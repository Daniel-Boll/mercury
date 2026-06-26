/**
 * ACP provider registry. Each provider knows how to spawn an agent that
 * speaks the Agent Client Protocol over stdio.
 */

export interface AcpProviderCommand {
  cmd: string[];
  env?: Record<string, string>;
}

export interface AcpProvider {
  id: string;
  displayName: string;
  /** Available model IDs for this provider. */
  models: string[];
  /** Default model for this provider (undefined means "use provider default"). */
  defaultModel?: string;
  /** Command + args (+ optional env) to spawn the agent in ACP mode. */
  command: (cwd: string, model?: string) => AcpProviderCommand;
  /** Whether the binary is expected on PATH (used for availability hints). */
  bin: string;
}

export const PROVIDERS: Record<string, AcpProvider> = {
  opencode: {
    id: "opencode",
    displayName: "opencode",
    bin: "opencode",
    models: [],
    defaultModel: undefined,
    command: (cwd, model) => {
      const env = model ? { OPENCODE_CONFIG_CONTENT: JSON.stringify({ model }) } : undefined;
      return { cmd: ["opencode", "acp", "--cwd", cwd], env };
    },
  },
  "claude-code": {
    id: "claude-code",
    displayName: "Claude Code",
    bin: "claude",
    models: [],
    defaultModel: undefined,
    // Zed's ACP adapter wraps the Claude Code CLI.
    // Model is passed via ANTHROPIC_MODEL env rather than a CLI flag.
    command: (cwd, model) => {
      const env = model ? { ANTHROPIC_MODEL: model } : undefined;
      return { cmd: ["npx", "-y", "@zed-industries/claude-code-acp"], env };
    },
  },
};

export function getProvider(id: string | undefined): AcpProvider {
  return PROVIDERS[id ?? "opencode"] ?? PROVIDERS.opencode!;
}

/** Spawn a command, capture stdout, and abandon it if it exceeds `timeoutMs`.
 *  Async (never blocks the event loop) and bounded by a hard Promise.race so a
 *  CLI that ignores SIGKILL still can't stall the caller past the timeout. */
async function runWithTimeout(cmd: string[], timeoutMs: number): Promise<string | null> {
  try {
    const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "ignore" });
    const collect = (async () => {
      const [out, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        proc.exited,
      ]);
      return exitCode === 0 ? out : null;
    })();
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => {
        try { proc.kill("SIGKILL"); } catch {}
        resolve(null);
      }, timeoutMs),
    );
    return await Promise.race([collect, timeout]);
  } catch {
    return null;
  }
}

/** Model-list cache. Enumerating models shells out to slow CLIs (`opencode
 *  models`, and `claude config list` can take 15s+), so cache the result per
 *  provider for the lifetime of the dashboard process with a short TTL. */
const MODELS_TTL_MS = 5 * 60 * 1000;
const MODELS_SPAWN_TIMEOUT_MS = 4000;
const _modelCache = new Map<string, { at: number; models: string[] }>();

/**
 * Enumerate available models for a provider by invoking its native CLI.
 * Cached (5 min TTL) and bounded by an 8s spawn timeout so the dashboard
 * never blocks on a slow or hanging CLI.
 *
 * - OpenCode: runs `opencode models` and parses line-oriented output.
 * - Claude Code: runs `claude config list` and extracts availableModels.
 * - Unknown providers return the static list from the provider definition.
 * Returns an empty array on any error (command missing, timeout, non-zero exit).
 */
export async function listProviderModels(providerId: string): Promise<string[]> {
  const cached = _modelCache.get(providerId);
  if (cached && Date.now() - cached.at < MODELS_TTL_MS) return cached.models;

  let models: string[];
  switch (providerId) {
    case "opencode":
      models = await listOpenCodeModels();
      break;
    case "claude-code":
      models = await listClaudeCodeModels();
      break;
    default:
      models = PROVIDERS[providerId]?.models ?? [];
  }
  _modelCache.set(providerId, { at: Date.now(), models });
  return models;
}

async function listOpenCodeModels(): Promise<string[]> {
  const out = (await runWithTimeout(["opencode", "models"], MODELS_SPAWN_TIMEOUT_MS))?.trim();
  if (!out) return [];
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("//"));
}

async function listClaudeCodeModels(): Promise<string[]> {
  const out = await runWithTimeout(["claude", "config", "list"], MODELS_SPAWN_TIMEOUT_MS);
  if (!out) return [];
  return parseClaudeConfigModels(out);
}

function parseClaudeConfigModels(out: string): string[] {
  const trimmed = out.trim();
  if (!trimmed) return [];

  const fromJson = parseClaudeConfigJson(trimmed);
  if (fromJson.length) return fromJson;

  const models = new Set<string>();
  const lines = trimmed.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    const match = line.match(/^availableModels\s*[:=]\s*(.+)$/i);
    if (!match) continue;
    collectModelTokens(match[1]!, models);
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j]!.trim();
      if (!next || /^[A-Za-z][A-Za-z0-9_-]*\s*[:=]/.test(next)) break;
      collectModelTokens(next, models);
    }
  }
  return [...models];
}

function parseClaudeConfigJson(out: string): string[] {
  try {
    const config = JSON.parse(out) as { availableModels?: unknown };
    return Array.isArray(config.availableModels)
      ? config.availableModels.filter((m): m is string => typeof m === "string" && m.length > 0)
      : [];
  } catch {
    return [];
  }
}

function collectModelTokens(text: string, models: Set<string>): void {
  const cleaned = text.replace(/[\[\]",]/g, " ");
  for (const token of cleaned.split(/\s+/)) {
    const model = token.trim();
    if (model && model !== "[]") models.add(model);
  }
}

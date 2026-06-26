/**
 * ACP provider registry. Each provider knows how to spawn an agent that
 * speaks the Agent Client Protocol over stdio.
 */
export interface AcpProvider {
  id: string;
  displayName: string;
  /** Command + args to spawn the agent in ACP mode. */
  command: (cwd: string) => { cmd: string[] };
  /** Whether the binary is expected on PATH (used for availability hints). */
  bin: string;
}

export const PROVIDERS: Record<string, AcpProvider> = {
  opencode: {
    id: "opencode",
    displayName: "opencode",
    bin: "opencode",
    command: (cwd) => ({ cmd: ["opencode", "acp", "--cwd", cwd] }),
  },
  "claude-code": {
    id: "claude-code",
    displayName: "Claude Code",
    bin: "claude",
    // Zed's ACP adapter wraps the Claude Code CLI.
    command: () => ({ cmd: ["npx", "-y", "@zed-industries/claude-code-acp"] }),
  },
};

export function getProvider(id: string | undefined): AcpProvider {
  return PROVIDERS[id ?? "opencode"] ?? PROVIDERS.opencode!;
}

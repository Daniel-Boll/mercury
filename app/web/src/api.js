// Token comes from the URL (?token=...) that the CLI opens.
const params = new URLSearchParams(location.search);
export const TOKEN = params.get("token") ?? "";

export async function api(path) {
  const res = await fetch(`/api/${path}?token=${encodeURIComponent(TOKEN)}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(`/api/${path}?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

/**
 * Single shared WebSocket. Subscribers receive every message; the connection
 * auto-reconnects. Returns an unsubscribe fn.
 */
const subs = new Set();
const connListeners = new Set();
let sharedWs;
let retryTimer;
let connected = false;

function setConnected(value) {
  if (connected === value) return;
  connected = value;
  for (const fn of connListeners) fn(connected);
}

function ensureWs() {
  if (sharedWs && sharedWs.readyState <= 1) return;
  sharedWs = new WebSocket(`ws://${location.host}/ws?token=${encodeURIComponent(TOKEN)}`);
  sharedWs.onopen = () => setConnected(true);
  sharedWs.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    for (const fn of subs) fn(msg);
  };
  sharedWs.onclose = () => {
    setConnected(false);
    clearTimeout(retryTimer);
    retryTimer = setTimeout(ensureWs, 1500);
  };
}

export function subscribe(fn) {
  ensureWs();
  subs.add(fn);
  return () => subs.delete(fn);
}

/**
 * Observe live socket connectivity. Calls fn(true/false) immediately with the
 * current state, then on every change. Returns an unsubscribe fn.
 */
export function onConnection(fn) {
  ensureWs();
  connListeners.add(fn);
  fn(connected);
  return () => connListeners.delete(fn);
}

/** Back-compat helper: fire onChange(table) only on DB change events. */
export function liveUpdates(onChange) {
  return subscribe((msg) => {
    if (msg.type === "changed") onChange(msg.table);
  });
}

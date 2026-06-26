// Async-resource helper for Svelte 5 runes. Wraps a fetcher into an explicit
// status so the UI can distinguish loading / error / ready — instead of the old
// `let rows = $state([])` pattern that flashes an empty state before data loads.
//
// Usage (inside a component <script>):
//   import { resource } from "../lib/resource.svelte.js";
//   const jobs = resource(() => api("jobs"), []);
//   // jobs.status -> 'loading' | 'error' | 'ready'
//   // jobs.data, jobs.error, jobs.reload()
//
// The fetcher runs once on creation. Call reload() to re-run it (e.g. on a live
// DB change). While reloading, status returns to 'loading' only if there's no
// prior data; otherwise it keeps showing stale data and sets `refreshing`.
export function resource(fetcher, initial = null) {
  let status = $state("loading"); // 'loading' | 'error' | 'ready'
  let data = $state(initial);
  let error = $state(null);
  let refreshing = $state(false);

  let runId = 0;

  async function run() {
    const id = ++runId;
    const hadData = status === "ready";
    if (hadData) refreshing = true;
    else status = "loading";
    error = null;
    try {
      const result = await fetcher();
      if (id !== runId) return; // a newer run superseded this one
      data = result;
      status = "ready";
    } catch (e) {
      if (id !== runId) return;
      error = e instanceof Error ? e.message : String(e);
      status = "error";
    } finally {
      if (id === runId) refreshing = false;
    }
  }

  run();

  return {
    get status() { return status; },
    get data() { return data; },
    get error() { return error; },
    get refreshing() { return refreshing; },
    reload: run,
  };
}

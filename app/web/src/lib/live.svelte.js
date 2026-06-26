// Live-update helper: re-run `reload` only when a relevant DB table changes.
//
// The server broadcasts { type: "changed", table } over the shared WebSocket
// whenever a CLI write touches a table (see app/src/db/notify.ts). This helper
// lets a section subscribe to just the tables it renders, instead of the old
// global rev-bump that refetched every mounted section on any change.
//
// Usage (inside a component <script>):
//   import { useLiveTable } from "../lib/live.svelte.js";
//   const jobs = resource(() => api("jobs"), []);
//   useLiveTable("jobs", jobs.reload);
//   // or multiple: useLiveTable(["recruiters", "jobs"], overview.reload);
import { subscribe } from "../api.js";

export function useLiveTable(tables, reload) {
  const wanted = new Set(Array.isArray(tables) ? tables : [tables]);
  $effect(() => {
    const stop = subscribe((msg) => {
      if (msg.type === "changed" && wanted.has(msg.table)) reload();
    });
    return stop;
  });
}

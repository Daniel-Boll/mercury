<script>
  import { api } from "../api.js";
  import { resource } from "../lib/resource.svelte.js";
  import { useLiveTable } from "../lib/live.svelte.js";
  import LoadingState from "../lib/LoadingState.svelte";
  import ErrorState from "../lib/ErrorState.svelte";
  import EmptyState from "../lib/EmptyState.svelte";

  const activity = resource(() => api("activity"), []);
  useLiveTable("activity_log", activity.reload);
</script>

<h1 class="page-title">Activity</h1>
<p class="page-sub">Recent skill runs and actions · live agent stream comes in Phase 3</p>

{#if activity.status === "loading"}
  <LoadingState />
{:else if activity.status === "error"}
  <ErrorState error={activity.error} onretry={activity.reload} />
{:else if activity.data.length === 0}
  <EmptyState message="No activity logged yet." />
{:else}
  <div class="panel">
    {#each activity.data as a}
      <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
        <span class="dim" style="font-size:.78rem;min-width:140px">{new Date(a.ts).toLocaleString()}</span>
        {#if a.skill}<span class="pill replied">{a.skill}</span>{/if}
        <span class="muted" style="font-size:.88rem">{a.summary ?? a.kind}</span>
      </div>
    {/each}
  </div>
{/if}

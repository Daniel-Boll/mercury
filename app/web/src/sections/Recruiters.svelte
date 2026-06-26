<script>
  import { api } from "../api.js";
  import { resource } from "../lib/resource.svelte.js";
  import { useLiveTable } from "../lib/live.svelte.js";
  import LoadingState from "../lib/LoadingState.svelte";
  import ErrorState from "../lib/ErrorState.svelte";
  import EmptyState from "../lib/EmptyState.svelte";

  const COLS = ["pending", "accepted", "replied", "interviewing", "closed"];

  const recruiters = resource(() => api("recruiters"), []);
  useLiveTable("recruiters", recruiters.reload);

  let byStatus = $derived(
    COLS.reduce((acc, c) => {
      acc[c] = (recruiters.data ?? []).filter((r) => r.status === c);
      return acc;
    }, {})
  );
</script>

<h1 class="page-title">Recruiters</h1>
<p class="page-sub">
  {recruiters.status === "ready" ? recruiters.data.length : "—"} contacts across your outreach pipeline
</p>

{#if recruiters.status === "loading"}
  <LoadingState rows={5} />
{:else if recruiters.status === "error"}
  <ErrorState error={recruiters.error} onretry={recruiters.reload} />
{:else if recruiters.data.length === 0}
  <EmptyState message="No recruiters yet." skill="recruiter-outreach" />
{:else}
  <div class="kanban">
    {#each COLS as col}
      <div class="kanban-col">
        <h4>{col} <span>{byStatus[col].length}</span></h4>
        {#each byStatus[col] as r}
          <div class="kanban-card">
            <div class="n">
              {#if r.username}<a href={`https://www.linkedin.com/in/${r.username}/`} target="_blank">{r.name}</a>{:else}{r.name}{/if}
            </div>
            <div class="c">{r.company ?? ""}{r.title ? ` · ${r.title}` : ""}</div>
            <div class="c">{r.location ?? ""}{r.degree ? ` · ${r.degree}` : ""}</div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
{/if}

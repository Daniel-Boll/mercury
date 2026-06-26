<script>
  import { api } from "../api.js";
  import { resource } from "../lib/resource.svelte.js";
  import { useLiveTable } from "../lib/live.svelte.js";
  import LoadingState from "../lib/LoadingState.svelte";
  import ErrorState from "../lib/ErrorState.svelte";
  import EmptyState from "../lib/EmptyState.svelte";

  const jobs = resource(() => api("jobs"), []);
  useLiveTable("jobs", jobs.reload);
</script>

<h1 class="page-title">Jobs</h1>
<p class="page-sub">
  {jobs.status === "ready" ? jobs.data.length : "—"} scouted roles · search coming in Phase 2
</p>

{#if jobs.status === "loading"}
  <LoadingState />
{:else if jobs.status === "error"}
  <ErrorState error={jobs.error} onretry={jobs.reload} />
{:else if jobs.data.length === 0}
  <EmptyState message="No jobs saved yet." skill="job-scout" />
{:else}
  <div class="panel">
    <table>
      <thead><tr><th>Role</th><th>Company</th><th>Mode</th><th>Fit</th><th>Status</th><th>Link</th></tr></thead>
      <tbody>
        {#each jobs.data as j}
          <tr>
            <td>{j.title ?? "—"}</td>
            <td>{j.company_name ?? "—"}</td>
            <td class="dim">{j.work_type ?? "—"}</td>
            <td>{#if j.fit}<span class="pill {j.fit}">{j.fit}</span>{:else}—{/if}</td>
            <td class="dim">{j.status}</td>
            <td>{#if j.link}<a href={j.link} target="_blank">view</a>{:else}—{/if}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

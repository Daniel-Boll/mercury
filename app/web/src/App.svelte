<script>
  import { api, onConnection } from "./api.js";
  import { resource } from "./lib/resource.svelte.js";
  import { useLiveTable } from "./lib/live.svelte.js";
  import Overview from "./sections/Overview.svelte";
  import Recruiters from "./sections/Recruiters.svelte";
  import Jobs from "./sections/Jobs.svelte";
  import Search from "./sections/Search.svelte";
  import Launch from "./sections/Launch.svelte";
  import Profile from "./sections/Profile.svelte";
  import Applications from "./sections/Applications.svelte";
  import Interviews from "./sections/Interviews.svelte";
  import Activity from "./sections/Activity.svelte";

  let active = $state("overview");
  let connected = $state(false);

  // Overview drives the sidebar badges + the Overview page. Refresh it when any
  // table that feeds its counts changes.
  const overview = resource(() => api("overview"), null);
  useLiveTable(
    ["recruiters", "jobs", "interviews", "applications", "profile_metrics"],
    overview.reload
  );

  $effect(() => onConnection((c) => (connected = c)));

  const nav = [
    { id: "overview", label: "Overview", icon: "◎" },
    { id: "profile", label: "Profile", icon: "★" },
    { id: "search", label: "Search", icon: "⌕" },
    { id: "launch", label: "Launch", icon: "▶" },
    { id: "recruiters", label: "Recruiters", icon: "✦" },
    { id: "jobs", label: "Jobs", icon: "❖" },
    { id: "applications", label: "Applications", icon: "✎" },
    { id: "interviews", label: "Interviews", icon: "▣" },
    { id: "activity", label: "Activity", icon: "≋" },
  ];

  let ov = $derived(overview.status === "ready" ? overview.data : null);
</script>

<div class="layout">
  <aside class="sidebar">
    <div class="brand grad">Mercury</div>
    {#each nav as item}
      <div
        class="nav-item {active === item.id ? 'active' : ''}"
        onclick={() => (active = item.id)}
        role="button" tabindex="0"
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
        {#if item.id === "recruiters" && ov}<span class="badge">{ov.recruiters}</span>{/if}
        {#if item.id === "interviews" && ov}<span class="badge">{ov.interviews}</span>{/if}
        {#if item.id === "jobs" && ov}<span class="badge">{ov.jobs}</span>{/if}
      </div>
    {/each}
    <div style="position:absolute;bottom:18px;left:14px;font-size:.74rem;" class="dim">
      <span class="live-dot" style:background={connected ? "var(--green)" : "var(--dim)"}
        style:box-shadow={connected ? "0 0 8px var(--green)" : "none"}></span>
      {connected ? "live" : "offline"}
    </div>
  </aside>

  <main class="main">
    {#if active === "overview"}<Overview {overview} onnav={(id) => (active = id)} />
    {:else if active === "profile"}<Profile />
    {:else if active === "search"}<Search />
    {:else if active === "launch"}<Launch />
    {:else if active === "recruiters"}<Recruiters />
    {:else if active === "jobs"}<Jobs />
    {:else if active === "applications"}<Applications />
    {:else if active === "interviews"}<Interviews />
    {:else if active === "activity"}<Activity />
    {/if}
  </main>
</div>

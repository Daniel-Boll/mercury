<script>
  // Loading placeholder shown while a resource is fetching for the first time.
  // `rows` controls how many skeleton lines to render.
  let { rows = 3 } = $props();
</script>

<div class="loading panel">
  {#each Array(rows) as _, i}
    <div class="skeleton" style="width:{[92, 78, 85, 70, 88][i % 5]}%"></div>
  {/each}
</div>

<style>
  .loading { display: flex; flex-direction: column; gap: 12px; }
  .skeleton {
    height: 14px; border-radius: 6px;
    background: linear-gradient(90deg, var(--panel-2) 25%, var(--border-2) 37%, var(--panel-2) 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
  }
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
</style>

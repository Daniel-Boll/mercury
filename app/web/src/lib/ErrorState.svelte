<script>
  // Error state with a Retry button. Used when a resource fetch throws — this is
  // distinct from the empty state, so a failed load no longer masquerades as
  // "run the skill".
  let { error = "Something went wrong.", onretry } = $props();
</script>

<div class="panel err">
  <strong class="err-title">Couldn't load this section.</strong>
  <p class="err-msg">{error}</p>
  <p class="err-hint">
    If this persists, make sure the LinkedIn MCP is reachable and you're logged in
    to LinkedIn in your browser session, then retry.
  </p>
  {#if onretry}
    <button class="retry" onclick={onretry}>Retry</button>
  {/if}
</div>

<style>
  .err { border-color: var(--red); }
  .err-title { color: var(--red); }
  .err-msg { color: var(--muted); font-size: .85rem; margin-top: 6px; word-break: break-word; }
  .err-hint { color: var(--dim); font-size: .8rem; margin-top: 6px; }
  .retry {
    margin-top: 12px; background: transparent; color: var(--red);
    border: 1px solid var(--red); padding: 7px 16px; border-radius: 8px;
    cursor: pointer; font-size: .85rem; font-weight: 600;
  }
  .retry:hover { background: rgba(239, 68, 68, .12); }
</style>

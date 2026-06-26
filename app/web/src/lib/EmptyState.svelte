<script>
  // True-empty state — shown ONLY when a resource has loaded successfully and
  // returned no rows. The optional `skill` renders the "run the X skill" CTA.
  let { message = "Nothing here yet.", skill } = $props();
</script>

<div class="empty">
  {message}
  {#if skill}
    Run the <code>{skill}</code> skill.
  {/if}
</div>

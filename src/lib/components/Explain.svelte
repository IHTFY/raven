<script>
  /** The rules behind a puzzle, one line per changing attribute. */
  let { puzzle } = $props();
</script>

<ul>
  {#each puzzle.rules as rule (rule.attr)}
    <li>{rule.text}</li>
  {/each}
</ul>

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 10px;
    line-height: 1.45;
  }

  li {
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    box-shadow: var(--sink);
  }
</style>

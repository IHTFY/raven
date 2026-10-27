<script>
  import { demoOf } from '../explain.js';
  import Demo from './Demo.svelte';

  /** The rules behind a puzzle, one line per changing attribute, each shown as a short animation. */
  let { puzzle } = $props();

  const items = $derived(puzzle.rules.map((rule) => ({ rule, demo: demoOf(puzzle, rule) })));
</script>

<ul>
  {#each items as { rule, demo } (rule.attr)}
    <li>
      {rule.text}
      <!-- A new puzzle can reuse this row; start its demo over rather than keep the old step. -->
      {#key demo}
        {#if demo}<Demo {demo} />{/if}
      {/key}
    </li>
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

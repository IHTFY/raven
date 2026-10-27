<script>
  import { go } from '../router.svelte.js';
  import { duration, shortDate } from '../format.js';
  import { canReview, store } from '../state.svelte.js';
  import Icon from './Icon.svelte';

  /** Every saved test, newest first. Tests whose answers were kept open their results again. */
</script>

<main>
  <header>
    <button class="icon-btn" onclick={() => go()} aria-label="Home"><Icon name="home" /></button>
    <h1>Past tests</h1>
    <button class="icon-btn" onclick={() => go('stats')} aria-label="Statistics"><Icon name="chart" /></button>
  </header>

  {#if store.history.length}
    <ol>
      {#each store.history as h, i (h.date)}
        {@const open = canReview(h)}
        <li style:--i={i}>
          <button class="row" disabled={!open} onclick={() => go(`history/${h.date}`)} aria-label="Test from {shortDate(h.date)}: {h.score} out of {h.total}{open ? '' : ', score only'}">
            <span class="score tabular"><b>{h.score}</b><span class="muted">/{h.total}</span></span>
            <span class="bar sunk"><span style:width="{(100 * h.score) / h.total}%"></span></span>
            <span class="meta muted tabular">{duration(h.seconds)} · {shortDate(h.date)}</span>
            {#if open}<Icon name="next" size={18} />{:else}<span class="muted small">score only</span>{/if}
          </button>
        </li>
      {/each}
    </ol>
    <p class="muted small note">Tests from older versions of the puzzles keep only their score.</p>
  {:else}
    <p class="muted empty">No finished tests yet.</p>
    <button class="btn primary" onclick={() => go()}>Take the test</button>
  {/if}
</main>

<style>
  main {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 16px 16px;
    max-width: 560px;
    margin: 0 auto;
  }

  header {
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    align-items: center;
    text-align: center;
  }

  h1 {
    font-size: 1.15rem;
    font-weight: 700;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
  }

  li {
    animation: row-in 200ms var(--ease-out) both;
    animation-delay: calc(min(var(--i), 12) * 20ms);
  }

  .row {
    width: 100%;
    display: grid;
    grid-template-columns: 4.2em 1fr auto auto;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    box-shadow: var(--lift-sm);
    text-align: left;
    transition: box-shadow 140ms var(--ease-out);
  }

  .row:active:not(:disabled) {
    box-shadow: var(--sink);
    transition-duration: 0ms;
  }

  .row:disabled {
    box-shadow: none;
  }

  .row:disabled .small {
    white-space: nowrap;
  }

  .score b {
    font-size: 1.15rem;
  }

  .bar {
    height: 8px;
    border-radius: 99px;
    overflow: hidden;
  }

  .bar span {
    display: block;
    height: 100%;
    background: var(--accent);
    border-radius: 99px;
  }

  .meta {
    font-size: 0.8rem;
  }

  .small {
    font-size: 0.8rem;
  }

  .note,
  .empty {
    text-align: center;
  }

  @media (max-width: 380px) {
    .row {
      grid-template-columns: 4em 1fr auto;
    }
    .meta {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }

  @keyframes row-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
</style>

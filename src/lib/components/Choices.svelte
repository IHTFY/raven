<script module>
  const LETTERS = 'ABCDEF';

  /** The option a key picks (1–6 or A–F), or -1. */
  export const optionForKey = (key) => (key.length === 1 ? Math.max('123456'.indexOf(key), LETTERS.indexOf(key.toUpperCase())) : -1);
</script>

<script>
  import Icon from './Icon.svelte';
  import Figure from './Figure.svelte';

  /**
   * The six options. Before a reveal, `chosen` shows the pick. After it,
   * the right answer gets a check and a wrong pick a cross.
   */
  let { puzzle, chosen = null, revealed = false, onchoose } = $props();

  const stateOf = (k) => (revealed ? (k === puzzle.answer ? 'good' : k === chosen ? 'bad' : 'idle') : k === chosen ? 'chosen' : 'idle');
</script>

<div class="choices" role="group" aria-label="Answer options">
  {#each puzzle.figures.options as figure, k (k)}
    {@const state = stateOf(k)}
    <button
      class="choice {state}"
      style:--i={k}
      disabled={revealed}
      aria-label="Option {LETTERS[k]}"
      aria-pressed={k === chosen}
      onclick={() => onchoose(k)}
    >
      <span class="letter">{LETTERS[k]}</span>
      {#if state === 'good' || state === 'bad'}
        <span class="badge"><Icon name={state === 'good' ? 'check' : 'cross'} size={14} /></span>
      {/if}
      <Figure {figure} />
    </button>
  {/each}
</div>

<style>
  .choices {
    display: grid;
    grid-template-columns: repeat(var(--option-columns, 3), var(--option));
    gap: calc(var(--option) * 0.12);
  }

  .choice {
    position: relative;
    width: var(--option);
    height: var(--option);
    padding: calc(var(--option) * 0.1);
    border-radius: calc(var(--option) * 0.16);
    background: var(--bg);
    box-shadow: var(--lift-sm);
    transition:
      box-shadow 140ms var(--ease-out),
      transform 140ms var(--ease-out);
    animation: choice-in 240ms var(--ease-out) both;
    animation-delay: calc(120ms + var(--i) * 30ms);
  }

  .choice:active:not(:disabled) {
    box-shadow: var(--sink);
    transform: scale(0.96);
    transition-duration: 0ms;
  }

  .chosen {
    box-shadow:
      var(--sink),
      0 0 0 2px var(--accent);
  }

  .good {
    box-shadow:
      var(--sink),
      0 0 0 2.5px var(--good);
  }

  .bad {
    box-shadow:
      var(--sink),
      0 0 0 2.5px var(--bad);
  }

  .choice:disabled.idle {
    opacity: 0.55;
  }

  .letter {
    position: absolute;
    top: calc(var(--option) * 0.05);
    left: calc(var(--option) * 0.09);
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--muted);
    transition: color 140ms;
  }

  .chosen .letter {
    color: var(--accent);
  }

  .badge {
    position: absolute;
    top: -6px;
    right: -6px;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: var(--bg);
    animation: badge-in 180ms var(--ease-out) both;
  }

  .good .badge {
    background: var(--good);
  }
  .bad .badge {
    background: var(--bad);
  }

  @keyframes choice-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  @keyframes badge-in {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
  }
</style>

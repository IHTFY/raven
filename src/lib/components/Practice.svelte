<script>
  import { go } from '../router.svelte.js';
  import { choosePractice, levelOf, nextPractice, practicePuzzle, startPractice, store } from '../state.svelte.js';
  import Board from './Board.svelte';
  import { optionForKey } from './Choices.svelte';
  import Explain from './Explain.svelte';
  import Icon from './Icon.svelte';
  import Sheet from './Sheet.svelte';
  import Toast from './Toast.svelte';

  startPractice();
  const p = store.practice;

  const puzzle = $derived(practicePuzzle(p));
  const revealed = $derived(p.choice != null);
  const right = $derived(p.choice === puzzle.answer);

  let why = $state(false);
  let toast = $state(null);

  function choose(k) {
    if (!revealed) choosePractice(puzzle, k);
  }

  function next() {
    why = false;
    nextPractice(puzzle);
  }

  function keydown(e) {
    if (why || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = optionForKey(e.key);
    if (k >= 0) choose(k);
    else if ((e.key === 'Enter' || e.key === 'ArrowRight') && revealed) next();
    else return;
    e.preventDefault();
  }
</script>

<svelte:window onkeydown={keydown} />

<main>
  <header>
    <button class="icon-btn" onclick={() => go()} aria-label="Home"><Icon name="home" /></button>
    <button class="btn level" onclick={() => (toast = 'Puzzles get harder when you’re right and easier when you miss.')}>
      Level {levelOf(p.target)}
    </button>
    <span class="score tabular muted" aria-label="{p.right} right out of {p.done}">
      <Icon name="check" size={16} />{p.right}/{p.done}
    </span>
  </header>

  {#key p.count}
    <Board {puzzle} chosen={p.choice} {revealed} onchoose={choose} />
  {/key}

  <footer>
    {#if revealed}
      <p class="verdict" class:good={right} class:bad={!right}>
        <Icon name={right ? 'check' : 'cross'} size={18} />
        {right ? 'Right' : 'Not quite'}
      </p>
      <button class="btn" onclick={() => (why = true)}>Why?</button>
      <button class="btn primary" onclick={next}>Next <Icon name="next" /></button>
    {:else}
      <p class="muted hint">Pick the picture that fits the empty square.</p>
    {/if}
  </footer>
</main>

{#if why}
  <Sheet title="How it works" onclose={() => (why = false)}>
    <Explain {puzzle} />
    <button class="btn big primary next" onclick={next}>Next puzzle <Icon name="next" /></button>
  </Sheet>
{/if}

<Toast bind:message={toast} />

<style>
  main {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px 12px 12px;
    max-width: 960px;
    margin: 0 auto;
  }

  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  .level {
    min-height: 40px;
    padding: 0 16px;
  }

  .score {
    justify-self: end;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding-right: 8px;
    font-weight: 600;
  }

  footer {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
  }

  .verdict {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-right: auto;
    font-weight: 650;
  }

  .good {
    color: var(--good);
  }

  .bad {
    color: var(--bad);
  }

  .hint {
    text-align: center;
  }

  .next {
    width: 100%;
    margin-top: 16px;
  }
</style>

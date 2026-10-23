<script>
  import { go } from '../router.svelte.js';
  import { clock, plural } from '../format.js';
  import { pressesControl } from '../keys.js';
  import { answerTest, finishTest, puzzlesFor, store } from '../state.svelte.js';
  import Board from './Board.svelte';
  import { optionForKey } from './Choices.svelte';
  import Icon from './Icon.svelte';
  import PlayAd from './PlayAd.svelte';
  import Sheet from './Sheet.svelte';

  const test = store.test;
  const puzzles = puzzlesFor(test.seed);
  const last = puzzles.length - 1;

  const puzzle = $derived(puzzles[test.current]);
  const blanks = $derived(test.answers.filter((a) => a == null).length);
  let overview = $state(false);

  let now = $state(Date.now());
  $effect(() => {
    const id = setInterval(() => {
      now = Date.now();
      if (now >= test.deadline && !test.finished) finish();
    }, 250);
    return () => clearInterval(id);
  });

  const move = (i) => (test.current = Math.max(0, Math.min(last, i)));

  // After a pick, move on once the choice has had a moment to show,
  // unless you've already moved yourself. Past the deadline, the timer ends the test.
  let advance;
  function choose(k) {
    if (!answerTest(k)) return;
    const at = test.current;
    clearTimeout(advance);
    advance = setTimeout(() => {
      if (test.current !== at) return;
      if (at === last) overview = true;
      else move(at + 1);
    }, 280);
  }
  $effect(() => () => clearTimeout(advance));

  function finish() {
    finishTest();
    go(`test/${test.seed}`);
  }

  function keydown(e) {
    if (overview || e.metaKey || e.ctrlKey || e.altKey || pressesControl(e)) return;
    const k = optionForKey(e.key);
    if (k >= 0) choose(k);
    else if (e.key === 'ArrowLeft') move(test.current - 1);
    else if (e.key === 'ArrowRight') move(test.current + 1);
    else if (e.key === 'Enter' && test.current === last) overview = true;
    else return;
    e.preventDefault();
  }
</script>

<svelte:window onkeydown={keydown} />

<PlayAd name="test">
  <main>
    <header>
      <button class="icon-btn" onclick={() => go()} aria-label="Home (the timer keeps running)"><Icon name="home" /></button>
      <button class="count btn tabular" onclick={() => (overview = true)} aria-label="All puzzles">
        <Icon name="grid" size={16} />
        {test.current + 1} / {puzzles.length}
      </button>
      <span class="timer tabular muted" role="timer" aria-label="Time left">{clock(test.deadline - now)}</span>
    </header>

    {#key test.current}
      <Board {puzzle} chosen={test.answers[test.current]} onchoose={choose} />
    {/key}

    <footer>
      <button class="btn" onclick={() => move(test.current - 1)} disabled={test.current === 0} aria-label="Previous puzzle">
        <Icon name="back" /> Back
      </button>
      {#if test.current === last}
        <button class="btn primary" onclick={() => (overview = true)}>Finish <Icon name="flag" /></button>
      {:else}
        <button class="btn" onclick={() => move(test.current + 1)} aria-label="Next puzzle">Next <Icon name="next" /></button>
      {/if}
    </footer>
  </main>
</PlayAd>

{#if overview}
  <Sheet title="All puzzles" onclose={() => (overview = false)}>
    <div class="chips">
      {#each puzzles as _, i (i)}
        <button
          class="chip tabular"
          class:done={test.answers[i] != null}
          class:here={i === test.current}
          onclick={() => {
            move(i);
            overview = false;
          }}
          aria-label="Puzzle {i + 1}{test.answers[i] == null ? ', blank' : ''}"
        >
          {i + 1}
        </button>
      {/each}
    </div>
    <p class="muted status">
      {blanks ? `${plural(blanks, 'puzzle')} still blank. Tap one to go back to it.` : 'Every puzzle has an answer.'}
    </p>
    <button class="btn big primary finish" onclick={finish}>{blanks ? 'Finish anyway' : 'Finish test'}</button>
  </Sheet>
{/if}

<style>
  main {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px 12px 12px;
    max-width: 960px;
    margin: 0 auto;
  }

  header,
  footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
  }

  footer {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
  }

  .count {
    min-height: 40px;
    padding: 0 14px;
    font-weight: 650;
  }

  .timer {
    justify-self: end;
    padding-right: 8px;
    font-weight: 600;
  }

  .chips {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
  }

  .chip {
    aspect-ratio: 1;
    border-radius: var(--radius-sm);
    box-shadow: var(--lift-sm);
    font-weight: 600;
    color: var(--muted);
    transition:
      box-shadow 140ms var(--ease-out),
      color 140ms;
  }

  .chip:active {
    box-shadow: var(--sink);
    transition-duration: 0ms;
  }

  .chip.done {
    box-shadow: var(--sink);
    color: var(--text);
  }

  .chip.here {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .status {
    margin: 16px 0 12px;
    text-align: center;
  }

  .finish {
    width: 100%;
  }
</style>

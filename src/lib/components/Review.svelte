<script>
  import Board from './Board.svelte';
  import Explain from './Explain.svelte';
  import Icon from './Icon.svelte';

  /** One finished puzzle: your pick, the answer, and why. */
  let { puzzles, answers, index = $bindable() } = $props();

  const puzzle = $derived(puzzles[index]);
  const picked = $derived(answers[index]);
  const verdict = $derived(picked == null ? 'Left blank' : picked === puzzle.answer ? 'Right' : 'Not quite');
</script>

<div class="review">
  <p class="verdict" class:good={picked === puzzle.answer} class:bad={picked != null && picked !== puzzle.answer}>
    {#if picked != null}<Icon name={picked === puzzle.answer ? 'check' : 'cross'} size={18} />{/if}
    {verdict}
  </p>
  <div class="stage">
    {#key index}
      <Board {puzzle} chosen={picked} revealed />
    {/key}
  </div>
  <Explain {puzzle} />
  <nav>
    <button class="btn" disabled={index === 0} onclick={() => index--} aria-label="Previous puzzle"><Icon name="back" /> Back</button>
    <button class="btn" disabled={index === puzzles.length - 1} onclick={() => index++} aria-label="Next puzzle">Next <Icon name="next" /></button>
  </nav>
</div>

<style>
  .review {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .verdict {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-weight: 650;
    color: var(--muted);
  }

  .good {
    color: var(--good);
  }

  .bad {
    color: var(--bad);
  }

  .stage {
    flex: 1;
    min-height: 220px;
    display: flex;
  }

  nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
</style>

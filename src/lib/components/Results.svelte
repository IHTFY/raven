<script>
  import { noteGameFinished } from '../ads.js';
  import { go, shareUrl } from '../router.svelte.js';
  import { duration } from '../format.js';
  import { elapsed, puzzlesFor, scoreOf, startTest, store } from '../state.svelte.js';
  import AdBox from './AdBox.svelte';
  import CountUp from './CountUp.svelte';
  import Icon from './Icon.svelte';
  import Review from './Review.svelte';
  import Sheet from './Sheet.svelte';
  import Toast from './Toast.svelte';

  const test = store.test;
  const puzzles = puzzlesFor(test.seed);
  const score = scoreOf(test);
  const seconds = elapsed(test);
  const outcome = (i) => (test.answers[i] == null ? 'blank' : test.answers[i] === puzzles[i].answer ? 'right' : 'wrong');

  // Thirds of the test, from easiest to hardest.
  const parts = ['Easy', 'Medium', 'Hard'].map((label, k) => {
    const from = Math.ceil((k * puzzles.length) / 3);
    const to = Math.ceil(((k + 1) * puzzles.length) / 3);
    const right = puzzles.slice(from, to).filter((_, j) => outcome(from + j) === 'right').length;
    return { label, right, total: to - from };
  });

  let reviewing = $state(null);
  let toast = $state(null);

  // Lets Home carry an ad from here on.
  noteGameFinished();

  async function share() {
    const url = shareUrl(test.seed);
    const text = `I got ${score}/${puzzles.length} on this pattern test. Can you beat it?`;
    try {
      if (navigator.share) await navigator.share({ title: 'Raven', text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast = 'Link copied';
      }
    } catch (e) {
      if (e.name !== 'AbortError') toast = 'Couldn’t share the link';
    }
  }
</script>

<div class="page">
  <main>
    <section class="score">
      <h1>Results</h1>
      <button class="icon-btn home" onclick={() => go()} aria-label="Home"><Icon name="home" /></button>
      <button class="icon-btn share" onclick={share} aria-label="Share this test"><Icon name="share" /></button>
      <p class="big tabular"><CountUp value={score} /><span class="muted">/{puzzles.length}</span></p>
      <p class="muted">{duration(seconds)}{test.finished >= test.deadline ? ' · time ran out' : ''}</p>
    </section>

    <section class="parts">
      {#each parts as part (part.label)}
        <div class="part raised">
          <span class="muted">{part.label}</span>
          <b class="tabular">{part.right}<span class="muted">/{part.total}</span></b>
        </div>
      {/each}
    </section>

    <section class="chips" aria-label="Your answers. Tap one to review it.">
      {#each puzzles as _, i (i)}
        {@const o = outcome(i)}
        <button class="chip {o}" style:--i={i} onclick={() => (reviewing = i)} aria-label="Puzzle {i + 1}: {o}">
          {#if o === 'blank'}<span class="dash">–</span>{:else}<Icon name={o === 'right' ? 'check' : 'cross'} size={16} />{/if}
        </button>
      {/each}
    </section>
    <p class="muted small">Tap a puzzle to see the answer and why.</p>

    <footer>
      <button class="btn big primary" onclick={() => startTest()}>New test</button>
      <button class="btn big" onclick={() => go('practice')}>Practice</button>
    </footer>
  </main>

  <!-- One ad per finished test (coming back to these results asks for no new one), 50 px or more from the buttons: beside the results on wide windows, below them on phones. The box keeps its size whether or not an ad fills it. -->
  <AdBox screen="results" adKey="{test.seed}/{test.finished}" />
</div>

{#if reviewing != null}
  <Sheet title="Puzzle {reviewing + 1}" full onclose={() => (reviewing = null)}>
    <Review {puzzles} answers={test.answers} bind:index={reviewing} />
  </Sheet>
{/if}

<Toast top bind:message={toast} />

<style>
  /* Sized from the viewport, not the parents: AdSense sets `height: auto` on an ad's ancestors. */
  .page {
    height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: safe center;
  }

  /* The result, its buttons, and the ad below them are one block, centered, and the whole of it fits the phone sizes this was measured on without scrolling. */
  main {
    flex: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 2dvh, 20px);
    padding: 8px 16px 12px;
    max-width: 480px;
    margin: 0 auto;
  }

  /* The result, with Home and Share in its corners. The heading is for screen readers. */
  .score {
    align-self: stretch;
    position: relative;
    text-align: center;
  }

  h1 {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .home,
  .share {
    position: absolute;
    top: 0;
  }

  .home {
    left: 0;
  }

  .share {
    right: 0;
  }

  .big {
    font-size: clamp(2.5rem, 8dvh, 4.5rem);
    font-weight: 750;
    line-height: 1.05;
  }

  .big .muted {
    font-size: 0.45em;
    font-weight: 600;
  }

  .parts {
    align-self: stretch;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .part {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    padding: 8px 4px;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
  }

  /* The label and the count don't fit side by side on a narrow phone. */
  @media (max-width: 351px) {
    .part {
      flex-direction: column;
      align-items: center;
      gap: 0;
    }
  }

  .part b {
    font-size: 1.3rem;
  }

  .part b span {
    font-size: 0.75em;
  }

  .chips {
    align-self: stretch;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  .chip {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    max-height: 38px;
    border-radius: 10px;
    box-shadow: var(--lift-sm);
    animation: chip-in 200ms var(--ease-out) both;
    animation-delay: calc(var(--i) * 8ms);
    transition: box-shadow 140ms var(--ease-out);
  }

  .chip:active {
    box-shadow: var(--sink);
    transition-duration: 0ms;
  }

  .right {
    color: var(--good);
  }

  .wrong {
    color: var(--bad);
  }

  .blank {
    color: var(--muted);
  }

  .dash {
    font-weight: 700;
  }

  .small {
    font-size: 0.85rem;
  }

  footer {
    align-self: stretch;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  footer .btn {
    min-height: 52px;
  }

  /* The ad sits 50 px below the buttons; beside the results on wide windows, 150 px to their right. */
  .page > :global(.ad) {
    --ad-padding: 10px 16px 12px;
  }

  @media (min-width: 1000px) {
    .page {
      display: grid;
      grid-template-columns: minmax(0, 480px) auto;
      justify-content: center;
    }

    .page > :global(.ad) {
      --ad-padding: 0 16px 0 150px;
      align-self: center;
    }
  }

  @keyframes chip-in {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
  }
</style>

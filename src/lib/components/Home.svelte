<script>
  import { screenAdSlot } from '../ads.js';
  import { go } from '../router.svelte.js';
  import { TEST_LENGTH } from '../engine/generate.js';
  import { clock, duration, shortDate } from '../format.js';
  import { TEST_MINUTES, canReview, currentTheme, expireTest, isRunning, prepareTest, startTest, store, toggleTheme } from '../state.svelte.js';
  import { currentBenchmarks, firstTry } from '../benchmarks.js';
  import AdBox from './AdBox.svelte';
  import Icon from './Icon.svelte';
  import Logo from './Logo.svelte';

  /** `shared` is a seed from a link someone sent. */
  let { shared = null } = $props();

  const running = $derived(isRunning(store.test) ? store.test : null);
  const theme = $derived(currentTheme());

  // With an ad on the screen, the logo and the older tests make room for it.
  const hasAd = screenAdSlot('home') !== null;

  // A test can run out while you're away from it.
  expireTest();
  let now = $state(Date.now());
  $effect(() => {
    const id = setInterval(() => {
      now = Date.now();
      expireTest();
    }, 1000);
    return () => clearInterval(id);
  });

  $effect(() => {
    const id = (window.requestIdleCallback ?? setTimeout)(prepareTest);
    return () => (window.cancelIdleCallback ?? clearTimeout)(id);
  });

  // Starting over loses a test in progress, so that takes a second tap.
  let confirming = $state(false);
  $effect(() => {
    if (!confirming) return;
    const id = setTimeout(() => (confirming = false), 4000);
    return () => clearTimeout(id);
  });

  function begin(seed) {
    if (running && !confirming) {
      confirming = true;
      return;
    }
    startTest(seed);
  }
</script>

<main>
  <header>
    <button class="icon-btn" onclick={toggleTheme} aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  </header>

  <section class="hero">
    {#if !hasAd}<Logo />{/if}
    <h1>Raven</h1>
    <p class="muted">Find the missing picture in each pattern.</p>
  </section>

  <section class="actions">
    {#if shared}
      <p class="note">Someone shared test <b>{shared}</b> with you.</p>
      <button class="btn big primary" onclick={() => begin(shared)}>
        {confirming ? 'Tap again to replace your test' : 'Take this test'}
      </button>
    {:else if running}
      <button class="btn big primary" onclick={() => go(`test/${running.seed}`)}>
        Resume test <span class="muted tabular">{clock(running.deadline - now)} left</span>
      </button>
      <button class="btn" onclick={() => begin()}>{confirming ? 'Tap again to start over' : 'Start a new test'}</button>
    {:else}
      <button class="btn big primary" onclick={() => begin()}>Take the test</button>
      <p class="muted small">{TEST_LENGTH} puzzles · {TEST_MINUTES} minutes · easy to hard</p>
    {/if}
    <button class="btn" onclick={() => go('practice')}>Practice <span class="muted">no timer</span></button>
  </section>

  <!-- Hidden during a test, so starting one never replaces it by surprise. -->
  {#if !running}
    <section class="bench">
      <h2 class="muted small">Benchmarks <span>the same puzzles for everyone</span></h2>
      <div class="row">
        {#each currentBenchmarks() as b (b.id)}
          {@const first = firstTry(b, store.history)}
          <button class="btn" onclick={() => (first && canReview(first) ? go(`history/${first.date}`) : begin(b.seed))} aria-label="{b.name}{first ? `: you scored ${first.score} of ${first.total}` : ', not taken'}">
            <span>{b.name.replace('Benchmark ', '')}</span>
            <span class="muted tabular">{first ? `${first.score}/${first.total}` : 'Take'}</span>
          </button>
        {/each}
      </div>
    </section>
  {/if}

  {#if store.history.length}
    <section class="history">
      <h2 class="muted small">Recent tests <span><button class="all" onclick={() => go('stats')}>Stats</button><button class="all" onclick={() => go('history')}>See all <Icon name="next" size={14} /></button></span></h2>
      <ol>
        {#each store.history.slice(0, hasAd ? 2 : 3) as h (h.date)}
          <li class="tabular">
            <button class="past" disabled={!canReview(h)} onclick={() => go(`history/${h.date}`)}>
              <b>{h.score}</b><span class="muted">/{h.total}</span>
              <span class="muted">{duration(h.seconds)} · {shortDate(h.date)}</span>
            </button>
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  <footer class="muted small">
    <p>Not a formal IQ test. Inspired by Mensa Norway's test and the Sandia Matrices.</p>
    <p><a href="https://ihtfy.com">IHTFY</a> · <a href="https://github.com/IHTFY/raven">Source</a> · <a href="https://ihtfy.com/support/">Support ♥</a>{#if !hasAd} · <a href="https://ihtfy.com/privacy/">Privacy</a>{/if}</p>
  </footer>

  <!-- Only once a game has finished in this tab: no ad on a first visit. -->
  <AdBox screen="home" />
</main>

<style>
  main {
    position: relative;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(12px, 3dvh, 28px);
    padding: 8px 20px 12px;
    max-width: 480px;
    margin: 0 auto;
  }

  header {
    position: absolute;
    top: 8px;
    right: 20px;
  }

  .hero {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  h1 {
    margin-top: 8px;
    font-size: 2rem;
    font-weight: 750;
    letter-spacing: 0.01em;
  }

  .actions {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }

  .actions .btn span {
    font-weight: 500;
  }

  .note {
    font-size: 0.95rem;
  }

  .small {
    font-size: 0.85rem;
  }

  .history {
    align-self: stretch;
  }

  .bench {
    align-self: stretch;
  }

  .bench h2 span {
    font-weight: 400;
  }

  .bench .row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 6px;
  }

  .bench .btn {
    min-height: 44px;
    padding: 0 8px;
    justify-content: space-between;
  }

  h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    margin-bottom: 2px;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
  }

  .all {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 6px 0 6px 8px;
    color: var(--accent);
    font-weight: 600;
  }

  .past {
    width: 100%;
    display: flex;
    align-items: baseline;
    gap: 2px;
    padding: 2px 0;
    text-align: left;
  }

  .past b {
    font-size: 1.05rem;
  }

  .past span:last-child {
    margin-left: auto;
    font-size: 0.85rem;
  }

  footer {
    margin-top: auto;
    text-align: center;
    display: grid;
    gap: 4px;
  }

  footer a {
    display: inline-block;
    padding: 6px 4px;
  }
</style>

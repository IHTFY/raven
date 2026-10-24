<script>
  import { go } from '../router.svelte.js';
  import { TEST_LENGTH } from '../engine/generate.js';
  import { clock, duration, shortDate } from '../format.js';
  import { TEST_MINUTES, currentTheme, expireTest, isRunning, prepareTest, startTest, store, toggleTheme } from '../state.svelte.js';
  import Icon from './Icon.svelte';
  import Logo from './Logo.svelte';

  /** `shared` is a seed from a link someone sent. */
  let { shared = null } = $props();

  const running = $derived(isRunning(store.test) ? store.test : null);
  const theme = $derived(currentTheme());

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
    <Logo />
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

  {#if store.history.length}
    <section class="history">
      <h2 class="muted small">Recent tests</h2>
      <ol>
        {#each store.history.slice(0, 3) as h (h.date)}
          <li class="tabular">
            <b>{h.score}</b><span class="muted">/{h.total}</span>
            <span class="muted">{duration(h.seconds)} · {shortDate(h.date)}</span>
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  <footer class="muted small">
    <p>Not a formal IQ test. Inspired by Mensa Norway's test and the Sandia Matrices.</p>
    <p><a href="https://ihtfy.com">IHTFY</a> · <a href="https://github.com/IHTFY/raven">Source</a> · <a href="https://ihtfy.com/support/">Support ♥</a> · <a href="https://ihtfy.com/privacy">Privacy</a></p>
  </footer>
</main>

<style>
  main {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(12px, 3dvh, 28px);
    padding: 8px 20px 12px;
    max-width: 480px;
    margin: 0 auto;
  }

  header {
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
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

  h2 {
    font-weight: 600;
    margin-bottom: 6px;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
  }

  li {
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  li b {
    font-size: 1.05rem;
  }

  li span:last-child {
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

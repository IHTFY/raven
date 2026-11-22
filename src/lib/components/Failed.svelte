<script>
  import { go, route } from '../router.svelte.js';
  import { clearUnbuildable, puzzlesFor, store } from '../state.svelte.js';

  /** `reset` shows the screens again once the saved work is gone. */
  let { reset } = $props();

  // Decided now, while the failed screen is still the route: going Back before the tap must not change what gets cleared.
  // The saved test is cleared only if it is the one that can't be built. A past result that fails leaves it alone.
  const failed = (() => {
    const page = route.path[0];
    if (page === 'practice') return 'practice';
    if (!store.test) return 'history';
    try {
      puzzlesFor(store.test.seed);
      return 'history';
    } catch {
      return 'test';
    }
  })();

  function leave() {
    clearUnbuildable(failed);
    go();
    reset();
  }
</script>

<main>
  <h1>Couldn’t build this puzzle</h1>
  <p class="muted">Something in your saved test or practice can’t be opened. Clearing it takes you back to the start. Your finished tests stay.</p>
  <button class="btn big primary" onclick={leave}>Clear it and go home</button>
</main>

<style>
  main {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 20px;
    max-width: 480px;
    margin: 0 auto;
    text-align: center;
  }
</style>

<script>
  import { go, route } from '../router.svelte.js';
  import { clearUnbuildable } from '../state.svelte.js';

  /** `reset` shows the screens again once the saved work is gone. */
  let { reset } = $props();

  function leave() {
    clearUnbuildable(route.path[0]);
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

<script>
  import { isSeed } from '../engine/rng.js';
  import { rise } from '../motion.js';
  import { route } from '../router.svelte.js';
  import { canReview, expireTest, pastTest, resultKey, store } from '../state.svelte.js';
  import History from './History.svelte';
  import Stats from './Stats.svelte';
  import Home from './Home.svelte';
  import Practice from './Practice.svelte';
  import Quiz from './Quiz.svelte';
  import Results from './Results.svelte';

  // A test left open in another visit may have run out of time meanwhile.
  expireTest();

  const view = $derived.by(() => {
    const [page, seed, pastSeed] = route.path;
    if (page === 'practice') return { screen: 'practice' };
    if (page === 'stats') return { screen: 'stats' };
    if (page === 'history') {
      // Only a saved test can be opened, so the date and seed in the link are looked up rather than trusted.
      const past = seed && pastTest(seed, pastSeed);
      return past && canReview(past) ? { screen: 'past', key: resultKey(past), past } : { screen: 'history' };
    }
    if (page === 'test') {
      const test = store.test;
      if (test && (!seed || seed === test.seed)) return { screen: test.finished ? 'results' : 'quiz', key: test.seed };
      // A seed the player has already taken isn't a shared test: an older entry in the tab's history (Back, or a saved link) opens its result.
      const taken = isSeed(seed) ? store.history.filter((h) => h.seed === seed) : [];
      const past = taken.find(canReview);
      if (past) return { screen: 'past', key: resultKey(past), past };
      if (taken.length) return { screen: 'home' };
      if (isSeed(seed)) return { screen: 'home', shared: seed };
    }
    return { screen: 'home' };
  });
</script>

{#key `${view.screen}/${view.key ?? view.shared ?? ''}`}
  <div class="screen" in:rise>
    {#if view.screen === 'quiz'}
      <Quiz />
    {:else if view.screen === 'results'}
      <Results />
    {:else if view.screen === 'past'}
      <Results past={view.past} />
    {:else if view.screen === 'stats'}
      <Stats />
    {:else if view.screen === 'history'}
      <History />
    {:else if view.screen === 'practice'}
      <Practice />
    {:else}
      <Home shared={view.shared} />
    {/if}
  </div>
{/key}

<style>
  .screen {
    height: 100%;
  }
</style>

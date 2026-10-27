<script>
  import { rise } from './lib/motion.js';
  import { route } from './lib/router.svelte.js';
  import { canReview, currentTheme, expireTest, pastTest, store } from './lib/state.svelte.js';
  import History from './lib/components/History.svelte';
  import Stats from './lib/components/Stats.svelte';
  import Home from './lib/components/Home.svelte';
  import Practice from './lib/components/Practice.svelte';
  import Quiz from './lib/components/Quiz.svelte';
  import Results from './lib/components/Results.svelte';

  const SEED = /^[a-z0-9]{1,24}$/i;

  // A test left open in another visit may have run out of time meanwhile.
  expireTest();

  const view = $derived.by(() => {
    const [page, seed] = route.path;
    if (page === 'practice') return { screen: 'practice' };
    if (page === 'stats') return { screen: 'stats' };
    if (page === 'history') {
      // Only a saved test can be opened, so the date in the link is looked up rather than trusted.
      const past = seed && pastTest(seed);
      return past && canReview(past) ? { screen: 'past', key: past.date, past } : { screen: 'history' };
    }
    if (page === 'test') {
      const test = store.test;
      if (test && (!seed || seed === test.seed)) return { screen: test.finished ? 'results' : 'quiz', key: test.seed };
      if (seed && SEED.test(seed)) return { screen: 'home', shared: seed };
    }
    return { screen: 'home' };
  });

  // Follow the theme, including the browser's chrome color.
  $effect(() => {
    document.documentElement.dataset.theme = currentTheme();
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    document.querySelector('meta[name="theme-color"]').setAttribute('content', bg);
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

<script>
  import { currentTheme } from './lib/state.svelte.js';
  import Failed from './lib/components/Failed.svelte';
  import Screens from './lib/components/Screens.svelte';

  // Follow the theme, including the browser's chrome color.
  $effect(() => {
    document.documentElement.dataset.theme = currentTheme();
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    document.querySelector('meta[name="theme-color"]').setAttribute('content', bg);
  });
</script>

<!-- A puzzle that can't be built throws while a screen opens; this shows a way out instead of a blank page. -->
<svelte:boundary onerror={(error) => console.error(error)}>
  <Screens />
  {#snippet failed(error, reset)}
    <Failed {reset} />
  {/snippet}
</svelte:boundary>

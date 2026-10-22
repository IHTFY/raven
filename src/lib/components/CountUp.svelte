<script>
  import { Tween, prefersReducedMotion } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  /** A number that counts up through its values. */
  let { value } = $props();

  const shown = new Tween(0, { duration: prefersReducedMotion.current ? 0 : 900, easing: cubicOut });
  $effect(() => {
    shown.target = value;
  });
</script>

{Math.round(shown.current)}

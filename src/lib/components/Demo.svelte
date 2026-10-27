<script>
  import { prefersReducedMotion } from 'svelte/motion';
  import Figure from './Figure.svelte';
  import Icon from './Icon.svelte';

  /** Plays a demo from explain.js: a small grid or a strip of pictures, one step at a time, looping. */
  let { demo } = $props();

  const STEP_MS = { grid: 1700, strip: 2800 };

  let index = $state(0);
  let playing = $state(!prefersReducedMotion.current);
  const step = $derived(demo.steps[index]);

  $effect(() => {
    if (!playing || demo.steps.length < 2) return;
    const id = setInterval(() => (index = (index + 1) % demo.steps.length), STEP_MS[demo.kind]);
    return () => clearInterval(id);
  });

  const pick = (k) => {
    index = k;
    playing = false;
  };

  // Arrow labels sit halfway between the two cells, in percent of the grid.
  const middle = (a, b) => ({ x: (((a % 3) + (b % 3)) / 2 + 0.5) * (100 / 3), y: ((Math.floor(a / 3) + Math.floor(b / 3)) / 2 + 0.5) * (100 / 3) });
</script>

{#snippet slot(layers, extra = '')}
  <div class="slot {extra}">
    {#if demo.base}<div class="layer"><Figure figure={demo.base} /></div>{/if}
    {#each layers as layer, i (i)}
      <div
        class="layer {layer.tone ? `tone-${layer.tone}` : ''}"
        class:drop={layer.drop}
        class:reveal={layer.reveal}
        class:ghost={layer.ghost}
        class:mover={layer.move}
        style:--rot="{layer.move?.rotate ?? 0}deg"
        style:--dx="{layer.move?.dx ?? 0}%"
        style:--dy="{layer.move?.dy ?? 0}%"
      >
        <Figure figure={layer.figure} />
      </div>
    {/each}
  </div>
{/snippet}

<figure class="demo">
  {#key index}
    {#if demo.kind === 'grid'}
      <div class="grid">
        {#each step.cells as layers, i (i)}
          {@render slot(layers, step.mark.includes(i) ? 'mark' : 'dim')}
        {/each}
        {#if step.arrow}
          {@const at = middle(step.arrow.from, step.arrow.to)}
          <span class="arrow" style:left="{at.x}%" style:top="{at.y}%">
            {step.arrow.to - step.arrow.from === 1 ? '→' : '↓'}
            {step.arrow.label}
          </span>
        {/if}
      </div>
    {:else}
      <div class="strip">
        {#each step.items as item, i (i)}
          {#if item.sign}
            <span class="sign">{item.sign}</span>
          {:else}
            <div class="item">
              {@render slot(item.layers, item.merge ? 'merge' : '')}
              {#if item.label != null}<span class="label tabular" class:reveal={item.reveal}>{item.label}</span>{/if}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
    <figcaption>{step.caption}</figcaption>
  {/key}

  {#if demo.steps.length > 1}
    <div class="controls">
      <button class="icon-btn" onclick={() => (playing = !playing)} aria-label={playing ? 'Pause' : 'Play'}>
        <Icon name={playing ? 'pause' : 'play'} size={18} />
      </button>
      {#each demo.steps as _, k (k)}
        <button class="dot" class:here={k === index} onclick={() => pick(k)} aria-label="Step {k + 1}"></button>
      {/each}
    </div>
  {/if}
</figure>

<style>
  .demo {
    margin: 10px 0 0;
    display: grid;
    justify-items: center;
    gap: 8px;
    --demo-cell: min(64px, 21vw);
  }

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, var(--demo-cell));
    gap: 4px;
    padding: 6px;
    border-radius: var(--radius-sm);
  }

  .strip {
    display: flex;
    align-items: center;
    gap: 4px;
    --demo-cell: min(56px, 15vw);
  }

  .item {
    display: grid;
    justify-items: center;
    gap: 2px;
  }

  .slot {
    position: relative;
    width: var(--demo-cell);
    height: var(--demo-cell);
    border-radius: 10px;
    overflow: hidden;
    transition:
      opacity 200ms,
      box-shadow 200ms;
  }

  .strip .slot {
    box-shadow: var(--sink);
  }

  .grid .dim {
    opacity: 0.35;
  }

  .grid .mark {
    box-shadow: 0 0 0 2px var(--accent);
    animation: mark-in 300ms var(--ease-out) both;
  }

  .layer {
    position: absolute;
    inset: 8%;
  }

  /* Tones recolor a layer's ink. */
  .tone-a {
    --ink: var(--tone-a);
  }
  .tone-b {
    --ink: var(--tone-b);
  }
  .tone-c {
    --ink: var(--tone-c);
  }
  .tone-both {
    --ink: var(--tone-both);
  }

  .ghost {
    opacity: 0.55;
  }

  /* Merged pictures slide in from the left, then the parts a rule drops fade out. */
  .merge .layer {
    animation: merge-in 600ms var(--ease-out) both;
  }
  .merge .layer:nth-child(odd) {
    animation-name: merge-in-right;
  }
  .merge .drop {
    animation:
      merge-in 600ms var(--ease-out) both,
      drop 500ms 1300ms ease-in forwards;
  }

  .reveal {
    animation: reveal 400ms 1100ms var(--ease-out) both;
  }

  .mover {
    animation:
      travel 900ms 300ms var(--ease-out) forwards,
      vanish 250ms 1300ms forwards;
  }
  .mover + .reveal {
    animation-delay: 1300ms;
  }

  .sign {
    min-width: 14px;
    text-align: center;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--muted);
  }

  .label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--muted);
  }

  .arrow {
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--bg);
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
    animation: reveal 250ms 150ms var(--ease-out) both;
  }

  figcaption {
    min-height: 2.6em;
    font-size: 0.85rem;
    color: var(--muted);
    text-align: center;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .controls .icon-btn {
    width: 36px;
    height: 36px;
    color: var(--muted);
  }

  .dot {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
  }

  .dot::after {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--line);
    transition: background 150ms;
  }

  .dot.here::after {
    background: var(--accent);
  }

  @keyframes mark-in {
    from {
      box-shadow: 0 0 0 0 var(--accent);
    }
  }

  @keyframes merge-in {
    from {
      opacity: 0;
      transform: translateX(-60%);
    }
  }

  @keyframes merge-in-right {
    from {
      opacity: 0;
      transform: translateX(60%);
    }
  }

  @keyframes drop {
    to {
      opacity: 0;
      transform: scale(0.85);
    }
  }

  @keyframes reveal {
    from {
      opacity: 0;
    }
  }

  @keyframes travel {
    to {
      transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
    }
  }

  @keyframes vanish {
    to {
      opacity: 0;
    }
  }
</style>

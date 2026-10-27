<script>
  /**
   * A one-series bar chart in plain HTML. Each bar is { label, value, tip };
   * hovering or focusing a bar shows its tip. `axis` labels every few bars.
   */
  let { bars, label, axis = (bar, i) => bar.label, every = 1, unit = '' } = $props();

  const top = $derived(Math.max(1, ...bars.map((b) => b.value ?? 0)));
  let active = $state(null);
</script>

<div class="chart" role="img" aria-label={label}>
  <span class="max muted tabular">{Math.round(top * 10) / 10}{unit}</span>
  <div class="plot">
    {#each bars as bar, i (i)}
      <button
        class="col"
        onpointerenter={() => (active = i)}
        onpointerleave={() => (active = null)}
        onfocus={() => (active = i)}
        onblur={() => (active = null)}
        aria-label={bar.tip}
      >
        <span class="bar" class:empty={!bar.value} style:height="{(100 * (bar.value ?? 0)) / top}%"></span>
      </button>
    {/each}
    {#if active != null}
      <span class="tip" style:left="clamp(48px, {((active + 0.5) * 100) / bars.length}%, calc(100% - 48px))">{bars[active].tip}</span>
    {/if}
  </div>
  <div class="axis muted tabular" aria-hidden="true">
    {#each bars as bar, i (i)}
      <span>{i % every === 0 ? axis(bar, i) : ''}</span>
    {/each}
  </div>
</div>

<style>
  .chart {
    position: relative;
    display: grid;
    gap: 4px;
  }

  .max {
    font-size: 0.72rem;
  }

  .plot {
    position: relative;
    height: 120px;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    border-bottom: 1px solid var(--line);
  }

  .col {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }

  .bar {
    width: min(100%, 28px);
    min-height: 2px;
    border-radius: 4px 4px 0 0;
    background: var(--accent);
    transition: opacity 120ms;
  }

  .bar.empty {
    background: var(--line);
  }

  .col:hover .bar,
  .col:focus-visible .bar {
    opacity: 0.75;
  }

  .tip {
    position: absolute;
    bottom: calc(100% + 4px);
    transform: translateX(-50%);
    padding: 3px 8px;
    border-radius: 8px;
    background: var(--text);
    color: var(--bg);
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    z-index: 1;
  }

  .axis {
    display: flex;
    gap: 2px;
    font-size: 0.68rem;
  }

  .axis span {
    flex: 1;
    text-align: center;
    overflow: visible;
    white-space: nowrap;
  }
</style>

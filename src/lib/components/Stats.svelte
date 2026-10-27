<script>
  import { TEST_LENGTH } from '../engine/generate.js';
  import { clock } from '../format.js';
  import { go } from '../router.svelte.js';
  import { store } from '../state.svelte.js';
  import { FAMILY_NAMES, RULE_NAMES, attempts, byCombination, byFamily, byPosition, byRule, comboName, histogram, summary } from '../stats.js';
  import Bars from './Bars.svelte';
  import Icon from './Icon.svelte';

  /** Statistics from saved tests and practice: scores, time per puzzle, and which rules are hardest. */

  const percent = (x) => (x == null ? '–' : `${Math.round(100 * x)}%`);
  const secs = (x) => (x == null ? '–' : `${Math.round(x)} s`);

  const tests = $derived(store.history.filter((h) => h.total === TEST_LENGTH));
  const head = $derived(summary(tests));
  const bins = $derived(histogram(tests, TEST_LENGTH));
  const positions = $derived(byPosition(tests, TEST_LENGTH));
  const list = $derived(attempts(store.history, store.log));
  const tables = $derived([
    { title: 'Rules', rows: byRule(list, 1), name: (k) => RULE_NAMES[k] ?? k },
    { title: 'Rule combinations', rows: byCombination(list, 3).slice(0, 10), name: comboName, note: 'At least 3 answers each; hardest 10.' },
    { title: 'Picture styles', rows: byFamily(list, 1), name: (k) => FAMILY_NAMES[k] ?? k },
  ]);
  const timed = $derived(positions.some((p) => p.seconds != null));
</script>

<main>
  <header>
    <button class="icon-btn" onclick={() => go()} aria-label="Home"><Icon name="home" /></button>
    <h1>Statistics</h1>
    <button class="icon-btn" onclick={() => go('history')} aria-label="Past tests"><Icon name="list" /></button>
  </header>

  {#if !tests.length && !list.length}
    <p class="muted empty">Finish a test or answer a few practice puzzles to see statistics here.</p>
  {:else}
    <section class="tiles">
      <div class="tile raised"><b class="tabular">{head.tests}</b><span class="muted">tests</span></div>
      <div class="tile raised"><b class="tabular">{head.best ?? '–'}</b><span class="muted">best</span></div>
      <div class="tile raised"><b class="tabular">{head.average == null ? '–' : head.average.toFixed(1)}</b><span class="muted">average</span></div>
      <div class="tile raised"><b class="tabular">{head.seconds == null ? '–' : clock(head.seconds * 1000)}</b><span class="muted">median time</span></div>
    </section>

    {#if tests.length}
      <section>
        <h2>Scores</h2>
        <p class="muted small">How many of your tests landed in each score range, out of {TEST_LENGTH}.</p>
        <Bars
          label="Histogram of test scores"
          bars={bins.map((b) => ({ label: `${b.from}`, value: b.count, tip: `${b.from}–${b.to}: ${b.count} test${b.count === 1 ? '' : 's'}` }))}
        />
      </section>
    {/if}

    {#if timed}
      <section>
        <h2>Time per puzzle</h2>
        <p class="muted small">Median seconds on each puzzle of a test, easiest first. Hover or tap a bar for the share right.</p>
        <Bars
          label="Median seconds by puzzle position"
          unit=" s"
          every={5}
          axis={(b) => b.position}
          bars={positions.map((p) => ({
            label: `${p.position}`,
            position: p.position,
            value: p.seconds,
            tip: `#${p.position}: ${secs(p.seconds)} · ${percent(p.right)} right`,
          }))}
        />
      </section>
    {/if}

    {#each tables as table (table.title)}
      {#if table.rows.length}
        <section>
          <h2>{table.title}</h2>
          <p class="muted small">Hardest first, from {list.length} answered puzzles in tests and practice.{table.note ? ` ${table.note}` : ''}</p>
          <table>
            <thead>
              <tr><th>Name</th><th class="num">Answers</th><th>Right</th><th class="num">Median</th></tr>
            </thead>
            <tbody>
              {#each table.rows as row (row.key)}
                <tr>
                  <td>{table.name(row.key)}</td>
                  <td class="num tabular">{row.count}</td>
                  <td>
                    <span class="share tabular"><span class="meter sunk"><span style:width={percent(row.share)}></span></span>{percent(row.share)}</span>
                  </td>
                  <td class="num tabular">{secs(row.seconds)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </section>
      {/if}
    {/each}

    <p class="muted small note">Statistics stay in this browser. Tests finished before this version count toward scores but not toward times or rules.</p>
  {/if}
</main>

<style>
  main {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 8px 16px 24px;
    max-width: 640px;
    margin: 0 auto;
  }

  header {
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    align-items: center;
    text-align: center;
  }

  h1 {
    font-size: 1.15rem;
    font-weight: 700;
  }

  h2 {
    font-size: 1rem;
    font-weight: 650;
    margin-bottom: 2px;
  }

  section {
    display: grid;
    gap: 8px;
  }

  .small {
    font-size: 0.8rem;
  }

  .empty,
  .note {
    text-align: center;
  }

  .tiles {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .tile {
    display: grid;
    justify-items: center;
    padding: 10px 4px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
  }

  .tile b {
    font-size: 1.15rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  th {
    text-align: left;
    font-weight: 600;
    color: var(--muted);
    font-size: 0.75rem;
    padding: 4px 6px;
  }

  td {
    padding: 6px;
    border-top: 1px solid var(--line);
  }

  .num {
    text-align: right;
    white-space: nowrap;
  }

  .share {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .meter {
    width: 48px;
    height: 6px;
    border-radius: 99px;
    overflow: hidden;
  }

  .meter span {
    display: block;
    height: 100%;
    background: var(--accent);
  }

  @media (max-width: 400px) {
    .meter {
      display: none;
    }
  }
</style>

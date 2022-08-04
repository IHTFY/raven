<script>
  import Icon from "@iconify/svelte";
  import { currentQuestion } from "../stores.js";

  export let totalQuestions = 30;

  const limit = (val) => Math.max(1, Math.min(val, totalQuestions));

  const gotoFirst = () => currentQuestion.set(1);
  const gotoLast = () => currentQuestion.set(totalQuestions);

  const gotoNext = () => currentQuestion.update((n) => limit(n + 1));
  const gotoPrev = () => currentQuestion.update((n) => limit(n - 1));

  const gotoPage = (page) => currentQuestion.set(limit(page));
</script>

<ul class="pagination">
  <li
    class="neu-flat"
    class:disabled={$currentQuestion <= 1}
    class:pressed={$currentQuestion <= 1}
  >
    <button class="btn neu-flat rounded-1" on:click={gotoFirst}
      ><Icon icon="mdi:chevron-double-left" inline={true} /></button
    >
  </li>

  {#each [$currentQuestion - 1, $currentQuestion, $currentQuestion + 1] as i}
    <li class="neu-flat" class:hidden={limit(i) !== i}>
      <button
        class="btn neu-flat rounded-1 font-w{$currentQuestion === i
          ? '600'
          : '400'}"
        class:neu-pressed={$currentQuestion === i}
        on:click={() => gotoPage(i)}>{i}</button
      >
    </li>
  {/each}

  <li
    class="neu-flat"
    class:disabled={$currentQuestion >= totalQuestions}
    class:pressed={$currentQuestion >= totalQuestions}
  >
    <button class="btn neu-flat rounded-1" on:click={gotoLast}
      ><Icon icon="mdi:chevron-double-right" inline={true} /></button
    >
  </li>
</ul>

<style>
  .pagination {
    user-select: none;
  }

  button.btn {
    min-width: 3.5em;
  }

  .hidden {
    visibility: hidden;
  }
</style>

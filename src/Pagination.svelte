<script>
  export let currentPage = 1;
  export let lastPage = 30;

  const limit = (val) => Math.max(1, Math.min(val, lastPage));

  const gotoFirst = () => (currentPage = 1);
  const gotoLast = () => (currentPage = lastPage);

  const gotoNext = () => (currentPage = limit(currentPage + 1));
  const gotoPrev = () => (currentPage = limit(currentPage - 1));

  const gotoPage = (page) => (currentPage = limit(page));
</script>

<ul class="pagination">
  <li class="neu-flat {currentPage < 2 ? 'disabled pressed' : ''}">
    <button class="btn neu-flat rounded-1" on:click={gotoFirst}>⟪</button>
  </li>

  {#each [currentPage - 1, currentPage, currentPage + 1] as i}
    {#if limit(i) === i}
      <li class="neu-flat">
        <button
          class="btn neu-flat rounded-1 {currentPage === i
            ? 'neu-pressed'
            : ''}"
          on:click={() => gotoPage(i)}>{i}</button
        >
      </li>
    {/if}
  {/each}

  <li class="neu-flat {currentPage > lastPage - 1 ? 'disabled pressed' : ''}">
    <button class="btn neu-flat rounded-1" on:click={gotoLast}>⟫</button>
  </li>
</ul>

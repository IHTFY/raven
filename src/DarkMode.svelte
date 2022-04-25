<script>
  import { theme } from "./stores.js";

  // get theme from localStorage or use light by default
  theme.set(localStorage.getItem("theme") ?? "neu-light");

  // update localStorage and html class whenever the theme writable changes
  theme.subscribe((current) => {
    localStorage.setItem("theme", current);
    document.documentElement.classList.remove("neu-light", "neu-dark");
    document.documentElement.classList.add(current);
  });
</script>

<button
  class="btn rounded-1 neu-concave neu-small"
  data-neu-click="neu-pressed"
  on:click={() => {
    theme.update((current) =>
      current === "neu-light" ? "neu-dark" : "neu-light"
    );
  }}
>
  DARK MODE
</button>

<script>
  import { theme } from "../stores.js";

  // get theme from localStorage or use light by default
  theme.set(localStorage.getItem("theme") ?? "neu-light");

  // update localStorage and html class whenever the theme writable changes
  theme.subscribe((current) => {
    localStorage.setItem("theme", current);
    document.documentElement.classList.remove("neu-light", "neu-dark");
    document.documentElement.classList.add(current);
  });

  const toggleDarkMode = () => {
    theme.update((current) =>
      current === "neu-light" ? "neu-dark" : "neu-light"
    );
  };
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a class="navbar-link neu-flat rounded-1" on:click={toggleDarkMode}>Dark Mode</a
>

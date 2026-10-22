<script>
  const PATHS = {
    back: 'M15 5l-7 7 7 7',
    next: 'M9 5l7 7-7 7',
    close: 'M6 6l12 12M18 6L6 18',
    grid: 'M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z',
    sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
    moon: 'M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z',
    share: 'M12 3.5v11M7.5 8l4.5-4.5L16.5 8M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    cross: 'M7 7l10 10M17 7L7 17',
    home: 'M4 11l8-7 8 7M6.5 9v11h11V9',
    flag: 'M6 21V4M6 4h11l-2.5 4L17 12H6',
  };

  let { name, size = 22 } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
  <path d={PATHS[name]} />
</svg>

<style>
  svg {
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex: none;
  }
</style>

/** Display helpers. Dates follow the browser's locale. */

export const clock = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const duration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return [m && `${m} min`, (s || !m) && `${s} s`].filter(Boolean).join(' ');
};

const day = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
export const shortDate = (ms) => day.format(ms);

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

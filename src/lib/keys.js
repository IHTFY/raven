/** Controls that Enter presses when they have focus. */
const CONTROLS = 'a[href], button:not(:disabled), input, select, textarea, summary';

/** Enter on a focused control belongs to that control, not to the screen's shortcuts. */
export const pressesControl = (e) => e.key === 'Enter' && e.target instanceof Element && e.target.closest(CONTROLS) !== null;

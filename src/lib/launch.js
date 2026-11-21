/**
 * The installed app's launch: the icon is a 2×2 puzzle, the logo on Home a 3×3 one.
 * The icon's four pieces spread to the logo's four corners (circle to circle, question
 * mark to question mark) while the launch screen fades, then the five cells between them
 * pop in. index.html holds the copy of the launch screen; main.js hands this to its launchExit.
 */

const FLY = 760;
const STAGGER = 40;
// The pieces move on this curve; their fades run on the clock, so a piece fades only once it is nearly in place.
const EASE = 'cubic-bezier(0.5, 0, 0.2, 1)';

// A box's center and height on screen, with the shape's stroke added on each side.
function box(rect, shape) {
  const style = getComputedStyle(shape);
  const pad = style.stroke === 'none' ? 0 : (parseFloat(style.strokeWidth) * shape.getScreenCTM().a) / 2;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, h: rect.height + 2 * pad };
}

const drawn = (cell) => {
  const path = cell.querySelector('path');
  return box(path.getBoundingClientRect(), path);
};

/** Starts the exit from the launch screen copy and returns every animation it runs. */
export function playLaunch(overlay) {
  const logo = document.querySelector('.logo');
  // Home without its logo (an ad took the room): the plain fade.
  if (!logo) return [];
  // The logo's own entrance runs under the copy; end it so the cells measure at full size.
  for (const animation of logo.getAnimations({ subtree: true })) animation.finish();

  const cells = [...logo.querySelectorAll('.cell')];
  const ask = logo.querySelector('.ask');
  const size = parseFloat(getComputedStyle(ask).fontSize);
  const r = ask.getBoundingClientRect();
  // Corners in the icon's order: top left, top right, bottom left, then the question mark.
  const corners = [cells[0], cells[2], cells[6], ask];
  const targets = [drawn(cells[0]), drawn(cells[2]), drawn(cells[6]), { x: r.left + r.width / 2, y: r.top + r.height / 2, h: size * 0.72 }];

  const animations = [
    overlay.animate({ backgroundColor: ['#252a3a', 'rgb(37 42 58 / 0)'] }, { duration: 600, delay: 100, easing: 'ease-in', fill: 'forwards' }),
  ];

  // The name rises into Home's title as the pieces fly.
  const name = document.getElementById('launch-name');
  const title = document.querySelector('h1');
  const from = name.getBoundingClientRect();
  const to = title.getBoundingClientRect();
  const grow = parseFloat(getComputedStyle(title).fontSize) / parseFloat(getComputedStyle(name).fontSize);
  animations.push(
    name.animate(
      [
        { transform: 'none', opacity: 1, easing: EASE },
        { opacity: 1, offset: 0.6 },
        { transform: `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(${grow})`, opacity: 0 },
      ],
      { duration: FLY, fill: 'forwards' },
    ),
    title.animate([{ opacity: 0 }, { opacity: 0, offset: 0.6 }, { opacity: 1 }], { duration: FLY }),
  );

  [...overlay.querySelectorAll('#launch-icon g')].forEach((piece, i) => {
    const from = box(piece.getBoundingClientRect(), piece.firstElementChild);
    const to = targets[i];
    const delay = i * STAGGER;
    const svg = piece.ownerSVGElement;
    const origin = svg.getBoundingClientRect();
    svg.style.transformOrigin = `${from.x - origin.left}px ${from.y - origin.top}px`;
    animations.push(
      svg.animate(
        [
          { transform: 'none', opacity: 1, easing: EASE },
          { opacity: 1, offset: 0.75 },
          { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(${to.h / from.h})`, opacity: 0 },
        ],
        { duration: FLY, delay, fill: 'forwards' },
      ),
      // The real corner shows only as the piece lands on it, so the two never sit side by side.
      corners[i].animate([{ opacity: 0 }, { opacity: 0, offset: 0.75 }, { opacity: 1 }], { duration: FLY, delay, fill: 'backwards' }),
    );
  });

  // The cells between the corners pop in as the corners land.
  [1, 3, 4, 5, 7].forEach((n, k) => {
    animations.push(
      cells[n].animate([{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 1, transform: 'none' }], {
        duration: 240,
        delay: 420 + k * 40,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        fill: 'backwards',
      }),
    );
  });
  return animations;
}

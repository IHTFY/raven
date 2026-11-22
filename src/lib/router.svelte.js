/** Hash routes like #/test/abc123, so links can be shared and Back works. */

const parse = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

export const route = $state({ path: parse() });

addEventListener('hashchange', () => (route.path = parse()));

// Set the route right away too, so a state change and its new route render together.
// `replace` swaps the current history entry, for a move the player didn't make (Back skips it).
export const go = (path = '', { replace = false } = {}) => {
  if (replace) history.replaceState(history.state, '', `#/${path}`);
  else location.hash = `/${path}`;
  route.path = parse();
};

export const shareUrl = (seed) => `${location.origin}${location.pathname}#/test/${seed}`;

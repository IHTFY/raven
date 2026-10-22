/** Hash routes like #/test/abc123, so links can be shared and Back works. */

const parse = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

export const route = $state({ path: parse() });

addEventListener('hashchange', () => (route.path = parse()));

// Set the route right away too, so a state change and its new route render together.
export const go = (path = '') => {
  location.hash = `/${path}`;
  route.path = parse();
};

export const shareUrl = (seed) => `${location.origin}${location.pathname}#/test/${seed}`;

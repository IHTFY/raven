/**
 * Seeded random numbers, so a seed always rebuilds the same puzzles.
 * sfc32 generator, seeded with the cyrb128 hash of a string.
 */

function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

export function createRng(seed) {
  let [a, b, c, d] = cyrb128(String(seed));

  const next = () => {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
  // Discard the first outputs, which are weakly mixed.
  for (let i = 0; i < 12; i++) next();

  const int = (min, max) => min + Math.floor(next() * (max - min + 1));
  const shuffle = (list) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  return {
    int,
    pick: (list) => list[Math.floor(next() * list.length)],
    shuffle,
    sample: (list, k) => shuffle(list).slice(0, k),
    /** Pick an item with probability proportional to weight(item). */
    weighted(list, weight) {
      const weights = list.map(weight);
      let r = next() * weights.reduce((s, w) => s + w, 0);
      for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r < 0) return list[i];
      }
      return list[list.length - 1];
    },
  };
}

const SEED_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

/** A short, readable random seed for sharing a test. */
export function randomSeed() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => SEED_ALPHABET[b % SEED_ALPHABET.length]).join('');
}

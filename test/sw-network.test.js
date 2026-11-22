// Runs the service worker template against a fake network and cache, to check how pages and other
// unhashed files are served when the network is slow, down, or failing.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const template = readFileSync(new URL('../src/sw.js', import.meta.url), 'utf8')
  .replace('__VERSION__', 'test')
  .replace('__PRECACHE__', JSON.stringify(['/', '/manifest.webmanifest']))
  .replace('__SHELL_HASH__', 'unused');

// Starts the worker with a cache holding `stored` (path to body) and a fetch that is `network`.
function startWorker(stored, network) {
  const listeners = {};
  const files = new Map(Object.entries(stored));
  const caches = {
    open: async () => ({ match: async (key) => (typeof key === 'string' && files.has(key) ? new Response(files.get(key)) : undefined) }),
    match: async () => undefined,
  };
  const self = {
    location: { origin: 'https://iq.test' },
    addEventListener: (type, listener) => (listeners[type] = listener),
  };
  new Function('self', 'caches', 'fetch', template)(self, caches, network);
  const respond = (path, mode = 'navigate') => {
    let answer;
    listeners.fetch({
      request: { method: 'GET', url: `https://iq.test${path}`, mode },
      respondWith: (promise) => (answer = promise),
    });
    return answer;
  };
  const request = (path, mode) => respond(path, mode).then((response) => response.text());
  request.response = respond;
  return request;
}

// A response whose headers are in but whose body sends `chunk` and then stalls; `cancelled` records
// whether the download was stopped.
function stalledResponse(chunk = '', init = { status: 200 }) {
  const state = { cancelled: false };
  const body = new ReadableStream({
    start: (controller) => chunk && controller.enqueue(new TextEncoder().encode(chunk)),
    cancel: () => (state.cancelled = true),
  });
  return { state, response: new Response(body, init) };
}

const never = () => new Promise(() => {});

describe('network first, cache as fallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('serves the cached page once the network has stayed silent for a few seconds', async () => {
    const request = startWorker({ '/': 'cached page' }, never);
    const body = request('/');
    await vi.advanceTimersByTimeAsync(3500);
    await expect(body).resolves.toBe('cached page');
  });

  it('serves a cached unhashed file once the network has stayed silent', async () => {
    const request = startWorker({ '/manifest.webmanifest': 'cached manifest' }, never);
    const body = request('/manifest.webmanifest', 'cors');
    await vi.advanceTimersByTimeAsync(3500);
    await expect(body).resolves.toBe('cached manifest');
  });

  it('serves the cached page when the headers arrive but the body stalls, and stops the download', async () => {
    const { response, state } = stalledResponse('<html>');
    const request = startWorker({ '/': 'cached page' }, async () => response);
    const body = request('/');
    await vi.advanceTimersByTimeAsync(3500);
    await expect(body).resolves.toBe('cached page');
    expect(state.cancelled).toBe(true);
  });

  it('passes a streaming response on as soon as its headers arrive when nothing is cached', async () => {
    const { response } = stalledResponse('<html>');
    const request = startWorker({}, async () => response);
    const answer = await request.response('/');
    expect(answer).toBe(response);
  });

  it('serves the cached page at once when a server error has a stalled body, and stops the download', async () => {
    const { response, state } = stalledResponse('', { status: 503 });
    const request = startWorker({ '/': 'cached page' }, async () => response);
    await expect(request('/')).resolves.toBe('cached page');
    expect(state.cancelled).toBe(true);
  });

  it('stops the download of a response that arrives after the cached page was served', async () => {
    const { response, state } = stalledResponse('<html>');
    const request = startWorker({ '/': 'cached page' }, () => new Promise((resolve) => setTimeout(resolve, 5000, response)));
    const body = request('/');
    await vi.advanceTimersByTimeAsync(3500);
    await expect(body).resolves.toBe('cached page');
    await vi.advanceTimersByTimeAsync(2000);
    expect(state.cancelled).toBe(true);
  });

  it('serves the cached page when the body fails, without an unhandled rejection', async () => {
    const failing = new Response(
      new ReadableStream({ pull: () => new Promise((_, reject) => setTimeout(reject, 5000, new TypeError('reset'))) }),
    );
    const request = startWorker({ '/': 'cached page' }, async () => failing);
    const body = request('/');
    await vi.advanceTimersByTimeAsync(3500);
    await expect(body).resolves.toBe('cached page');
    await vi.advanceTimersByTimeAsync(3000);
  });

  it('serves the cached page when the body fails before the wait is over', async () => {
    const failing = new Response(new ReadableStream({ pull: () => Promise.reject(new TypeError('reset')) }));
    const request = startWorker({ '/': 'cached page' }, async () => failing);
    await expect(request('/')).resolves.toBe('cached page');
  });

  it('passes on the live response itself, with its status, headers and body', async () => {
    const live = new Response('live page', { status: 203, headers: { 'x-a': 'b' } });
    const request = startWorker({ '/': 'cached page' }, async () => live);
    const answer = await request.response('/');
    expect(answer).toBe(live);
    expect(answer.status).toBe(203);
    expect(answer.headers.get('x-a')).toBe('b');
    await expect(answer.text()).resolves.toBe('live page');
  });

  it('serves the network response when it arrives in time', async () => {
    const request = startWorker({ '/': 'cached page' }, () => new Promise((resolve) => setTimeout(resolve, 1000, new Response('live page'))));
    const body = request('/');
    await vi.advanceTimersByTimeAsync(1500);
    await expect(body).resolves.toBe('live page');
  });

  it('keeps waiting for the network when nothing is cached', async () => {
    const request = startWorker({}, () => new Promise((resolve) => setTimeout(resolve, 10_000, new Response('live page'))));
    const body = request('/');
    await vi.advanceTimersByTimeAsync(10_500);
    await expect(body).resolves.toBe('live page');
  });

  it('serves the cached page when the request fails at once', async () => {
    const request = startWorker({ '/': 'cached page' }, () => Promise.reject(new TypeError('offline')));
    await expect(request('/')).resolves.toBe('cached page');
  });

  it('serves the cached page when the network fails after the wait', async () => {
    const request = startWorker({ '/': 'cached page' }, () => new Promise((_, reject) => setTimeout(reject, 5000, new TypeError('reset'))));
    const body = request('/');
    await vi.advanceTimersByTimeAsync(6000);
    await expect(body).resolves.toBe('cached page');
  });

  it('serves the cached page when the server answers with an error', async () => {
    const request = startWorker({ '/': 'cached page' }, async () => new Response('down', { status: 503 }));
    await expect(request('/')).resolves.toBe('cached page');
  });

  it('fails the request when the network fails and nothing is cached', async () => {
    const request = startWorker({}, () => Promise.reject(new TypeError('offline')));
    await expect(request('/')).rejects.toThrow('offline');
  });
});

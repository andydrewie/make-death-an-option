/* Aggregate navigation counts only. No cookies, storage, or personal content. */
(() => {
  'use strict';

  const pages = new Map([
    ['/', ['home', 'Home']],
    ['/explore/', ['atlas', 'Project Atlas']],
    ['/access-memory/', ['access-memory', 'Access Memory']],
    ['/evening/', ['evening', 'Go Far Together']]
  ]);
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  const page = pages.get(path);
  if (window.location.origin !== 'https://open.andrewfai.com' || !page ||
      window.top !== window.self || navigator.webdriver ||
      navigator.globalPrivacyControl || navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' || typeof window.fetch !== 'function' ||
      new URLSearchParams(window.location.search).get('analytics') === 'off') return;

  // GoatCounter's documented /count transport. Never send location.search,
  // location.hash, document.title, document.referrer, or any textarea content.
  function count(name, title, event = false) {
    try {
      const query = new URLSearchParams({
        p: name, t: title, e: event ? '1' : '0', rnd: String(Math.random())
      });
      window.fetch('https://andrewfai-open.goatcounter.com/count?' + query, {
        method: 'GET', mode: 'no-cors', credentials: 'omit', cache: 'no-store',
        keepalive: true, referrerPolicy: 'no-referrer'
      }).catch(() => {});
    } catch { /* Counting must never interrupt the page. */ }
  }

  let pageCounted = false;
  function countPage() {
    if (pageCounted || document.visibilityState !== 'visible') return;
    pageCounted = true;
    count(path, page[1]);
    document.removeEventListener('visibilitychange', countPage);
  }
  document.addEventListener('visibilitychange', countPage);
  countPage();

  const labels = new Map([
    ['article', 'Article on X'],
    ['corpus', 'GitHub corpus'],
    ['contribution', 'Contribution route'],
    ['copy-invitation', 'Invitation copied']
  ]);
  function action(name) {
    if (document.visibilityState !== 'visible' || !labels.has(name)) return;
    count(name + '-from-' + page[0], labels.get(name) + ' · ' + page[1], true);
  }

  const repositories = new Set([
    'andydrewie/make-death-an-option',
    'universal-altruism/distributed-proof-of-contribution',
    'universal-altruism/.github'
  ]);
  function countLink(event) {
    if (!event.isTrusted || (event.type === 'click' ? event.button !== 0 : event.button !== 1)) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.origin === 'https://x.com' && url.pathname === '/andydrewie/status/2100206836897214598') {
      action('article');
    } else if (url.origin === 'https://github.com') {
      const parts = url.pathname.toLowerCase().split('/').filter(Boolean);
      if (parts[0] === 'universal-altruism' && parts[1] === 'distributed-proof-of-contribution' &&
          parts[2] === 'issues' && parts[3] === 'new') action('contribution');
      else if (repositories.has(parts.slice(0, 2).join('/')) || url.pathname === '/universal-altruism') action('corpus');
    }
  }
  document.addEventListener('click', countLink);
  document.addEventListener('auxclick', countLink);

  // Dispatched by the existing copy controls after writeText resolves.
  // It carries no text, timestamp, identifier, or other user data.
  document.addEventListener('mdao:invitation-copied', () => action('copy-invitation'));

  const examples = new Map([
    ['available-context', 'The interruption worth keeping'],
    ['one-supplied-item', 'Twelve cards. One unknown name.'],
    ['no-prior-context', 'Long enough to see it']
  ]);
  if (path === '/access-memory/') for (const [id, title] of examples) {
    const example = document.getElementById(id);
    if (!(example instanceof HTMLDetailsElement)) continue;
    let counted = false;
    function countOpen() {
      if (counted || !example.open || document.visibilityState !== 'visible') return;
      counted = true;
      count('example-' + id, 'Example opened · ' + title, true);
      example.removeEventListener('toggle', countOpen);
      document.removeEventListener('visibilitychange', countOpen);
    }
    example.addEventListener('toggle', countOpen);
    document.addEventListener('visibilitychange', countOpen);
    countOpen();
  }
})();

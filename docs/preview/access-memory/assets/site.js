/* Static preview enhancements. No personal input, storage, or analytics. */
'use strict';

for (const button of document.querySelectorAll('[data-copy]')) {
  const field = document.getElementById(button.dataset.copy);
  const status = button.parentElement.querySelector('[role="status"]');
  if (!(field instanceof HTMLTextAreaElement) || !status) continue;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Use direct copy');
      await navigator.clipboard.writeText(field.value);
      status.textContent = 'Invitation copied. Paste it into your agent.';
    } catch {
      field.focus();
      field.select();
      field.setSelectionRange(0, field.value.length);
      status.textContent = 'Text selected. Use your device’s Copy command.';
    }
  });
}

const startingGuidance = {
  memory: 'A photograph description, a place, a moment you keep returning to. You decide how much to bring.',
  project: 'An unfinished draft, an old plan, a reason that still matters. You can carry something forward and change its shape.',
  question: 'Something you are still wondering about. One small question is enough, and it can remain open.'
};
const guidance = document.getElementById('starting-guidance');
for (const button of document.querySelectorAll('[data-start]')) {
  button.addEventListener('click', () => {
    for (const other of document.querySelectorAll('[data-start]')) {
      other.setAttribute('aria-pressed', String(other === button));
    }
    if (guidance) guidance.textContent = startingGuidance[button.dataset.start];
  });
}

const contents = document.querySelector('.reader-toc details');
if (contents && window.matchMedia('(max-width: 760px)').matches) contents.open = false;

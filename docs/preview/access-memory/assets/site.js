/* Static preview enhancements. No personal input, storage, or analytics. */
'use strict';

const invitationCopiedAtMarker = '{{INVITATION_COPIED_AT}}';
const copyTemplates = new WeakMap();

for (const button of document.querySelectorAll('[data-copy]')) {
  const field = document.getElementById(button.dataset.copy);
  const status = button.parentElement.querySelector('[role="status"]');
  if (!(field instanceof HTMLTextAreaElement) || !status) continue;
  if (!copyTemplates.has(field)) copyTemplates.set(field, field.value);
  button.hidden = false;
  button.addEventListener('click', async () => {
    const template = copyTemplates.get(field);
    const hasCopyTimestamp = template.includes(invitationCopiedAtMarker);
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Use direct copy');
      const copiedText = hasCopyTimestamp
        ? template.replace(invitationCopiedAtMarker, new Date().toISOString())
        : field.value;
      await navigator.clipboard.writeText(copiedText);
      field.value = copiedText;
      status.textContent = 'Invitation copied. Paste it into your agent.';
    } catch {
      if (hasCopyTimestamp) {
        field.value = template.replace(invitationCopiedAtMarker, 'not available (manual copy)');
      }
      const disclosure = field.closest('details');
      if (disclosure) disclosure.open = true;
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

// A linked example should open its actual reflection, not land on a closed row.
function openLinkedExample() {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
  const example = document.getElementById(id);
  if (example instanceof HTMLDetailsElement && example.classList.contains('example')) {
    example.open = true;
    requestAnimationFrame(() => example.scrollIntoView({block: 'start'}));
  }
}
openLinkedExample();
window.addEventListener('hashchange', openLinkedExample);

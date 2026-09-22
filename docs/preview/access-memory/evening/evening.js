/* Copyright 2026 Andrew Fai. SPDX-License-Identifier: Apache-2.0 */
/* Native details keep every perspective usable without JavaScript. */
'use strict';

for (const button of document.querySelectorAll('[data-copy]')) {
  const field = document.getElementById(button.dataset.copy);
  const status = button.parentElement.querySelector('[role="status"]');
  if (!(field instanceof HTMLTextAreaElement) || !status) continue;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(field.value);
      status.textContent = 'Reading invitation copied.';
    } catch {
      field.focus();
      field.select();
      field.setSelectionRange(0, field.value.length);
      status.textContent = 'Text selected. Use your device’s Copy command.';
    }
  });
}

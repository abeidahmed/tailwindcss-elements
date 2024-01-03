import 'tailwindcss-elements';
import DialogElement from 'tailwindcss-elements/elements/dialog';

function openDialog(event: Event) {
  const trigger = event.target as HTMLButtonElement;
  const dialogId = trigger.getAttribute('data-twc-dialog');
  if (!dialogId) return;
  const dialog = document.getElementById(dialogId) as DialogElement;
  if (dialog) {
    dialog.open = true;
  }
}

const dialogTriggers = Array.from(document.querySelectorAll('[data-twc-dialog]'));
for (const trigger of dialogTriggers) {
  trigger.addEventListener('click', openDialog);
}

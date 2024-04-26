# Dialog

A dialog component that uses the native `<dialog>` element to interrupt interaction with the rest of the page.

## Imports

```js
import 'tailwindcss-elements/elements/dialog';
```

## Usage

```html
<button type="button">Open dialog</button>
<twc-dialog>
  <dialog data-target="twc-dialog.dialog">Contents</dialog>
</twc-dialog>
```

```js
function openDialog() {
  const dialog = document.querySelector('twc-dialog');
  dialog.open = true; // shows the dialog element.
}

const button = document.querySelector('button');
button.addEventListener('click', openDialog);
```

[![Edit Dialog](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/dialog-6gyqxk)

## Examples

### Show dialog by default

You can add the `open` attribute on the `twc-dialog` element, and the dialog will be shown by default.

```html
<twc-dialog open>
  <dialog data-target="twc-dialog.dialog">Contents</dialog>
</twc-dialog>
```

### Programmatically toggling the visiblity state

```html
<twc-dialog>
  <dialog data-target="twc-dialog.dialog">Contents</dialog>
</twc-dialog>
```

```js
const element = document.querySelector('twc-dialog');

// Show
element.open = true;

// Hide
element.open = false;
```

### Adding a close button inside the dialog

You can add a button inside the dialog and add the `data-action="click->twc-dialog#hide"` attribute on it. Pressing it
will close the parent dialog element.

```html
<twc-dialog>
  <dialog data-target="twc-dialog.dialog">
    <button type="button" data-action="click->twc-dialog#hide">x</button>
  </dialog>
</twc-dialog>
```

### Nesting dialogs

```html
<button type="button" data-dialog-id="dialog1">Open dialog</button>
<twc-dialog id="dialog1">
  <dialog data-target="twc-dialog.dialog">
    <button type="button" data-dialog-id="dialog2">Open nested dialog</button>
    <twc-dialog id="dialog2">
      <dialog data-target="twc-dialog.dialog">Nested contents</dialog>
    </twc-dialog>
  </dialog>
</twc-dialog>
```

```js
function openDialog(event) {
  const dialog = document.getElementById(event.target.dataset.dialogId);
  dialog.open = true; // shows the dialog element.
}

const buttons = Array.from(document.querySelectorAll('[data-dialog-id]'));
for (const button of buttons) {
  button.addEventListener('click', openDialog);
}
```

## Styling different states

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Events

| Name                | Bubbles   | Description                                                      |
| ------              | --------- | ------------                                                     |
| `twc-dialog:hidden` | `true`    | This event fires when the dialog is hidden via user interaction. |

# Dialog

A dialog component that uses the native `<dialog>` element to interrupt interaction with the rest of the page.

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

## Examples

### Programatically toggling the visiblity state

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

| Name   | Bubbles   | Description                                                      |
| ------ | --------- | ------------                                                     |
| `hide` | `false`   | This event fires when the dialog is hidden via user interaction. |
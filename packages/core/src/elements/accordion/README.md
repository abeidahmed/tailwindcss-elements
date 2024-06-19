# Accordion

A vertically stacked set of interactive headings that each reveal an associated section of content.

## Imports

```js
import 'tailwindcss-elements/elements/accordion';
```

## Usage

```html
<twc-accordion>
  <button type="button" data-target="twc-accordion.trigger">Do you offer technical support?</button>
  <div class="hidden data-[headlessui-state=open]:block" data-target="twc-accordion.panel">No.</div>
</twc-accordion>
```

## Examples

### Showing a panel by default

You can add the `open` attribute on the `twc-accordion` element, and the panel will be shown by default.

```html
<twc-accordion open>
  <button type="button" data-target="twc-accordion.trigger">Do you offer technical support?</button>
  <div class="hidden data-[headlessui-state=open]:block" data-target="twc-accordion.panel">No.</div>
</twc-accordion>
```

### Programmatically toggling the visibility state

```html
<twc-accordion>
  ...
</twc-accordion>
```

```js
const element = document.querySelector('twc-accordion');

// Show
element.show();

// Shows and emits the `show` and `shown` events
element.showWithEvent();

// Hide
element.hide();

// Hides and emits the `hide` and `hidden` events
element.hideWithEvent();
```

### Preventing the panel from being hidden

You can prevent the panel from being hidden by listening to the `twc-accordion:hide` event and calling the
`preventDefault` method on the event object.

```js
document.addEventListener('twc-accordion:hide', (event) => {
  event.preventDefault();
});
```

## Styling different states

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Events

| Name                   | Bubbles   | Cancelable | Description                                                                 |
| ------                 | --------- | ---------- | ------------                                                                |
| `twc-accordion:show`   | `true`    | `true`     | This event fires when the panel is about to show via user interaction.      |
| `twc-accordion:shown`  | `true`    | `false`    | This event fires when the panel is shown via user interaction.              |
| `twc-accordion:hide`   | `true`    | `true`     | This event fires when the panel is about to be hidden via user interaction. |
| `twc-accordion:hidden` | `true`    | `false`    | This event fires when the panel is hidden via user interaction.             |

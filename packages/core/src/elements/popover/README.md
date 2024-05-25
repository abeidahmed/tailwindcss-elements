# Popover

A popover can contain any arbitrary content that is triggered by a button.

## Imports

```js
import 'tailwindcss-elements/elements/popover';
```

## Usage

```html
<twc-popover>
  <button data-target="twc-popover.trigger" type="button">Toggle popover</button>
  <div data-target="twc-popover.panel">
    Popover contents!
  </div>
</twc-popover>
```

[![Edit Popover](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/popover-yyvw2d)

**Note:** The popover element uses the [`popover`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover)
attribute and comes with a [polyfill](https://github.com/oddbird/popover-polyfill). Therefore, you should not add any
hidden classes to the popover' panel as it is managed by the browser.

## Examples

### Programmatically toggling the visibility state

```html
<twc-popover>
  ...
</twc-popover>
```

```js
const element = document.querySelector('twc-popover');

// Show
element.show();

// Hide
element.hide();
```

### Adding a close button inside the popover

You can add a button inside the popover and add the `data-action="click->twc-popover#hide"` attribute on it. Pressing it
will close the parent popover.

```html
<twc-popover>
  <button data-target="twc-popover.trigger" type="button">Toggle popover</button>
  <div data-target="twc-popover.panel">
    Popover contents!
    <button type="button" data-action="click->twc-popover#hide">x</button>
  </div>
</twc-popover>
```

### Nesting popovers

```html
<twc-popover>
  <button data-target="twc-popover.trigger" type="button">Toggle popover</button>
  <div data-target="twc-popover.panel">
    Look another popover!

    <twc-popover>
      <button data-target="twc-popover.trigger" type="button">Toggle nested popover</button>
      <div data-target="twc-popover.panel">
        Nested popover contents!
      </div>
    </twc-popover>
  </div>
</twc-popover>
```

### Positioning the panel

By default, the positioning logic is not taken care of when you use the `twc-popover` element. But, you can do so by
wrapping the trigger and panel with the [`twc-floating-panel`](../floating_panel/README.md) element.

```html
<twc-popover>
  <twc-floating-panel>
    <button data-target="twc-popover.trigger twc-floating-panel.trigger" type="button">Toggle popover</button>
    <div data-target="twc-popover.panel twc-floating-panel.panel">
      Popover contents!
    </div>
  </twc-floating-panel>
</twc-popover>
```

## Styling different states

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Events

| Name                 | Bubbles   | Description                                                       |
| ------               | --------- | ------------                                                      |
| `twc-popover:shown`  | `true`    | This event fires when the popover is shown via user interaction.  |
| `twc-popover:hidden` | `true`    | This event fires when the popover is hidden via user interaction. |

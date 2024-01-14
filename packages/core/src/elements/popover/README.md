# Popover

A popover can contain any arbitrary content that is triggered by a button.

## Imports

```js
import 'tailwindcss-elements/elements/popover';
```

## Usage

```html
<twc-popover class="relative">
  <button data-target="twc-popover.trigger" type="button">Toggle popover</button>
  <div data-target="twc-popover.panel" class="absolute hidden data-[headlessui-state='open']:block">
    Popover contents!
  </div>
</twc-popover>
```

[![Edit Popover](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/popover-yyvw2d)

## Examples

### Default to the open state

You can set the `open` attribute on the element and it will be open by default.

```html
<twc-popover open>
  ...
</twc-popover>
```

### Programmatically toggling the visibility state

```html
<twc-popover>
  ...
</twc-popover>
```

```js
const element = document.querySelector('twc-popover');

// Show
element.open = true;

// Hide
element.open = false;
```

### Adding a close button inside the popover

You can add a button inside the popover and add the `data-action="click->twc-popover#hide"` attribute on it. Pressing it
will close the parent popover.

```html
<twc-popover>
  <button data-target="twc-popover.trigger" type="button">Toggle popover</button>
  <div data-target="twc-popover.panel" class="hidden data-[headlessui-state='open']:block">
    Popover contents!
    <button type="button" data-action="click->twc-popover#hide">x</button>
  </div>
</twc-popover>
```

### Nesting popovers

```html
<twc-popover>
  <button data-target="twc-popover.trigger" type="button">Toggle popover</button>
  <div data-target="twc-popover.panel" class="hidden data-[headlessui-state='open']:block">
    Look another popover!

    <twc-popover>
      <button data-target="twc-popover.trigger" type="button">Toggle nested popover</button>
      <div data-target="twc-popover.panel" class="hidden data-[headlessui-state='open']:block">
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
<twc-popover class="relative">
  <twc-floating-panel>
    <button data-target="twc-popover.trigger twc-floating-panel.trigger" type="button">Toggle popover</button>
    <div data-target="twc-popover.panel twc-floating-panel.panel" class="absolute hidden data-[headlessui-state='open']:block">
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

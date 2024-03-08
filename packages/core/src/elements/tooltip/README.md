# Tooltip

A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the
mouse hovers over it.

**Note:** The tooltip element uses the [`popover`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover)
attribute and comes with a [polyfill](https://github.com/oddbird/popover-polyfill).

## Imports

```js
import 'tailwindcss-elements/elements/tooltip';
```

## Usage

```html
<twc-tooltip>
  <button type="button" data-target="twc-tooltip.trigger">Hover me</button>
  <div data-target="twc-tooltip.panel" class="m-0">Hello, Tooltip!</div>
</twc-tooltip>
```

## Examples

### Positioning the panel

By default, the positioning logic is not taken care of when you use the `twc-tooltip` element. But, you can do so by
wrapping the trigger and panel with the [`twc-floating-panel`](../floating_panel/README.md) element.

```html
<twc-tooltip>
  <twc-floating-panel>
    <button type="button" data-target="twc-tooltip.trigger twc-floating-panel.trigger">Hover me</button>
    <div data-target="twc-tooltip.panel twc-floating-panel.panel" class="m-0">Hello, Tooltip!</div>
  </twc-floating-panel>
</twc-tooltip>
```

## Events

| Name                 | Bubbles   | Description                                                       |
| ------               | --------- | ------------                                                      |
| `twc-tooltip:shown`  | `true`    | This event fires when the tooltip is shown via user interaction.  |
| `twc-tooltip:hidden` | `true`    | This event fires when the tooltip is hidden via user interaction. |

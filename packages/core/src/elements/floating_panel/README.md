# Floating panel

A thin wrapper around [Floating UI](https://floating-ui.com/) that positions the floating panel with respect to the
anchor (trigger).

## Imports

```js
import 'tailwindcss-elements/elements/floating_panel';
```

## Usage

```html
<twc-floating-panel>
  <button type="button" data-target="twc-floating-panel.trigger">Anchor</button>
  <div data-target="twc-floating-panel.panel">Contents!</div>
</twc-floating-panel>
```

```js
const element = document.querySelector('twc-floating-panel');

// Start the positioning logic
element.active = true;

// Stop the positioning logic
element.active = false;

// Update the position of the panel
await element.position();
```

## Examples

### Setting the initial position

By default, the initial placement is set to `bottom-start`, but you can set it to one of `top`, `top-start`, `top-end`,
`right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, or `left-end` by
setting the `placement` attibute on the element.

```html
<twc-floating-panel placement="top-start">
  ...
</twc-floating-panel>
```

For more info, visit the [official docs](https://floating-ui.com/docs/computePosition#placement).

### Setting the positioning strategy

By default, the positioning strategy is set as `fixed`, but you can set it to one of `absolute` or `fixed` by
setting the `strategy` attribute on the element.

```html
<twc-floating-panel strategy="absolute">
  ...
</twc-floating-panel>
```

For more info, visit the [official docs](https://floating-ui.com/docs/computeposition#strategy).

### Adding space between the trigger and the panel element

You can set the `offset-options` attribute as a number of a JSON object.

```html
<twc-floating-panel offset-options="10">
  ...
</twc-floating-panel>

<twc-floating-panel offset-options='{"mainAxis": 10, "crossAxis": 20}'>
  ...
</twc-floating-panel>
```

For more info, visit the [official docs](https://floating-ui.com/docs/offset).

### Syncing the width, height, or both with respect to the trigger element

You can set the `sync` attribute on the element which accepts one of `width`, `height`, or `both`.

- `width` -> Make the width of the panel equal to that of the trigger.
- `height` -> Make the height of the panel equal to that of the trigger.
- `both` -> Make both the width and height of the panel equal to that of the trigger.

```html
<twc-floating-panel sync="width">
  ...
</twc-floating-panel>
```

## Events

| Name                         | Bubbles   | Description                                                                        |
| ------                       | --------- | ------------                                                                       |
| `twc-floating-panel:changed` | `true`    | This event fires when the panel is positioned with respect to the trigger element. |

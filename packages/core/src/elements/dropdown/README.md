# Dropdown

Displays a set of actions to the user with robust support for keyboard navigation.

## Imports

```js
import 'tailwindcss-elements/elements/dropdown';
```

## Usage

```html
<twc-dropdown class="relative">
  <button type="button" data-target="twc-dropdown.trigger">Toggle dropdown</button>
  <div data-target="twc-dropdown.menu" class="absolute hidden data-[headlessui-state='open']:block">
    <a href="/dashboard" data-target="twc-dropdown.menuItems">Dashboard</a>
    <a href="/settings" data-target="twc-dropdown.menuItems">Settings</a>
    <a href="/profile" data-target="twc-dropdown.menuItems">Profile</a>
  </div>
</twc-dropdown>
```

[![Edit Dropdown](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/dropdown-k3yh6f)

## Examples

### Programmatically toggling the visibility state

```html
<twc-dropdown>
  ...
</twc-dropdown>
```

```js
const element = document.querySelector('twc-dropdown');

// Show
element.open = true;

// Hide
element.open = false;
```

### Positioning the panel

By default, the positioning logic is not taken care of when you use the `twc-dropdown` element. But, you can do so by
wrapping the trigger and panel with the [`twc-floating-panel`](../floating_panel/README.md) element.

```html
<twc-dropdown class="relative">
  <twc-floating-panel>
    <button type="button" data-target="twc-dropdown.trigger twc-floating-panel.trigger">Toggle dropdown</button>
    <div data-target="twc-dropdown.menu twc-floating-panel.panel" class="absolute hidden data-[headlessui-state='open']:block">
      <a href="/dashboard" data-target="twc-dropdown.menuItems">Dashboard</a>
      <a href="/settings" data-target="twc-dropdown.menuItems">Settings</a>
      <a href="/profile" data-target="twc-dropdown.menuItems">Profile</a>
    </div>
  </twc-floating-panel>
</twc-dropdown>
```

## Styling different states

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Events

| Name                   | Bubbles   | Description                                                                                                                                                           |
| ------                 | --------- | ------------                                                                                                                                                          |
| `twc-dropdown:shown`   | `true`    | This event fires when the menu is shown via user interaction.                                                                                                         |
| `twc-dropdown:hidden`  | `true`    | This event fires when the menu is hidden via user interaction.                                                                                                        |
| `twc-dropdown:changed` | `true`    | This event fires when a menu item is selected via user interaction. You can get the selected menu item by accessing the `relatedTarget` in the `event.detail` object. |

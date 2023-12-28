# Switch

Switches are a pleasant interface for toggling a value between two states and offer the same semantics and keyboard
navigation as native checkbox elements.

## Usage

```html
<twc-switch>
  <button
    type="button"
    class="group relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 bg-indigo-50 aria-checked:bg-indigo-600"
    data-target="twc-switch.trigger"
  >
    <span class="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out translate-x-0 group-aria-checked:translate-x-9"
    ></span>
  </button>
</twc-switch>
```

## Examples

### Default to the checked state

You can set the `checked` attribute on the element and it will be checked by default.

```html
<twc-switch checked>
  <button type="button">...</button>
</twc-switch>
```

### Programatically toggling the checked state

```html
<twc-switch>
  <button type="button">...</button>
</twc-switch>
```

```js
const element = document.querySelector('twc-switch');

// On
element.checked = true;

// Off
element.checked = false;
```

## Styling different states

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Events

| Name     | Bubbles   | Description                                                              |
| ------   | --------- | ------------                                                             |
| `change` | `false`   | This event fires when the switch is toggled on/off via user interaction. |

# Tabs

Tabs are a set of layered section of content that displays one panel of content at a time.

## Imports

```js
import 'tailwindcss-elements/elements/tabs';
```

## Usage

```html
<twc-tabs>
  <twc-tabs-list>
    <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
    <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
  </twc-tabs-list>

  <div id="panel1" data-target="twc-tabs.panels" class="hidden data-[headlessui-state='selected']:block">
    Panel 1
  </div>
  <div id="panel2" data-target="twc-tabs.panels" class="hidden data-[headlessui-state='selected']:block">
    Panel 2
  </div>
</twc-tabs>
```

## Examples

### Specifying the default tab that is selected

You can set the `data-headlessui-state="selected"` on the tab element and it will be selected by default.

```html
<twc-tabs>
  <twc-tabs-list>
    <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
    <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2" data-headlessui-state="selected">Tab 2</button>
  </twc-tabs-list>

  <div id="panel1" data-target="twc-tabs.panels" class="hidden data-[headlessui-state='selected']:block">
    Panel 1
  </div>
  <div id="panel2" data-target="twc-tabs.panels" class="hidden data-[headlessui-state='selected']:block">
    Panel 2
  </div>
</twc-tabs>
```

### Vertical tabs

You can set the `orientation="vertical"` on the `twc-tabs` element to enable navigating between the tabs via the up and
down arrow keys. It also sets the `aria-orientation` attribute on the `twc-tabs-list` element.

```html
<twc-tabs orientation="vertical">
  <twc-tabs-list>
    <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
    <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
  </twc-tabs-list>

  <div id="panel1" data-target="twc-tabs.panels" class="hidden data-[headlessui-state='selected']:block">
    Panel 1
  </div>
  <div id="panel2" data-target="twc-tabs.panels" class="hidden data-[headlessui-state='selected']:block">
    Panel 2
  </div>
</twc-tabs>
```

## Styling different states

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Events

| Name               | Bubbles   | Description                                                                                                                                                       |
| ------             | --------- | ------------                                                                                                                                                      |
| `twc-tabs:changed` | `true`    | This event fires when a tab has been selected via user interaction. You can get the selected panel by accessing the `relatedTarget` in the `event.detail` object. |

# tailwindcss-elements

A set of accessible custom elements that pairs beautifully with Tailwind CSS.

## Installation

```bash
yarn add @abeidahmed/tailwindcss-elements
```

or

```bash
npm install @abeidahmed/tailwindcss-elements
```

## Importing components

```js
// Imports all the components
import '@abeidahmed/tailwindcss-elements';

// or, cherry pick what you need
import '@abeidahmed/tailwindcss-elements/dist/elements/dialog';
import '@abeidahmed/tailwindcss-elements/dist/elements/dropdown';
```

## Components

- [Dialog](./packages/core/src/elements/dialog/README.md)
- [Dropdown](./packages/core/src/elements/dropdown/README.md)
- [Popover](./packages/core/src/elements/popover/README.md)
- [Switch](./packages/core/src/elements/switch/README.md)

## Styling

Each component exposes the `data-headlessui-state` attribute that you can use to conditionally apply the classes. You
can use the [`@headlessui/tailwindcss`](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss)
plugin to target this attribute.

## Contributing

After cloning the project:

1. Run `yarn install` to install the dependencies
2. Run `yarn dev` and visit `http://localhost:3000` in your browser

Run `yarn test` to run the tests and `yarn test:watch` to run it in watch mode.

Bug reports and pull requests are welcome on GitHub at https://github.com/abeidahmed/tailwindcss-elements.
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to
the Contributor Covenant code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

import { ImpulseElement, registerElement } from '@ambiki/impulse';

@registerElement('twc-tabs-list')
export default class TabsListElement extends ImpulseElement {
  connected() {
    this.setAttribute('role', 'tablist');
  }
}

declare global {
  interface Window {
    TabsListElement: typeof TabsListElement;
  }
  interface HTMLElementTagNameMap {
    'twc-tabs-list': TabsListElement;
  }
}

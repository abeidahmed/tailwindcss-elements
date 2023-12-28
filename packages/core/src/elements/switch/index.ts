import { ImpulseElement, property, registerElement, target } from '@ambiki/impulse';

@registerElement('twc-switch')
export default class SwitchElement extends ImpulseElement {
  /**
   * Whether or not the switch is checked. To make the switch checked by default, set the `checked` attribute.
   */
  @property({ type: Boolean }) checked = false;

  @target() trigger: HTMLButtonElement;

  constructor() {
    super();
    this.handleToggle = this.handleToggle.bind(this);
  }

  /**
   * Called when the `trigger` element is connected to the DOM.
   */
  triggerConnected(trigger: HTMLButtonElement) {
    trigger.setAttribute('role', 'switch');
    if (!trigger.hasAttribute('tabindex')) {
      trigger.setAttribute('tabindex', '0');
    }
    this.syncState(this.checked);
    trigger.addEventListener('click', this.handleToggle);
  }

  /**
   * Called when the `trigger` element is removed from the DOM.
   */
  triggerDisconnected(trigger: HTMLButtonElement) {
    trigger.removeEventListener('click', this.handleToggle);
  }

  /**
   * Called when the `checked` property changes.
   */
  checkedChanged(value: boolean) {
    this.syncState(value);
  }

  private handleToggle() {
    this.checked = !this.checked;
    this.emit('change', { prefix: false, bubbles: false });
  }

  private syncState(state: boolean) {
    this.trigger.setAttribute('aria-checked', state.toString());
    this.setAttribute('data-headlessui-state', state ? 'checked' : '');
  }
}

declare global {
  interface Window {
    SwitchElement: typeof SwitchElement;
  }
  interface HTMLElementTagNameMap {
    'twc-switch': SwitchElement;
  }
}
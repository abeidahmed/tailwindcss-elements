import { ImpulseElement, property, registerElement, target } from '@ambiki/impulse';
import { setSafeAttribute } from '../../helpers/dom';
import uniqueId from '../../helpers/unique_id';

@registerElement('twc-accordion')
export default class AccordionElement extends ImpulseElement {
  /**
   * Whether the accordion is open or not. To make the accordion open by default, set the `open` attribute.
   */
  @property({ type: Boolean }) open = false;

  @target() trigger: HTMLElement;
  @target() panel: HTMLElement;

  constructor() {
    super();
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
  }

  connected() {
    if (this.open) {
      this.syncState(true);
    }

    setSafeAttribute(this, 'data-headlessui-state', '');
    this.trigger.setAttribute('aria-controls', this.panel.id);
    this.panel.setAttribute('aria-labelledby', this.trigger.id);
  }

  triggerConnected(trigger: HTMLElement) {
    setSafeAttribute(trigger, 'id', uniqueId());
    trigger.addEventListener('click', this.handleTriggerClick);
    trigger.setAttribute('aria-expanded', 'false');
    setSafeAttribute(trigger, 'data-headlessui-state', '');
  }

  triggerDisconnected(trigger: HTMLElement) {
    trigger.removeEventListener('click', this.handleTriggerClick);
  }

  panelConnected(panel: HTMLElement) {
    panel.setAttribute('role', 'region');
    setSafeAttribute(panel, 'id', uniqueId());
    setSafeAttribute(panel, 'data-headlessui-state', '');
  }

  private handleTriggerClick() {
    if (this.open) {
      this.hideWithEvent();
    } else {
      this.showWithEvent();
    }
  }

  /**
   * Shows the accordion.
   */
  show() {
    if (this.open) return;
    this.open = true;
    this.syncState(true);
  }

  /**
   * Hides the accordion.
   */
  hide() {
    if (!this.open) return;
    this.syncState(false);
    this.open = false;
  }

  /**
   * Shows the accordion and emits the `show` and `shown` events.
   */
  showWithEvent() {
    const event = this.emit('show', { cancelable: true });
    if (event.defaultPrevented) return;
    this.show();
    this.emit('shown');
  }

  /**
   * Hides the accordion and emits the `hide` and `hidden` events.
   */
  hideWithEvent() {
    const event = this.emit('hide', { cancelable: true });
    if (event.defaultPrevented) return;
    this.hide();
    this.emit('hidden');
  }

  private syncState(state: boolean) {
    const open = state ? 'open' : '';
    this.setAttribute('data-headlessui-state', open);
    this.trigger.setAttribute('data-headlessui-state', open);
    this.trigger.setAttribute('aria-expanded', state.toString());
    this.panel.setAttribute('data-headlessui-state', open);
  }
}

declare global {
  interface Window {
    AccordionElement: typeof AccordionElement;
  }
  interface HTMLElementTagNameMap {
    'twc-accordion': AccordionElement;
  }
}

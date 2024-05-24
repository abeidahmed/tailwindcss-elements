import { ImpulseElement, registerElement, target } from '@ambiki/impulse';
import { apply, isSupported } from '@oddbird/popover-polyfill/fn';
import { setSafeAttribute } from '../../helpers/dom';
import { isLooselyFocusable } from '../../helpers/focus';
import focusTrap from '../../helpers/focus_trap';
import uniqueId from '../../helpers/unique_id';
import useOutsideClick from '../../hooks/use_outside_click';

const popovers = new Set<PopoverElement>();

@registerElement('twc-popover')
export default class PopoverElement extends ImpulseElement {
  @target() trigger: HTMLButtonElement;
  @target() panel: HTMLElement;

  private _focusTrap?: AbortController;

  constructor() {
    super();
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  /**
   * Called when the element is connected to the DOM.
   */
  connected() {
    this.addEventListener('keydown', this.handleKeydown);
    this.trigger.setAttribute('aria-controls', this.panel.id);

    if (!isSupported()) {
      apply();
    }

    useOutsideClick(this, {
      boundaries: [this.trigger, this.panel],
      callback: (event, target) => {
        if (this.open && !this.hasNestedOpenPopovers) {
          this.hide();
          if (!isLooselyFocusable(target)) {
            // Prevent dialogs from closing accidentally.
            event.preventDefault();
            this.trigger.focus();
            this.emit('hidden');
          }
        }
      },
    });
  }

  /**
   * Called when the element is removed from the DOM.
   */
  disconnected() {
    this.removeEventListener('keydown', this.handleKeydown);
    this.hide();
  }

  /**
   * Called when the trigger is connected to the DOM.
   */
  triggerConnected(trigger: HTMLElement) {
    trigger.addEventListener('click', this.handleTriggerClick);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-headlessui-state', '');
  }

  /**
   * Called when the trigger is removed from the DOM.
   */
  triggerDisconnected(trigger: HTMLElement) {
    trigger.removeEventListener('click', this.handleTriggerClick);
  }

  /**
   * Called when the panel is connected to the DOM.
   */
  panelConnected(panel: HTMLElement) {
    setSafeAttribute(panel, 'id', uniqueId());
    panel.setAttribute('popover', 'manual');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('data-headlessui-state', '');
  }

  private handleTriggerClick() {
    if (this.open) {
      this.hide();
      this.trigger.focus();
      this.emit('hidden');
    } else {
      this.show();
      this.emit('shown');
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          event.stopPropagation();
          this.hide(event);
        }
        break;
    }
  }

  /**
   * Shows the popover.
   */
  show() {
    if (this.open) return;

    popovers.add(this);
    this.closeOtherPopovers();

    if (this.floatingPanel) {
      this.floatingPanel.active = true;
    }

    this.panel.showPopover();
    this._focusTrap = focusTrap(this.panel);
    this.panel.setAttribute('data-headlessui-state', 'open');
    this.trigger.setAttribute('data-headlessui-state', 'open');
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  /**
   * Hides the popover.
   * If this function is called by a user interaction, after hiding, it will focus on the trigger element and emit a
   * `hidden` event.
   */
  hide(event?: Event) {
    if (!this.open) return;

    this._focusTrap?.abort();
    this.panel.hidePopover();
    this.panel.setAttribute('data-headlessui-state', '');
    this.trigger.setAttribute('data-headlessui-state', '');
    this.trigger.setAttribute('aria-expanded', 'false');

    if (this.floatingPanel) {
      this.floatingPanel.active = false;
    }

    popovers.delete(this);

    if (event) {
      this.trigger.focus();
      this.emit('hidden');
    }
  }

  private closeOtherPopovers() {
    for (const popover of popovers) {
      if (popover === this || popover.contains(this)) continue;
      popover.hide();
    }
  }

  /**
   * Whether the popover is open or not.
   */
  get open() {
    return this.panel.matches(':popover-open');
  }

  get floatingPanel() {
    return this.querySelector('twc-floating-panel');
  }

  /**
   * Return `true` if there are nested popovers that are open, else `false`.
   */
  get hasNestedOpenPopovers() {
    return Array.from(this.querySelectorAll<PopoverElement>(this.identifier)).filter((p) => p.open).length !== 0;
  }
}

declare global {
  interface Window {
    PopoverElement: typeof PopoverElement;
  }
  interface HTMLElementTagNameMap {
    'twc-popover': PopoverElement;
  }
}

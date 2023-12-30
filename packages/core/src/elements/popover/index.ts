import { ImpulseElement, property, registerElement, target } from '@ambiki/impulse';
import uniqueId from '../../helpers/unique_id';
import focusTrap from '../../helpers/focus_trap';
import useOutsideClick from '../../hooks/use_outside_click';
import { isLooselyFocusable } from '../../helpers/focus';

@registerElement('twc-popover')
export default class PopoverElement extends ImpulseElement {
  /**
   * Whether the popover is open or not. To make the popover open by default, set the `open` attribute.
   */
  @property({ type: Boolean }) open = false;

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

    useOutsideClick(this, {
      boundaries: [this.trigger, this.panel],
      callback: (event: Event, target: HTMLElement) => {
        if (this.open) {
          this.open = false;
          if (!isLooselyFocusable(target)) {
            // Prevent dialogs from closing accidentally.
            event.preventDefault();
            this.trigger.focus();
            this.emit('hide', { bubbles: false, prefix: false });
          }
        }
      },
    });

    // If the popover is initially open we only want to change the attributes without trapping the focus.
    if (this.open) {
      this.syncState(true);
    }
  }

  /**
   * Called when the element is removed from the DOM.
   */
  disconnected() {
    this.removeEventListener('keydown', this.handleKeydown);
    this.open = false;
  }

  /**
   * Called when the `open` property changes.
   */
  openChanged(value: boolean) {
    if (value) {
      this.syncState(true);
    } else {
      this._focusTrap?.abort();
      this.syncState(false);
    }
  }

  /**
   * Called when the `trigger` element is connected to the DOM.
   */
  triggerConnected(trigger: HTMLButtonElement) {
    trigger.addEventListener('click', this.handleTriggerClick);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-headlessui-state', '');
  }

  /**
   * Called when the `trigger` element is removed from the DOM.
   */
  triggerDisconnected(trigger: HTMLButtonElement) {
    trigger.removeEventListener('click', this.handleTriggerClick);
  }

  /**
   * Called when the `panel` element is connected to the DOM.
   */
  panelConnected(panel: HTMLElement) {
    if (!panel.id) {
      panel.id = uniqueId();
    }
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('data-headlessui-state', '');
  }

  private handleTriggerClick() {
    if (this.open) {
      this.open = false;
      this.trigger.focus();
      this.emit('hide', { bubbles: false, prefix: false });
    } else {
      this.open = true;
      this._focusTrap = focusTrap(this.panel);
      this.emit('show', { bubbles: false, prefix: false });
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          event.stopPropagation();
          this.open = false;
          this.trigger.focus();
          this.emit('hide', { bubbles: false, prefix: false });
        }
        break;
    }
  }

  /**
   * Hides the popover and focuses and emits and event if the action was invoked via a user interaction.
   *
   * @example
   * <twc-popover>
   *   <button type="button" data-action="click->twc-popover#hide">Close</button>
   * </twc-popover>
   */
  hide(event?: Event) {
    if (!this.open) return;
    this.open = false;

    // The action was invoked via a user interaction.
    if (event) {
      this.trigger.focus();
      this.emit('hide', { bubbles: false, prefix: false });
    }
  }

  private syncState(state: boolean) {
    this.trigger.setAttribute('aria-expanded', state.toString());
    this.trigger.setAttribute('data-headlessui-state', state ? 'open' : '');
    this.panel.setAttribute('data-headlessui-state', state ? 'open' : '');
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

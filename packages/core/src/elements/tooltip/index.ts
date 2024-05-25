import { ImpulseElement, registerElement, target } from '@ambiki/impulse';
import { apply, isSupported } from '@oddbird/popover-polyfill/fn';
import { setSafeAttribute } from '../../helpers/dom';
import uniqueId from '../../helpers/unique_id';

@registerElement('twc-tooltip')
export default class TooltipElement extends ImpulseElement {
  @target() trigger: HTMLElement;
  @target() panel: HTMLElement;

  private isMousedown = false;
  private isMousemove = false;
  private triggerController = new AbortController();

  connected() {
    if (!isSupported()) {
      apply();
    }

    this.trigger.setAttribute('aria-describedby', this.panel.id);
  }

  disconnected() {
    this.isMousedown = false;
    this.isMousemove = false;
    this.hide();
  }

  triggerConnected(trigger: HTMLElement) {
    const { signal } = this.triggerController;
    trigger.addEventListener('mousedown', this.handleMousedown.bind(this), { signal });
    trigger.addEventListener('focus', this.handleFocus.bind(this), { signal });
    trigger.addEventListener('blur', this.handleBlur.bind(this), { signal });
    trigger.addEventListener('mousemove', this.handleMousemove.bind(this), { signal });
    trigger.addEventListener('mouseleave', this.handleMouseleave.bind(this), { signal });

    trigger.setAttribute('data-headlessui-state', '');
  }

  triggerDisconnected() {
    this.triggerController.abort();
  }

  panelConnected(panel: HTMLElement) {
    panel.setAttribute('popover', 'auto');
    panel.setAttribute('role', 'tooltip');
    setSafeAttribute(panel, 'id', uniqueId());
    panel.setAttribute('data-headlessui-state', '');
  }

  private handleMousedown() {
    this.isMousedown = true;
    document.addEventListener(
      'mouseup',
      () => {
        this.isMousedown = false;
      },
      { once: true }
    );
    this.hide();
    this.emit('hidden');
  }

  private handleFocus() {
    if (!this.isMousedown) {
      this.show();
      this.emit('shown');
    }
  }

  private handleBlur() {
    this.hide();
    this.emit('hidden');
  }

  private handleMousemove() {
    if (!this.isMousemove) {
      this.show();
      this.emit('shown');
      this.isMousemove = true;
    }
  }

  private handleMouseleave() {
    this.hide();
    this.emit('hidden');
    this.isMousemove = false;
  }

  /**
   * Shows the tooltip.
   */
  show() {
    if (!this.open) {
      if (this.floatingPanel) {
        this.floatingPanel.active = true;
      }
      this.panel.showPopover();
      this.panel.setAttribute('data-headlessui-state', 'open');
      this.trigger.setAttribute('data-headlessui-state', 'open');
    }
  }

  /**
   * Hides the tooltip.
   */
  hide() {
    if (this.open) {
      this.panel.hidePopover();
      this.panel.setAttribute('data-headlessui-state', '');
      this.trigger?.setAttribute('data-headlessui-state', '');
      if (this.floatingPanel) {
        this.floatingPanel.active = false;
      }
    }
  }

  /**
   * Whether the tooltip is open or not.
   */
  get open() {
    return this.panel.matches(':popover-open');
  }

  get floatingPanel() {
    return this.querySelector('twc-floating-panel');
  }
}

declare global {
  interface Window {
    TooltipElement: typeof TooltipElement;
  }
  interface HTMLElementTagNameMap {
    'twc-tooltip': TooltipElement;
  }
}

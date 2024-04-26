import { ImpulseElement, property, registerElement, target } from '@ambiki/impulse';
import scrollLock from '../../helpers/scroll_lock';

@registerElement('twc-dialog')
export default class DialogElement extends ImpulseElement {
  /**
   * Whether the dialog is open or not. To make the dialog open by default, set the `open` attribute.
   */
  @property({ type: Boolean }) open = false;

  @target() dialog: HTMLDialogElement;

  private _scrollLockController?: AbortController;

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * Called when the element is connected to the DOM.
   */
  connected() {
    if (this.open) {
      this.showModal();
    }
  }

  /**
   * Called when the element is removed from the DOM.
   */
  disconnected() {
    this.open = false;
  }

  /**
   * Called when the `open` property changes.
   */
  openChanged(value: boolean) {
    if (value) {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  dialogConnected(dialog: HTMLDialogElement) {
    dialog.addEventListener('click', this.handleClick);
    dialog.addEventListener('keydown', this.handleKeydown);
    dialog.addEventListener('close', this.handleClose);
    dialog.setAttribute('data-headlessui-state', '');
  }

  dialogDisconnected(dialog: HTMLDialogElement) {
    dialog.removeEventListener('click', this.handleClick);
    dialog.removeEventListener('keydown', this.handleKeydown);
    dialog.removeEventListener('close', this.handleClose);
  }

  /**
   * Hides the dialog element.
   *
   * @example
   * <twc-dialog>
   *   <dialog>
   *     <button type="button" data-action="click->twc-dialog#hide">Close</button>
   *   </dialog>
   * </twc-dialog>
   */
  hide() {
    this.open = false;
    this.emit('hidden');
  }

  private showModal() {
    this.dialog.showModal();
    this.hideOverflow();
    this.dialog.setAttribute('data-headlessui-state', 'open');
  }

  private hideModal() {
    if (this.dialog.open) {
      this.dialog.close();
    }
    this.showOverflow();
    this.dialog.setAttribute('data-headlessui-state', '');
  }

  private handleClick(event: MouseEvent) {
    if (event.defaultPrevented) return;
    const target = event.target;
    // Only close the top most dialog in the stack.
    if (!(target instanceof HTMLElement) || target !== this.dialog) return;
    const rect = target.getBoundingClientRect();
    if (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    ) {
      return;
    }
    this.open = false;
    this.emit('hidden');
  }

  private handleKeydown(event: KeyboardEvent) {
    // Avoid parent popovers from being closed.
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.emit('hidden');
    }
  }

  private handleClose() {
    this.open = false;
  }

  private hideOverflow() {
    this._scrollLockController = scrollLock();
  }

  private showOverflow() {
    // If the parent dialog is still open, do not remove the styles.
    if (!this.closest('dialog[open]')) {
      this._scrollLockController?.abort();
    }
  }
}

declare global {
  interface Window {
    DialogElement: typeof DialogElement;
  }
  interface HTMLElementTagNameMap {
    'twc-dialog': DialogElement;
  }
}

import { ImpulseElement, property, registerElement, target, targets } from '@ambiki/impulse';
import { cycle } from '../../helpers/array';
import { isDisabled, setSafeAttribute } from '../../helpers/dom';
import { isLooselyFocusable } from '../../helpers/focus';
import focusTrap from '../../helpers/focus_trap';
import uniqueId from '../../helpers/unique_id';
import useOutsideClick from '../../hooks/use_outside_click';

@registerElement('twc-dropdown')
export default class DropdownElement extends ImpulseElement {
  /**
   * Whether the dropdown is open or not. To make the dropdown open by default, set the `open` attribute.
   */
  @property({ type: Boolean }) open = false;

  @target() trigger: HTMLButtonElement;
  @target() menu: HTMLElement;
  @targets() menuItems: HTMLElement[];

  private _focusTrap?: AbortController;

  constructor() {
    super();
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  connected() {
    this.addEventListener('keydown', this.handleKeydown);
    this.trigger.setAttribute('aria-controls', this.menu.id);
    this.menu.setAttribute('aria-labelledby', this.trigger.id);

    useOutsideClick(this, {
      boundaries: [this.trigger, this.menu],
      callback: (event: Event, target: HTMLElement) => {
        if (this.open) {
          this.open = false;
          if (!isLooselyFocusable(target)) {
            // Prevent dialogs from closing accidentally.
            event.preventDefault();
            this.trigger.focus();
          }
          this.emit('hidden');
        }
      },
    });

    // If the dropdown is initially open we only want to change the attributes without trapping the focus.
    if (this.open) {
      this.syncState(true);
    }
  }

  disconnected() {
    this.removeEventListener('keydown', this.handleKeydown);
    this.open = false;
  }

  openChanged(value: boolean) {
    if (value) {
      if (this.floatingPanel) {
        this.floatingPanel.active = true;
      }
      this.syncState(true);
    } else {
      this._focusTrap?.abort();
      this.syncState(false);
      this.menu.removeAttribute('aria-activedescendant');
      this.deactivateAllMenuItems();
      if (this.floatingPanel) {
        this.floatingPanel.active = false;
      }
    }
  }

  triggerConnected(trigger: HTMLButtonElement) {
    trigger.addEventListener('click', this.handleTriggerClick);
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-headlessui-state', '');
    setSafeAttribute(trigger, 'id', uniqueId());
  }

  triggerDisconnected(trigger: HTMLButtonElement) {
    trigger.removeEventListener('click', this.handleTriggerClick);
  }

  menuConnected(menu: HTMLElement) {
    menu.addEventListener('click', this.handleMenuClick);
    menu.setAttribute('autofocus', '');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('tabindex', '-1');
    menu.setAttribute('data-headlessui-state', '');
    setSafeAttribute(menu, 'id', uniqueId());
  }

  menuDisconnected(menu: HTMLElement) {
    menu.removeEventListener('click', this.handleMenuClick);
  }

  menuItemsConnected(menuItem: HTMLElement) {
    menuItem.addEventListener('pointermove', this.handleMove);
    menuItem.addEventListener('mousemove', this.handleMove);
    menuItem.addEventListener('pointerleave', this.handleLeave);
    menuItem.addEventListener('mouseleave', this.handleLeave);

    menuItem.setAttribute('role', 'menuitem');
    menuItem.setAttribute('tabindex', '-1');
    menuItem.setAttribute('data-headlessui-state', '');
    setSafeAttribute(menuItem, 'id', uniqueId());
  }

  menuItemsDisconnected(menuItem: HTMLElement) {
    menuItem.removeEventListener('pointermove', this.handleMove);
    menuItem.removeEventListener('mousemove', this.handleMove);
    menuItem.removeEventListener('pointerleave', this.handleLeave);
    menuItem.removeEventListener('mouseleave', this.handleLeave);
  }

  private handleTriggerClick() {
    if (this.open) {
      this.open = false;
      this.trigger.focus();
      this.emit('hidden');
    } else {
      this.openAndTrapFocus();
      this.emit('shown');
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    const isTriggerActive = document.activeElement === this.trigger;

    switch (event.key) {
      case 'Escape': {
        if (this.open) {
          event.preventDefault();
          event.stopPropagation();
          this.open = false;
          this.trigger.focus();
          this.emit('hidden');
        }
        break;
      }
      case 'Enter':
      case ' ': {
        if (isTriggerActive && !this.open) {
          event.preventDefault();
          this.openAndTrapFocus();
          const firstMenuItem = this.interactableMenuItems[0];
          if (firstMenuItem) {
            this.activateMenuItem(firstMenuItem);
          }
          this.emit('shown');
          return;
        }

        if (this.activeMenuItem) {
          event.preventDefault();
          this.activeMenuItem.click();
        }
        break;
      }
      case 'ArrowDown': {
        if (isTriggerActive && !this.open) {
          event.preventDefault();
          this.openAndTrapFocus();
          const firstMenuItem = this.interactableMenuItems[0];
          if (firstMenuItem) {
            this.activateMenuItem(firstMenuItem);
          }
          this.emit('shown');
          return;
        }

        event.preventDefault();
        if (this.activeMenuItem) {
          const nextMenuItem = cycle(this.interactableMenuItems, this.activeMenuItem, 1);
          this.activateMenuItem(nextMenuItem);
        } else {
          const firstMenuItem = this.interactableMenuItems[0];
          if (firstMenuItem) {
            this.activateMenuItem(firstMenuItem);
          }
        }
        break;
      }
      case 'ArrowUp': {
        if (isTriggerActive && !this.open) {
          event.preventDefault();
          this.openAndTrapFocus();
          const lastMenuItem = this.interactableMenuItems[this.interactableMenuItems.length - 1];
          if (lastMenuItem) {
            this.activateMenuItem(lastMenuItem);
          }
          this.emit('shown');
          return;
        }

        event.preventDefault();
        if (this.activeMenuItem) {
          const previousMenuItem = cycle(this.interactableMenuItems, this.activeMenuItem, -1);
          this.activateMenuItem(previousMenuItem);
        } else {
          const lastMenuItem = this.interactableMenuItems[this.interactableMenuItems.length - 1];
          if (lastMenuItem) {
            this.activateMenuItem(lastMenuItem);
          }
        }
        break;
      }
    }
  }

  private handleMove(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const menuItem = target.closest<HTMLElement>('[role="menuitem"]');
    if (!menuItem || !this.menuItems.includes(menuItem)) return;
    if (menuItem === this.activeMenuItem) return;
    if (isDisabled(menuItem)) {
      this.deactivateAllMenuItems();
      return;
    }
    this.activateMenuItem(menuItem);
  }

  private handleLeave(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const menuItem = target.closest<HTMLElement>('[role="menuitem"]');
    if (!menuItem || !this.menuItems.includes(menuItem)) return;
    // Here the active menu item should be disabled.
    if (menuItem === this.activeMenuItem) {
      menuItem.setAttribute('data-headlessui-state', '');
      this.menu.removeAttribute('aria-activedescendant');
    }
  }

  private handleMenuClick(event: Event) {
    // Always focus on the menu element.
    this.menu.focus();

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const menuItem = target.closest<HTMLElement>('[role="menuitem"]');
    if (!menuItem || !this.menuItems.includes(menuItem)) return;
    // If it is disabled prevent the event and return early.
    if (isDisabled(menuItem)) {
      event.preventDefault();
      return;
    }
    // Click the active menu item.
    if (this.menuItemActive(menuItem)) {
      menuItem.click();
      this.open = false;
      this.trigger.focus();
      this.emit('changed', { detail: { relatedTarget: menuItem } });
    }
  }

  private openAndTrapFocus() {
    if (this.open) return;
    this.open = true;
    this._focusTrap = focusTrap(this.menu);
  }

  activateMenuItem(menuItem: HTMLElement) {
    for (const item of this.menuItems) {
      if (item === menuItem) {
        item.setAttribute('data-headlessui-state', 'active');
        this.menu.setAttribute('aria-activedescendant', item.id);
        item.scrollIntoView();
      } else {
        item.setAttribute('data-headlessui-state', '');
      }
    }
  }

  deactivateAllMenuItems() {
    this.menu.removeAttribute('aria-activedescendant');
    for (const item of this.menuItems) {
      item.setAttribute('data-headlessui-state', '');
    }
  }

  get activeMenuItem() {
    return this.menuItems.find(this.menuItemActive);
  }

  menuItemActive(menuItem: HTMLElement) {
    return menuItem.getAttribute('data-headlessui-state') === 'active';
  }

  get interactableMenuItems() {
    return this.menuItems.filter((menuItem) => !isDisabled(menuItem));
  }

  get floatingPanel() {
    return this.querySelector('twc-floating-panel');
  }

  private syncState(state: boolean) {
    this.trigger.setAttribute('aria-expanded', state.toString());
    this.trigger.setAttribute('data-headlessui-state', state ? 'open' : '');
    this.menu.setAttribute('data-headlessui-state', state ? 'open' : '');
  }
}

declare global {
  interface Window {
    DropdownElement: typeof DropdownElement;
  }
  interface HTMLElementTagNameMap {
    'twc-dropdown': DropdownElement;
  }
}

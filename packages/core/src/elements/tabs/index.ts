import { ImpulseElement, property, registerElement, targets } from '@ambiki/impulse';
import { cycle } from '../../helpers/array';
import uniqueId from '../../helpers/unique_id';
import './list';
import { isDisabled, setSafeAttribute } from '../../helpers/dom';

function getNavigationKeys(direction: 'horizontal' | 'vertical') {
  if (direction === 'horizontal') return ['ArrowRight', 'ArrowLeft'];
  return ['ArrowDown', 'ArrowUp'];
}

@registerElement('twc-tabs')
export default class TabsElement extends ImpulseElement {
  /**
   * The orientation of the tabs. By default, this is set as horizontal.
   */
  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @targets() triggers: HTMLElement[];
  @targets() panels: HTMLElement[];

  constructor() {
    super();
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  connected() {
    this.addEventListener('keydown', this.handleKeydown);
    this.tabsList?.setAttribute('aria-orientation', this.orientation);
    for (const panel of this.panels) {
      this.initializePanel(panel);
    }

    // Select the first tab if there aren't any selected tabs.
    if (!this.selectedTab) {
      this.selectTab(this.interactableTabs[0]);
    }
  }

  disconnected() {
    this.removeEventListener('keydown', this.handleKeydown);
  }

  orientationChanged(value: 'horizontal' | 'vertical') {
    this.tabsList?.setAttribute('aria-orientation', value);
  }

  triggersConnected(trigger: HTMLElement) {
    trigger.addEventListener('click', this.handleTriggerClick);
    trigger.setAttribute('role', 'tab');
    trigger.setAttribute('tabindex', '-1');
    trigger.setAttribute('aria-selected', 'false');
    setSafeAttribute(trigger, 'data-headlessui-state', '');
    setSafeAttribute(trigger, 'id', uniqueId());
  }

  triggersDisconnected(trigger: HTMLElement) {
    trigger.removeEventListener('click', this.handleTriggerClick);
  }

  panelsConnected(panel: HTMLElement) {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', '0');
    setSafeAttribute(panel, 'data-headlessui-state', '');
    setSafeAttribute(panel, 'id', uniqueId());
  }

  private handleTriggerClick(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const trigger = target.closest<HTMLElement>('[role="tab"]');
    if (!trigger || !this.triggers.includes(trigger)) return;
    this.selectTab(trigger);
    this.emitSelectedEvent(trigger);
  }

  private handleKeydown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLElement;
    const tabActive = this.triggers.includes(activeElement);
    if (!tabActive) return;
    const [incrementKey, decrementKey] = getNavigationKeys(this.orientation);

    switch (event.key) {
      case incrementKey: {
        const nextTab = cycle(this.interactableTabs, activeElement, 1);
        if (nextTab) {
          event.preventDefault();
          this.selectTab(nextTab);
          nextTab.focus();
          this.emitSelectedEvent(nextTab);
        }
        break;
      }
      case decrementKey: {
        const previousTab = cycle(this.interactableTabs, activeElement, -1);
        if (previousTab) {
          event.preventDefault();
          this.selectTab(previousTab);
          previousTab.focus();
          this.emitSelectedEvent(previousTab);
        }
        break;
      }
      case 'Home': {
        const firstTab = this.interactableTabs[0];
        if (firstTab) {
          event.preventDefault();
          this.selectTab(firstTab);
          firstTab.focus();
          this.emitSelectedEvent(firstTab);
        }
        break;
      }
      case 'End': {
        const lastTab = this.interactableTabs[this.interactableTabs.length - 1];
        if (lastTab) {
          event.preventDefault();
          this.selectTab(lastTab);
          lastTab.focus();
          this.emitSelectedEvent(lastTab);
        }
        break;
      }
    }
  }

  private initializePanel(panel: HTMLElement) {
    const tab = this.triggers.find((trigger) => trigger.getAttribute('aria-controls') === panel.id);
    if (!tab) return;
    panel.setAttribute('aria-labelledby', tab.id);

    if (this.tabSelected(tab)) {
      tab.setAttribute('data-headlessui-state', 'selected');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      panel.setAttribute('data-headlessui-state', 'selected');
    }
  }

  private emitSelectedEvent(tab: HTMLElement) {
    return this.emit('changed', { detail: { relatedTarget: this.findPanelFromTab(tab) } });
  }

  selectTab(tab: HTMLElement) {
    for (const trigger of this.triggers) {
      const panel = this.findPanelFromTab(trigger);
      const selected = trigger === tab;

      trigger.setAttribute('tabindex', selected ? '0' : '-1');
      trigger.setAttribute('aria-selected', selected.toString());
      trigger.setAttribute('data-headlessui-state', selected ? 'selected' : '');
      panel?.setAttribute('data-headlessui-state', selected ? 'selected' : '');
    }
  }

  tabSelected(tab: HTMLElement) {
    return tab.getAttribute('data-headlessui-state') === 'selected';
  }

  findPanelFromTab(tab: HTMLElement) {
    return this.panels.find((panel) => panel.id === tab.getAttribute('aria-controls'));
  }

  get interactableTabs() {
    return this.triggers.filter((trigger) => !isDisabled(trigger));
  }

  get selectedTab() {
    return this.triggers.find(this.tabSelected);
  }

  get tabsList() {
    return this.querySelector('twc-tabs-list');
  }
}

declare global {
  interface Window {
    TabsElement: typeof TabsElement;
  }
  interface HTMLElementTagNameMap {
    'twc-tabs': TabsElement;
  }
}

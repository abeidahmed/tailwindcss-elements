import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import Sinon from 'sinon';
import FloatingPanelElement from '../floating_panel';
import DropdownElement from './index';

function assertDropdownShown(el: DropdownElement, trigger: Element, menu: Element) {
  expect(el).to.have.attribute('open');
  expect(trigger).to.have.attribute('aria-expanded', 'true');
  expect(trigger).to.have.attribute('data-headlessui-state', 'open');
  expect(menu).to.have.attribute('data-headlessui-state', 'open');
}

function assertDropdownHidden(el: DropdownElement, trigger: Element, menu: Element) {
  expect(el).not.to.have.attribute('open');
  expect(trigger).to.have.attribute('aria-expanded', 'false');
  expect(trigger).to.have.attribute('data-headlessui-state', '');
  expect(menu).to.have.attribute('data-headlessui-state', '');
  expect(menu).not.to.have.attribute('aria-activedescendant');

  const menuItems = el.querySelectorAll('[role="menuitem"]');
  for (const item of menuItems) {
    expect(item).to.have.attribute('data-headlessui-state', '');
  }
}

function assertActiveMenuItem(menuItem: Element) {
  const menu = menuItem.closest('[role="menu"]');
  expect(menu).to.have.attribute('aria-activedescendant', menuItem.id);
  expect(menuItem).to.have.attribute('data-headlessui-state', 'active');
}

describe('Dropdown', () => {
  it('sets the attributes', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems"></a>
        </div>
      </twc-dropdown>
    `);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = el.querySelectorAll('a')!;

    expect(el).not.to.have.attribute('open');
    expect(trigger).to.have.attribute('aria-haspopup', 'menu');
    expect(trigger).to.have.attribute('aria-expanded', 'false');
    expect(trigger).to.have.attribute('aria-controls', menu.id);
    expect(trigger).to.have.attribute('data-headlessui-state', '');
    expect(menu).to.have.attribute('role', 'menu');
    expect(menu).to.have.attribute('autofocus', '');
    expect(menu).to.have.attribute('tabindex', '-1');
    expect(menu).to.have.attribute('aria-labelledby', trigger.id);
    expect(menu).to.have.attribute('data-headlessui-state', '');
    for (const item of menuItems) {
      expect(item).to.have.attribute('role', 'menuitem');
      expect(item).to.have.attribute('tabindex', '-1');
      expect(item).to.have.attribute('data-headlessui-state', '');
    }
  });

  it('toggles the visibility of the dropdown', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems"></a>
        </div>
      </twc-dropdown>
    `);
    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;

    expect(el).not.to.have.attribute('open');

    trigger.click();
    assertDropdownShown(el, trigger, menu);
    expect(menu).not.to.have.attribute('aria-activedescendant');
    expect(document.activeElement).to.eq(menu);
    expect(shownHandler.calledOnce).to.be.true;

    trigger.click();
    assertDropdownHidden(el, trigger, menu);
    expect(document.activeElement).to.eq(trigger);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('activates the first menu item by opening the dropdown with an Enter/Space/ArrowDown key', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems"></a>
        </div>
      </twc-dropdown>
    `);
    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));
    const activeMenuItem = menuItems[0];

    trigger.focus();
    await sendKeys({ press: 'Enter' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);
    expect(shownHandler.calledOnce).to.be.true;

    trigger.click();
    assertDropdownHidden(el, trigger, menu);
    expect(hiddenHandler.calledOnce).to.be.true;

    await sendKeys({ press: ' ' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);
    expect(shownHandler.callCount).to.eq(2);

    trigger.click();
    assertDropdownHidden(el, trigger, menu);
    expect(hiddenHandler.called).to.be.true;

    await sendKeys({ press: 'ArrowDown' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);
    expect(shownHandler.callCount).to.eq(3);
  });

  it('activates the last menu item by opening the dropdown with an ArrowUp key', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems">Last</a>
        </div>
      </twc-dropdown>
    `);
    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));
    const activeMenuItem = menuItems[1];

    trigger.focus();
    await sendKeys({ press: 'ArrowUp' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);
    expect(shownHandler.calledOnce).to.be.true;
  });

  it('activates the first non-disabled menu item by opening the dropdown with an Enter/Space/ArrowDown key', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems" aria-disabled="true"></a>
          <a href="#" data-target="twc-dropdown.menuItems"></a>
        </div>
      </twc-dropdown>
    `);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));
    const activeMenuItem = menuItems[1];

    trigger.focus();
    await sendKeys({ press: 'Enter' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);

    trigger.click();
    assertDropdownHidden(el, trigger, menu);

    await sendKeys({ press: ' ' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);

    trigger.click();
    assertDropdownHidden(el, trigger, menu);

    await sendKeys({ press: 'ArrowDown' });
    assertDropdownShown(el, trigger, menu);
    assertActiveMenuItem(activeMenuItem);
    expect(document.activeElement).to.eq(menu);
  });

  it('activates the last non-disabled menu item by opening the dropdown with an ArrowUp key', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems">Second</a>
          <a href="#" data-target="twc-dropdown.menuItems" aria-disabled="true">Last</a>
        </div>
      </twc-dropdown>
    `);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));
    const activeMenuItem = menuItems[1];

    trigger.focus();
    await sendKeys({ press: 'ArrowUp' });
    assertDropdownShown(el, trigger, menu);
    expect(menu).to.have.attribute('aria-activedescendant', activeMenuItem.id);
    expect(document.activeElement).to.eq(menu);
    expect(activeMenuItem).to.have.attribute('data-headlessui-state', 'active');
  });

  it('hides the dropdown on Escape keypress', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
        </div>
      </twc-dropdown>
    `);
    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;

    trigger.click();
    assertDropdownShown(el, trigger, menu);

    await sendKeys({ press: 'Escape' });
    assertDropdownHidden(el, trigger, menu);
    expect(document.activeElement).to.eq(trigger);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('hides the dropdown on outside click', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
        </div>
      </twc-dropdown>
    `);
    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;

    trigger.click();
    assertDropdownShown(el, trigger, menu);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertDropdownHidden(el, trigger, menu);
    expect(document.activeElement).to.eq(trigger);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('cycles through the menu items by pressing the ArrowDown and ArrowUp keys', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems" aria-disabled="true">Second</a>
          <a href="#" data-target="twc-dropdown.menuItems">Last</a>
        </div>
      </twc-dropdown>
    `);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));

    trigger.click();
    assertDropdownShown(el, trigger, menu);

    await sendKeys({ press: 'ArrowDown' });
    assertActiveMenuItem(menuItems[0]);

    await sendKeys({ press: 'ArrowDown' });
    assertActiveMenuItem(menuItems[2]);

    await sendKeys({ press: 'ArrowDown' });
    assertActiveMenuItem(menuItems[0]);

    await sendKeys({ press: 'ArrowUp' });
    assertActiveMenuItem(menuItems[2]);

    await sendKeys({ press: 'ArrowUp' });
    assertActiveMenuItem(menuItems[0]);

    await sendKeys({ press: 'ArrowUp' });
    assertActiveMenuItem(menuItems[2]);
  });

  it('clicks and emits an event by clicking on the menu item', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems" aria-disabled="true">Second</a>
          <a href="#" data-target="twc-dropdown.menuItems">Last</a>
        </div>
      </twc-dropdown>
    `);
    const changedHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:changed`, changedHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));

    trigger.click();
    assertDropdownShown(el, trigger, menu);

    el.activateMenuItem(menuItems[0]);
    menuItems[0].click();
    expect(changedHandler.calledOnce).to.be.true;
    expect(changedHandler.getCall(0).args[0].detail.relatedTarget).to.eq(menuItems[0]);

    // Event is not fired for disabled menu items.
    trigger.click();
    changedHandler.resetHistory();
    el.activateMenuItem(menuItems[1]);
    menuItems[1].click();
    expect(changedHandler.called).to.be.false;

    changedHandler.resetHistory();
    trigger.click();
    el.activateMenuItem(menuItems[2]);
    menuItems[2].click();
    expect(changedHandler.calledOnce).to.be.true;
    expect(changedHandler.getCall(0).args[0].detail.relatedTarget).to.eq(menuItems[2]);

    changedHandler.resetHistory();
    trigger.click();
    await sendKeys({ press: 'ArrowDown' });
    assertActiveMenuItem(menuItems[0]);
    await sendKeys({ press: 'Enter' });
    expect(changedHandler.calledOnce).to.be.true;
    expect(changedHandler.getCall(0).args[0].detail.relatedTarget).to.eq(menuItems[0]);
  });

  it('closes the menu and focuses on the trigger after clicking on the menu item', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems" aria-disabled="true">Second</a>
          <a href="#" data-target="twc-dropdown.menuItems">Last</a>
        </div>
      </twc-dropdown>
    `);
    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;
    const menuItems = Array.from(el.querySelectorAll('a'));

    trigger.click();
    assertDropdownShown(el, trigger, menu);

    el.activateMenuItem(menuItems[0]);
    assertActiveMenuItem(menuItems[0]);
    menuItems[0].click();
    assertDropdownHidden(el, trigger, menu);
    expect(document.activeElement).to.eq(trigger);

    trigger.click();
    assertDropdownShown(el, trigger, menu);
    el.activateMenuItem(menuItems[2]);
    menuItems[2].click();
    assertDropdownHidden(el, trigger, menu);
    expect(document.activeElement).to.eq(trigger);

    trigger.click();
    assertDropdownShown(el, trigger, menu);
    await sendKeys({ press: 'ArrowDown' });
    assertActiveMenuItem(menuItems[0]);
    await sendKeys({ press: 'Enter' });
    assertDropdownHidden(el, trigger, menu);
    expect(document.activeElement).to.eq(trigger);
  });

  it('toggles the visibility of the menu programmatically', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
        </div>
      </twc-dropdown>
    `);
    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const menu = el.querySelector('div')!;

    el.open = true;
    assertDropdownShown(el, trigger, menu);
    expect(shownHandler.called).to.be.false;

    el.open = false;
    assertDropdownHidden(el, trigger, menu);
    expect(hiddenHandler.called).to.be.false;
  });

  it('menuItemActive returns true/false if the menu item is active or inactive', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems">Second</a>
        </div>
      </twc-dropdown>
    `);
    const menuItems = Array.from(el.querySelectorAll('a'));

    el.open = true;

    el.activateMenuItem(menuItems[0]);
    expect(el.menuItemActive(menuItems[0])).to.be.true;
    expect(el.menuItemActive(menuItems[1])).to.be.false;
  });

  it('activeMenuItem returns the menu item that is currently active', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
          <a href="#" data-target="twc-dropdown.menuItems">Second</a>
        </div>
      </twc-dropdown>
    `);
    const menuItems = Array.from(el.querySelectorAll('a'));

    el.open = true;

    el.activateMenuItem(menuItems[0]);
    expect(el.activeMenuItem).to.eq(menuItems[0]);
  });

  it('deactivateAllMenuItems deactivates all menu items', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <button type="button" data-target="twc-dropdown.trigger">Button</button>
        <div data-target="twc-dropdown.menu">
          <a href="#" data-target="twc-dropdown.menuItems">First</a>
        </div>
      </twc-dropdown>
    `);
    const menuItems = Array.from(el.querySelectorAll('a'));

    el.open = true;

    el.activateMenuItem(menuItems[0]);
    assertActiveMenuItem(menuItems[0]);

    el.deactivateAllMenuItems();
    expect(el.activeMenuItem).to.be.undefined;
  });

  it('starts and stops the positioning logic', async () => {
    const el = await fixture<DropdownElement>(html`
      <twc-dropdown>
        <twc-floating-panel>
          <button type="button" data-target="twc-dropdown.trigger twc-floating-panel.trigger">Button</button>
          <div data-target="twc-dropdown.menu twc-floating-panel.panel">
            <a href="#" data-target="twc-dropdown.menuItems">First</a>
          </div>
        </twc-floating-panel>
      </twc-dropdown>
    `);

    const floatingPanel = el.querySelector('twc-floating-panel')! as FloatingPanelElement;

    el.open = true;
    expect(floatingPanel).to.have.attribute('active');

    el.open = false;
    expect(floatingPanel).not.to.have.attribute('active');
  });
});

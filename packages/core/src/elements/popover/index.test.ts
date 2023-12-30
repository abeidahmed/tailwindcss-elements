import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import Sinon from 'sinon';
import PopoverElement from './index';

function assertPopoverShown(el: PopoverElement, trigger: HTMLButtonElement, panel: Element) {
  expect(el).to.have.attribute('open');
  expect(trigger).to.have.attribute('data-headlessui-state', 'open');
  expect(trigger).to.have.attribute('aria-expanded', 'true');
  expect(panel).to.have.attribute('data-headlessui-state', 'open');
}

function assertPopoverHidden(el: PopoverElement, trigger: HTMLButtonElement, panel: Element) {
  expect(el).not.to.have.attribute('open');
  expect(trigger).to.have.attribute('data-headlessui-state', '');
  expect(trigger).to.have.attribute('aria-expanded', 'false');
  expect(panel).to.have.attribute('data-headlessui-state', '');
}

describe('Popover', () => {
  it('sets the attributes', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    expect(el).not.to.have.attribute('open');

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    expect(trigger).to.have.attribute('aria-haspopup', 'dialog');
    expect(trigger).to.have.attribute('aria-expanded', 'false');
    expect(trigger).to.have.attribute('data-headlessui-state', '');
    expect(trigger).to.have.attribute('aria-controls', panel.id);

    expect(panel).to.have.attribute('role', 'dialog');
    expect(panel).to.have.attribute('tabindex', '-1');
    expect(panel).to.have.attribute('data-headlessui-state', '');
    expect(panel).to.have.attribute('id');
  });

  it('toggles the popover by clicking on the trigger', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const showHandler = Sinon.spy();
    el.addEventListener('show', showHandler);

    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(el, trigger, panel);
    expect(document.activeElement).to.eq(panel);
    expect(showHandler.calledOnce).to.be.true;

    trigger.click();
    assertPopoverHidden(el, trigger, panel);
    expect(document.activeElement).to.eq(trigger);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('closes the popover by pressing the Escape key', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(el, trigger, panel);
    expect(document.activeElement).to.eq(panel);

    await sendKeys({ press: 'Escape' });
    assertPopoverHidden(el, trigger, panel);
    expect(document.activeElement).to.eq(trigger);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('closes the popover and emits an event when hide action is called', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel">
          <button type="button" data-action="click->twc-popover#hide" data-test-id="close-btn">Close</button>
        </div>
      </twc-popover>
    `);
    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const trigger = el.querySelector<HTMLButtonElement>('[data-target="twc-popover.trigger"]')!;
    const panel = el.querySelector('div')!;
    const closeButton = el.querySelector<HTMLButtonElement>('[data-test-id="close-btn"]')!;

    trigger.click();
    assertPopoverShown(el, trigger, panel);
    expect(document.activeElement).to.eq(closeButton);

    closeButton.click();
    assertPopoverHidden(el, trigger, panel);
    expect(document.activeElement).to.eq(trigger);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('hides the popover when the hide function is called', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(el, trigger, panel);

    el.hide();
    assertPopoverHidden(el, trigger, panel);
    expect(hideHandler.called).to.be.false;
  });

  it('toggles the popover when setting the open attribute', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const showHandler = Sinon.spy();
    el.addEventListener('show', showHandler);

    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    el.open = true;
    assertPopoverShown(el, trigger, panel);
    expect(showHandler.called).to.be.false;

    el.open = false;
    assertPopoverHidden(el, trigger, panel);
    expect(hideHandler.called).to.be.false;
  });

  it('hides the popover when clicked outside', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const trigger = el.querySelector<HTMLButtonElement>('[data-target="twc-popover.trigger"]')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(el, trigger, panel);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertPopoverHidden(el, trigger, panel);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('shows the popover initially if the open attribute is set to true', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover open>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const showHandler = Sinon.spy();
    el.addEventListener('show', showHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    assertPopoverShown(el, trigger, panel);
    expect(showHandler.called).to.be.false;
    expect(document.activeElement).to.eq(document.body);
  });

  it('closes all the nested popovers and the parent popover when parent trigger button is clicked', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger" data-test-id="parent-trigger">Toggle</button>
        <div data-target="twc-popover.panel" data-test-id="parent-panel">
          <twc-popover>
            <button type="button" data-target="twc-popover.trigger">Toggle</button>
            <div data-target="twc-popover.panel"></div>
          </twc-popover>
        </div>
      </twc-popover>
    `);

    const trigger = el.querySelector<HTMLButtonElement>('[data-test-id="parent-trigger"]')!;
    const panel = el.querySelector('[data-test-id="parent-panel"]')!;
    const nestedEl = el.querySelector('twc-popover')!;
    const nestedTrigger = nestedEl.querySelector('button')!;
    const nestedPanel = nestedEl.querySelector('div')!;

    trigger.click();
    assertPopoverShown(el, trigger, panel);

    nestedTrigger.click();
    assertPopoverShown(nestedEl, nestedTrigger, nestedPanel);
    assertPopoverShown(el, trigger, panel);

    await sendMouse({
      type: 'click',
      position: [trigger.getBoundingClientRect().x, trigger.getBoundingClientRect().y],
    });
    assertPopoverHidden(el, trigger, panel);
    assertPopoverHidden(nestedEl, nestedTrigger, nestedPanel);
  });
});

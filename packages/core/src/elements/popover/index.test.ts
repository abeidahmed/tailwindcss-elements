import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import Sinon from 'sinon';
import FloatingPanelElement from '../floating_panel';
import PopoverElement from './index';

function assertPopoverShown(trigger: HTMLButtonElement, panel: Element) {
  expect(trigger).to.have.attribute('data-headlessui-state', 'open');
  expect(trigger).to.have.attribute('aria-expanded', 'true');
  expect(panel).to.have.attribute('data-headlessui-state', 'open');
}

function assertPopoverHidden(trigger: HTMLButtonElement, panel: Element) {
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

    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(trigger, panel);
    expect(document.activeElement).to.eq(panel);
    expect(shownHandler.calledOnce).to.be.true;

    trigger.click();
    assertPopoverHidden(trigger, panel);
    expect(document.activeElement).to.eq(trigger);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('closes the popover by pressing the Escape key', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(trigger, panel);
    expect(document.activeElement).to.eq(panel);

    await sendKeys({ press: 'Escape' });
    assertPopoverHidden(trigger, panel);
    expect(document.activeElement).to.eq(trigger);
    expect(hiddenHandler.calledOnce).to.be.true;
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
    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector<HTMLButtonElement>('[data-target="twc-popover.trigger"]')!;
    const panel = el.querySelector('div')!;
    const closeButton = el.querySelector<HTMLButtonElement>('[data-test-id="close-btn"]')!;

    trigger.click();
    assertPopoverShown(trigger, panel);
    expect(document.activeElement).to.eq(closeButton);

    closeButton.click();
    assertPopoverHidden(trigger, panel);
    expect(document.activeElement).to.eq(trigger);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('hides the popover when the hide function is called', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(trigger, panel);

    el.hide();
    assertPopoverHidden(trigger, panel);
    expect(hiddenHandler.called).to.be.false;
  });

  it('hides the popover when clicked outside', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Toggle</button>
        <div data-target="twc-popover.panel"></div>
      </twc-popover>
    `);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector<HTMLButtonElement>('[data-target="twc-popover.trigger"]')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertPopoverShown(trigger, panel);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertPopoverHidden(trigger, panel);
    expect(hiddenHandler.calledOnce).to.be.true;
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
    assertPopoverShown(trigger, panel);

    nestedTrigger.click();
    assertPopoverShown(nestedTrigger, nestedPanel);
    assertPopoverShown(trigger, panel);

    await sendMouse({
      type: 'click',
      position: [trigger.getBoundingClientRect().x, trigger.getBoundingClientRect().y],
    });
    assertPopoverHidden(trigger, panel);
    assertPopoverHidden(nestedTrigger, nestedPanel);
  });

  it('closes popover in order when clicked outside', async () => {
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
    nestedTrigger.click();

    await sendMouse({ type: 'click', position: [0, 0] });
    assertPopoverHidden(nestedTrigger, nestedPanel);
    assertPopoverShown(trigger, panel);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertPopoverHidden(trigger, panel);
  });

  it('closes all open popovers when opening a non-related popover', async () => {
    const el = await fixture<PopoverElement>(html`
      <div>
        <twc-popover>
          <button type="button" data-target="twc-popover.trigger" data-test-id="diff-trigger">Toggle</button>
          <div data-target="twc-popover.panel" data-test-id="diff-panel"></div>
        </twc-popover>
        <twc-popover>
          <button type="button" data-target="twc-popover.trigger" data-test-id="parent-trigger">Toggle</button>
          <div data-target="twc-popover.panel" data-test-id="parent-panel">
            <twc-popover data-test-id="nested-popover">
              <button type="button" data-target="twc-popover.trigger">Toggle</button>
              <div data-target="twc-popover.panel"></div>
            </twc-popover>
          </div>
        </twc-popover>
      </div>
    `);

    const diffTrigger = el.querySelector<HTMLButtonElement>('[data-test-id="diff-trigger"]')!;
    const diffPanel = el.querySelector('[data-test-id="diff-panel"]')!;

    const trigger = el.querySelector<HTMLButtonElement>('[data-test-id="parent-trigger"]')!;
    const panel = el.querySelector('[data-test-id="parent-panel"]')!;
    const nestedEl = el.querySelector<PopoverElement>('[data-test-id="nested-popover"]')!;
    const nestedTrigger = nestedEl.querySelector('button')!;
    const nestedPanel = nestedEl.querySelector('div')!;

    trigger.click();
    nestedTrigger.click();

    diffTrigger.click();
    assertPopoverHidden(trigger, panel);
    assertPopoverHidden(nestedTrigger, nestedPanel);
    assertPopoverShown(diffTrigger, diffPanel);
  });

  it('starts and stops the positioning logic', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <twc-floating-panel>
          <button type="button" data-target="twc-popover.trigger twc-floating-panel.trigger">Toggle</button>
          <div data-target="twc-popover.panel twc-floating-panel.panel"></div>
        </twc-floating-panel>
      </twc-popover>
    `);

    const floatingPanel = el.querySelector('twc-floating-panel')! as FloatingPanelElement;

    el.show();
    expect(floatingPanel).to.have.attribute('active');

    el.hide();
    expect(floatingPanel).not.to.have.attribute('active');
  });
});

import { expect, fixture, html } from '@open-wc/testing';
import SwitchElement from './index';
import Sinon from 'sinon';

function assertSwitchOn(el: SwitchElement, trigger: HTMLElement) {
  expect(el).to.have.attribute('checked');
  expect(el).to.have.attribute('data-headlessui-state', 'checked');
  expect(trigger).to.have.attribute('aria-checked', 'true');
}

function assertSwitchOff(el: SwitchElement, trigger: HTMLElement) {
  expect(el).not.to.have.attribute('checked');
  expect(el).to.have.attribute('data-headlessui-state', '');
  expect(trigger).to.have.attribute('aria-checked', 'false');
}

describe('Switch', () => {
  it('sets the attributes', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);

    const trigger = el.querySelector('button')!;
    assertSwitchOff(el, trigger);
    expect(trigger).to.have.attribute('role', 'switch');
    expect(trigger).to.have.attribute('tabindex', '0');
  });

  it('defaults to the checked state', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch checked>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);

    expect(el).to.have.attribute('checked');

    const trigger = el.querySelector('button')!;
    assertSwitchOn(el, trigger);
  });

  it('toggles the checked state', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);
    const changeHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:change`, changeHandler);

    const changedHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:changed`, changedHandler);

    const trigger = el.querySelector('button')!;
    trigger.click();
    assertSwitchOn(el, trigger);
    expect(changedHandler.calledOnce).to.be.true;
    expect(changeHandler.calledOnce).to.be.true;
    expect(changedHandler.calledAfter(changeHandler)).to.be.true;

    trigger.click();
    assertSwitchOff(el, trigger);
    expect(changedHandler.calledTwice).to.be.true;
    expect(changeHandler.calledTwice).to.be.true;
  });

  it('programmatically toggling the checked state', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);
    const changeHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:change`, changeHandler);

    const changedHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:changed`, changedHandler);

    el.checked = true;

    const trigger = el.querySelector('button')!;
    assertSwitchOn(el, trigger);
    expect(changeHandler.called).to.be.false;
    expect(changedHandler.called).to.be.false;

    el.checked = false;
    assertSwitchOff(el, trigger);
    expect(changeHandler.called).to.be.false;
    expect(changedHandler.called).to.be.false;
  });

  it('toggling can be stopped by preventing the change event', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);
    el.addEventListener(`${el.identifier}:change`, (event) => {
      event.preventDefault();
    });

    const trigger = el.querySelector('button')!;
    trigger.click();
    assertSwitchOff(el, trigger);
  });

  it('specified tabindex is not overridden', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger" tabindex="-1">Switch</button>
      </twc-switch>
    `);

    const trigger = el.querySelector('button')!;
    expect(trigger).to.have.attribute('tabindex', '-1');
  });
});

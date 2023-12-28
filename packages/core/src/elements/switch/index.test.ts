import { expect, fixture, html } from '@open-wc/testing';
import SwitchElement from './index';
import Sinon from 'sinon';

describe('Switch', () => {
  it('sets the attributes', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);

    expect(el).not.to.have.attribute('checked');

    const trigger = el.querySelector('button');
    expect(trigger).to.have.attribute('role', 'switch');
    expect(trigger).to.have.attribute('tabindex', '0');
    expect(trigger).to.have.attribute('aria-checked', 'false');
    expect(el).to.have.attribute('data-headlessui-state', '');
  });

  it('defaults to the checked state', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch checked>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);

    expect(el).to.have.attribute('checked');

    const trigger = el.querySelector('button');
    expect(trigger).to.have.attribute('aria-checked', 'true');
    expect(el).to.have.attribute('data-headlessui-state', 'checked');
  });

  it('toggles the checked state', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);
    const changeHandler = Sinon.spy();
    el.addEventListener('change', changeHandler);

    const trigger = el.querySelector('button')!;
    trigger.click();
    expect(el).to.have.attribute('checked');
    expect(trigger).to.have.attribute('aria-checked', 'true');
    expect(el).to.have.attribute('data-headlessui-state', 'checked');
    expect(changeHandler.calledOnce).to.be.true;

    trigger.click();
    expect(el).not.to.have.attribute('checked');
    expect(trigger).to.have.attribute('aria-checked', 'false');
    expect(el).to.have.attribute('data-headlessui-state', '');
    expect(changeHandler.calledTwice).to.be.true;
  });

  it('programatically toggling the checked state', async () => {
    const el = await fixture<SwitchElement>(html`
      <twc-switch>
        <button type="button" data-target="twc-switch.trigger">Switch</button>
      </twc-switch>
    `);
    const changeHandler = Sinon.spy();
    el.addEventListener('change', changeHandler);

    el.checked = true;

    const trigger = el.querySelector('button')!;
    expect(trigger).to.have.attribute('aria-checked', 'true');
    expect(el).to.have.attribute('data-headlessui-state', 'checked');
    expect(changeHandler.called).to.be.false;

    el.checked = false;
    expect(trigger).to.have.attribute('aria-checked', 'false');
    expect(el).to.have.attribute('data-headlessui-state', '');
    expect(changeHandler.called).to.be.false;
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

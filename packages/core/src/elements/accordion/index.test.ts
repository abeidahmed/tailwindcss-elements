import { expect, fixture, html } from '@open-wc/testing';
import Sinon from 'sinon';
import AccordionElement from './index';

function assertAccordionShown(el: AccordionElement, trigger: HTMLElement, panel: HTMLElement) {
  expect(el).to.have.attribute('data-headlessui-state', 'open');
  expect(el).to.have.attribute('open');
  expect(trigger).to.have.attribute('data-headlessui-state', 'open');
  expect(trigger).to.have.attribute('aria-expanded', 'true');
  expect(panel).to.have.attribute('data-headlessui-state', 'open');
}

function assertAccordionHidden(el: AccordionElement, trigger: HTMLElement, panel: HTMLElement) {
  expect(el).to.have.attribute('data-headlessui-state', '');
  expect(el).not.to.have.attribute('open');
  expect(trigger).to.have.attribute('data-headlessui-state', '');
  expect(trigger).to.have.attribute('aria-expanded', 'false');
  expect(panel).to.have.attribute('data-headlessui-state', '');
}

describe('Accordion', () => {
  it('sets the attributes', async () => {
    const el = await fixture<AccordionElement>(html`
      <twc-accordion>
        <button data-target="twc-accordion.trigger">Trigger</button>
        <div data-target="twc-accordion.panel">Panel</div>
      </twc-accordion>
    `);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    expect(el).to.have.attribute('data-headlessui-state', '');
    expect(trigger).to.have.attribute('data-headlessui-state', '');
    expect(trigger).to.have.attribute('aria-expanded', 'false');
    expect(trigger).to.have.attribute('aria-controls', panel.id);
    expect(panel).to.have.attribute('data-headlessui-state', '');
    expect(panel).to.have.attribute('aria-labelledby', trigger.id);
    expect(panel).to.have.attribute('role', 'region');
  });

  it('toggles the accordion', async () => {
    const el = await fixture<AccordionElement>(html`
      <twc-accordion>
        <button data-target="twc-accordion.trigger">Trigger</button>
        <div data-target="twc-accordion.panel">Panel</div>
      </twc-accordion>
    `);

    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertAccordionShown(el, trigger, panel);
    expect(shownHandler.calledOnce).to.be.true;

    trigger.click();
    assertAccordionHidden(el, trigger, panel);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('prevents the accordion from being opened by preventing the show event', async () => {
    const el = await fixture<AccordionElement>(html`
      <twc-accordion>
        <button data-target="twc-accordion.trigger">Trigger</button>
        <div data-target="twc-accordion.panel">Panel</div>
      </twc-accordion>
    `);

    const showHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:show`, (event: Event) => {
      event.preventDefault();
      showHandler();
    });

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertAccordionHidden(el, trigger, panel);
    expect(showHandler.calledOnce).to.be.true;
  });

  it('prevents the accordion from being closed by preventing the hide event', async () => {
    const el = await fixture<AccordionElement>(html`
      <twc-accordion>
        <button data-target="twc-accordion.trigger">Trigger</button>
        <div data-target="twc-accordion.panel">Panel</div>
      </twc-accordion>
    `);

    const hideHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hide`, (event: Event) => {
      event.preventDefault();
      hideHandler();
    });

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    trigger.click();
    assertAccordionShown(el, trigger, panel);

    trigger.click();
    assertAccordionShown(el, trigger, panel);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('opens the accordion by default', async () => {
    const el = await fixture<AccordionElement>(html`
      <twc-accordion open>
        <button data-target="twc-accordion.trigger">Trigger</button>
        <div data-target="twc-accordion.panel">Panel</div>
      </twc-accordion>
    `);

    const trigger = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    assertAccordionShown(el, trigger, panel);

    trigger.click();
    assertAccordionHidden(el, trigger, panel);
  });
});

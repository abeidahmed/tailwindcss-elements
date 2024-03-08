import { expect, fixture, html } from '@open-wc/testing';
import { sendMouse } from '@web/test-runner-commands';
import Sinon from 'sinon';
import FloatingPanelElement from '../floating_panel';
import TooltipElement from './index';

function assertTooltipShown(button: HTMLButtonElement, panel: HTMLElement) {
  expect(button).to.have.attribute('data-headlessui-state', 'open');
  expect(panel).to.have.attribute('data-headlessui-state', 'open');
}

function assertTooltipHidden(button: HTMLButtonElement, panel: HTMLElement) {
  expect(button).to.have.attribute('data-headlessui-state', '');
  expect(panel).to.have.attribute('data-headlessui-state', '');
}

describe('Tooltip', () => {
  it('sets the attributes', async () => {
    const el = await fixture<TooltipElement>(html`
      <twc-tooltip>
        <button type="button" data-target="twc-tooltip.trigger">Hover</button>
        <div data-target="twc-tooltip.panel">Contents!</div>
      </twc-tooltip>
    `);

    const button = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    assertTooltipHidden(button, panel);
    expect(panel).to.have.attribute('popover', 'auto');
    expect(panel).to.have.attribute('role', 'tooltip');
    expect(panel).to.have.attribute('id');
    expect(button).to.have.attribute('aria-describedby', panel.id);
  });

  it('shows the tooltip on keyboard focus', async () => {
    const el = await fixture<TooltipElement>(html`
      <twc-tooltip>
        <button type="button" data-target="twc-tooltip.trigger">Hover</button>
        <div data-target="twc-tooltip.panel">Contents!</div>
      </twc-tooltip>
    `);

    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const button = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    button.focus();
    assertTooltipShown(button, panel);
    expect(shownHandler.calledOnce).to.be.true;
  });

  it('toggles the visibility of the tooltip on mouse hover', async () => {
    const el = await fixture<TooltipElement>(html`
      <twc-tooltip>
        <button type="button" data-target="twc-tooltip.trigger">Hover</button>
        <div data-target="twc-tooltip.panel">Contents!</div>
      </twc-tooltip>
    `);

    const shownHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:shown`, shownHandler);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const button = el.querySelector('button')!;
    const panel = el.querySelector('div')!;
    const { x, y } = button.getBoundingClientRect();

    await sendMouse({ type: 'move', position: [x, y] });
    assertTooltipShown(button, panel);
    expect(shownHandler.calledOnce).to.be.true;

    await sendMouse({ type: 'move', position: [0, 0] });
    assertTooltipHidden(button, panel);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('hides the tooltip when trigger is clicked', async () => {
    const el = await fixture<TooltipElement>(html`
      <twc-tooltip>
        <button type="button" data-target="twc-tooltip.trigger">Hover</button>
        <div data-target="twc-tooltip.panel">Contents!</div>
      </twc-tooltip>
    `);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const button = el.querySelector('button')!;
    const panel = el.querySelector('div')!;
    const { x, y } = button.getBoundingClientRect();

    await sendMouse({ type: 'move', position: [x, y] });
    assertTooltipShown(button, panel);

    await sendMouse({ type: 'click', position: [x, y] });
    assertTooltipHidden(button, panel);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('hides the tooltip when trigger is blurred', async () => {
    const el = await fixture<TooltipElement>(html`
      <twc-tooltip>
        <button type="button" data-target="twc-tooltip.trigger">Hover</button>
        <div data-target="twc-tooltip.panel">Contents!</div>
      </twc-tooltip>
    `);

    const hiddenHandler = Sinon.spy();
    el.addEventListener(`${el.identifier}:hidden`, hiddenHandler);

    const button = el.querySelector('button')!;
    const panel = el.querySelector('div')!;

    button.focus();
    assertTooltipShown(button, panel);

    button.blur();
    assertTooltipHidden(button, panel);
    expect(hiddenHandler.calledOnce).to.be.true;
  });

  it('starts and stops the positioning logic', async () => {
    const el = await fixture<TooltipElement>(html`
      <twc-tooltip>
        <twc-floating-panel>
          <button type="button" data-target="twc-tooltip.trigger twc-floating-panel.trigger">Hover</button>
          <div data-target="twc-tooltip.panel twc-floating-panel.panel">Contents!</div>
        </twc-floating-panel>
      </twc-tooltip>
    `);

    const floatingPanel = el.querySelector('twc-floating-panel')! as FloatingPanelElement;
    const button = el.querySelector('button')!;

    button.focus();
    expect(floatingPanel).to.have.attribute('active');

    button.blur();
    expect(floatingPanel).not.to.have.attribute('active');
  });
});

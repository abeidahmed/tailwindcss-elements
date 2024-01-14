import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import FloatingPanelElement from './index';
import Sinon from 'sinon';

describe('Floating panel', () => {
  it('starts and stops the positioning of the panel', async () => {
    const el = await fixture<FloatingPanelElement>(html`
      <twc-floating-panel>
        <button type="button" data-target="twc-floating-panel.trigger">Trigger</button>
        <div data-target="twc-floating-panel.panel"></div>
      </twc-floating-panel>
    `);

    const panel = el.querySelector('div')!;

    expect(el).not.to.have.attribute('active');
    expect(el).not.to.have.attribute('data-current-placement');

    el.active = true;
    expect(el).to.have.attribute('active');
    await waitUntil(() => el.hasAttribute('data-current-placement'));
    expect(el).to.have.attribute('data-current-placement', 'bottom-start');
    expect(panel).to.have.style('position', 'absolute');

    el.active = false;
    expect(el).not.to.have.attribute('active');
    expect(el).not.to.have.attribute('data-current-placement');
  });

  it('setting the initial placement', async () => {
    const el = await fixture<FloatingPanelElement>(html`
      <twc-floating-panel placement="bottom-end">
        <button type="button" data-target="twc-floating-panel.trigger">Trigger</button>
        <div data-target="twc-floating-panel.panel"></div>
      </twc-floating-panel>
    `);

    el.active = true;
    await waitUntil(() => el.hasAttribute('data-current-placement'));
    expect(el).to.have.attribute('data-current-placement', 'bottom-end');
  });

  it('setting the positioning strategy', async () => {
    const el = await fixture<FloatingPanelElement>(html`
      <twc-floating-panel strategy="fixed">
        <button type="button" data-target="twc-floating-panel.trigger">Trigger</button>
        <div data-target="twc-floating-panel.panel"></div>
      </twc-floating-panel>
    `);

    const panel = el.querySelector('div')!;

    el.active = true;
    await waitUntil(() => el.hasAttribute('data-current-placement'));
    expect(panel).to.have.style('position', 'fixed');
  });

  it('emits the changed event after positioning the panel', async () => {
    const el = await fixture<FloatingPanelElement>(html`
      <twc-floating-panel>
        <button type="button" data-target="twc-floating-panel.trigger">Trigger</button>
        <div data-target="twc-floating-panel.panel"></div>
      </twc-floating-panel>
    `);

    const handler = Sinon.spy();
    document.addEventListener(`${el.identifier}:changed`, handler);

    el.active = true;
    await waitUntil(() => el.hasAttribute('data-current-placement'));
    expect(handler.called).to.be.true;
  });
});

import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import TabsElement from './index';
import Sinon from 'sinon';

function assertTabSelected(trigger: Element) {
  expect(trigger).to.have.attribute('aria-selected', 'true');
  expect(trigger).to.have.attribute('tabindex', '0');
  expect(trigger).to.have.attribute('data-headlessui-state', 'selected');

  const panelId = trigger.getAttribute('aria-controls') || '';
  const panel = document.getElementById(panelId);
  expect(panel).to.have.attribute('data-headlessui-state', 'selected');
}

function assertTabUnselected(trigger: Element) {
  expect(trigger).to.have.attribute('aria-selected', 'false');
  expect(trigger).to.have.attribute('tabindex', '-1');
  expect(trigger).to.have.attribute('data-headlessui-state', '');

  const panelId = trigger.getAttribute('aria-controls') || '';
  const panel = document.getElementById(panelId);
  expect(panel).to.have.attribute('data-headlessui-state', '');
}

describe('Tabs', () => {
  it('sets the attributes', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
      </twc-tabs>
    `);

    const tabsList = el.querySelector('twc-tabs-list');
    const triggers = Array.from(el.querySelectorAll('button'));
    const panels = Array.from(el.querySelectorAll('div'));

    expect(el).to.have.attribute('orientation', 'horizontal');
    expect(tabsList).to.have.attribute('role', 'tablist');
    expect(tabsList).to.have.attribute('aria-orientation', 'horizontal');

    for (const trigger of triggers) {
      expect(trigger).to.have.attribute('role', 'tab');
    }

    for (const panel of panels) {
      expect(panel).to.have.attribute('role', 'tabpanel');
      expect(panel).to.have.attribute('tabindex', '0');
      const trigger = triggers.find((t) => t.getAttribute('aria-controls') === panel.id);
      expect(panel).to.have.attribute('aria-labelledby', trigger?.id);
    }

    assertTabSelected(triggers[0]);
    assertTabUnselected(triggers[1]);
  });

  it('sets the orientation as vertical', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs orientation="vertical">
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
      </twc-tabs>
    `);

    const tabsList = el.querySelector('twc-tabs-list');
    expect(tabsList).to.have.attribute('aria-orientation', 'vertical');
  });

  it('selects the first non-disabled tab by default if there are no selected tabs', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1" disabled>Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
      </twc-tabs>
    `);

    const triggers = Array.from(el.querySelectorAll('button'));
    assertTabSelected(triggers[1]);
  });

  it('default selected tab can be specified by setting the data-headlessui-state as selected on the tab', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2" data-headlessui-state="selected">
            Tab 2
          </button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
      </twc-tabs>
    `);

    const triggers = Array.from(el.querySelectorAll('button'));
    assertTabSelected(triggers[1]);
    assertTabUnselected(triggers[0]);
  });

  it('selects a tab by clicking on the tab', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
      </twc-tabs>
    `);
    const changedHandler = Sinon.spy();
    document.addEventListener(`${el.identifier}:changed`, changedHandler);

    const triggers = Array.from(el.querySelectorAll('button'));

    assertTabSelected(triggers[0]);
    assertTabUnselected(triggers[1]);

    triggers[1].click();
    assertTabSelected(triggers[1]);
    assertTabUnselected(triggers[0]);
    expect(changedHandler.calledOnce).to.be.true;
    expect(changedHandler.args[0][0].detail.relatedTarget).to.eq(document.getElementById('panel2'));
  });

  it('cycles through the tab by pressing the ArrowRight and ArrowLeft keys', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2" disabled>Tab 2</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel3">Tab 3</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
        <div id="panel3" data-target="twc-tabs.panels">Panel 3</div>
      </twc-tabs>
    `);
    const changedHandler = Sinon.spy();
    document.addEventListener(`${el.identifier}:changed`, changedHandler);

    const triggers = Array.from(el.querySelectorAll('button'));
    triggers[0].focus();

    await sendKeys({ press: 'ArrowRight' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.calledOnce).to.be.true;

    await sendKeys({ press: 'ArrowRight' });
    assertTabSelected(triggers[0]);
    expect(changedHandler.callCount).to.eq(2);

    await sendKeys({ press: 'ArrowLeft' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.callCount).to.eq(3);

    await sendKeys({ press: 'ArrowLeft' });
    assertTabSelected(triggers[0]);
    expect(changedHandler.callCount).to.eq(4);

    await sendKeys({ press: 'ArrowLeft' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.callCount).to.eq(5);

    await sendKeys({ press: 'ArrowDown' });
    assertTabSelected(triggers[2]);

    await sendKeys({ press: 'ArrowUp' });
    assertTabSelected(triggers[2]);
  });

  it('cycles through the tab by pressing the ArrowDown and ArrowUp keys', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs orientation="vertical">
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2" disabled>Tab 2</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel3">Tab 3</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
        <div id="panel3" data-target="twc-tabs.panels">Panel 3</div>
      </twc-tabs>
    `);
    const changedHandler = Sinon.spy();
    document.addEventListener(`${el.identifier}:changed`, changedHandler);

    const triggers = Array.from(el.querySelectorAll('button'));
    triggers[0].focus();

    await sendKeys({ press: 'ArrowDown' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.callCount).to.eq(1);

    await sendKeys({ press: 'ArrowDown' });
    assertTabSelected(triggers[0]);
    expect(changedHandler.callCount).to.eq(2);

    await sendKeys({ press: 'ArrowUp' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.callCount).to.eq(3);

    await sendKeys({ press: 'ArrowUp' });
    assertTabSelected(triggers[0]);
    expect(changedHandler.callCount).to.eq(4);

    await sendKeys({ press: 'ArrowUp' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.callCount).to.eq(5);

    await sendKeys({ press: 'ArrowRight' });
    assertTabSelected(triggers[2]);

    await sendKeys({ press: 'ArrowLeft' });
    assertTabSelected(triggers[2]);
  });

  it('selects the first/last tab by pressing the Home and End key respectively', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1" disabled>Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel3">Tab 3</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel4" disabled>Tab 4</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
        <div id="panel3" data-target="twc-tabs.panels">Panel 3</div>
        <div id="panel4" data-target="twc-tabs.panels">Panel 4</div>
      </twc-tabs>
    `);
    const changedHandler = Sinon.spy();
    document.addEventListener(`${el.identifier}:changed`, changedHandler);

    const triggers = Array.from(el.querySelectorAll('button'));
    assertTabSelected(triggers[1]);
    triggers[1].focus();

    await sendKeys({ press: 'End' });
    assertTabSelected(triggers[2]);
    expect(changedHandler.callCount).to.eq(1);

    await sendKeys({ press: 'Home' });
    assertTabSelected(triggers[1]);
    expect(changedHandler.callCount).to.eq(2);
  });

  it('programmatically selecting a tab', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
      </twc-tabs>
    `);
    const changedHandler = Sinon.spy();
    document.addEventListener(`${el.identifier}:changed`, changedHandler);

    const triggers = Array.from(el.querySelectorAll('button'));

    assertTabSelected(triggers[0]);

    el.selectTab(triggers[1]);
    assertTabSelected(triggers[1]);
    expect(changedHandler.called).to.be.false;
  });

  it('programmatically changing the orientation', async () => {
    const el = await fixture<TabsElement>(html`
      <twc-tabs>
        <twc-tabs-list>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel1">Tab 1</button>
          <button type="button" data-target="twc-tabs.triggers" aria-controls="panel2">Tab 2</button>
        </twc-tabs-list>

        <div id="panel1" data-target="twc-tabs.panels">Panel 1</div>
        <div id="panel2" data-target="twc-tabs.panels">Panel 2</div>
      </twc-tabs>
    `);

    const tabsList = el.querySelector('twc-tabs-list')!;

    expect(el).to.have.attribute('orientation', 'horizontal');

    el.orientation = 'vertical';
    expect(el).to.have.attribute('orientation', 'vertical');
    expect(tabsList).to.have.attribute('aria-orientation', 'vertical');
  });
});

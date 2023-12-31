import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import Sinon from 'sinon';
import PopoverElement from '../popover';
import DialogElement from './index';

function assertDialogShown(el: DialogElement, dialog: HTMLDialogElement) {
  expect(el).to.have.attribute('open');
  expect(dialog).to.have.attribute('data-headlessui-state', 'open');
  expect(dialog).to.have.attribute('open');
}

function assertDialogHidden(el: DialogElement, dialog: HTMLDialogElement) {
  expect(el).not.to.have.attribute('open');
  expect(dialog).to.have.attribute('data-headlessui-state', '');
  expect(dialog).not.to.have.attribute('open');
}

describe('Dialog', async () => {
  it('sets the attributes', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog">Contents</dialog>
      </twc-dialog>
    `);

    expect(el).not.to.have.attribute('open');

    const dialog = el.querySelector('dialog')!;
    expect(dialog).to.have.attribute('data-headlessui-state', '');
  });

  it('toggles the visibility of the dialog', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog">Contents</dialog>
      </twc-dialog>
    `);
    const dialog = el.querySelector('dialog')!;

    expect(el).not.to.have.attribute('open');

    el.open = true;
    assertDialogShown(el, dialog);
    expect(document.body).to.have.style('overflow', 'hidden');

    el.open = false;
    assertDialogHidden(el, dialog);
    expect(document.body).not.to.have.style('overflow', 'hidden');
  });

  it('closes the dialog when clicked outside', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog">Contents</dialog>
      </twc-dialog>
    `);
    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const dialog = el.querySelector('dialog')!;

    el.open = true;
    assertDialogShown(el, dialog);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertDialogHidden(el, dialog);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('closes the dialog and emits a hide event when hide the action is called', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog">
          <button type="button" data-action="click->twc-dialog#hide">Hide</button>
        </dialog>
      </twc-dialog>
    `);
    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const dialog = el.querySelector('dialog')!;
    const closeButton = el.querySelector('button')!;

    el.open = true;
    assertDialogShown(el, dialog);

    closeButton.click();
    assertDialogHidden(el, dialog);
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('emits a hide event when Escape key is pressed', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog">Contents</dialog>
      </twc-dialog>
    `);
    const hideHandler = Sinon.spy();
    el.addEventListener('hide', hideHandler);

    const dialog = el.querySelector('dialog')!;

    el.open = true;
    assertDialogShown(el, dialog);

    await sendKeys({ press: 'Escape' });
    expect(hideHandler.calledOnce).to.be.true;
  });

  it('closes the dialogs in order when clicked outside', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog" data-test-id="parent-dialog">
          <twc-dialog>
            <dialog data-target="twc-dialog.dialog" data-test-id="nested-dialog">Nested dialog</dialog>
          </twc-dialog>
        </dialog>
      </twc-dialog>
    `);

    const parentDialog = el.querySelector<HTMLDialogElement>('[data-test-id="parent-dialog"]')!;
    const nestedEl = el.querySelector('twc-dialog')!;
    const nestedDialog = nestedEl.querySelector<HTMLDialogElement>('[data-test-id="nested-dialog"]')!;

    el.open = true;
    assertDialogShown(el, parentDialog);

    nestedEl.open = true;
    assertDialogShown(nestedEl, nestedDialog);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertDialogHidden(nestedEl, nestedDialog);
    assertDialogShown(el, parentDialog);

    await sendMouse({ type: 'click', position: [0, 0] });
    assertDialogHidden(el, parentDialog);
  });

  it('should not remove the overflow styles if parent dialog is still open', async () => {
    const el = await fixture<DialogElement>(html`
      <twc-dialog>
        <dialog data-target="twc-dialog.dialog" data-test-id="parent-dialog">
          <twc-dialog>
            <dialog data-target="twc-dialog.dialog" data-test-id="nested-dialog">Nested dialog</dialog>
          </twc-dialog>
        </dialog>
      </twc-dialog>
    `);

    const parentDialog = el.querySelector<HTMLDialogElement>('[data-test-id="parent-dialog"]')!;
    const nestedEl = el.querySelector('twc-dialog')!;
    const nestedDialog = nestedEl.querySelector<HTMLDialogElement>('[data-test-id="nested-dialog"]')!;

    el.open = true;
    assertDialogShown(el, parentDialog);
    expect(document.body).to.have.style('overflow', 'hidden');

    nestedEl.open = true;
    assertDialogShown(nestedEl, nestedDialog);
    expect(document.body).to.have.style('overflow', 'hidden');

    await sendKeys({ press: 'Escape' });
    expect(document.body).to.have.style('overflow', 'hidden'); // Parent dialog is still open.
  });

  it('pressing Escape key should not close the parent popover', async () => {
    const el = await fixture<PopoverElement>(html`
      <twc-popover>
        <button type="button" data-target="twc-popover.trigger">Button</button>
        <div data-target="twc-popover.panel">
          <twc-dialog>
            <dialog data-target="twc-dialog.dialog">Contents</dialog>
          </twc-dialog>
        </div>
      </twc-popover>
    `);

    const trigger = el.querySelector('button')!;
    const twcDialog = el.querySelector('twc-dialog')!;
    const dialog = twcDialog.querySelector('dialog')!;

    trigger.click();
    expect(el).to.have.attribute('open');

    twcDialog.open = true;
    assertDialogShown(twcDialog, dialog);

    await sendKeys({ press: 'Escape' });
    expect(el).to.have.attribute('open'); // Should not close the popover.
  });
});

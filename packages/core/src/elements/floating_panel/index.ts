import { ImpulseElement, property, registerElement, target } from '@ambiki/impulse';
import {
  FlipOptions,
  Middleware,
  OffsetOptions,
  Placement,
  ShiftOptions,
  Strategy,
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  platform,
  shift,
  size,
} from '@floating-ui/dom';
import { offsetParent } from 'composed-offset-position';
import { isEmpty } from '../../helpers/metal';

function presence<T = unknown>(value: T) {
  // number can be passed to the offsetOptions.
  return isEmpty(value) && typeof value !== 'number' ? undefined : value;
}

@registerElement('twc-floating-panel')
export default class FloatingPanelElement extends ImpulseElement {
  /**
   * Activates the positioning logic of the floating panel.
   */
  @property({ type: Boolean }) active = false;

  /**
   * If the trigger lives outside the floating panel, you can set the trigger element's id.
   */
  @property() triggerId: string;

  /**
   * One of 'absolute' or 'fixed'.
   * https://floating-ui.com/docs/computeposition#strategy
   */
  @property() strategy: Strategy = 'fixed';

  /**
   * The initial position of the panel. This placement can be changed to keep the panel within the viewport.
   * https://floating-ui.com/docs/computePosition#placement
   */
  @property() placement: Placement = 'bottom-start';

  /**
   * https://floating-ui.com/docs/offset
   */
  @property({ type: Object }) offsetOptions: OffsetOptions = {};

  /**
   * https://floating-ui.com/docs/flip
   */
  @property({ type: Object }) flipOptions: FlipOptions = {};

  /**
   * https://floating-ui.com/docs/shift
   */
  @property({ type: Object }) shiftOptions: ShiftOptions = {};

  /**
   * Makes the panel's height and width similar to that of the trigger element.
   */
  @property() sync?: 'width' | 'height' | 'both';

  @target() trigger?: HTMLElement;
  @target() panel: HTMLElement;
  @target() arrow?: HTMLElement;

  private cleanup?: ReturnType<typeof autoUpdate>;

  connected() {
    this.start();
  }

  disconnected() {
    this.stop();
  }

  activeChanged(value: boolean) {
    if (value) {
      this.start();
    } else {
      this.stop();
    }
  }

  /**
   * We want to restart the placement logic when the trigger id changes.
   */
  async triggerIdChanged() {
    await this.stop();
    this.start();
  }

  start() {
    if (!this.triggerElement) return;
    this.panel.style.position = this.strategy;
    this.panel.style.top = '0px';
    this.panel.style.left = '0px';

    this.cleanup = autoUpdate(this.triggerElement, this.panel, this.position.bind(this));
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = undefined;
        this.setCurrentPlacement('');
        requestAnimationFrame(() => resolve());
      } else {
        resolve();
      }
    });
  }

  async position() {
    if (!this.active || !this.triggerElement) return;

    const middleware: Middleware[] = [offset(presence(this.offsetOptions))];

    if (this.sync) {
      middleware.push(
        size({
          apply: ({ rects }) => {
            const syncWidth = this.sync === 'width' || this.sync === 'both';
            const syncHeight = this.sync === 'height' || this.sync === 'both';
            this.panel.style.width = syncWidth ? `${rects.reference.width}px` : '';
            this.panel.style.height = syncHeight ? `${rects.reference.height}px` : '';
          },
        })
      );
    } else {
      this.panel.style.width = '';
      this.panel.style.height = '';
    }

    middleware.push(flip(presence(this.flipOptions)));
    middleware.push(shift(presence(this.shiftOptions)));

    if (this.arrow) {
      middleware.push(
        arrow({
          element: this.arrow,
        })
      );
    }

    const getOffsetParent =
      this.strategy === 'absolute'
        ? (element: Element) => platform.getOffsetParent(element, offsetParent)
        : platform.getOffsetParent;

    const { x, y, strategy, placement, middlewareData } = await computePosition(this.triggerElement, this.panel, {
      placement: this.placement,
      middleware,
      strategy: this.strategy,
      platform: {
        ...platform,
        getOffsetParent,
      },
    });

    Object.assign(this.panel.style, {
      left: `${x}px`,
      top: `${y}px`,
      position: strategy,
    });

    if (this.arrow && middlewareData.arrow) {
      const { x, y } = middlewareData.arrow;
      Object.assign(this.arrow.style, {
        left: typeof x === 'number' ? `${x}px` : '',
        top: typeof y === 'number' ? `${y}px` : '',
      });
    }

    this.setCurrentPlacement(placement);
    this.emit('changed');
  }

  private get triggerElement() {
    if (this.trigger) {
      return this.trigger;
    }
    return document.getElementById(this.triggerId);
  }

  private setCurrentPlacement(placement: string) {
    if (placement) {
      this.setAttribute('data-current-placement', placement);
      this.panel.setAttribute('data-current-placement', placement);
    } else {
      this.removeAttribute('data-current-placement');
      this.panel.removeAttribute('data-current-placement');
    }
  }
}

declare global {
  interface Window {
    FloatingPanelElement: typeof FloatingPanelElement;
  }
  interface HTMLElementTagNameMap {
    'twc-floating-panel': FloatingPanelElement;
  }
}

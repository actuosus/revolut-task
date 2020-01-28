import * as RX from "reactxp";
import * as _ from "reactxp/dist/web/utils/lodashMini";

const _compareDOMOrder = (a: Responder, b: Responder) => {
  if (
    a.target.compareDocumentPosition(b.target) &
    Node.DOCUMENT_POSITION_PRECEDING
  ) {
    return 1;
  } else {
    return -1;
  }
};

interface Responder {
  id: number;
  target: HTMLElement;
  shouldBecomeFirstResponder: (
    event: TouchEvent,
    gestureState: RX.Types.PanGestureState | null
  ) => boolean;
  onMove: (
    event: TouchEvent,
    gestureState: RX.Types.PanGestureState | null
  ) => void;
  onTerminate: (
    event: TouchEvent,
    gestureState: RX.Types.PanGestureState | null
  ) => void;
}

export interface TouchResponderConfig {
  id: number;
  target: HTMLElement;
  disableWhenModal: boolean;
  shouldBecomeFirstResponder?: (
    event: TouchEvent,
    gestureState: RX.Types.PanGestureState
  ) => boolean;
  onMove?: (event: TouchEvent, gestureState: RX.Types.PanGestureState) => void;
  onTerminate?: (
    event: TouchEvent,
    gestureState: RX.Types.PanGestureState
  ) => void;
}

export default class TouchResponder {
  private static _responders: Responder[];

  private static _pendingGestureState: RX.Types.PanGestureState | null = null;
  private static _isModalDisplayed = false;
  private static _currentResponder: Responder | null = null;

  static create(config: TouchResponderConfig) {
    TouchResponder._initializeEventHandlers();

    TouchResponder._responders = TouchResponder._responders || [];

    const responder: Responder = {
      id: config.id,
      target: config.target,
      shouldBecomeFirstResponder(
        event: TouchEvent,
        gestureState: RX.Types.PanGestureState | null
      ) {
        if (TouchResponder._isModalDisplayed && config.disableWhenModal) {
          return false;
        }

        if (!config.shouldBecomeFirstResponder) {
          return false;
        }

        if (!gestureState) {
          return false;
        }

        return config.shouldBecomeFirstResponder(event, gestureState);
      },

      onMove(event: TouchEvent, gestureState: RX.Types.PanGestureState | null) {
        if (!config.onMove || !gestureState) {
          return;
        }

        config.onMove(event, gestureState);
      },

      onTerminate(
        event: TouchEvent,
        gestureState: RX.Types.PanGestureState | null
      ) {
        if (!config.onTerminate || !gestureState) {
          return;
        }

        config.onTerminate(event, gestureState);
      }
    };

    TouchResponder._responders.push(responder);

    return {
      dispose() {
        _.remove(
          TouchResponder._responders,
          (r: Responder) => r.id === responder.id
        );

        if (TouchResponder._responders.length === 0) {
          TouchResponder._removeEventHandlers();
        }
      }
    };
  }

  private static _initializeEventHandlers() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.addEventListener("touchstart", TouchResponder._onTouchStart);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.addEventListener("touchmove", TouchResponder._onTouchMove);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.addEventListener("touchend", TouchResponder._onTouchEnd);
  }

  private static _onTouchStart(event: TouchEvent) {
    const firstTouch = event.touches.item(0);

    if (!firstTouch) {
      return;
    }

    TouchResponder._pendingGestureState = {
      initialClientX: firstTouch.clientX,
      initialClientY: firstTouch.clientY,
      initialPageX: firstTouch.pageX,
      initialPageY: firstTouch.pageY,
      clientX: firstTouch.clientX,
      clientY: firstTouch.clientY,
      pageX: firstTouch.pageX,
      pageY: firstTouch.pageY,
      velocityX: 0,
      velocityY: 0,
      timeStamp: Date.now(),
      isComplete: false,
      isTouch: true
    };

    TouchResponder._responders.sort(_compareDOMOrder);

    const firstResponder = _.findLast(
      TouchResponder._responders,
      (responder: Responder) => {
        return responder.shouldBecomeFirstResponder(
          event,
          TouchResponder._pendingGestureState
        );
      }
    );

    if (firstResponder) {
      TouchResponder._currentResponder = firstResponder;
    }
  }
  private static _onTouchMove(event: TouchEvent) {
    const { velocityX, velocityY } = TouchResponder._calcVelocity(
      event,
      TouchResponder._pendingGestureState
    );
    const firstTouch = event.touches.item(0);

    if (!firstTouch) {
      return;
    }

    TouchResponder._pendingGestureState = _.merge(
      {},
      TouchResponder._pendingGestureState,
      {
        clientX: firstTouch.clientX,
        clientY: firstTouch.clientY,
        pageX: firstTouch.pageX,
        pageY: firstTouch.pageY,
        velocityX,
        velocityY,
        isComplete: false
      }
    );

    if (TouchResponder._currentResponder) {
      TouchResponder._currentResponder.onMove(
        event,
        TouchResponder._pendingGestureState
      );
    }
  }
  private static _onTouchEnd(event: TouchEvent) {
    if (
      TouchResponder._currentResponder &&
      TouchResponder._pendingGestureState
    ) {
      const { velocityX, velocityY } = TouchResponder._calcVelocity(
        event,
        TouchResponder._pendingGestureState
      );

      const firstTouch = event.touches.item(0) || event.changedTouches.item(0);

      if (!firstTouch) {
        return;
      }

      TouchResponder._pendingGestureState = _.merge(
        {},
        TouchResponder._pendingGestureState,
        {
          clientX: firstTouch.clientX,
          clientY: firstTouch.clientY,
          pageX: firstTouch.pageX,
          pageY: firstTouch.pageY,
          velocityX,
          velocityY,
          isComplete: true
        }
      );

      TouchResponder._currentResponder.onTerminate(
        event,
        TouchResponder._pendingGestureState
      );

      TouchResponder._currentResponder = null;
      TouchResponder._pendingGestureState = null;
    }
  }

  private static _removeEventHandlers() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.removeEventListener("touchstart", TouchResponder._onTouchStart);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.removeEventListener("touchmove", TouchResponder._onTouchMove);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.removeEventListener("touchend", TouchResponder._onTouchEnd);
  }

  private static _calcVelocity = (
    e: TouchEvent,
    gestureState: RX.Types.PanGestureState | null
  ) => {
    if (!gestureState) {
      return { velocityX: 0, velocityY: 0 };
    }

    const time = Date.now() - gestureState.timeStamp;

    const firstTouch = e.touches.item(0) || e.changedTouches.item(0);

    if (!firstTouch) {
      return { velocityX: 0, velocityY: 0 };
    }

    const velocityX = (firstTouch.clientX - gestureState.initialClientX) / time;
    const velocityY = (firstTouch.clientY - gestureState.initialClientY) / time;

    return {
      velocityX,
      velocityY
    };
  };
}

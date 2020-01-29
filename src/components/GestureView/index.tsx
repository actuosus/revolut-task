import * as RX from "reactxp";
import { TouchEventBasic } from "reactxp/dist/common/GestureView";

export default class GestureView extends RX.GestureView {
  // Overload for touchend fix.
  _touchEventToTapGestureState(e: TouchEventBasic) {
    let pageX = e.pageX;
    let pageY = e.pageY;
    let clientX = e.locationX;
    let clientY = e.locationY;
    // Grab the first touch. If the user adds additional touch events,
    // we will ignore them. If we use e.pageX/Y, we will be using the average
    // of the touches, so we'll see a discontinuity.
    if (e.touches && e.touches.length > 0) {
      pageX = e.touches[0].pageX;
      pageY = e.touches[0].pageY;
      clientX = e.touches[0].locationX;
      clientY = e.touches[0].locationY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      const ft = e.changedTouches[0];
      pageX = ft.pageX;
      pageY = ft.pageY;
      clientX = ft.locationX;
      clientY = ft.locationY;
    }

    return {
      // @ts-ignore
      timeStamp: this._getEventTimestamp(e),
      clientX: clientX,
      clientY: clientY,
      pageX: pageX,
      pageY: pageY,
      // @ts-ignore
      isTouch: !GestureView._isActuallyMouseEvent(e)
    };
  }
}

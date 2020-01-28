/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NavigationEventCallback,
  NavigationEventSubscription
} from "react-navigation";

const navigation = {
  navigate: () => true,
  setParams: (_newParams: Partial<any>) => true,
  dispatch: () => true,
  getParam: <T extends "walletId">(param: T): any[T] => {
    return param;
  },
  goBack: () => true,
  dismiss: () => true,
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
  addListener: (
    _eventName: "willBlur" | "willFocus" | "didFocus" | "didBlur",
    _callback: NavigationEventCallback
  ): NavigationEventSubscription => {
    return { remove: () => {} };
  },
  push: () => true,
  pop: () => true,
  popToTop: () => true,
  replace: () => true,
  isFocused: () => true,
  dangerouslyGetParent: () => {
    return navigation;
  },
  state: {
    index: 0,
    routes: [],
    isTransitioning: false,
    key: "",
    params: {
      walletId: "1"
    }
  }
};

export default navigation;

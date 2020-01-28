declare module "@react-navigation/web" {
  import {
    NavigationAction,
    NavigationParams,
    NavigationRoute,
    NavigationScreenProp,
    ScreenProps
  } from "@react-navigation/core";
  import { Component, ComponentClass, ReactNode } from "react";

  export interface LinkProps {
    children: ReactNode;
    params?: NavigationParams;
    routeName: string;
    routeKey?: string;
    navigation?: NavigationScreenProp<NavigationRoute>;
    action?: NavigationAction;
  }
  export class Link extends Component<LinkProps> {
    constructor(props: LinkProps);
  }

  export type WebAppProps = {
    screenProps: ScreenProps;
    onNavigationStateChange?: (
      prevNav: NavigationScreenProp<NavigationRoute>,
      nav: NavigationScreenProp<NavigationRoute>,
      action: NavigationAction
    ) => void;
  };

  export type WebAppState = {
    nav: NavigationState;
  };

  export interface WebApp extends ComponentClass<WebAppProps, WebAppState> {
    private _title: string;
    private _actionEventSubscribers: Set;
    private _navigation: NavigationScreenProp<NavigationRoute>;
    updateTitle();
    private _onNavigationStateChange(
      prevNav: NavigationScreenProp<NavigationRoute>,
      nav: NavigationScreenProp<NavigationRoute>,
      action: NavigationAction
    );
    dispatch(action: NavigationAction);
  }

  type BrowserAppOptions = {
    history: {
      historyOption: "browser" | "hash" | "memory";
    };
  };

  export function createBrowserApp(
    App,
    { history: historyOption }?: BrowserAppOptions = {}
  ): WebApp;

  type ScreenOptions = {
    title?: string;
    headerTitle?: string;
  };

  export type NavigationResponse = {
    navigation: NavigationScreenProp<NavigationRoute>;
    title: string;
    options: ScreenOptions;
  };

  export function handleServerRequest(
    router: NavigationRouter,
    path?: string,
    query?: {}
  ): NavigationResponse;
}

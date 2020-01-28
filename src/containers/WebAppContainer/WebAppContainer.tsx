import {
  NavigationAction,
  NavigationActions,
  NavigationDispatch,
  NavigationParams
} from "@react-navigation/core";
import { createBrowserApp } from "@react-navigation/web";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  Location
} from "history";
import queryString from "querystring";
import AppNavigator from "../Navigator";

type PathParams = {
  path: string;
  params?: NavigationParams;
};

const getPathAndParamsFromLocation = (location: Location): PathParams => {
  const path = encodeURI(location.pathname.substr(1));
  const params = queryString.parse(location.search);
  return { path, params };
};

const matchPathAndParams = (a: PathParams, b: PathParams) => {
  if (a.path !== b.path) {
    return false;
  }
  if (queryString.stringify(a.params) !== queryString.stringify(b.params)) {
    return false;
  }
  return true;
};

const getHistory = (history?: string) => {
  if (typeof history === "string") {
    switch (history) {
      case "browser":
        return createBrowserHistory();
      case "hash":
        return createHashHistory();
      case "memory":
        return createMemoryHistory();
      default:
        throw new Error(
          "@react-navigation/web: createBrowserApp() Invalid value for options.history " +
            history
        );
    }
  }
  return history || createBrowserHistory();
};

const history = getHistory("browser");
let currentPathAndParams = getPathAndParamsFromLocation(history.location);

const _AppContainer = createBrowserApp(AppNavigator);

const initAction =
  AppNavigator.router.getActionForPathAndParams(
    currentPathAndParams.path,
    currentPathAndParams.params
  ) || NavigationActions.init();

const setHistoryListener = (dispatch: NavigationDispatch) => {
  history.listen((location: Location, historyAction: "POP") => {
    const pathAndParams = getPathAndParamsFromLocation(location);
    if (matchPathAndParams(pathAndParams, currentPathAndParams)) {
      return;
    }
    currentPathAndParams = pathAndParams;
    const action =
      historyAction === "POP" && typeof location.state !== "undefined"
        ? NavigationActions.back()
        : AppNavigator.router.getActionForPathAndParams(
            pathAndParams.path,
            pathAndParams.params
          );
    if (action) {
      dispatch(action);
    } else {
      dispatch(initAction);
    }
  });
};

class WebAppContainer extends _AppContainer {
  componentDidMount() {
    setHistoryListener(this.dispatch);
    // @ts-ignore super
    this.updateTitle();
    // @ts-ignore super
    this._actionEventSubscribers.forEach(subscriber =>
      subscriber({
        type: "action",
        action: initAction,
        state: this.state.nav,
        lastState: null
      })
    );
  }

  dispatch = (action: NavigationAction) => {
    const lastState = this.state.nav;
    const newState = AppNavigator.router.getStateForAction(action, lastState);
    const dispatchEvents = () =>
      // @ts-ignore super
      this._actionEventSubscribers.forEach(subscriber =>
        subscriber({
          type: "action",
          action,
          state: newState,
          lastState
        })
      );
    if (action.type === NavigationActions.BACK) {
      history.goBack();
    }
    if (newState && newState !== lastState) {
      this.setState({ nav: newState }, () => {
        // @ts-ignore super
        this._onNavigationStateChange(lastState, newState, action);
        dispatchEvents();
      });
      const pathAndParams =
        AppNavigator.router.getPathAndParamsForState &&
        AppNavigator.router.getPathAndParamsForState(newState);
      if (
        pathAndParams &&
        !matchPathAndParams(pathAndParams, currentPathAndParams)
      ) {
        currentPathAndParams = pathAndParams;
        const url = `/${pathAndParams.path}?${queryString.stringify(
          pathAndParams.params
        )}`;
        if (action.type === NavigationActions.SET_PARAMS) {
          history.replace(url);
        } else if (action.type === NavigationActions.NAVIGATE) {
          history.push(url, { yo: "man" });
        }
      }
    } else {
      dispatchEvents();
    }

    return true;
  };
}

export default WebAppContainer;

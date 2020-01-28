import React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Provider } from "react-redux";
import RX from "reactxp";
import AppContainer from "./containers/App";
import AppNavigator from "./containers/Navigator";
import configureStore from "./store";
import initialState from "./store/initial";

if (typeof window === "undefined") {
  global.window = {
    innerWidth: 375,
    innerHeight: 600
  };
}

const { store } = configureStore(initialState);

interface AppProps {
  navigation?: NavigationScreenProp<NavigationState>;
}

export class App extends RX.Component<AppProps> {
  public static router = AppNavigator.router;

  public render() {
    const { navigation } = this.props;

    return (
      <Provider store={store}>
        <AppContainer navigation={navigation} />
      </Provider>
    );
  }
}

export default App;

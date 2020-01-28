import {
  createNavigator,
  createSwitchNavigator,
  NavigationContainer,
  NavigationRouteConfigMap,
  StackNavigatorConfig,
  StackRouter
} from "@react-navigation/core";
import Account from "../../../screens/Account";
import Exchange from "../../../screens/Exchange";

function createStackNavigator(
  routeConfigMap: NavigationRouteConfigMap,
  stackConfig: StackNavigatorConfig = {}
) {
  const StackView = require("./StackView").default;
  const router = StackRouter(routeConfigMap, stackConfig);

  // Create a navigator with StackView as the view
  return createNavigator(StackView, router, stackConfig);
}

const routeConfigMap = {
  Account: {
    screen: Account,
    path: "account"
  },
  Exchange: {
    screen: Exchange,
    path: "exchange"
  }
};

let AppNavigator: NavigationContainer;

if (process.browser) {
  AppNavigator = createStackNavigator(routeConfigMap, {
    initialRouteName: "Account"
  });
} else {
  AppNavigator = createSwitchNavigator(routeConfigMap, {
    initialRouteName: "Account"
  });
}

export default AppNavigator;

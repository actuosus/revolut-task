import { createBrowserApp } from "@react-navigation/web";
import RX from "reactxp";
import AppNavigator from "../../Navigator";

let AppContainer: React.ElementType;

if (process.browser) {
  AppContainer = createBrowserApp(AppNavigator);
  // AppContainer = WebAppContainer;
} else {
  // @ts-ignore
  RX.ActivityIndicator._isStyleSheetInstalled = true;
  AppContainer = AppNavigator;
}

export default AppContainer;

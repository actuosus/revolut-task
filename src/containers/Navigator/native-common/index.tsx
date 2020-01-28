import { createStackNavigator } from "react-navigation";
import Account from "../../../screens/Account";
import Exchange from "../../../screens/Exchange";

const AppNavigator = createStackNavigator(
  {
    Account: {
      screen: Account,
      path: "account"
    },
    Exchange: {
      screen: Exchange,
      path: "exchange"
    }
  },
  {
    headerMode: "none"
  }
);

export default AppNavigator;

import React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import * as RX from "reactxp";
import { LayoutInfo } from "reactxp/dist/common/Types";
import { ReduxState } from "../../@types/ReduxState";
import AnimatedBackground from "../../components/AnimatedBackground";
import AnimatedBlurredText from "../../components/AnimatedBlurredText";
import BottomTabBar from "../../components/BottomTabBar";
import FormattedAmount from "../../components/FormattedAmount";
import Pager from "../../components/Pagination";
import RotatingItems from "../../components/RotatingItems";
import SafeAreaView from "../../components/SafeAreaView";
import TransactionList from "../../components/TransactionList";
import { TransactionListView } from "../../components/TransactionList/TransactionList";
import { formatCurrency } from "../../lib";
import Styles from "../../lib/styles";
import {
  TransactionsState,
  TransferTransaction
} from "../../store/transactions/types";
import { Wallet, WalletId, WalletsState } from "../../store/wallets/types";
import { ExchangeNavigationParams } from "../Exchange/Exchange";
import ActionButtons from "./components/ActionButtons";

const _styles = {
  root: RX.Styles.createViewStyle({
    flex: 1
  }),
  header: RX.Styles.createViewStyle({
    justifyContent: "center",
    alignItems: "center",
    flex: 1.26,
    ...RX.Platform.select({
      web: {
        backgroundColor: "#3577EF"
      },
      default: {
        backgroundColor: "rgba(40, 40, 255, 1)"
      }
    })
  }),
  accounts: RX.Styles.createViewStyle({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    minWidth: RX.UserInterface.measureWindow().width
  }),
  // @ts-ignore Web styles
  amount: RX.Styles.createViewStyle({
    flexDirection: "row",
    position: "absolute",

    justifyContent: "center",
    overflow: "visible",
    width: 0,
    transform: [{ translateY: -20 }],

    ...RX.Platform.select({
      default: {},
      web: {
        userSelect: "none",
        WebkitUserSelect: "none",
        alignItems: "baseline"
      }
    })
  })
};

interface AccountNavigationParams {
  walletId: string;
}

interface AccountProps {
  navigation: NavigationScreenProp<NavigationState, AccountNavigationParams>;
  wallets: WalletsState;
  transactions: TransactionsState;
}

interface ExtendedTransferTransaction extends TransferTransaction {
  fromWallet: Wallet;
  toWallet: Wallet;
}

export const Account = (props: AccountProps) => {
  const { navigation, wallets, transactions = {} } = props;
  const navigationWalletId = navigation.getParam("walletId");
  const selectedIndex =
    typeof navigationWalletId !== "undefined"
      ? Object.keys(wallets).indexOf(navigationWalletId)
      : 0;
  const [selected, setSelected] = React.useState(selectedIndex);
  const [internalSelected, setInternalSelected] = React.useState(selected);
  const wallet: Wallet = wallets[Object.keys(wallets)[selected]];

  const filteredTransactions: ExtendedTransferTransaction[] = Object.keys(
    transactions
  )
    .sort((a, b) => (a > b ? -1 : 1))
    .filter(_ => {
      const transaction = transactions[_];
      const currentWalletId = Object.keys(wallets)[selected];

      return (
        transaction.fromWalletId == currentWalletId ||
        transaction.toWalletId == currentWalletId
      );
    })
    .map(_ => ({
      ...transactions[_],
      fromWallet: wallets[transactions[_].fromWalletId],
      toWallet: wallets[transactions[_].toWalletId]
    }));

  const handleExchangePress = () => {
    const fromWalletId = Object.keys(wallets)[selected];
    const params: ExchangeNavigationParams = { fromWalletId };

    // Resolve receiving wallet by last transaction
    const lastTransaction = filteredTransactions[0];
    const toWalletId = lastTransaction
      ? lastTransaction.toWallet.id.toString() !== fromWalletId
        ? lastTransaction.toWallet.id.toString()
        : lastTransaction.fromWallet.id.toString()
      : undefined;
    if (toWalletId) {
      params.toWalletId = toWalletId;
    }
    navigation.navigate("Exchange", params);
  };

  const handlePageItemPress = (value: number) => {
    setInternalSelected(value);
  };

  const handleWalletItemPress = (value: WalletId) => {
    setInternalSelected(Object.keys(wallets).indexOf(value));
  };

  const transactionListView = React.useRef<TransactionListView>(null);

  /* Effects */

  React.useEffect(() => {
    navigation.addListener("willFocus", () => {
      if (transactionListView.current) {
        transactionListView.current.scrollToTop(false);
      }
    });

    RX.StatusBar.setBarStyle("light-content", false);
    RX.StatusBar.setBackgroundColor("rgba(38,88,188,0)", false);
    RX.StatusBar.setTranslucent(true);
  }, []);

  React.useEffect(() => {
    if (navigationWalletId) {
      setSelected(Object.keys(wallets).indexOf(navigationWalletId));
    }
  }, [navigationWalletId]);

  React.useEffect(() => {
    navigation.setParams({ walletId: Object.keys(wallets)[selected] });
  }, [selected]);

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      forceInset={{ top: "never", bottom: "always" }}
    >
      <RX.View style={_styles.root}>
        <RX.View style={_styles.header}>
          <AnimatedBackground style={Styles.absoluteFill} />

          <RX.View style={_styles.accounts}>
            <RotatingItems
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                overflow: "visible",
                marginBottom: 20
              }}
              items={Object.keys(wallets).map(_ => wallets[_])}
              selected={internalSelected}
              onRotationEnd={value => setSelected(value)}
              onRotationDragEnd={value => setInternalSelected(value)}
              renderItem={(wallet: Wallet) => {
                const [height, setHeight] = React.useState(0);
                const handleItemLayout = (layout: LayoutInfo) => {
                  if (Math.abs(height - layout.height) > 1) {
                    setHeight(layout.height);
                  }
                };
                const centring = {
                  top: -height / 2
                };

                const _style = RX.Styles.combine(_styles.amount, centring);

                return (
                  <RX.View
                    style={_style}
                    onLayout={handleItemLayout}
                    onPress={() => handleWalletItemPress(wallet.id)}
                  >
                    <FormattedAmount
                      currency={wallet.currency}
                      amount={wallet.balance}
                      textStyle={{ fontSize: 40, fontWeight: "300" }}
                      currencyStyle={{ fontSize: 28, fontWeight: "300" }}
                      fractionStyle={{ fontSize: 32, fontWeight: "300" }}
                      maximumFractionDigits={2}
                    />
                  </RX.View>
                );
              }}
            />

            {wallet ? (
              <AnimatedBlurredText
                value={`${wallet.currency} – ${formatCurrency(
                  wallet.currency
                )}`}
                style={{ marginBottom: 10 }}
              />
            ) : null}

            <Pager
              number={Object.keys(wallets).length}
              value={selected}
              style={{ justifyContent: "center" }}
              onItemPress={handlePageItemPress}
            />
          </RX.View>

          <ActionButtons onExchangePress={handleExchangePress} />
        </RX.View>
        <RX.View
          style={{
            flex: 1,
            minHeight: RX.UserInterface.measureWindow().width / 3 + 30 + 40,
            maxHeight: RX.UserInterface.measureWindow().width / 3 + 30 + 40
          }}
        >
          <TransactionList
            ref={transactionListView}
            itemList={filteredTransactions}
            walletId={Object.keys(wallets)[selected]}
          />
        </RX.View>
        <BottomTabBar />
      </RX.View>
    </SafeAreaView>
  );
};

Account.navigationOptions = {
  title: "Account"
};

export const ConnectedAccount = connect(
  ({ wallets, transactions }: ReduxState) => ({
    wallets,
    transactions
  })
)(Account);

export default ConnectedAccount;

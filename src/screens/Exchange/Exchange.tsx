import React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import * as RX from "reactxp";
import { LayoutInfo } from "reactxp/dist/common/Types";
import { ReduxState } from "../../@types/ReduxState";
import Button from "../../components/Button";
import FormattedAmount from "../../components/FormattedAmount";
import ArrowDropDown from "../../components/icons/ArrowDropDown";
import KeyboardAwareView from "../../components/KeyboardAwareView";
import SafeAreaView from "../../components/SafeAreaView";
import Slider from "../../components/Slider";
import { formatMoney } from "../../lib";
import Styles from "../../lib/styles";
import { usePrevious } from "../../lib/utils/hooks";
import {
  getRates,
  subscribeToRates,
  unsubscribeFromRates
} from "../../store/rates/actions";
import { RatesState } from "../../store/rates/types";
import { exchange } from "../../store/wallets/actions";
import { Wallet, WalletsState } from "../../store/wallets/types";
import ClippedBackground from "./components/ClippedBackground";
import Header from "./components/Header";
import Picker from "./components/Picker";
import ExchangeTextField from "./components/TextField";

const window = RX.UserInterface.measureWindow();

const _styles = {
  root: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: "#2A6FEC"
  }),
  headerButton: RX.Styles.createButtonStyle({
    padding: 8
  }),
  headerButtonText: RX.Styles.createTextStyle({
    color: "rgba(255,255,255,0.8)",
    fontSize: 16
  }),
  accountSelect: RX.Styles.createViewStyle({
    paddingVertical: 2,
    paddingLeft: 8,
    paddingRight: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center"
  }),
  accountSelectText: RX.Styles.createTextStyle({
    color: "rgba(255,255,255,0.8)",
    fontSize: 18
  }),
  form: RX.Styles.createViewStyle({
    flex: 1
  }),
  row: RX.Styles.createViewStyle({
    width: window.width,
    minWidth: window.width,
    flex: 1
  })
};

export interface ExchangeNavigationParams {
  fromWalletId: string;
  toWalletId?: string;
}

interface ExchangeProps {
  navigation: NavigationScreenProp<NavigationState, ExchangeNavigationParams>;
  wallets: WalletsState;
  rates: RatesState;
  getRates: typeof getRates;
  subscribeToRates: typeof subscribeToRates;
  unsubscribeFromRates: typeof unsubscribeFromRates;
  exchange: typeof exchange;
}

export const Exchange = (props: ExchangeProps) => {
  const { navigation, wallets, rates } = props;
  const _wallets = Object.keys(wallets).map(_ => wallets[_]);
  const fromWalletId = navigation.getParam("fromWalletId", "1");
  let nextWalletIndex = Object.keys(wallets).indexOf(fromWalletId) + 1;
  if (nextWalletIndex >= Object.keys(wallets).length) {
    nextWalletIndex = 0;
  }
  const nextWalletId = Object.keys(wallets)[nextWalletIndex];
  const toWalletId = navigation.getParam("toWalletId", nextWalletId);
  const [fromWallet, setFromWallet] = React.useState<Wallet>(
    wallets[fromWalletId]
  );
  const [toWallet, setToWallet] = React.useState<Wallet>(wallets[toWalletId]);
  const fromInput = React.useRef(
    [...Array(Object.keys(wallets).length)].map(() =>
      React.createRef<RX.TextInput>()
    )
  );
  const toInput = React.useRef(
    [...Array(Object.keys(wallets).length)].map(() =>
      React.createRef<RX.TextInput>()
    )
  );
  const fromIndex = Object.keys(wallets).indexOf(fromWalletId);
  const toIndex = Object.keys(wallets).indexOf(toWalletId);

  if (!fromWallet || !toWallet) {
    return null;
  }

  const [fromAmount, setFromAmount] = React.useState<number>();
  const [toAmount, setToAmount] = React.useState<number>();
  const [isValid, setValid] = React.useState(false);

  const getRate = (fromWallet: Wallet, toWallet: Wallet) => {
    if (rates && fromWallet && toWallet) {
      const fromRates = rates[fromWallet.currency];
      if (fromRates) {
        return fromRates[toWallet.currency] || 0;
      }
      return 0;
    }

    return 0;
  };
  const getCurrentFromRate = () => getRate(fromWallet, toWallet);
  const getCurrentToRate = () => getRate(toWallet, fromWallet);

  const setInputFocus = () => {
    // It is sad but we cannot focus with keyboard in mobile Safari (only in standalone mode).
    // But it definitely works with React Native
    if (fromInput.current) {
      const index = Object.keys(wallets).indexOf(fromWalletId.toString());
      const ref = fromInput.current[index];
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  };

  /* Effects */

  React.useEffect(() => {
    setTimeout(() => {
      setInputFocus();
    }, 300);
  }, []);

  React.useEffect(() => {
    const rate = getCurrentFromRate();
    if (rate && fromAmount) {
      setToAmount(rate * fromAmount);
    }
  }, [rates]);

  const prevFromWallet = usePrevious(fromWallet);
  React.useEffect(() => {
    setInputFocus();

    if (prevFromWallet) {
      props.unsubscribeFromRates(prevFromWallet.currency);
    }

    // props.subscribeToRates(fromWallet.currency);

    const rate = getCurrentFromRate();
    // Update to amount when from wallet changed.
    if (rate && fromAmount) {
      setToAmount(rate * fromAmount);
    }

    return () => {
      props.unsubscribeFromRates(fromWallet.currency);
    };
  }, [fromWallet]);

  React.useEffect(() => {
    if (
      fromWallet.id !== toWallet.id &&
      fromAmount &&
      toAmount &&
      fromWallet.balance >= fromAmount
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [fromAmount, toAmount, fromWallet.id, toWallet.id]);

  /* Handlers */

  const handleFromIndexChange = (index: number) => {
    const wallet = _wallets[index];
    if (wallet) {
      setFromWallet(_wallets[index]);
      navigation.setParams({ fromWalletId: _wallets[index].id });
    }
  };
  const handleToIndexChange = (index: number) => {
    const wallet = _wallets[index];
    if (wallet) {
      setToWallet(_wallets[index]);
      navigation.setParams({ toWalletId: _wallets[index].id });
    }
  };

  const handleCancelPress = () => {
    if (navigation.goBack) {
      navigation.goBack();
    } else {
      navigation.navigate("Account", {
        walletId: fromWallet.id.toString()
      });
    }
  };

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    if (!fromAmount) {
      return;
    }

    const rate = getCurrentFromRate();

    props.exchange(
      fromWallet.id,
      toWallet.id,
      Math.abs(fromAmount),
      rate,
      Date.now()
    );

    navigation.navigate("Account", {
      walletId: fromWallet.id.toString()
    });
  };

  const handleExchangePress = () => {
    handleSubmit();
  };

  const handleFromChange = (value: number) => {
    const rate = getCurrentFromRate();
    setFromAmount(value);
    setToAmount(rate * value);
  };

  const handleFromSubmit = () => {
    handleSubmit();
  };

  const handleToChange = (value: number) => {
    const rate = getCurrentFromRate();
    setToAmount(value);
    const fromAmount = parseFloat((value / rate).toFixed(2));
    setFromAmount(fromAmount);
  };

  const [width, setWidth] = React.useState(window.width);
  const handleLayout = (layout: LayoutInfo) => {
    setWidth(layout.width);
  };

  const _modalId = "PickerDialog";
  const dialogPosition = React.useRef(RX.Animated.createValue(0)).current;

  const handleHidePicker = () => {
    RX.Animated.timing(dialogPosition, {
      duration: 250,
      toValue: 0,
      easing: RX.Animated.Easing.In()
    }).start(() => {
      RX.Modal.dismiss(_modalId);
    });
  };

  const handleShowPicker = () => {
    if (RX.Platform.getType() !== "ios") {
      return;
    }

    const dialog = (
      <RX.View
        style={Styles.absoluteFill}
        onPress={handleHidePicker}
        activeOpacity={1}
      >
        <RX.Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              height: window.height / 3,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.9)"
            },
            RX.Styles.createAnimatedViewStyle({
              transform: [
                {
                  translateY: dialogPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [window.height / 3, 0]
                  })
                }
              ]
            })
          ]}
        >
          <Picker
            wallets={_wallets}
            fromWallet={fromWallet}
            toWallet={toWallet}
            getRate={getRate}
            onValueChange={value => {
              handleFromIndexChange(Object.keys(wallets).indexOf(value));
            }}
          />

          <RX.View
            style={{
              padding: 16,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >
            <Button onPress={handleHidePicker}>
              <RX.Text>Done</RX.Text>
            </Button>
          </RX.View>
        </RX.Animated.View>
      </RX.View>
    );

    RX.Animated.timing(dialogPosition, {
      duration: 250,
      toValue: 1,
      easing: RX.Animated.Easing.Out()
    }).start();

    RX.Modal.show(dialog, _modalId);
  };

  RX.StatusBar.setBarStyle("light-content", false);
  RX.StatusBar.setBackgroundColor("rgba(42,111,236,0)", false);
  RX.StatusBar.setTranslucent(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2A6FEC" }}>
      <KeyboardAwareView behavior={"padding"} enabled style={{ flex: 1 }}>
        <RX.View style={_styles.root} onLayout={handleLayout}>
          {/* <FloatingBubbles /> */}
          <Header
            headerLeft={
              <Button
                style={_styles.headerButton}
                onPress={handleCancelPress}
                activeOpacity={0.8}
              >
                <RX.Text style={_styles.headerButtonText}>Cancel</RX.Text>
              </Button>
            }
            headerTitle={
              fromWallet.id !== toWallet.id ? (
                <RX.View style={_styles.accountSelect}>
                  {rates && rates[fromWallet.currency] ? (
                    <RX.View
                      style={{ flexDirection: "row", alignItems: "center" }}
                      onPress={handleShowPicker}
                    >
                      <FormattedAmount
                        currency={fromWallet.currency}
                        currencyStyle={{ fontSize: 16 }}
                        textStyle={{ fontSize: 22 }}
                        amount={1}
                      />
                      <RX.Text style={_styles.accountSelectText}>= </RX.Text>
                      <FormattedAmount
                        currency={toWallet.currency}
                        amount={getCurrentFromRate()}
                        currencyStyle={{ fontSize: 16 }}
                        textStyle={{ fontSize: 22 }}
                        subFractionStyle={{ fontSize: 16 }}
                        useSubFraction
                      />
                      <ArrowDropDown size={28} />

                      {RX.Platform.getType() === "ios" ? null : (
                        <Picker
                          wallets={_wallets}
                          fromWallet={fromWallet}
                          toWallet={toWallet}
                          getRate={getRate}
                          onValueChange={value =>
                            handleFromIndexChange(
                              Object.keys(wallets).indexOf(value)
                            )
                          }
                        />
                      )}
                    </RX.View>
                  ) : (
                    <RX.ActivityIndicator size={"small"} color={"white"} />
                  )}
                </RX.View>
              ) : null
            }
            headerRight={
              <Button
                style={_styles.headerButton}
                onPress={handleExchangePress}
                disabled={!isValid}
                activeOpacity={0.8}
              >
                <RX.Text style={_styles.headerButtonText}>Exchange</RX.Text>
              </Button>
            }
          />
          <RX.View style={_styles.form}>
            <Slider
              style={_styles.row}
              onIndexChanged={handleFromIndexChange}
              index={fromIndex}
              loop
            >
              {Object.keys(wallets).map((_, i) => {
                const wallet = wallets[_];
                return (
                  <ExchangeTextField
                    key={`field-${_}`}
                    wallet={wallet}
                    amount={fromAmount}
                    ref={fromInput.current[i]}
                    onChange={handleFromChange}
                    onSubmit={handleFromSubmit}
                    autoFocus={wallet.id === fromWallet.id}
                    disabled={
                      RX.Platform.getType() !== "ios" &&
                      wallet.id !== fromWallet.id
                    }
                    style={{ minWidth: width }}
                    direction={"from"}
                  />
                );
              })}
            </Slider>
            <ClippedBackground style={_styles.row} width={window.width}>
              <Slider
                style={_styles.row}
                onIndexChanged={handleToIndexChange}
                index={toIndex}
                loop
              >
                {Object.keys(wallets).map((_, i) => {
                  const wallet = wallets[_];
                  const shouldShowHint =
                    rates &&
                    rates[fromWallet.currency] &&
                    fromWallet.id !== toWallet.id;
                  const hint = shouldShowHint ? (
                    <RX.View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <RX.Text
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 14
                        }}
                      >
                        {formatMoney(1, {
                          locale: "en-US",
                          currency: toWallet.currency,
                          minimumFractionDigits: 0
                        })}{" "}
                        ={" "}
                        {formatMoney(getCurrentToRate(), {
                          locale: "en-US",
                          currency: fromWallet.currency,
                          maximumFractionDigits: 4
                        })}
                      </RX.Text>
                    </RX.View>
                  ) : null;
                  return (
                    <ExchangeTextField
                      key={`field-${_}`}
                      wallet={wallet}
                      amount={toAmount}
                      ref={toInput.current[i]}
                      onChange={handleToChange}
                      disabled={wallet.id !== toWallet.id}
                      direction={"to"}
                      style={{ minWidth: width }}
                      hint={hint}
                    />
                  );
                })}
              </Slider>
            </ClippedBackground>
          </RX.View>
        </RX.View>
      </KeyboardAwareView>
    </SafeAreaView>
  );
};

Exchange.navigationOptions = {
  title: "Exchange"
};

export const ConnectedExchange = connect(
  ({ wallets, rates }: ReduxState) => ({ wallets, rates }),
  { getRates, subscribeToRates, unsubscribeFromRates, exchange }
)(Exchange);

export default ConnectedExchange;

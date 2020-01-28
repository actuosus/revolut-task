import React, { ReactNode } from "react";
import * as RX from "reactxp";
import { isNumber } from "util";
import { formatMoney } from "../../../../lib";
import { Wallet } from "../../../../store/wallets/types";

const window = RX.UserInterface.measureWindow();

const _styles = {
  row: RX.Styles.createViewStyle({
    flex: 1,
    justifyContent: "center",
    padding: 48,
    paddingRight: 24,
    maxWidth: window.width
  }),
  currencyText: RX.Styles.createTextStyle({
    fontSize: 48,
    fontWeight: "300",
    color: "white",
    paddingRight: 10
  }),
  input: RX.Styles.createTextInputStyle({
    flex: 1,
    minWidth: 100,
    fontSize: 48,
    fontWeight: "300",
    color: "white",
    backgroundColor: "transparent",
    textAlign: "right",
    padding: 0,

    ...RX.Platform.select({
      default: {},
      web: {
        fontFamily:
          'proxima-nova, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
        caretColor: "white"
      }
    })
  }),
  balance: RX.Styles.createTextStyle({
    flex: 1,
    fontSize: 14,
    fontWeight: "300",
    color: "rgba(255,255,255,0.6)"
  })
};

type ExchangeTextFieldProps = {
  wallet: Wallet;
  amount?: number;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
  hint?: ReactNode;
  direction: "from" | "to";
};

const ExchangeTextField = React.forwardRef(
  (props: ExchangeTextFieldProps, ref: React.RefObject<RX.TextInput>) => {
    const { wallet, amount, direction, hint, disabled, autoFocus } = props;

    const handleChange = (value: string) => {
      props.onChange(value);
    };

    const handlePaste = (event: RX.Types.ClipboardEvent) => {
      if (event.clipboardData) {
        if (
          event.clipboardData.types &&
          event.clipboardData.types.includes("text/plain")
        ) {
          const data = event.clipboardData.getData("text/plain");
          if (!data || !isNumber(parseFloat(data))) {
            event.preventDefault();
          }
        } else {
          event.preventDefault();
        }
      }
    };

    const handleSubmit = () => {
      props.onSubmit && props.onSubmit();
    };

    const handlePress = () => {
      if (ref && ref.current) {
        ref.current.focus();
      }
    };

    const absAmount = Math.abs(amount || 0);
    const value = amount
      ? direction === "from"
        ? `-${absAmount}`
        : `+${absAmount.toFixed(2)}`
      : "";

    return (
      <RX.View
        style={RX.Styles.combine([_styles.row, props.style])}
        onPress={handlePress}
        disableTouchOpacityAnimation
      >
        <RX.View style={{ flexDirection: "row", marginBottom: 8 }}>
          <RX.Text style={_styles.currencyText}>{wallet.currency}</RX.Text>
          <RX.TextInput
            ref={ref}
            // One sad thing that this type sets pattern [\d]* to the input and we have no dot on mobile
            keyboardType={"numeric"}
            style={_styles.input}
            onChangeText={handleChange}
            onSubmitEditing={handleSubmit}
            onPaste={handlePaste}
            value={value}
            editable={!disabled}
            autoFocus={autoFocus}
            selectionColor={RX.Platform.select({
              ios: "white",
              android: "rgba(255,255,255,0.2)"
            })}
            placeholderTextColor={"rgba(255,255,255,0.8)"}
            allowFontScaling
          />
        </RX.View>
        <RX.View style={{ flexDirection: "row" }}>
          <RX.Text style={_styles.balance}>
            You have{" "}
            {formatMoney(wallet.balance, {
              locale: "en-US",
              currency: wallet.currency,
              maximumFractionDigits: 2
            })}
          </RX.Text>
          {hint}
        </RX.View>
      </RX.View>
    );
  }
);
ExchangeTextField.displayName = "TextField";

export default ExchangeTextField;

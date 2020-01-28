import React from "react";
import * as RX from "reactxp";
import { formatMoneyParts } from "../../lib";

const _styles = {
  root: RX.Styles.createViewStyle({
    flexDirection: "row",
    // @ts-ignore Actually "baseline" is supported by React Native
    alignItems: "baseline"
  }),
  text: RX.Styles.createTextStyle({
    fontSize: 18,
    color: "white"
  }),
  currency: RX.Styles.createTextStyle({
    fontSize: 14,
    paddingHorizontal: 1
  })
};

interface FormattedAmountProps {
  currency: string;
  amount: number;
  prefix?: string;
  useSubFraction?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
  textStyle?: RX.Types.StyleRuleSetOrArray<RX.Types.TextStyle>;
  currencyStyle?: RX.Types.StyleRuleSetOrArray<RX.Types.TextStyle>;
  fractionStyle?: RX.Types.StyleRuleSetOrArray<RX.Types.TextStyle>;
  subFractionStyle?: RX.Types.StyleRuleSetOrArray<RX.Types.TextStyle>;
}

const FormattedAmount = ({
  currency,
  amount,
  prefix,
  useSubFraction = false,
  minimumFractionDigits = 0,
  maximumFractionDigits = 4,
  style,
  textStyle,
  currencyStyle,
  fractionStyle,
  subFractionStyle
}: FormattedAmountProps) => {
  const parts = formatMoneyParts(amount, {
    locale: "en-US",
    currency: currency,
    maximumFractionDigits,
    minimumFractionDigits
  });

  return (
    <RX.View
      // @ts-ignore Web styles
      style={[_styles.root, style]}
    >
      {prefix ? (
        <RX.Text
          allowFontScaling
          style={[_styles.text, { paddingHorizontal: 1 }, textStyle]}
        >
          {prefix}
        </RX.Text>
      ) : null}
      {parts.map((_, i: number) => {
        if (_.type === "fraction" && useSubFraction) {
          const firstSubfraction = _.value.substring(0, 2);
          const restSubFraction = _.value.substring(2);

          return [
            <RX.Text
              allowFontScaling
              key={`${_.type}-${i}-first`}
              style={[_styles.text, textStyle, fractionStyle]}
            >
              {firstSubfraction}
            </RX.Text>,
            <RX.Text
              allowFontScaling
              key={`${_.type}-${i}-rest`}
              style={[_styles.text, textStyle, fractionStyle, subFractionStyle]}
            >
              {restSubFraction}
            </RX.Text>
          ];
        }

        return (
          <RX.Text
            allowFontScaling
            key={`${_.type}-${i}`}
            style={[
              _styles.text,
              textStyle,
              _.type === "currency"
                ? RX.Styles.combine(_styles.currency, currencyStyle)
                : {},
              _.type === "fraction" ? fractionStyle : {}
            ]}
          >
            {_.value}
          </RX.Text>
        );
      })}
    </RX.View>
  );
};

export default FormattedAmount;

import dayjs from "dayjs";
import React from "react";
import * as RX from "reactxp";
import { VirtualListViewCellRenderDetails } from "reactxp-virtuallistview";
import FormattedAmount from "../../../FormattedAmount";
import Cached from "../../../icons/Cached";
import { TransactionItemInfo } from "../../TransactionList";

const _styles = {
  buttonIcon: RX.Styles.createViewStyle({
    marginBottom: 7.5,
    backgroundColor: "rgba(145,157,204,1)",
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center"
  })
};

const TransactionListItem = (
  details: VirtualListViewCellRenderDetails<TransactionItemInfo>
) => {
  const { item } = details;
  const { fromWallet, toWallet } = item.data;
  const isTo = item.selectedWalletId == fromWallet.id;

  const position = RX.Animated.createValue(0);

  React.useEffect(() => {
    // Hacky way to check new transaction to be animated
    if (Date.now() - item.data.timestamp < 5000) {
      position.setValue(0);
      const animation = RX.Animated.timing(position, {
        toValue: 1,
        duration: RX.Platform.select({ android: 750, default: 350 }),
        isInteraction: false
      });
      animation.start();

      return () => {
        animation.stop();
      };
    } else {
      position.setValue(1);
    }
    return;
  }, [item.data.timestamp]);

  return (
    <RX.Animated.View
      style={[
        {
          flexDirection: "row",
          padding: 16,
          backgroundColor: "rgba(255,255,255,0.5)"
        },
        RX.Styles.createAnimatedViewStyle({
          backgroundColor: position.interpolate({
            inputRange: [0, 1],
            outputRange: ["rgba(0,0,0,0.5)", "rgba(255,255,255,0.5)"]
          }),
          transform: [
            {
              scale: position.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1]
              })
            },
            {
              rotateX: position.interpolate({
                inputRange: [0, 1],
                outputRange: ["-90deg", "0deg"]
              })
            }
          ]
        })
      ]}
    >
      <RX.View style={[_styles.buttonIcon, { backgroundColor: "#929FC7" }]}>
        <Cached size={36} />
      </RX.View>
      <RX.View style={{ flex: 1, paddingLeft: 16, paddingRight: 16 }}>
        <RX.Text
          style={{ color: "#4A4754", fontSize: 19, flex: 1 }}
          numberOfLines={1}
        >
          {isTo
            ? `Exchanged to ${toWallet.currency}`
            : `Exchanged from ${fromWallet.currency}`}
        </RX.Text>
        <RX.Text style={{ color: "rgba(0,0,0,0.5)", fontSize: 14, flex: 1 }}>
          {dayjs(item.data.timestamp).format("HH:mm")}
        </RX.Text>
      </RX.View>
      <RX.View style={{ alignItems: "flex-end" }}>
        <FormattedAmount
          amount={isTo ? item.data.fromAmount : item.data.amount}
          currency={isTo ? fromWallet.currency : toWallet.currency}
          style={{ flex: 1 }}
          textStyle={{ color: "#090909", fontSize: 22 }}
          currencyStyle={{ fontSize: 16 }}
          prefix={isTo ? "-" : "+"}
          maximumFractionDigits={2}
        />
        <FormattedAmount
          amount={isTo ? item.data.amount : item.data.fromAmount}
          currency={isTo ? toWallet.currency : fromWallet.currency}
          style={{ flex: 1 }}
          textStyle={{
            textAlign: "right",
            color: "#6885C1",
            fontSize: 16
          }}
          prefix={isTo ? "+" : "-"}
          maximumFractionDigits={2}
        />
      </RX.View>
    </RX.Animated.View>
  );
};

export default TransactionListItem;

import React from "react";
import RX from "reactxp";
import { formatMoneyParts } from "../../../../lib";
import Styles from "../../../../lib/styles";
import { Wallet, WalletId } from "../../../../store/wallets/types";

const _styles = {
  root: RX.Styles.createPickerStyle({
    opacity: 0,
    // @ts-ignore
    width: "100%",
    // @ts-ignore Web styles
    fontSize: 16,
    ...RX.Platform.select({
      default: {},
      web: { WebkitAppearance: "none" }
    })
  })
};

interface PickerProps {
  wallets: Wallet[];
  fromWallet: Wallet;
  toWallet: Wallet;
  getRate: (fromWallet: Wallet, toWallet: Wallet) => number;
  onValueChange: (value: WalletId) => void;
}

const Picker = ({
  wallets,
  fromWallet,
  toWallet,
  getRate,
  onValueChange
}: PickerProps) => (
  <RX.Picker
    items={wallets.map(_ => ({
      value: _.id,
      label:
        formatMoneyParts(1, {
          locale: "en-US",
          currency: _.currency,
          minimumFractionDigits: 0
        })
          .map(_ => _.value)
          .join("") +
        " = " +
        formatMoneyParts(getRate(_, toWallet), {
          locale: "en-US",
          currency: toWallet.currency,
          maximumFractionDigits: 4
        })
          .map(_ => _.value)
          .join("")
    }))}
    selectedValue={fromWallet.id}
    onValueChange={onValueChange}
    style={[Styles.absoluteFill, _styles.root]}
  />
);

export default Picker;

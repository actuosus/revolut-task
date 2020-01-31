import React from "react";
import * as RX from "reactxp";
import Button from "../Button";
import AccountBalance from "../icons/AccountBalance";
import AccountCircle from "../icons/AccountCircle";
import Chat from "../icons/Chat";
import CreditCard from "../icons/CreditCard";
import ReplyInverted from "../icons/ReplyInverted";

const _styles = {
  item: RX.Styles.createViewStyle({
    flex: 1
  }),
  button: RX.Styles.createViewStyle({
    alignItems: "center",
    padding: 4
  }),
  buttonLabel: RX.Styles.createTextStyle({
    fontSize: 10,
    color: "#848093"
  })
};

interface BottomTabBarItemProps {
  icon: RX.Types.ReactNode;
  label: string;
  active?: boolean;
}

const BottomTabBarItem = ({ icon, label, active }: BottomTabBarItemProps) => (
  <RX.View style={_styles.item}>
    <Button style={_styles.button}>
      {icon}
      <RX.Text
        style={[_styles.buttonLabel, active ? { color: "#3266D9" } : {}]}
      >
        {label}
      </RX.Text>
    </Button>
  </RX.View>
);

const BottomTabBar = () => {
  return (
    <RX.View
      style={{
        flex: 0,
        minHeight: 44,
        height: 44,
        flexDirection: "row",
        overflow: "visible",
        backgroundColor: "white"
      }}
    >
      <BottomTabBarItem
        icon={<AccountBalance color={"#3266D9"} />}
        label={"Account"}
        active
      />
      <BottomTabBarItem
        icon={<CreditCard color={"#848093"} />}
        label={"Card"}
      />
      <RX.View style={{ flex: 1, alignItems: "center", overflow: "visible" }}>
        <Button
          style={{
            width: 60,
            height: 60,
            alignItems: "center",
            backgroundColor: "#E01AAD",
            borderRadius: 30,
            position: "relative",
            top: -26
          }}
        >
          <ReplyInverted color={"rgba(255,255,255,0.85)"} size={36} />
          <RX.Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 10 }}>
            Send
          </RX.Text>
        </Button>
      </RX.View>
      <BottomTabBarItem icon={<Chat color={"#848093"} />} label={"Support"} />
      <BottomTabBarItem
        icon={<AccountCircle color={"#848093"} />}
        label={"Profile"}
      />
    </RX.View>
  );
};

export default BottomTabBar;

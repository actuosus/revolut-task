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
      <RX.View style={_styles.item}>
        <Button style={_styles.button}>
          <AccountBalance color={"#3266D9"} />
          <RX.Text style={[_styles.buttonLabel, { color: "#3266D9" }]}>
            Account
          </RX.Text>
        </Button>
      </RX.View>
      <RX.View style={_styles.item}>
        <Button style={_styles.button}>
          <CreditCard color={"#848093"} />
          <RX.Text style={_styles.buttonLabel}>Card</RX.Text>
        </Button>
      </RX.View>
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
      <RX.View style={_styles.item}>
        <Button style={_styles.button}>
          <Chat color={"#848093"} />
          <RX.Text style={_styles.buttonLabel}>Support</RX.Text>
        </Button>
      </RX.View>
      <RX.View style={_styles.item}>
        <Button style={_styles.button}>
          <AccountCircle color={"#848093"} />
          <RX.Text style={_styles.buttonLabel}>Profile</RX.Text>
        </Button>
      </RX.View>
    </RX.View>
  );
};

export default BottomTabBar;

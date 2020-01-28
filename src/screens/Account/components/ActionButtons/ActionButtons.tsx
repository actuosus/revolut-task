import React from "react";
import * as RX from "reactxp";
import Button from "../../../../components/Button";
import Add from "../../../../components/icons/Add";
import ArrowRightAlt from "../../../../components/icons/ArrowRightAlt";
import Cached from "../../../../components/icons/Cached";

const _styles = {
  actions: RX.Styles.createViewStyle({
    flexDirection: "row",
    justifyContent: "center"
  }),
  button: RX.Styles.createButtonStyle({
    margin: 15,
    alignItems: "center",
    justifyContent: "center"
  }),
  buttonIcon: RX.Styles.createViewStyle({
    marginBottom: 7.5,
    backgroundColor: "rgba(0,0,0,0.1)",
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center"
  }),
  buttonText: RX.Styles.createTextStyle({
    fontSize: 14,
    color: "rgba(255,255,255,0.35)"
  })
};

interface ActionButtonsProps {
  onExchangePress?: () => void;
}

const ActionButtons = (props: ActionButtonsProps) => {
  const handleExchangePress = () => {
    props.onExchangePress && props.onExchangePress();
  };

  return (
    <RX.View style={_styles.actions}>
      <Button style={_styles.button} disabled>
        <RX.View style={_styles.buttonIcon}>
          <Add size={36} />
        </RX.View>
        <RX.Text style={_styles.buttonText}>Top up</RX.Text>
      </Button>
      <Button style={_styles.button} onPress={handleExchangePress}>
        <RX.View style={_styles.buttonIcon}>
          <Cached size={36} />
        </RX.View>
        <RX.Text style={_styles.buttonText}>Exchange</RX.Text>
      </Button>
      <Button style={_styles.button} disabled>
        <RX.View style={_styles.buttonIcon}>
          <ArrowRightAlt size={36} />
        </RX.View>
        <RX.Text style={_styles.buttonText}>Bank</RX.Text>
      </Button>
    </RX.View>
  );
};

export default ActionButtons;

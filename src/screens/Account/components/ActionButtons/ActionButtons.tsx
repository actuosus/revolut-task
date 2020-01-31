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

interface ActionButton {
  label: string;
  icon: RX.Types.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
}

const ActionButton = ({ label, icon, disabled, onPress }: ActionButton) => (
  <Button style={_styles.button} disabled={disabled} onPress={onPress}>
    <RX.View style={_styles.buttonIcon}>{icon}</RX.View>
    <RX.Text style={_styles.buttonText}>{label}</RX.Text>
  </Button>
);

interface ActionButtonsProps {
  onExchangePress?: () => void;
}

const ActionButtons = (props: ActionButtonsProps) => {
  const handleExchangePress = () => {
    props.onExchangePress && props.onExchangePress();
  };

  return (
    <RX.View style={_styles.actions}>
      <ActionButton label={"Top up"} icon={<Add size={36} />} disabled />
      <ActionButton
        label={"Exchange"}
        icon={<Cached size={36} />}
        onPress={handleExchangePress}
      />
      <ActionButton
        label={"Bank"}
        icon={<ArrowRightAlt size={36} />}
        disabled
      />
    </RX.View>
  );
};

export default ActionButtons;

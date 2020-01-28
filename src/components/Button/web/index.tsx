import React from "react";
import RX from "reactxp";

const DEFAULT_ACTIVE_OPACITY = 0.6;

const Button = (props: RX.Types.ButtonProps) => {
  const [active, setActive] = React.useState(false);

  const handlePressIn = (e: RX.Types.SyntheticEvent) => {
    setActive(true);
    props.onPressIn && props.onPressIn(e);
  };
  const handlePressOut = (e: RX.Types.SyntheticEvent) => {
    setActive(false);
    props.onPressOut && props.onPressOut(e);
  };

  const activeStyle = RX.Styles.createButtonStyle({
    opacity: props.activeOpacity || DEFAULT_ACTIVE_OPACITY
  });

  return (
    <RX.Button
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
      style={[active ? activeStyle : {}, props.style]}
    >
      {props.children}
    </RX.Button>
  );
};

export default Button;

import React from "react";
import RX from "reactxp";
import Svg from "../svg/Svg";

const DEFAULT_SIZE = 24;

interface MaterialIconProps {
  size?: number;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
  children: RX.Types.ReactNode;
}

const MaterialIcon = (props: MaterialIconProps) => (
  <Svg
    width={props.size || DEFAULT_SIZE}
    height={props.size || DEFAULT_SIZE}
    viewBox={`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`}
  >
    {props.children}
  </Svg>
);

export default MaterialIcon;

import React from "react";
import {
  RadialGradient as SvgRadialGradient,
  RadialGradientProps
} from "react-native-svg";

const RadialGradient = (props: RadialGradientProps) => {
  return <SvgRadialGradient {...props} />;
};

export default RadialGradient;

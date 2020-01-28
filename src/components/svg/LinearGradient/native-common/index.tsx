import React from "react";
import {
  LinearGradient as SvgLinearGradient,
  LinearGradientProps
} from "react-native-svg";

const LinearGradient = (props: LinearGradientProps) => {
  return <SvgLinearGradient {...props} />;
};

export default LinearGradient;

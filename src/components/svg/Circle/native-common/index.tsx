import React from "react";
import { Circle as SvgCircle, CircleProps } from "react-native-svg";

const Circle = (props: CircleProps) => {
  return <SvgCircle {...props} />;
};

export default Circle;

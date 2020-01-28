import React from "react";
import { Rect as SvgRect, RectProps } from "react-native-svg";

const Rect = (props: RectProps) => {
  return <SvgRect {...props} />;
};

export default Rect;

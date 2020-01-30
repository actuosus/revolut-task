import React from "react";
import { Polygon as SvgPolygon, PolygonProps } from "react-native-svg";

const Polygon = (props: PolygonProps) => {
  return <SvgPolygon {...props} />;
};

export default Polygon;

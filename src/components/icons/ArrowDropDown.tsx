import React from "react";
import Path from "../svg/Path";
import Svg from "../svg/Svg";

type IconProps = {
  color?: string;
  size?: number;
};

const ArrowDropDown = (props: IconProps) => {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox={"0 0 24 24"}
    >
      <Path d={"M7 10l5 5 5-5z"} fill={props.color || "white"} />
    </Svg>
  );
};

export default ArrowDropDown;

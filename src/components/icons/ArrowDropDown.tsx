import React from "react";
import Path from "../svg/Path";
import MaterialIcon from "./MaterialIcon";

type IconProps = {
  color?: string;
  size?: number;
};

const ArrowDropDown = (props: IconProps) => {
  return (
    <MaterialIcon>
      <Path d={"M7 10l5 5 5-5z"} fill={props.color || "white"} />
    </MaterialIcon>
  );
};

export default ArrowDropDown;

import React from "react";
import Path from "../svg/Path";
import Svg from "../svg/Svg";

type IconProps = {
  color?: string;
  size?: number;
};

const Add = (props: IconProps) => {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox={"0 0 24 24"}
    >
      <Path
        d={"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}
        fill={props.color || "white"}
      />
    </Svg>
  );
};

export default Add;

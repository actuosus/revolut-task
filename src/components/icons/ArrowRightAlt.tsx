import React from "react";
import Path from "../svg/Path";
import Svg from "../svg/Svg";

type IconProps = {
  color?: string;
  size?: number;
};

const ArrowRightAlt = (props: IconProps) => {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox={"0 0 24 24"}
    >
      <Path
        d={"M16.01 11H4v2h12.01v3L20 12l-3.99-4z"}
        fill={props.color || "white"}
      />
    </Svg>
  );
};

export default ArrowRightAlt;

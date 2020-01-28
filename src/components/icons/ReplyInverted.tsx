import React from "react";
import Path from "../svg/Path";
import Svg from "../svg/Svg";

type IconProps = {
  color?: string;
  size?: number;
};

const ReplyInverted = (props: IconProps) => {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox={"0 0 24 24"}
      style={{ transform: [{ rotateY: "180deg" }] }}
    >
      <Path
        d={"M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"}
        fill={"transparent"}
        stroke={props.color || "white"}
        strokeWidth={1}
      />
    </Svg>
  );
};

export default ReplyInverted;

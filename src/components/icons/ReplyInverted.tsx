import React from "react";
import RX from "reactxp";
import Path from "../svg/Path";
import MaterialIcon from "./MaterialIcon";

type IconProps = {
  color?: string;
  size?: number;
};

const ReplyInverted = (props: IconProps) => {
  return (
    <MaterialIcon
      style={{
        transform: RX.Platform.select({
          // @ts-ignore Web styles
          default: [{ rotateY: "180deg" }],
          web: "rotateY(180deg)"
        })
      }}
    >
      <Path
        d={"M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"}
        fill={"transparent"}
        stroke={props.color || "white"}
        strokeWidth={1}
      />
    </MaterialIcon>
  );
};

export default ReplyInverted;

import React from "react";
import Path from "../svg/Path";
import Svg from "../svg/Svg";

type IconProps = {
  color?: string;
  size?: number;
};

const Chat = (props: IconProps) => {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox={"0 0 24 24"}
    >
      <Path
        d={
          "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"
        }
        fill={props.color || "white"}
      />
    </Svg>
  );
};

export default Chat;

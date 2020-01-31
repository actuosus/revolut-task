import React from "react";
import Path from "../svg/Path";
import MaterialIcon from "./MaterialIcon";

type IconProps = {
  color?: string;
  size?: number;
};

const Cached = (props: IconProps) => {
  return (
    <MaterialIcon
      style={{ transform: [{ rotateZ: "-60deg" }, { rotateX: "180deg" }] }}
    >
      <Path
        d={
          "M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
        }
        fill={props.color || "white"}
      />
    </MaterialIcon>
  );
};

export default Cached;

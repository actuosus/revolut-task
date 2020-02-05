import React from "react";
import Path from "../svg/Path";
import MaterialIcon from "./MaterialIcon";

type IconProps = {
  color?: string;
  size?: number;
};

const ArrowRightAlt = (props: IconProps) => {
  return (
    <MaterialIcon size={props.size}>
      <Path
        d={"M16.01 11H4v2h12.01v3L20 12l-3.99-4z"}
        fill={props.color || "white"}
      />
    </MaterialIcon>
  );
};

export default ArrowRightAlt;

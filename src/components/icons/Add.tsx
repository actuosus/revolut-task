import React from "react";
import Path from "../svg/Path";
import MaterialIcon from "./MaterialIcon";

type IconProps = {
  color?: string;
  size?: number;
};

const Add = (props: IconProps) => {
  return (
    <MaterialIcon>
      <Path
        d={"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}
        fill={props.color || "white"}
      />
    </MaterialIcon>
  );
};

export default Add;

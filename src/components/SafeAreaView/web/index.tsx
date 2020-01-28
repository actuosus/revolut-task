import React from "react";
import { SafeAreaViewProps } from "react-navigation";
import * as RX from "reactxp";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SafeAreaView = ({ forceInset, ...props }: SafeAreaViewProps) => {
  // @ts-ignore
  return <RX.View {...props} />;
};

export default SafeAreaView;

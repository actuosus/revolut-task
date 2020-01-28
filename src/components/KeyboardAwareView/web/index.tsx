import React from "react";
import * as RX from "reactxp";
import { ReactNode } from "reactxp/dist/common/Types";

interface KeyboardAwareViewProps {
  behavior?: string;
  children?: ReactNode;
  enabled?: boolean;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const KeyboardAwareView = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  behavior,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enabled,
  ...props
}: KeyboardAwareViewProps) => <RX.View {...props} />;

export default KeyboardAwareView;

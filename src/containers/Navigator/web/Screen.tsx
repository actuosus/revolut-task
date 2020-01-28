import React from "react";
import * as RX from "reactxp";

interface ScreenComponentProps {
  pointerEvents?: "box-none" | "none" | "box-only" | "auto";
  onComponentRef?: (view: RX.View) => void;
  active: boolean;
  style: RX.Types.StyleRuleSetOrArray<RX.Types.AnimatedViewStyle>;
}

class Screen extends RX.Component<ScreenComponentProps> {
  render() {
    const { style } = this.props;
    return (
      <RX.Animated.View style={style}>{this.props.children}</RX.Animated.View>
    );
  }
}

export default Screen;

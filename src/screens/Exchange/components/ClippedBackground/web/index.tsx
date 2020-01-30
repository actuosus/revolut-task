import React from "react";
import RX from "reactxp";

const SIZE = 30;

const clipPath = `polygon(0% 0%, calc(50% - ${SIZE / 2}px) 0%, 50% ${SIZE /
  2}px, calc(50% + ${SIZE / 2}px) 0%, 100% 0%, 100% 100%, 0% 100%)`;

const _styles = {
  root: RX.Styles.createViewStyle({
    backgroundColor: "rgba(0,0,0,0.2)",
    // @ts-ignore Web styles
    clipPath,
    WebkitClipPath: clipPath
  })
};

interface ClippedBackgroundProps {
  width?: number;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const ClippedBackground = (props: ClippedBackgroundProps) => (
  <RX.View {...props} style={[_styles.root, props.style]} />
);

export default ClippedBackground;

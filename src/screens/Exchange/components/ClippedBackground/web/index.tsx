import React from "react";
import RX from "reactxp";

const SIZE = 30;

const _styles = {
  root: RX.Styles.createViewStyle({
    backgroundColor: "rgba(0,0,0,0.2)",
    // @ts-ignore Web styles
    clipPath: `polygon(0% 0%, calc(50% - ${SIZE / 2}px) 0%, 50% ${SIZE /
      2}px, calc(50% + ${SIZE / 2}px) 0%, 100% 0%, 100% 100%, 0% 100%)`
    // WebkitClipPath:
    //   "polygon(0% 0%, 46% 0%, 50% 4%, 54% 0%, 100% 0%, 100% 100%, 0% 100%)"
  })
};

const ClippedBackground = props => (
  <RX.View {...props} style={[_styles.root, props.style]} />
);

export default ClippedBackground;

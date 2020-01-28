import React from "react";
import * as RX from "reactxp";
import Styles from "../../lib/styles";
import FloatingBubbles from "../FloatingBubbles";
import IntenseGradientBackground from "../IntenseGradientBackground";

interface AnimatedBackgroundProps {
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const AnimatedBackground = ({ style }: AnimatedBackgroundProps) => (
  <RX.View style={style}>
    <IntenseGradientBackground
      // @ts-ignore Web styles
      style={[
        Styles.absoluteFill,
        {
          ...RX.Platform.select({
            web: {
              background: `linear-gradient(30deg,
              rgba(35,94,203,1) 0%,
              rgba(35,94,203,1) 49%,
              rgba(46,103,208,1) 83%,
              rgba(60,92,188,1) 87%,
              rgba(164,28,129,1) 97%
            )`
            }
          })
        }
      ]}
    />
    <FloatingBubbles count={40} />
  </RX.View>
);

export default AnimatedBackground;

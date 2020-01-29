import React from "react";
import * as RX from "reactxp";
import Styles from "../../lib/styles";
import FloatingBubbles from "../FloatingBubbles";
import GradientBackground from "../GradientBackground";
import SecondaryGradientBackground from "../SecondaryGradientBackground";

interface AnimatedBackgroundProps {
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const AnimatedBackground = ({ style }: AnimatedBackgroundProps) => (
  <RX.View style={style}>
    <SecondaryGradientBackground
      // @ts-ignore Web styles
      style={[
        Styles.absoluteFill,
        {
          opacity: 1,
          ...RX.Platform.select({
            web: {
              background: `linear-gradient(120deg, rgba(33,72,163,1) 0%, rgba(60,122,251,1) 50%, rgba(42,103,228,1) 95%)`
            }
          })
        }
      ]}
    />
    <GradientBackground
      // @ts-ignore Web styles
      style={[
        Styles.absoluteFill,
        {
          opacity: 0.75,
          ...RX.Platform.select({
            web: {
              background: `linear-gradient(30deg, rgba(37,93,191,1) 0%, rgba(39,102,218,1) 20%, rgba(59,121,250,1) 50%, rgba(46,105,219,1) 75%, rgba(59,100,193,1) 82%, rgba(60,92,188,1) 85%, rgba(164,28,129,1) 92%)`,
              boxShadow: `inset 0 0 150px rgba(0,0,0,0.25)`
            }
          })
        }
      ]}
    />
    <FloatingBubbles count={40} />
  </RX.View>
);

export default AnimatedBackground;

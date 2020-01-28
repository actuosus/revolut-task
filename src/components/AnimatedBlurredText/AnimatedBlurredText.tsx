/**
 * Blur text with animation
 *
 * The solution works only for web.
 * Tried @react-native-community/blur, but on iOS we have UIBlurEffect with background color transformations
 * and for Android it is hard to animate because of the canvas usage.
 */

import React from "react";
import * as RX from "reactxp";
import { blur } from "../../lib/animated";

const _styles = {
  text: RX.Styles.createTextStyle({
    fontWeight: "300",
    fontSize: 16,
    color: "white"
  })
};

const AnimatedBlurredText = ({
  value,
  style
}: {
  value: string;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}) => {
  const blurValue = React.useRef(
    RX.Animated.createValue(process.browser ? 1 : 0)
  ).current;
  const interpolated = React.useRef(
    blur(blurValue, {
      inputRange: [0, 1],
      outputRange: ["blur(0px)", "blur(10px)"]
    })
  ).current;
  const animStyle = RX.Styles.createAnimatedViewStyle({
    // @ts-ignore Web style
    filter: interpolated
  });

  React.useEffect(() => {
    if (RX.Platform.getType() === "web") {
      if (blurValue._getOutputValue() === 0) {
        blurValue._updateFinalValue(1);
      }
    }
    const animation = RX.Animated.timing(blurValue, {
      toValue: 0,
      duration: 500
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [value]);

  return (
    <RX.Animated.View style={[style, animStyle]}>
      <RX.Text style={_styles.text}>{value}</RX.Text>
    </RX.Animated.View>
  );
};

export default AnimatedBlurredText;

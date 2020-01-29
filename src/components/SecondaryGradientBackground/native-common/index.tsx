import React from "react";
import * as RX from "reactxp";
import Defs from "../../svg/Defs";
import LinearGradient from "../../svg/LinearGradient";
import Rect from "../../svg/Rect";
import Stop from "../../svg/Stop";
import Svg from "../../svg/Svg";

interface SecondaryGradientBackgroundProps {
  opacity?: number;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const SecondaryGradientBackground = ({
  opacity,
  style
}: SecondaryGradientBackgroundProps) => {
  return (
    <Svg width={"100%"} height={"100%"} style={style}>
      <Defs>
        <LinearGradient id={"grad"} x1={"0%"} y1={"0%"} x2={"100%"} y2={"100%"}>
          <Stop
            offset={"0%"}
            stopColor={"rgb(33,72,163)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"50%"}
            stopColor={"rgb(60,122,251)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"95%"}
            stopColor={"rgb(42,103,228)"}
            stopOpacity={opacity || 1}
          />
        </LinearGradient>
      </Defs>
      <Rect width={"100%"} height={"100%"} fill={"url(#grad)"} />
    </Svg>
  );
};

export default SecondaryGradientBackground;

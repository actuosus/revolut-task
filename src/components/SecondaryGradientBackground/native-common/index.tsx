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
        <LinearGradient id={"grad"} x1={"0%"} y1={"100%"} x2={"100%"} y2={"0%"}>
          <Stop
            offset={"0%"}
            stopColor={"rgb(35,94,203)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"49%"}
            stopColor={"rgb(35,94,203)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"83%"}
            stopColor={"rgb(46,103,208)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"85%"}
            stopColor={"rgb(60,92,188)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"90%"}
            stopColor={"rgb(164,28,129)"}
            stopOpacity={opacity || 1}
          />
        </LinearGradient>
      </Defs>
      <Rect width={"100%"} height={"100%"} fill={"url(#grad)"} />
    </Svg>
  );
};

export default SecondaryGradientBackground;

import React from "react";
import * as RX from "reactxp";
import Defs from "../../svg/Defs";
import LinearGradient from "../../svg/LinearGradient";
import Rect from "../../svg/Rect";
import Stop from "../../svg/Stop";
import Svg from "../../svg/Svg";

interface GradientBackgroundProps {
  opacity?: number;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const GradientBackground = ({ opacity, style }: GradientBackgroundProps) => {
  return (
    <Svg width={"100%"} height={"100%"} style={style}>
      <Defs>
        <LinearGradient id={"grad"} x1={"0%"} y1={"100%"} x2={"70%"} y2={"0%"}>
          <Stop
            offset={"0%"}
            stopColor={"rgb(27,66,130)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"49%"}
            stopColor={"rgb(39,76,150)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"60%"}
            stopColor={"rgb(37,57,112)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"75%"}
            stopColor={"rgb(43,48,94)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"100%"}
            stopColor={"rgb(82,1,60)"}
            stopOpacity={opacity || 1}
          />
        </LinearGradient>
      </Defs>
      <Rect width={"100%"} height={"100%"} fill={"url(#grad)"} />
    </Svg>
  );
};

export default GradientBackground;

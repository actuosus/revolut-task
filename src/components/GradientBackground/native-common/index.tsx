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
        <LinearGradient id={"grad"} x1={"0%"} y1={"100%"} x2={"100%"} y2={"0%"}>
          <Stop
            offset={"0%"}
            stopColor={"rgb(37,93,191)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"20%"}
            stopColor={"rgb(39,102,218)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"50%"}
            stopColor={"rgb(59,121,250)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"75%"}
            stopColor={"rgb(46,105,219)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"82%"}
            stopColor={"rgb(59,100,193)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"85%"}
            stopColor={"rgb(60,92,188)"}
            stopOpacity={opacity || 1}
          />
          <Stop
            offset={"92%"}
            stopColor={"rgb(164,28,129)"}
            stopOpacity={opacity || 1}
          />
        </LinearGradient>
      </Defs>
      <Rect width={"100%"} height={"100%"} fill={"url(#grad)"} />
    </Svg>
  );
};

export default GradientBackground;

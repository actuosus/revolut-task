import React from "react";
import RX from "reactxp";
import Defs from "../../../../../components/svg/Defs";
import Mask from "../../../../../components/svg/Mask";
import Polygon from "../../../../../components/svg/Polygon";
import Rect from "../../../../../components/svg/Rect";
import Svg from "../../../../../components/svg/Svg";

const SIZE = 30;

const ClippedBackground = props => {
  const [layout, setLayout] = React.useState({
    width: props.width || 0,
    height: 0
  });
  const handleLayout = (layout: RX.Types.LayoutInfo) => {
    setLayout(layout);
  };

  return (
    <RX.View style={props.style} onLayout={handleLayout}>
      <Svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        }}
      >
        <Defs>
          <Mask id="mask" width="100%" height="100%">
            <Rect width="100%" height="100%" fill="white" />
            <Polygon
              points={`0,0 ${SIZE},0 ${SIZE / 2},${SIZE / 2}`}
              fill="black"
              x={layout.width / 2 - SIZE / 2}
            />
          </Mask>
        </Defs>
        <Rect
          id="rect"
          fill="rgba(0,0,0,0.2)"
          width="100%"
          height="100%"
          mask="url(#mask)"
        />
      </Svg>
      {props.children}
    </RX.View>
  );
};

export default ClippedBackground;

import React from "react";
import * as RX from "reactxp";
import { LayoutInfo } from "reactxp/dist/common/Types";
import { blur } from "../../lib/animated";
import Styles from "../../lib/styles";
import Circle from "../svg/Circle";
import Defs from "../svg/Defs";
import RadialGradient from "../svg/RadialGradient";
import Stop from "../svg/Stop";
import Svg from "../svg/Svg";

const NUMBER_OF_PLANETS = 40;

const MIN_BUBBLE_SIZE = 10;

if (typeof window === "undefined") {
  global.window = {
    innerWidth: 375,
    innerHeight: 600
  };
}

const _styles = {
  item: RX.Styles.createViewStyle({
    position: "absolute",
    minWidth: MIN_BUBBLE_SIZE,
    minHeight: MIN_BUBBLE_SIZE,
    borderRadius: MIN_BUBBLE_SIZE,

    ...RX.Platform.select({
      default: {
        backgroundColor: "rgba(255,255,255,0.01)"
      },
      web: {
        backgroundColor: "rgba(255,255,255,0.8)",
        shadowColor: "white",
        shadowOpacity: 0.5,
        shadowRadius: 4
      }
    })
  })
};

const BubbleCircle = () => {
  return (
    <Svg height={MIN_BUBBLE_SIZE} width={MIN_BUBBLE_SIZE}>
      <Defs>
        <RadialGradient
          id={"grad"}
          cx={MIN_BUBBLE_SIZE / 2}
          cy={MIN_BUBBLE_SIZE / 2}
          rx={MIN_BUBBLE_SIZE / 2}
          ry={MIN_BUBBLE_SIZE / 2}
          fx={MIN_BUBBLE_SIZE / 2}
          fy={MIN_BUBBLE_SIZE / 2}
          gradientUnits={"userSpaceOnUse"}
        >
          <Stop offset={"0"} stopColor={"white"} stopOpacity={"1"} />
          <Stop offset={"0.75"} stopColor={"white"} stopOpacity={"0.9"} />
          <Stop offset={"1"} stopColor={"white"} stopOpacity={"0"} />
        </RadialGradient>
      </Defs>
      <Circle
        cx={MIN_BUBBLE_SIZE / 2}
        cy={MIN_BUBBLE_SIZE / 2}
        r={MIN_BUBBLE_SIZE / 2}
        fill={"url(#grad)"}
      />
    </Svg>
  );
};

interface BubbleProps {
  position: RX.Animated.Value;
  width: number;
  height: number;
}

const Bubble = ({ position, width, height }: BubbleProps) => {
  const [w, h] = [width, height];

  if (!w || !h) {
    return null;
  }

  const animatedTranslateX = React.useMemo(() => {
    const value = position.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.random() * w, Math.random() * w]
    });
    return value;
  }, [w, h]);
  const animatedTranslateY = React.useMemo(() => {
    const value = position.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.random() * h, Math.random() * h]
    });
    return value;
  }, [w, h]);
  const animatedScale = React.useMemo(() => {
    const value = position.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.random() * 5, Math.random() * 5]
    });
    return value;
  }, []);
  const animatedOpacity = React.useMemo(() => {
    const ratio = RX.Platform.select({ web: 3, default: 8 }) || 1;
    const value = position.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.random() / ratio, Math.random() / ratio]
    });
    return value;
  }, []);

  const animatedBlurFilter = React.useMemo(() => {
    const value = blur(position, {
      inputRange: [0, 1],
      outputRange: [
        `blur(${Math.round(Math.random() * 10)}px)`,
        `blur(${Math.random()}px)`
      ]
    });
    return value;
  }, []);

  return (
    <RX.Animated.View
      style={[
        _styles.item,
        RX.Platform.select({
          web: { shadowRadius: Math.round(Math.random() * 10) }
        }),
        RX.Styles.createAnimatedViewStyle({
          transform: [
            {
              translateX: animatedTranslateX
            },
            {
              translateY: animatedTranslateY
            },
            {
              scale: animatedScale
            }
          ],
          opacity: animatedOpacity,

          ...RX.Platform.select({
            web: {
              filter: animatedBlurFilter
            }
          })
        })
      ]}
    >
      {RX.Platform.select({ default: <BubbleCircle />, web: null })}
    </RX.Animated.View>
  );
};

interface FloatingBubblesProps {
  count?: number;
}

const FloatingBubbles = ({ count }: FloatingBubblesProps) => {
  const amount = count || NUMBER_OF_PLANETS;
  const position = React.useMemo(() => {
    const value = RX.Animated.createValue(0);
    return value;
  }, []);
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });

  const animation = () => {
    const duration = 50000;
    const anim = RX.Animated.timing(position, {
      toValue: Math.random(),
      duration: duration,
      easing: RX.Animated.Easing.Linear(),
      useNativeDriver: true
    });

    anim.start(result => {
      if (result.finished) {
        setTimeout(() => {
          animation();
        }, 350);
      }
    });

    return anim;
  };

  React.useEffect(() => {
    if (layout.width && layout.height) {
      const anim = animation();
      return () => {
        anim.stop();
      };
    }
    return;
  }, [layout]);

  const opacity = React.useMemo(() => {
    return RX.Animated.createValue(0);
  }, []);

  React.useEffect(() => {
    const opacityAnimation = RX.Animated.timing(opacity, {
      toValue: 1,
      duration: 5000
    });
    opacityAnimation.start();

    return () => {
      opacityAnimation.stop();
    };
  }, []);

  const handleLayout = (layout: LayoutInfo) => setLayout(layout);

  return (
    <RX.Animated.View
      ignorePointerEvents
      blockPointerEvents
      // @ts-ignore Web styles
      style={[
        Styles.absoluteFill,
        {
          opacity: opacity
        },
        {
          ...RX.Platform.select({
            web: {
              transform: "translate3d(0,0,0)"
            }
          })
        }
      ]}
      onLayout={handleLayout}
    >
      {Array(amount)
        .fill(null)
        .map((_, i) => {
          return <Bubble key={`bubble-${i}`} position={position} {...layout} />;
        })}
    </RX.Animated.View>
  );
};

export default FloatingBubbles;

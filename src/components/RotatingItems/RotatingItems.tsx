import React from "react";
import * as RX from "reactxp";
import { LayoutInfo, SyntheticEvent } from "reactxp/dist/common/Types";
import Mat3 from "../../lib/utils/3d/Mat3";
import Vertex from "../../lib/utils/3d/Vertex";
import { usePrevious } from "../../lib/utils/hooks";

const MIN_FAR_OPACITY = 0.3;
const MIN_FAR_SCALE = 0.05;

const _styles = {
  root: RX.Platform.select({
    web: {
      transform: [{ translateX: 0 }, { translateY: 0 }, { translateZ: 0 }]
    }
  })
};

type RotatingItemsProps = {
  items: Array<any>;
  selected: number;
  style?: RX.Types.ViewStyle;
  shift?: number;
  renderItem: (item: any) => React.ReactNode;
  onItemPress?: (index: number, item: any, event: SyntheticEvent) => void;
  onRotationEnd?: (index: number) => void;
};

const window = RX.UserInterface.measureWindow();

const RotatingItems = (props: RotatingItemsProps) => {
  const { items, selected, style } = props;
  const len = items.length;
  const angle = (2 * Math.PI) / len;

  const [width, setWidth] = React.useState(window.width);
  const [height, setHeight] = React.useState(1);
  const handleLayout = (layout: LayoutInfo) => {
    setWidth(layout.width);
    setHeight(layout.height);
  };
  const radius = Math.max(width, height) / 1.5;

  const [stepAngle, setStepAngle] = React.useState(selected * angle);
  const [lastStepAngle, setLastStepAngle] = React.useState(0);
  const animation = React.useRef<{ stop: () => void }>();

  const start = (toValue: number, done?: (end?: number) => void) => {
    let stop = false;

    const from = stepAngle;
    const to = toValue;
    const duration = 500;
    const easing = RX.Animated.Easing.InOut().function;

    let start: number, end: number;

    const update = (now: number) => {
      if (stop) {
        done && done(end);
        return;
      }
      if (now - start >= duration) {
        stop = true;
      }
      const p = (now - start) / duration;
      const val = easing(p);
      const newValue = from + (to - from) * val;
      setStepAngle(newValue);
      setLastStepAngle(newValue);
      requestAnimationFrame(update);
    };

    const animate = (time: number) => {
      start = time;
      end = start + duration;
      update(time);
    };

    requestAnimationFrame(animate);

    return {
      stop: () => {
        stop = true;
      }
    };
  };

  const stop = () => {
    if (animation.current) {
      animation.current.stop();
    }
  };

  React.useEffect(() => {
    if (props.shift) {
      setStepAngle((Math.PI / 360) * props.shift + lastStepAngle);
    }
  }, [props.shift]);

  const prevSelected = usePrevious(selected);
  React.useEffect(() => {
    stop();

    let toValue = selected * angle;
    const firstIsNext = prevSelected === items.length - 1 && selected === 0;
    const lastIsNext = prevSelected === 0 && selected === items.length - 1;

    if (prevSelected) {
      if (firstIsNext) {
        toValue = (prevSelected + 1) * angle;
      }
      if (lastIsNext) {
        toValue = (prevSelected - 1) * angle;
      }
    }

    animation.current = start(toValue, () => {
      if (firstIsNext || lastIsNext) {
        setStepAngle(selected * angle);
      }

      props.onRotationEnd && props.onRotationEnd(selected);
    });

    return () => {
      stop();
    };
  }, [selected]);

  const handleItemPress = (index: number, item: any) => (
    event: SyntheticEvent
  ) => {
    props.onItemPress && props.onItemPress(index, item, event);
  };

  return (
    <RX.View style={[style, _styles.root]} onLayout={handleLayout}>
      {items.map((_, i) => {
        const ratio = 2;
        // Inverted direction for upright rotation
        const current = (len - i) * angle + stepAngle + Math.PI / 2;

        const x = Math.cos(current);
        const y = Math.sin(current);

        const vertex = new Vertex(x, y, 0);
        const transform = Mat3.rotationX(Math.PI / 4);
        const v = Vertex.transform(vertex, transform);

        const translateX = v.x * radius;
        const translateY = v.y * radius;
        const scale = Math.max(v.z, MIN_FAR_SCALE) * ratio;

        const opacity = Math.max(v.z, MIN_FAR_OPACITY) * 1.2;

        const style = RX.Styles.createViewStyle(
          {
            position: "absolute",
            overflow: "visible",
            transform: [
              { translateX },
              { translateY },
              // Emulate field of view with scaling
              { scale }
            ],
            // Emulate field of view with opacity
            opacity
          },
          false
        );

        return (
          <RX.Animated.View
            style={style}
            key={`item-${i}`}
            onPress={handleItemPress(i, _)}
          >
            {props.renderItem(_)}
          </RX.Animated.View>
        );
      })}
    </RX.View>
  );
};

export default RotatingItems;

import React, { ReactElement } from "react";
import * as RX from "reactxp";
import { LayoutInfo } from "reactxp/dist/common/Types";
import { usePrevious } from "../../lib/utils/hooks";
import Pagination from "../Pagination";

type SliderProps = {
  children: ReactElement[];
  loop?: boolean;
  index?: number;
  onIndexChanged?: (index: number) => void;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
};

const Slider = (props: SliderProps) => {
  const { children } = props;

  const len = children.length;

  const [selected, setSelected] = React.useState(props.index || 0);
  const prevSelected = usePrevious(selected);
  const [width, setWidth] = React.useState(
    RX.UserInterface.measureWindow().width
  );
  const scrollView = React.useRef<RX.ScrollView>(null);
  const scrollTimeout = React.useRef<NodeJS.Timeout>();
  const [offset, setOffset] = React.useState(0);

  const scrollBy = (index: number, animated = true) => {
    if (scrollView.current) {
      const x = index * width;
      scrollView.current.setScrollLeft(x, animated);
      setOffset(x);
    }
  };
  const updateIndex = (currentOffset: number) => {
    const step = width;
    const diff = currentOffset - offset;

    if (!diff) {
      return;
    }

    // @ts-ignore Integer value from maybe float
    let index = parseInt(selected + Math.round(diff / step));

    if (props.loop) {
      if (index <= -1) {
        index = len - 1;
      } else if (index >= len) {
        index = 0;
      }
    }

    setOffset(currentOffset);
    setSelected(index);
    scrollBy(index);
  };

  // A hack to not to show scrollbars on web for horizontal slider
  if (process.browser) {
    React.useEffect(() => {
      RX.UserInterface.useCustomScrollbars(true);
      return () => {
        RX.UserInterface.useCustomScrollbars(false);
      };
    }, []);
  }

  React.useEffect(() => {
    if (width) {
      scrollBy(selected, typeof prevSelected !== "undefined");
    }

    if (props.onIndexChanged) {
      props.onIndexChanged(selected);
    }
  }, [selected, width]);

  const handleLayout = (layout: LayoutInfo) => {
    setWidth(layout.width);
  };

  const handleScroll = (_: number, scrollLeft: number) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      updateIndex(scrollLeft);
    }, 100);
  };

  const handlePanHorizontal = (gestureState: RX.Types.PanGestureState) => {
    if (gestureState.isComplete) {
      const diff = gestureState.initialClientX - gestureState.clientX;
      if (diff < 0) {
        setSelected(selected - 1 >= 0 ? selected - 1 : len - 1);
      }
      if (diff > 0) {
        setSelected(selected + 1 < len ? selected + 1 : 0);
      }
    }
  };

  const handlePaginationItemPress = (index: number) => {
    setSelected(index);
  };

  return (
    <RX.GestureView onPanHorizontal={handlePanHorizontal} style={props.style}>
      <RX.ScrollView
        ref={scrollView}
        horizontal
        onScroll={handleScroll}
        style={{
          flex: 1,
          flexDirection: "row",
          ...RX.Platform.select({
            web: {
              display: "flex"
            }
          })
        }}
        onLayout={handleLayout}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </RX.ScrollView>
      <Pagination
        number={len}
        value={selected}
        onItemPress={handlePaginationItemPress}
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          justifyContent: "center",
          ...RX.Platform.select({
            web: {
              zIndex: 2
            }
          })
        }}
      />
    </RX.GestureView>
  );
};

export default Slider;

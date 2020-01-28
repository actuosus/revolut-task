import React from "react";
import * as RX from "reactxp";
import { LayoutInfo } from "reactxp/dist/common/Types";

const ICON_SIZE = 7;

const _styles = {
  root: RX.Styles.createViewStyle({
    flexDirection: "row"
  }),
  dotWrapper: RX.Styles.createViewStyle({
    padding: ICON_SIZE / 1.5,
    ...RX.Platform.select({
      web: {
        userSelect: "none",
        WebkitUserSelect: "none"
      }
    })
  }),
  dot: RX.Styles.createViewStyle({
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: ICON_SIZE / 2
  }),
  current: RX.Styles.createViewStyle({
    backgroundColor: "white"
  }),
  active: RX.Styles.createViewStyle({
    shadowColor: "white",
    shadowOpacity: 0.5,
    shadowRadius: 8
  })
};

interface PaginationProps {
  number: number;
  value: number;
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
  onItemPress?: (value: number) => void;
  onLayout?: (layout: LayoutInfo) => void;
}

const Pagination = (props: PaginationProps) => {
  const handleItemPress = (index: number) => () => {
    props.onItemPress && props.onItemPress(index);
  };

  const [active, setActive] = React.useState(-1);

  return (
    <RX.View
      style={RX.Styles.combine([_styles.root, props.style])}
      onLayout={props.onLayout}
    >
      {Array(props.number)
        .fill(null)
        .map((_, i) => (
          <RX.Button
            key={`dot-${i}`}
            style={_styles.dotWrapper}
            onPress={handleItemPress(i)}
            onPressIn={() => setActive(i)}
            onPressOut={() => setActive(-1)}
            tabIndex={i + 1}
            onFocus={() => {
              setActive(i);
              handleItemPress(i)();
            }}
          >
            <RX.View
              style={RX.Styles.combine(_styles.dot, [
                props.value === i ? _styles.current : {},
                active === i ? _styles.active : {}
              ])}
            />
          </RX.Button>
        ))}
    </RX.View>
  );
};

export default Pagination;

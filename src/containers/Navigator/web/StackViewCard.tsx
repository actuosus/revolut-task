import React from "react";
import { NavigationScene } from "react-navigation";
import * as RX from "reactxp";
import Screen from "./Screen";

const _styles = {
  card: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: "#fff"
  }),
  overlay: RX.Styles.createViewStyle({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000"
  }),
  shadow: RX.Styles.createViewStyle({
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    position: "absolute",
    backgroundColor: "#fff",
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 5,
    shadowColor: "#000"
  }),
  transparent: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: "transparent"
  })
};

interface StackViewCardProps {
  pointerEvents?: "box-none" | "none" | "box-only" | "auto";
  position: RX.Animated.Value;
  style: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
  animatedStyle: {
    shadowOpacity?: RX.Animated.Value;
    overlayOpacity?: RX.Animated.Value;
  };
  transparent: boolean;
  scene: NavigationScene;
}

class StackViewCard extends RX.Component<StackViewCardProps> {
  render() {
    const {
      children,
      pointerEvents,
      style,
      position,
      transparent,
      scene: { index, isActive }
    } = this.props;

    const active =
      transparent || isActive
        ? 1
        : position.interpolate({
            inputRange: [index, index + 1],
            outputRange: [1, 0]
          });

    const animatedStyle = this.props.animatedStyle || {};

    const {
      shadowOpacity,
      overlayOpacity,
      ...containerAnimatedStyle
    } = animatedStyle;

    // @ts-ignore
    const { backgroundColor, ...screenStyle } = RX.Styles.combine(style);

    return (
      <Screen
        style={[
          { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 },
          RX.Styles.createAnimatedViewStyle(containerAnimatedStyle),
          screenStyle
        ]}
        active={!!active}
      >
        {!transparent && shadowOpacity ? (
          <RX.Animated.View
            // @ts-ignore
            style={[_styles.shadow, { shadowOpacity }]}
            blockPointerEvents={pointerEvents === "none"}
          />
        ) : null}
        <RX.Animated.View
          // @ts-ignore
          style={[
            transparent ? _styles.transparent : _styles.card,
            backgroundColor && backgroundColor !== "transparent"
              ? { backgroundColor }
              : null
          ]}
        >
          {children}
        </RX.Animated.View>
        {overlayOpacity ? (
          <RX.Animated.View
            style={[_styles.overlay, { opacity: overlayOpacity }]}
            blockPointerEvents={pointerEvents === "none"}
          />
        ) : null}
      </Screen>
    );
  }
}

export default StackViewCard;

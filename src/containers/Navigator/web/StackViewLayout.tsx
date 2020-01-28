import { SceneView } from "@react-navigation/core";
import React from "react";
import {
  HeaderMode,
  NavigationDescriptor,
  NavigationOrientationInjectedProps,
  NavigationScene,
  NavigationTransitionProps,
  ScreenProps,
  TransitionConfig,
  TransitionConfigurer
} from "react-navigation";
import * as RX from "reactxp";
import I18nManager from "../../../lib/i18nManager";
import StackViewCard from "./StackViewCard";
import StackViewTransitionConfigs from "./StackViewTransitionConfigs";

const IS_IPHONE_X = false;

const Platform = {
  isPad: false
};

const getDefaultHeaderHeight = (isLandscape: boolean) => {
  if (RX.Platform.getType() === "ios") {
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else if (IS_IPHONE_X) {
      return 88;
    } else {
      return 64;
    }
  } else if (RX.Platform.getType() === "android") {
    return 56;
  } else {
    return 64;
  }
};

const _styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    flexDirection: "column-reverse"
  }),
  scenes: RX.Styles.createViewStyle({
    flex: 1
  }),
  floatingHeader: RX.Styles.createViewStyle({
    position: "absolute",
    left: 0,
    top: 0,
    right: 0
  })
};

interface LayoutProps extends NavigationOrientationInjectedProps {
  transitionProps: NavigationTransitionProps;
  lastTransitionProps?: NavigationTransitionProps;
  descriptors?: { [key: string]: NavigationDescriptor };
  headerMode: HeaderMode;
  screenProps: ScreenProps;
  shadowEnabled?: boolean;
  transitionConfig: TransitionConfigurer;
  cardStyle: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
  cardOverlayEnabled?: boolean;
  transparentCard: boolean;
  mode?: "card" | "modal";
  isLayout: boolean;
}

interface LayoutState {
  floatingHeaderHeight: number;
}

class StackViewLayout extends RX.Component<LayoutProps, LayoutState> {
  panGestureRef: React.RefObject<RX.GestureView>;
  gestureX: RX.Animated.Value;
  gestureY: RX.Animated.Value;
  positionSwitch: RX.Animated.Value;
  position: RX.Animated.Value;
  _prevProps?: Readonly<LayoutProps> & Readonly<{ children?: React.ReactNode }>;
  gesturePosition: undefined;
  _transitionConfig?: TransitionConfig;

  constructor(props: LayoutProps) {
    super(props);
    this.panGestureRef = React.createRef();
    this.gestureX = new RX.Animated.Value(0);
    this.gestureY = new RX.Animated.Value(0);
    this.positionSwitch = new RX.Animated.Value(1);
    this.position = new RX.Animated.Value(0);

    this.state = {
      floatingHeaderHeight: getDefaultHeaderHeight(props.isLandscape)
    };
  }

  _getHeaderMode() {
    if (this.props.headerMode) {
      return this.props.headerMode;
    }
    if (RX.Platform.getType() !== "ios" || this.props.mode === "modal") {
      return "screen";
    }
    return "float";
  }

  _renderInnerScene(scene: NavigationScene) {
    const { navigation, getComponent } = scene.descriptor;
    const SceneComponent = getComponent();
    const { screenProps } = this.props;
    const headerMode = this._getHeaderMode();

    if (headerMode === "screen") {
      return (
        <RX.View style={{ flex: 1 }}>
          <RX.View style={{ flex: 1 }}>
            <SceneView
              screenProps={screenProps}
              navigation={navigation}
              component={SceneComponent}
            />
          </RX.View>
        </RX.View>
      );
    }
    return (
      <SceneView
        screenProps={screenProps}
        navigation={navigation}
        component={SceneComponent}
      />
    );
  }

  _prepareTransitionConfig() {
    // @ts-ignore React Native Animated Easing to RX Animated easing problem
    this._transitionConfig = StackViewTransitionConfigs.getTransitionConfig(
      this.props.transitionConfig,
      {
        ...this.props.transitionProps,
        position: this.position
      },
      this.props.lastTransitionProps || this.props.transitionProps,
      this._isModal()
    );
  }

  _preparePosition() {
    if (this.gesturePosition) {
      this.position = this.props.transitionProps.position;
    } else {
      this.position = this.props.transitionProps.position;
    }
  }

  _renderCard = (scene: NavigationScene) => {
    const {
      transitionProps,
      shadowEnabled,
      cardOverlayEnabled,
      transparentCard,
      cardStyle
    } = this.props;

    const { screenInterpolator } = this._transitionConfig || {};
    const style =
      screenInterpolator &&
      screenInterpolator({
        ...transitionProps,
        // @ts-ignore
        shadowEnabled,
        cardOverlayEnabled,
        position: this.position,
        scene
      });

    const { options } = scene.descriptor;
    const hasHeader = options.header !== null;
    const headerMode = this._getHeaderMode();
    let paddingTopStyle;
    if (hasHeader && headerMode === "float" && !options.headerTransparent) {
      paddingTopStyle = { paddingTop: this.state.floatingHeaderHeight };
    }

    return (
      <StackViewCard
        {...transitionProps}
        key={`card_${scene.key}`}
        position={this.position}
        animatedStyle={style}
        style={RX.Styles.combine([paddingTopStyle, cardStyle])}
        transparent={transparentCard}
        scene={scene}
      >
        {this._renderInnerScene(scene)}
      </StackViewCard>
    );
  };

  _prepareAnimated() {
    if (this.props === this._prevProps) {
      return;
    }
    this._prevProps = this.props;

    this._prepareGesture();
    this._preparePosition();
    this._prepareTransitionConfig();
  }

  _isGestureEnabled() {
    const gesturesEnabled = this.props.transitionProps.scene.descriptor.options
      .gesturesEnabled;
    return typeof gesturesEnabled === "boolean"
      ? gesturesEnabled
      : RX.Platform.getType() === "ios";
  }

  _maybeCancelGesture() {
    this.positionSwitch.setValue(1);
  }

  // This only currently applies to the horizontal gesture!
  _isMotionInverted() {
    const {
      transitionProps: { scene }
    } = this.props;
    const { options } = scene.descriptor;
    const { gestureDirection } = options;

    if (this._isModal()) {
      return gestureDirection === "inverted";
    } else {
      return typeof gestureDirection === "string"
        ? gestureDirection === "inverted"
        : I18nManager.isRTL;
    }
  }

  _prepareGestureHorizontal() {
    this.gesturePosition = undefined;
  }

  _prepareGestureVertical() {
    this.gesturePosition = undefined;
  }

  _isModal() {
    return this.props.mode === "modal";
  }

  _isMotionVertical() {
    return this._isModal();
  }

  _prepareGesture() {
    if (!this._isGestureEnabled()) {
      if (this.positionSwitch._getOutputValue() !== 1) {
        this.positionSwitch.setValue(1);
      }
      this.gesturePosition = undefined;
      return;
    }

    if (
      this.props.transitionProps.layout.width._getOutputValue() === 0 ||
      this.props.transitionProps.layout.height._getOutputValue() === 0
    ) {
      return;
    }

    if (this._isMotionVertical()) {
      this._prepareGestureVertical();
    } else {
      this._prepareGestureHorizontal();
    }
  }

  render() {
    this._prepareAnimated();

    const { transitionProps } = this.props;
    const { scenes } = transitionProps;

    return (
      <RX.GestureView ref={this.panGestureRef} style={{ flex: 1 }}>
        <RX.Animated.View
          // @ts-ignore ReactXP and React Native style types concat
          style={[_styles.container, this._transitionConfig.containerStyle]}
        >
          {scenes.map(this._renderCard)}
        </RX.Animated.View>
      </RX.GestureView>
    );
  }
}

export default StackViewLayout;

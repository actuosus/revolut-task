import { StackActions } from "@react-navigation/core";
import React from "react";
import {
  NavigationDescriptor,
  NavigationParams,
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationStackViewConfig,
  NavigationState,
  NavigationTransitionProps
} from "react-navigation";
import * as RX from "reactxp";
import StackViewLayout from "./StackViewLayout";
import StackViewTransitionConfigs from "./StackViewTransitionConfigs";
import Transitioner from "./Transitioner";

const USE_NATIVE_DRIVER = true;

const DefaultNavigationConfig = {
  mode: "card",
  cardShadowEnabled: true,
  cardOverlayEnabled: false
};

interface StackViewProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  screenProps: NavigationScreenProps;
  descriptors: Record<string, NavigationDescriptor>;
  navigationConfig: NavigationStackViewConfig;
}

class StackView extends RX.Component<StackViewProps> {
  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.isTransitioning) {
      navigation.dispatch(
        StackActions.completeTransition({
          key: navigation.state.key
        })
      );
    }
  }

  _configureTransition = (
    transitionProps: NavigationTransitionProps,
    prevTransitionProps: NavigationTransitionProps
  ) => {
    return {
      ...StackViewTransitionConfigs.getTransitionConfig(
        this.props.navigationConfig.transitionConfig,
        transitionProps,
        prevTransitionProps,
        this.props.navigationConfig.mode === "modal"
      ).transitionSpec,
      useNativeDriver: USE_NATIVE_DRIVER
    };
  };

  _getShadowEnabled = () => {
    const { navigationConfig } = this.props;
    return navigationConfig &&
      Object.prototype.hasOwnProperty.call(
        navigationConfig,
        "cardShadowEnabled"
      )
      ? navigationConfig.cardShadowEnabled
      : DefaultNavigationConfig.cardShadowEnabled;
  };

  _getCardOverlayEnabled = () => {
    const { navigationConfig } = this.props;
    return navigationConfig &&
      Object.prototype.hasOwnProperty.call(
        navigationConfig,
        "cardOverlayEnabled"
      )
      ? navigationConfig.cardOverlayEnabled
      : DefaultNavigationConfig.cardOverlayEnabled;
  };

  _render = (
    transitionProps: NavigationTransitionProps,
    lastTransitionProps?: NavigationTransitionProps
  ) => {
    const { screenProps, navigationConfig } = this.props;
    return (
      // @ts-ignore
      <StackViewLayout
        {...navigationConfig}
        shadowEnabled={this._getShadowEnabled()}
        cardOverlayEnabled={this._getCardOverlayEnabled()}
        screenProps={screenProps}
        descriptors={this.props.descriptors}
        transitionProps={transitionProps}
        lastTransitionProps={lastTransitionProps}
      >
        {this.props.children}
      </StackViewLayout>
    );
  };

  render() {
    return (
      <Transitioner
        render={this._render}
        // @ts-ignore React Native Animated Easing vs RX Animated easing
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        screenProps={this.props.screenProps}
        descriptors={this.props.descriptors}
      />
    );
  }
}

export default StackView;

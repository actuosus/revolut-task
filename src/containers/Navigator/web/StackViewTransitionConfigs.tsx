import {
  NavigationTransitionProps,
  TransitionConfigurer
} from "react-navigation";
import * as RX from "reactxp";
import StyleInterpolator from "./StackViewStyleInterpolator";

// This is an approximation of the IOS spring animation using a derived bezier curve
const IOSTransitionSpec = {
  duration: 5000,
  easing: RX.Animated.Easing.CubicBezier(0.2833, 0.99, 0.31833, 0.99),
  timing: RX.Animated.timing
};

// Standard iOS navigation transition
const SlideFromRightIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: StyleInterpolator.forHorizontal,
  containerStyle: {
    backgroundColor: "#eee"
  }
};

// Standard iOS navigation transition for modals
const ModalSlideFromBottomIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: StyleInterpolator.forVertical,
  containerStyle: {
    backgroundColor: "#eee"
  }
};

// Standard Android navigation transition when opening an Activity
const FadeInFromBottomAndroid = {
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
  transitionSpec: {
    duration: 350,
    easing: RX.Animated.Easing.Out(), // decelerate
    timing: RX.Animated.timing
  },
  screenInterpolator: StyleInterpolator.forFadeFromBottomAndroid
};

// Standard Android navigation transition when closing an Activity
const FadeOutToBottomAndroid = {
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
  transitionSpec: {
    duration: 150,
    easing: RX.Animated.Easing.In(), // accelerate
    timing: RX.Animated.timing
  },
  screenInterpolator: StyleInterpolator.forFadeToBottomAndroid
};

const NoAnimation = {
  transitionSpec: {
    duration: 0,
    timing: RX.Animated.timing
  },
  screenInterpolator: StyleInterpolator.forNoAnimation,
  containerStyle: {
    backgroundColor: "#eee"
  }
};

function defaultTransitionConfig(
  transitionProps: NavigationTransitionProps,
  prevTransitionProps: NavigationTransitionProps | undefined,
  isModal: boolean
) {
  const type = RX.Platform.getType();
  if (type !== "ios") {
    if (type === "web") {
      return SlideFromRightIOS;
    }
    // Use the default Android animation no matter if the screen is a modal.
    // Android doesn't have full-screen modals like iOS does, it has dialogs.
    if (
      prevTransitionProps &&
      transitionProps.index < prevTransitionProps.index
    ) {
      // Navigating back to the previous screen
      return FadeOutToBottomAndroid;
    }
    return FadeInFromBottomAndroid;
  }

  // iOS and other platforms
  if (isModal) {
    return ModalSlideFromBottomIOS;
  }

  return SlideFromRightIOS;
}

function getTransitionConfig(
  transitionConfigurer: TransitionConfigurer | undefined,
  transitionProps: NavigationTransitionProps,
  prevTransitionProps: NavigationTransitionProps,
  isModal: boolean
) {
  const defaultConfig = defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
  if (transitionConfigurer) {
    return {
      ...defaultConfig,
      ...transitionConfigurer(transitionProps, prevTransitionProps, isModal)
    };
  }
  return defaultConfig;
}

export default {
  defaultTransitionConfig,
  getTransitionConfig,
  SlideFromRightIOS,
  ModalSlideFromBottomIOS,
  FadeInFromBottomAndroid,
  FadeOutToBottomAndroid,
  NoAnimation
};

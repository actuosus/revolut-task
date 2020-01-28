// import { I18nManager } from 'react-native';
import { NavigationTransitionProps } from "react-navigation";
import I18nManager from "../../../lib/i18nManager";

function getSceneIndicesForInterpolationInputRange(
  props: NavigationTransitionProps
) {
  const { scene, scenes } = props;
  const index = scene.index;
  const lastSceneIndexInScenes = scenes.length - 1;
  const isBack = !scenes[lastSceneIndexInScenes].isActive;

  if (isBack) {
    const currentSceneIndexInScenes = scenes.findIndex(item => item === scene);
    const targetSceneIndexInScenes = scenes.findIndex(item => item.isActive);
    const targetSceneIndex = scenes[targetSceneIndexInScenes].index;
    const lastSceneIndex = scenes[lastSceneIndexInScenes].index;

    if (
      index !== targetSceneIndex &&
      currentSceneIndexInScenes === lastSceneIndexInScenes
    ) {
      return {
        first: Math.min(targetSceneIndex, index - 1),
        last: index + 1
      };
    } else if (
      index === targetSceneIndex &&
      currentSceneIndexInScenes === targetSceneIndexInScenes
    ) {
      return {
        first: index - 1,
        last: Math.max(lastSceneIndex, index + 1)
      };
    } else if (
      index === targetSceneIndex ||
      currentSceneIndexInScenes > targetSceneIndexInScenes
    ) {
      return null;
    } else {
      return { first: index - 1, last: index + 1 };
    }
  } else {
    return { first: index - 1, last: index + 1 };
  }
}

/**
 * Utility that builds the style for the card in the cards stack.
 *
 *     +------------+
 *   +-+            |
 * +-+ |            |
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props: NavigationTransitionProps) {
  const { navigation, scene } = props;

  const focused = navigation.state.index === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    transform: [{ translateX: translate }, { translateY: translate }]
  };
}

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontal(
  props: NavigationTransitionProps & {
    shadowEnabled?: boolean;
    cardOverlayEnabled?: boolean;
  }
) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: [first, index],
    outputRange: I18nManager.isRTL ? [0, -width] : [width, 0],
    extrapolate: "clamp"
  });

  const shadowOpacity = props.shadowEnabled
    ? position.interpolate({
        inputRange: [first, index],
        outputRange: [0, 0.7]
      })
    : null;

  const overlayOpacity = props.cardOverlayEnabled
    ? position.interpolate({
        inputRange: [index, last],
        outputRange: [0, 0.07]
      })
    : null;

  return {
    transform: [{ translateX }],
    overlayOpacity,
    shadowOpacity
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(props: NavigationTransitionProps) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const height = layout.initHeight;
  const translateY = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [height, 0, 0],
    extrapolate: "clamp"
  });

  return {
    transform: [{ translateY }]
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
function forFadeFromBottomAndroid(props: NavigationTransitionProps) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, first + 0.5, first + 0.9, index, last - 1e-5, last],
    outputRange: [0, 0.25, 0.7, 1, 1, 0],
    extrapolate: "clamp"
  });

  const height = layout.initHeight;
  const maxTranslation = height * 0.08;
  const translateY = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [maxTranslation, 0, 0],
    extrapolate: "clamp"
  });

  return {
    opacity,
    transform: [{ translateY }]
  };
}

function forFadeToBottomAndroid(props: NavigationTransitionProps) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, index, last];

  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
    extrapolate: "clamp"
  });

  const height = layout.initHeight;
  const maxTranslation = height * 0.08;

  const translateY = position.interpolate({
    inputRange,
    outputRange: [maxTranslation, 0, 0],
    extrapolate: "clamp"
  });

  return {
    opacity,
    transform: [{ translateY }]
  };
}

/**
 *  fadeIn and fadeOut
 */
function forFade(props: NavigationTransitionProps) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, index],
    outputRange: [0, 1],
    extrapolate: "clamp"
  });

  return {
    opacity
  };
}

function forNoAnimation() {
  return {};
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  forFadeToBottomAndroid,
  forFade,
  forNoAnimation
};

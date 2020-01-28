import invariant from "invariant";
import React, { Context } from "react";
import {
  NavigationScene,
  NavigationScreenOptions,
  NavigationScreenProps,
  NavigationTransitionProps,
  TransitionerProps
} from "react-navigation";
import NavigationScenesReducer from "react-navigation/node_modules/react-navigation-stack/dist/views/ScenesReducer";
import * as RX from "reactxp";
import { LayoutInfo } from "reactxp/dist/common/Types";

const DefaultTransitionSpec = {
  duration: 250,
  easing: RX.Animated.Easing.InOut(),
  timing: RX.Animated.timing
};

function isSceneActive(scene: NavigationScene) {
  return scene.isActive;
}

function buildTransitionProps(
  props: TransitionerProps & { options: NavigationScreenOptions },
  state: State
): NavigationTransitionProps & { options: NavigationScreenOptions } {
  const { navigation, options } = props;

  const { layout, position, scenes, progress } = state;

  const scene = scenes.find(isSceneActive) || scenes[0];

  invariant(scene, "Could not find active scene");

  return {
    layout,
    navigation,
    position,
    progress,
    scenes,
    scene,
    options,
    index: scene.index
  };
}

function isSceneNotStale(scene: NavigationScene) {
  return !scene.isStale;
}

function filterStale(scenes: NavigationScene[]) {
  const filtered = scenes.filter(isSceneNotStale);
  if (filtered.length === scenes.length) {
    return scenes;
  }
  return filtered;
}

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1
  })
};

type Props = TransitionerProps & {
  screenProps: NavigationScreenProps;
  options: NavigationScreenOptions;
};

interface State {
  layout: {
    height: RX.Animated.Value;
    initHeight: number;
    initWidth: number;
    isMeasured: boolean;
    width: RX.Animated.Value;
  };
  progress: RX.Animated.Value;
  position: RX.Animated.Value;
  scenes: NavigationScene[];
  nextScenes?: NavigationScene[];
}

class Transitioner extends RX.Component<Props, State> {
  private _isMounted: boolean;
  _isTransitionRunning: boolean;
  _transitionProps: NavigationTransitionProps;
  _prevTransitionProps?: NavigationTransitionProps;
  _positionListener: {
    setValue(valueObject: RX.Animated.Value, newValue: number | string): void;
    startTransition(
      valueObject: RX.Animated.Value,
      from: number | string,
      toValue: number | string,
      duration: number,
      easing: string,
      delay: number,
      onEnd: RX.Types.Animated.EndCallback
    ): void;
    stopTransition(valueObject: RX.Animated.Value): number | string | undefined;
  };
  _queuedTransition: { prevProps: Props } | null;

  constructor(props: Props, context: Context<{}>) {
    super(props, context);

    const layout = {
      height: new RX.Animated.Value(0),
      initHeight: 0,
      initWidth: 0,
      isMeasured: false,
      width: new RX.Animated.Value(0)
    };

    const position = new RX.Animated.Value(this.props.navigation.state.index);
    this._positionListener = {
      setValue: () => {},
      startTransition: () => {},
      stopTransition: () => 0
    };
    position._addListener(this._positionListener);

    const progress = new RX.Animated.Value(0);
    this.state = {
      layout,
      position,
      progress,
      scenes: NavigationScenesReducer(
        [],
        this.props.navigation.state,
        null,
        this.props.descriptors
      )
    };
    this._prevTransitionProps = undefined;
    this._transitionProps = buildTransitionProps(props, this.state);

    this._isMounted = false;
    this._isTransitionRunning = false;
    this._queuedTransition = null;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._positionListener &&
      this.state.position._removeListener(this._positionListener);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this._isTransitionRunning) {
      if (!this._queuedTransition) {
        this._queuedTransition = { prevProps: this.props };
      }
      return;
    }

    this._startTransition(this.props, nextProps);
  }

  _computeScenes = (props: Props, nextProps: Props) => {
    let nextScenes = NavigationScenesReducer(
      this.state.scenes,
      nextProps.navigation.state,
      props.navigation.state,
      nextProps.descriptors
    );

    if (!nextProps.navigation.state.isTransitioning) {
      nextScenes = filterStale(nextScenes);
    }

    if (nextProps.screenProps !== this.props.screenProps) {
      this.setState({ nextScenes });
    }

    if (nextScenes === this.state.scenes) {
      return;
    }

    return nextScenes;
  };

  private _startTransition(props: Props, nextProps: Props) {
    const indexHasChanged =
      props.navigation.state.index !== nextProps.navigation.state.index;
    const nextScenes = this._computeScenes(props, nextProps);

    if (!nextScenes) {
      this._prevTransitionProps = this._transitionProps;

      this.state.position.setValue(props.navigation.state.index);
      this._onTransitionEnd();

      return;
    }

    const nextState = {
      ...this.state,
      scenes: nextScenes
    };

    const { position } = nextState;
    const toValue = nextProps.navigation.state.index;
    this._prevTransitionProps = this._transitionProps;
    this._transitionProps = buildTransitionProps(nextProps, nextState);
    const { isTransitioning } = this._transitionProps.navigation.state;

    if (!isTransitioning || !indexHasChanged) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.setState(nextState, async () => {
        if (nextProps.onTransitionStart) {
          const result = nextProps.onTransitionStart(
            this._transitionProps,
            this._prevTransitionProps
          );
          if (result instanceof Promise) {
            // why do we bother awaiting the result here?
            await result;
          }
        }
        // jump immediately to the new value
        indexHasChanged && position.setValue(toValue);
        // end the transition
        this._onTransitionEnd();
      });
    } else if (isTransitioning) {
      this._isTransitionRunning = true;
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.setState(nextState, async () => {
        if (nextProps.onTransitionStart) {
          const result = nextProps.onTransitionStart(
            this._transitionProps,
            this._prevTransitionProps
          );

          if (result instanceof Promise) {
            await result;
          }
        }

        const transitionUserSpec = nextProps.configureTransition
          ? nextProps.configureTransition(
              this._transitionProps,
              this._prevTransitionProps
            )
          : null;

        const transitionSpec = {
          ...DefaultTransitionSpec,
          ...(transitionUserSpec || {})
        };

        const { timing } = transitionSpec;
        delete transitionSpec.timing;

        const positionHasChanged = position._getOutputValue() !== toValue;
        if (indexHasChanged && positionHasChanged) {
          // @ts-ignore React Native and RX.Animated typings diff
          timing(position, {
            ...transitionSpec,
            toValue: nextProps.navigation.state.index
          }).start(() => {
            requestAnimationFrame(this._onTransitionEnd);
          });
        } else {
          this._onTransitionEnd();
        }
      });
    }
  }

  private _onTransitionEnd = () => {
    if (!this._isMounted) {
      return;
    }
    const prevTransitionProps = this._prevTransitionProps;
    this._prevTransitionProps = undefined;

    const scenes = filterStale(this.state.scenes);

    const nextState = {
      ...this.state,
      scenes
    };

    this._transitionProps = buildTransitionProps(this.props, nextState);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState(nextState, async () => {
      if (this.props.onTransitionEnd) {
        const result = this.props.onTransitionEnd(
          this._transitionProps,
          prevTransitionProps
        );

        // @ts-ignore onTransitionEnd typings are bad in react-navigation
        if (result instanceof Promise) {
          await result;
        }
      }

      if (this._queuedTransition) {
        const { prevProps } = this._queuedTransition;
        this._queuedTransition = null;
        this._startTransition(prevProps, this.props);
      } else {
        this._isTransitionRunning = false;
      }
    });
  };

  private _onLayout = (_layout: LayoutInfo) => {
    const { width, height } = _layout;
    if (
      this.state.layout.initWidth === width &&
      this.state.layout.initHeight === height
    ) {
      return;
    }
    const layout = {
      ...this.state.layout,
      initHeight: height,
      initWidth: width,
      isMeasured: true
    };

    layout.height.setValue(height);
    layout.width.setValue(width);

    const nextState = {
      ...this.state,
      layout
    };

    this._transitionProps = buildTransitionProps(this.props, nextState);
    this.setState(nextState);
  };

  render() {
    return (
      <RX.View onLayout={this._onLayout} style={_styles.main}>
        {this.props.render(this._transitionProps, this._prevTransitionProps)}
      </RX.View>
    );
  }
}

export default Transitioner;

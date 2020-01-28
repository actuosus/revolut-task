declare module "react-navigation/node_modules/react-navigation-stack/dist/views/ScenesReducer" {
  import {
    NavigationDescriptor,
    NavigationScene,
    NavigationState
  } from "react-navigation";

  export default function ScenesReducer(
    scenes: NavigationScene[],
    nextState: NavigationState,
    prevState?: NavigationState | null,
    descriptors?: { [key: string]: NavigationDescriptor }
  ): NavigationScene[];
}

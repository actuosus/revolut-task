/// <reference types="react-navigation/typescript/react-navigation" />

declare module "@react-navigation/core" {
  import { ComponentType } from "react";
  export * from "react-navigation";

  export interface SceneViewProps {
    screenProps: ScreenProps;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    component: ComponentType;
  }
  export class SceneView extends React.Component<SceneViewProps> {}
}

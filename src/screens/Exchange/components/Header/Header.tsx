import React, { ReactNode } from "react";
import * as RX from "reactxp";

const _styles = {
  header: RX.Styles.createViewStyle({
    flexDirection: "row",
    height: 56,
    alignItems: "center",

    ...RX.Platform.select({
      ios: {
        paddingTop: 20
      },
      android: {
        paddingTop: 20
      }
    }),

    // @ts-ignore
    zIndex: 2
  }),
  headerLeft: RX.Styles.createViewStyle({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0
  }),
  headerTitle: RX.Styles.createViewStyle({
    alignItems: "center",
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: 0
  }),
  headerRight: RX.Styles.createViewStyle({
    alignItems: "flex-end",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0
  })
};

interface HeaderProps {
  headerLeft: ReactNode;
  headerTitle: ReactNode;
  headerRight: ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <RX.View style={_styles.header}>
      <RX.View style={_styles.headerLeft}>{props.headerLeft}</RX.View>
      <RX.View style={_styles.headerTitle}>{props.headerTitle}</RX.View>
      <RX.View style={_styles.headerRight}>{props.headerRight}</RX.View>
    </RX.View>
  );
};

export default Header;

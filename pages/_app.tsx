import { handleServerRequest } from "@react-navigation/web";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import Head from "next/head";
import React from "react";
import Application from "../src/App";

const TITLE = "MDS QMS";

type AppProps = AppPropsType & {
  App: any; //?
};

const App = (props: AppProps) => {
  const { router } = props;

  const URL = require("url");
  const parsedUrl = URL.parse(router.asPath);

  const { navigation, title } = handleServerRequest(
    Application.router,
    parsedUrl.pathname,
    router.query
  );

  return (
    <div className="app-container">
      <Head>
        <title>{title || TITLE}</title>
      </Head>
      <Application navigation={navigation} />
    </div>
  );
};

export default App;

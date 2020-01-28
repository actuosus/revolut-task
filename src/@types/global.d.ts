import { compose } from "redux";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }

  namespace NodeJS {
    interface Global {
      window: any;
    }

    export interface Process {
      browser: boolean;
    }
  }
}

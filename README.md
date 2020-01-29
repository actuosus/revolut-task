# Revolut Task

Currency exchange application for Revolut task.

## Demo

https://revoluttask.actuosus.now.sh

## Screenshots

### Web

<img src="screenshots/revoluttask.now.sh_account_walletId_1_iPhone_6_7_8_.png" height="400" alt="Google Chrome Screenshot" title="Google Chrome in Simulator mode"/>

### iOS

<img src="screenshots/Simulator_Screen_Shot_-_iPhone_8_-_2020-01-28_at_23.14.23.png" height="400" alt="iOS Simulator Screenshot" title="iOS iPhone 8 Simulator"/>

### Android

<img src="screenshots/Screenshot_1580244836.png" height="400" alt="Android Emulator Screenshot" title="Android Pixel 2 Emulator"/>

### Installation

```shell
yarn install
```

### Commands

- `yarn start:web` - runs the Web version of the app in the development mode
- `yarn build:web` - builds the Web version of the app for production to the **dist-web** folder
- `yarn start:ios` - runs the iOS version of the app and attempts to open in the iOS Simulator if you're on a Mac and have it installed
- `yarn start:android` - runs the Android version of the app and attempts to open your app on a connected Android device or emulator
- `yarn start:windows` - runs the Windows version of the app
- `yarn start:rn-dev-server` - runs react native (RN) development server

- `yarn test` – runs the tests using Jest and Enzyme

---

Created by **create-rx-app@0.6.4**

## Making use of

- Typescript
- Babel
- Webpack
- React
- ReactXP
- Redux
- Redux Saga
- Redux Persist
- DayJS
- React Native
- Jest
- Enzyme
- Next.js (API proxy and simple SSR)

### Services

- ECB
- OpenExchange

### Plus

- CSS in JS
- Debounce

## Challenges

- Animation loop for wallet items rotation with Matrix 3D transformations
- Swiper (Paged Slider aka Page Control for iOS)
- React Navigation Stack for Web (copied from React Navigation)
- Particles cloud (Floating bubbles)

## TODO

- Validate rates by timestamp (some diff when rates fetching is not possible)

# PWA Example
This is a PWA example repo on how to test an installable PWA with Appium

> **NOTE:** This repo uses WDIO V7 together with Sync Mode. Make sure you are on NodeJS 14. Sync Mode got broken
> on NodeJS 16

## To use
1. clone the project to your machine
1. `cd pwa-example`
1. `npm install`

Make sure you have the same emulators configured on your machine as in the config, see:
- **Android:** [wdio.mobile.chrome.local.conf.js](./test/configs/wdio.mobile.chrome.local.conf.js)
- **iOS:** [wdio.mobile.safari.local.conf.js](./test/configs/wdio.mobile.safari.local.conf.js)

Make sure you have Appium installed on your machine, this project will automatically run it

## Running the test

- **Android:** `npm run test.local.android`
- **iOS:** `npm run test.local.ios`

## What does it do?
1. Start a Safari/Chrome session through Appium
1. Store the PWA as an installable on the home screen
1. Close Safari / Chrome
1. Open the PWA and automatically switch to the correct Webview 
1. Run the automated tests
1. When done remove the PWA for iOS (this will automatically be done for Android by the driver)

## Good to know
Some gotchas/good things to know:
- iOS/Safari doesn't have an automatic "*Add Swag Labs to home screen*"-banner as Android has. This makes the flow for
  iOS more flaky because you need to automate all steps (you also need to think about different flow regarding different
  OS versions)
- both installable apps are *light versions* of Chrome / Safari without the address/bottom toolbar
- Android has two flows to handle installing the PWA to the home-screen. Through the *banner* or through the options
  menu of Chrome
- When you install an PWA or adding a bookmark to the home-screen of, or Android, or iOS, then you don't need to worry
  about navigating to the correct home-screen. Both platforms automatically redirect you to the correct screen
- Adding `autoAcceptAlerts:true` for iOS helps a lot for automatically accept certain native modals, especially if you 
  want to automate the delete-flow of the PWA.
- All fancy iOS animations make the automation process a little painful and more flaky

There are more things, but you can find all steps and challenges in the [Android specs](./test/specs/pwa.android.spec.js) 
and or [iOS specs](./test/specs/pwa.ios.spec.js).

## Issues
### Android
- When using Sauce Labs emulators I found out that Chrome 72 for mobile crashes storing the PWA when clicking 
  on the banner. This works perfectly on newer browsers.

### iOS
Hmm, where shall I start..., just kidding. There are some challenges with the flows for different iOS versions. 
- There is a difference between iOS 12 and iOS 13+ in the way Safari handles adding a PWA to the home screen
- You can restart the `com.apple.SafariViewService` ( a *Safari Light without an address/bottom toolbar*) between tests. 
  The downside of this is that iOS 12 and 13 keep the Webviews in memory. This makes it pretty hard to automate the 
  installable Webviews. You might even loose all Webviews when you bring the app to the background, as a result you
  can't find the Webview anymore. This is not happening with iOS 14 and is not tied to the version of Appium you are
  using.
- Clicking on elements in the Webview of the installable PWA for iOS 12, in combination with Appium 1.13, results in not
  seeing a result of the click action. `nativeTab:true` doesn't make a diff.
- Sometimes the XCUITest driver "crashes" and can't give proper context data back. I've only seen this happening on
  iOS 14, 12 and 13 are stable.
- There is a difference in the way how you need to remove the PWA from the home screen between iOS 12 and iOS 13+

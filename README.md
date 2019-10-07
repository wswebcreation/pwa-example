# PWA Example

This is a PWA example repo on how to test a PWA with Appium

## To use
1. clone the project to your machine
1. `cd pwa-example`
1. `npm install`

Make sure you have the same emulators configured on your machine as in the config, see:

- **Android:** [wdio.mobile.chrome.local.conf.js](./test/configs/wdio.mobile.chrome.local.conf.js)
- **iOS:** [wdio.mobile.safari.local.conf.js](./test/configs/wdio.mobile.safari.local.conf.js)

Make sure you have the right ChromeDriver version installed on your machine to automate the Chrome browser

Make sure you have Appium running on port `4723`

## Running the test

- **Android:** `npm run test.android`
- **iOS:** `npm run test.ios`

## What does it (need to) do?
For both platforms it will first store a PWA on the device. Then it needs to open the app and needs to automate the PWA.

### Android issues:
Currently the PWA can be installed and started, the testcase also succeeds (it needs to click away the banner), but it is not executed in the correct context,
meaning in the PWA

### iOS issues
1. There are tons of webviews, this makes it hard to choose
1. When a webview has been chooses the app can be automated, but when the app is brought to the background and you want to automate it again it can't find the webview context
1. When the PWA is removed (manually) and then added with Appium the amount if Webviews is increasing enormously til 10-20. This might have something to do with the local storage of the PWA

const DEFAULT_TIMEOUT = 15000;

describe('The Sauce Swag Labs iOS PWA', () => {
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS usage 2021-02-24 (https://developer.apple.com/support/app-store/)
    //  86% of all devices introduced in the last four years use iOS 14.
    //  - 86% iOS 14
    //  - 12% iOS 13
    //  - 2% Earlier
    //  80% of all devices use iOS 14.
    //  - 80% iOS 14
    //  - 12% iOS 13
    //  - 8% Earlier
    ////////////////////////////////////////////////////////////////////////////////////
    beforeAll(() => {
        storeIosPwa();
        openPwa();
    });

    // afterAll(() => {
    //     // This is not allowed
    //     driver.removeApp('com.apple.SafariViewService');
    // });

    beforeEach(() => {
        // Clean the session
        driver.deleteCookies('session-username')
        driver.execute('localStorage.clear()')
        driver.refresh();
        // This is needed because on some devices the refresh is taking longer
        // and it failed when putting data in the input fields
        driver.pause(1000);
    });

    // afterEach(() => {
    //     // iOS 14:
    //     // Terminate app seems to restart the webview, but not put the app in the background
    //     // driver.execute('mobile: terminateApp', {'bundleId': 'com.apple.SafariViewService'})
    //     driver.background(-1);
    // });

    // @TODO: iOS 12, 13 seems to mess up multiple views which are not cleared.
    // @TODO: This does not happen with iOS 14, need to investigate this?

    it('should be able log in', () => {
        /**
         * Start interacting with the app
         */
        $('#user-name').waitForDisplayed({timeout: DEFAULT_TIMEOUT});
        $('#user-name').addValue('standard_user');
        $('#password').addValue('secret_sauce');
        // It seems that this button can't be clicked on iOS 12 with Appium 1.13
        $('#login-button').click();
        $('#inventory_container').waitForDisplayed({timeout: DEFAULT_TIMEOUT});

        expect($('#inventory_container').isDisplayed()).toEqual(true)
    });

    it('should be able to skip login and go to the cart page', () => {
        const userCookies = `document.cookie="session-username=standard_user";`;
        const productStorage = `localStorage.setItem("cart-contents", "[3,4]");`;

        // Go to the domain and set the storage
        browser.url('');
        browser.execute(`${userCookies} ${productStorage}`);

        // Now go to the page
        browser.url('https://www.saucedemo.com/cart.html');
        $('#cart_contents_container').waitForDisplayed({timeout: DEFAULT_TIMEOUT});

        expect($('#cart_contents_container').isDisplayed()).toEqual(true)
    });
});

/**
 * Store an iOS PWA to the device
 */
function storeIosPwa() {
    // Open Safari
    // Go to url
    // Wait for loaded
    driver.url('');

    // Switch to native context
    driver.switchContext('NATIVE_APP');

    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =   ShareButton
    // -ios predicate string(beta)  =   label == "Share"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Share"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   ShareButton
    // -ios predicate string(beta)  =   label == "Share"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Share"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12
    // accessibility id             =   Share
    // -ios predicate string(beta)  =   label == "Share"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Share"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // $('~ShareButton').click();
    const shareSelector = `label == "Share"`
    $(`-ios predicate string:${shareSelector}`).click()

    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =   -
    // -ios predicate string(beta)  =   type == "XCUIElementTypeCollectionView"
    // -ios class chain(beta)       =   **/XCUIElementTypeOther[`name == "ActivityListView"`]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   ActivityListView
    // -ios predicate string(beta)  =   name == "ActivityListView"
    // -ios class chain(beta)       =   **/XCUIElementTypeOther[`name == "ActivityListView"`]
    // !!OR, same as iOS 14!!
    // accessibility id             =
    // -ios predicate string(beta)  =   type == "XCUIElementTypeCollectionView"
    // -ios class chain(beta)       =   **/XCUIElementTypeOther[`name == "ActivityListView"`]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12
    // accessibility id             =   ActivityListView
    // -ios predicate string(beta)  =   name == "ActivityListView"
    // -ios class chain(beta)       =   **/XCUIElementTypeOther[`name == "ActivityListView"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12 has a different element to wait for
    const platformVersion = parseInt(driver.capabilities.platformVersion);
    let selector

    if(platformVersion < 13){
        selector = '~ActivityListView'
    } else {
        selector = `-ios predicate string:type == 'XCUIElementTypeCollectionView'`;
    }
    $(selector).waitForDisplayed({timeout: DEFAULT_TIMEOUT});

    // handle icon to home screen
    openAddToHomeScreenModal();

    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =   Swag Labs
    // -ios predicate string(beta)  =   label == "Swag Labs"
    // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   Swag Labs
    // -ios predicate string(beta)  =   label == "Swag Labs"
    // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // After clicking on the Add button the following flow happens:
    // - iOS 14: The screen where the app is added is shown, no need to swipe and search
    // - iOS 13: The screen where the app is added is shown, no need to swipe and search
    // - iOS 12: The screen where the app is added is shown, no need to swipe and search
    $('~Swag Labs').waitForDisplayed({timeout: DEFAULT_TIMEOUT});

    // @TODO: we can also find here that we have multiple Swag Labs icons

    // Terminate the safari browser, otherwise it might dive an issue for finding the webviews
    //  ["NATIVE_APP","WEBVIEW_9617.1"]
    driver.terminateApp('com.apple.mobilesafari')
}

/**
 * Scroll till you find the `~Add to Home Screen` button, but only for max 4 times
 *
 * @param {number} amount The amount of scrolls
 */
function openAddToHomeScreenModal(amount = 0) {
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =   -
    // -ios predicate string(beta)  =   label == "Add to Home Screen" AND name == "Add to Home Screen" AND type == "XCUIElementTypeButton"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Add to Home Screen"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13, it's XCUIElementTypeCell instead of XCUIElementTypeButton for iOS 14
    // accessibility id             =   -
    // -ios predicate string(beta)  =   label == "Add to Home Screen" AND name == "Add to Home Screen" AND type == "XCUIElementTypeCell"
    // -ios class chain(beta)       =   **/XCUIElementTypeCell[`label == "Add to Home Screen"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12, for iOS 13 it's XCUIElementTypeCell, but for iOS 14 is also XCUIElementTypeButton
    // accessibility id             =   -
    // -ios predicate string(beta)  =   label == "Add to Home Screen"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Add to Home Screen"`]
    ////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // Check if the "Add to Home Screen" is visible
    ////////////////////////////////////////////////////////////////////////////////////

    if (!$('~Add to Home Screen').isDisplayed() && amount < 4) {
        const platformVersion = parseInt(driver.capabilities.platformVersion)
        let xStart, xEnd, yStart, yEnd;
        const listRectangles = driver.getElementRect($('~ActivityListView').elementId);

        if (platformVersion < 13) {
            // iOS 12 and lower have a row that has tiles. We need to swipe the first
            // row of tiles from right to left to see if the button is there
            // The design of the screen is that it contains 2 equal rows,
            // the options are in the second row so take the half of that meaning 0.75% of height
            // Swipe from right
            xStart = listRectangles.width * 0.8;
            yStart = listRectangles.y + Math.round(listRectangles.height * 0.75);
            // to the left
            xEnd = listRectangles.width * 0.2;
            yEnd = listRectangles.y + Math.round(listRectangles.height * 0.75);
        } else {
            // iOS 13 + 14 have a new design. All the options are in a list in a card
            // If it's not visible, then the cards needs to be dragged up

            // Drag the card from half way of the screen
            xStart = listRectangles.width / 2;
            yStart = listRectangles.y + Math.round(listRectangles.height * 0.75);
            // to the top
            xEnd = listRectangles.width / 2;
            yEnd = 0;
        }

        driver.touchPerform([
            {
                action: 'press',
                options: {
                    x: xStart,
                    y: yStart,
                },
            },
            {
                action: 'wait',
                options: {ms: 1000},
            },
            {
                action: 'moveTo',
                options: {
                    x: xEnd,
                    y: yEnd,
                },
            },
            {
                action: 'release',
            },
        ]);

        console.log('############\nSwipped and will pause now\n############\n')
        driver.pause(1000)

        openAddToHomeScreenModal(amount + 1);
    }

    // If found click on it
    $('~Add to Home Screen').click();

    // A new modal / card will be shown
    // Wait for ~Add and press it
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =   Add
    // -ios predicate string(beta)  =   label == "Add"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Add"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   Add
    // -ios predicate string(beta)  =   label == "Add"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Add"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12
    // accessibility id             =   Add
    // -ios predicate string(beta)  =   label == "Add"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Add"`]
    ////////////////////////////////////////////////////////////////////////////////////

    $('~Add').waitForDisplayed({timeout: DEFAULT_TIMEOUT});
    // @TODO: We skipped the step to change the name of the app, but here are the selectors
    ////////////////////////////////////////////////////////////////////////////////////
    // The clear field
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =
    // -ios predicate string(beta)  =
    // -ios class chain(beta)       =
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   Clear text
    // -ios predicate string(beta)  =   label == "Clear text"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Clear text"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12
    // accessibility id             =   Clear text
    // -ios predicate string(beta)  =   label == "Clear text"
    // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Clear text"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // The text field
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =
    // -ios predicate string(beta)  =
    // -ios class chain(beta)       =
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   -
    // -ios predicate string(beta)  =   type == "XCUIElementTypeTextField"
    // -ios class chain(beta)       =   -
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12
    // accessibility id             =   -
    // -ios predicate string(beta)  =   type == "XCUIElementTypeTextField"
    // -ios class chain(beta)       =   -
    ////////////////////////////////////////////////////////////////////////////////////
    $('~Add').click();
}

/**
 * This method will open the PWA and set it to the right context
 */
// function openPwa() {
//     driver.switchContext('NATIVE_APP');
//     // Wait till the app icon is on the screen (this might take a while)
//     // Click on it, in our case it is the ~Smashing
//     $('~Smashing').waitForDisplayed(15000);
//     // Store the current contexts so they can be filtered out later
//     const currentContexts = driver.getContexts();
//     $('~Smashing').click();
//
//     let webviewID = 'unknown';
//     let blankID;
//     let tempWebviewId = 'unknown';
//
//     driver.waitUntil(() => {
//         /**
//          * This is messy, sorry
//          */
//             // Remove the `NATIVE_APP` and Safari contexts to have clean array
//         const currentPwaContexts = driver.getContexts().filter(context =>
//                 !currentContexts.find(currentContext => context.id === currentContext.id)
//             );
//
//         console.log('\n\ncurrentPwaContexts =', currentPwaContexts, ' \n\n');
//
//         // Don't check anything if there is no data in the array
//         if (currentPwaContexts.length === 0) {
//             return false;
//         }
//
//         // There is an id of a blank page, now check if it changed to become a full page
//         if (blankID) {
//             // do some magic here
//             const title = currentPwaContexts.find(currentContext => currentContext.id === blankID).title;
//             webviewID = title.includes('Smashing Magazine — For Web Designers And Developers') ? blankID : false;
//
//             return webviewID
//         }
//
//         // First check if there is a blank
//         const blank = currentPwaContexts
//             .find(currentPwaContext => currentPwaContext.title === '' && currentPwaContext.url === 'about:blank');
//
//         if (blank) {
//             blankID = blank.id;
//             return false;
//         } else {
//             console.log('\NN\#### DO SOME MAGIC HERE TO DETERMINE THE LATEST WEBVIEW ####\N\N')
//         }
//     }, {timeout: DEFAULT_TIMEOUT});
//
//     driver.switchContext(webviewID);
// }
function openPwa() {
    // iOS 14
    // @TODO: It could be that the PWA is already there, remove if it's double?
    driver.terminateApp('com.apple.mobilesafari')
    driver.switchContext('NATIVE_APP');
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 14
    // accessibility id             =   Swag Labs
    // -ios predicate string(beta)  =   label == "Swag Labs"
    // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 13
    // accessibility id             =   Swag Labs
    // -ios predicate string(beta)  =   label == "Swag Labs"
    // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // iOS 12
    // accessibility id             =   Swag Labs
    // -ios predicate string(beta)  =   label == "Swag Labs"
    // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]
    ////////////////////////////////////////////////////////////////////////////////////
    // Wait till the app icon is on the screen because this is a generic hook
    $('~Swag Labs').waitForDisplayed({timeout: DEFAULT_TIMEOUT});
    $('~Swag Labs').click();

    // This is what we get back for `mobile: getContexts` with a single PWA
    // iOS 14:
    // [
    //      {"id":"NATIVE_APP"},
    //      {
    //          "bundleId":"com.apple.SafariViewService",
    //          "id":"WEBVIEW_9617.1",
    //          "title":"Swag Labs",
    //          "url":"https://www.saucedemo.com/"
    //      }
    // ]
    // This is with 2 PWAs and with Safari open
    // [
    //      {"id":"NATIVE_APP"},
    //      {
    //          "bundleId":"com.apple.SafariViewService",
    //          "id":"WEBVIEW_9617.1",
    //          "title":"Swag Labs",
    //          "url":"https://www.saucedemo.com/"
    //      },
    //      {
    //          "bundleId":"com.apple.SafariViewService",
    //          "id":"WEBVIEW_9617.2",
    //          "title":"Smashing Magazine — For Web Designers And Developers",
    //          "url":"https://www.smashingmagazine.com/"
    //      },
    //      {
    //          "bundleId":"com.apple.mobilesafari",
    //          "id":"WEBVIEW_9890.1",
    //          "title":"Smashing Magazine — For Web Designers And Developers",
    //          "url":"https://www.smashingmagazine.com/"
    //      }
    // ]
    //
    // iOS 12:
    // [
    //      {"id":"NATIVE_APP"},
    //      {
    //          "bundleId":"com.apple.SafariViewService",
    //          "id":"WEBVIEW_31438.1",
    //          "title":"Swag Labs",
    //          "url":"https://www.saucedemo.com/"
    //      }
    // ]
    // This is with 2 PWAs and with Safari open
    // [
    //      {"id":"NATIVE_APP"},
    //      {
    //          "bundleId":"com.apple.SafariViewService",
    //          "id":"WEBVIEW_31438.1",
    //          "title":"Swag Labs",
    //          "url":"https://www.saucedemo.com/"
    //      },
    //      {
    //          "bundleId":"com.apple.SafariViewService",
    //          "id":"WEBVIEW_31438.3",
    //          "title":"Smashing Magazine — For Web Designers And Developers",
    //          "url":"https://www.smashingmagazine.com/"
    //      }
    // ]
    driver.waitUntil(() => {
        const contexts = driver.execute('mobile:getContexts')
        const swagLabsWebviews = contexts
            .filter((wv) => wv.title && wv.title.includes('Swag Labs'));

        // Wait for the webview to be loaded
        // @TODO: determine if this is needed
        for (const wv of swagLabsWebviews) {
            driver.switchContext(wv.id);
            if ($('#login-button').isDisplayed()) {
                return wv;
            }
        }

        // nothing was found, so do it all again
        driver.switchContext('NATIVE_APP');
        return false;
    }, {timeout: DEFAULT_TIMEOUT});
}


// Some logs from iOS 14, 13 and 12
// ╰ yarn test.ios
// yarn run v1.22.10
// $ wdio ./test/configs/wdio.mobile.safari.local.conf.js
//
// Execution of 1 spec files started at 2021-04-11T16:35:55.422Z
//
// [0-0] RUNNING in safari - /test/specs/pwa.ios.spec.js
// [0-0] DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise.
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_22290.9',
//     title: '',
//     url: 'about:blank',
//     bundleId: 'com.apple.SafariViewService'
//   }
// ]
// swagLabsWebviews: []
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_22290.9',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/',
//     bundleId: 'com.apple.SafariViewService'
//   }
// ]
// swagLabsWebviews: [ 'WEBVIEW_22290.9' ]
// [0-0] FINALLY SELECTING: {"id":"WEBVIEW_22290.9","title":"Swag Labs","url":"https://www.saucedemo.com/","bundleId":"com.apple.SafariViewService"}
// [0-0] DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise.
// [0-0] PASSED in safari - /test/specs/pwa.ios.spec.js
//
//  "spec" Reporter:
// ------------------------------------------------------------------
// [iPhone 11 iOS 14.2 #0-0] Running: iPhone 11 on iOS 14.2 executing safari
// [iPhone 11 iOS 14.2 #0-0] Session ID: 79de6b59-d1a5-4f48-8b1e-44e740df3ea2
// [iPhone 11 iOS 14.2 #0-0]
// [iPhone 11 iOS 14.2 #0-0] » /test/specs/pwa.ios.spec.js
// [iPhone 11 iOS 14.2 #0-0] An iOS PWA
// [iPhone 11 iOS 14.2 #0-0]    ✓ should be able log in
// [iPhone 11 iOS 14.2 #0-0]    ✓ should be able to skip login and go to the cart page
// [iPhone 11 iOS 14.2 #0-0]
// [iPhone 11 iOS 14.2 #0-0] 2 passing (22.1s)
//
//
// Spec Files:      1 passed, 1 total (100% completed) in 00:01:23
//
// ✨  Done in 85.91s.
//
// ╭─   SL-1379     …/Git/pwa-example     feat/update-saucedemo                                                                         01:26     91%   5.04G   192.168.178.81    06:37    11-04-21 
// ╰ yarn test.ios
// yarn run v1.22.10
// $ wdio ./test/configs/wdio.mobile.safari.local.conf.js
//
// Execution of 1 spec files started at 2021-04-11T16:37:31.179Z
//
// [0-0] RUNNING in safari - /test/specs/pwa.ios.spec.js
// [0-0] DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise.
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_26561.2',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/cart.html',
//     bundleId: 'process-SafariViewService'
//   },
//   {
//     id: 'WEBVIEW_26561.3',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/',
//     bundleId: 'process-SafariViewService'
//   },
//   {
//     id: 'WEBVIEW_26561.4',
//     title: '',
//     url: 'about:blank',
//     bundleId: 'process-SafariViewService'
//   }
// ]
// [0-0] swagLabsWebviews: [ 'WEBVIEW_26561.2', 'WEBVIEW_26561.3' ]
// [0-0] FINALLY SELECTING: {"id":"WEBVIEW_26561.3","title":"Swag Labs","url":"https://www.saucedemo.com/","bundleId":"process-SafariViewService"}
// [0-0] DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise.
// [0-0] PASSED in safari - /test/specs/pwa.ios.spec.js
//
//  "spec" Reporter:
// ------------------------------------------------------------------
// [iPhone 11 iOS 13.7 #0-0] Running: iPhone 11 on iOS 13.7 executing safari
// [iPhone 11 iOS 13.7 #0-0] Session ID: 7823f3ae-6c6d-4cc7-a2e5-ca0a30352c5a
// [iPhone 11 iOS 13.7 #0-0]
// [iPhone 11 iOS 13.7 #0-0] » /test/specs/pwa.ios.spec.js
// [iPhone 11 iOS 13.7 #0-0] An iOS PWA
// [iPhone 11 iOS 13.7 #0-0]    ✓ should be able log in
// [iPhone 11 iOS 13.7 #0-0]    ✓ should be able to skip login and go to the cart page
// [iPhone 11 iOS 13.7 #0-0]
// [iPhone 11 iOS 13.7 #0-0] 2 passing (17.4s)
//
//
// Spec Files:      1 passed, 1 total (100% completed) in 00:01:23
//
// ✨  Done in 85.60s.
//
// ╭─   SL-1379     …/Git/pwa-example     feat/update-saucedemo                                                                         01:26     91%   5.19G   192.168.178.81    06:38    11-04-21 
// ╰ yarn test.ios
// yarn run v1.22.10
// $ wdio ./test/configs/wdio.mobile.safari.local.conf.js
//
// Execution of 1 spec files started at 2021-04-11T16:39:36.436Z
//
// [0-0] RUNNING in safari - /test/specs/pwa.ios.spec.js
// [0-0] DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise.
// [0-0] ############
// Swipped and will pause now
// ############
//
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_36555.1',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/cart.html',
//     bundleId: 'com.apple.SafariViewService'
//   },
//   {
//     id: 'WEBVIEW_36555.2',
//     title: '',
//     url: 'about:blank',
//     bundleId: 'com.apple.SafariViewService'
//   }
// ]
// swagLabsWebviews: [ 'WEBVIEW_36555.1' ]
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_36555.1',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/cart.html',
//     bundleId: 'com.apple.SafariViewService'
//   },
//   {
//     id: 'WEBVIEW_36555.2',
//     title: '',
//     url: 'about:blank',
//     bundleId: 'com.apple.SafariViewService'
//   }
// ]
// [0-0] swagLabsWebviews: [ 'WEBVIEW_36555.1' ]
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_36555.1',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/cart.html',
//     bundleId: 'com.apple.SafariViewService'
//   },
//   {
//     id: 'WEBVIEW_36555.2',
//     title: '',
//     url: 'about:blank',
//     bundleId: 'com.apple.SafariViewService'
//   }
// ]
// [0-0] swagLabsWebviews: [ 'WEBVIEW_36555.1' ]
// [0-0] webviews =  [
//   { id: 'NATIVE_APP' },
//   {
//     id: 'WEBVIEW_36555.1',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/cart.html',
//     bundleId: 'com.apple.SafariViewService'
//   },
//   {
//     id: 'WEBVIEW_36555.2',
//     title: 'Swag Labs',
//     url: 'https://www.saucedemo.com/',
//     bundleId: 'com.apple.SafariViewService'
//   }
// ]
// [0-0] swagLabsWebviews: [ 'WEBVIEW_36555.1', 'WEBVIEW_36555.2' ]
// [0-0] FINALLY SELECTING: {"id":"WEBVIEW_36555.2","title":"Swag Labs","url":"https://www.saucedemo.com/","bundleId":"com.apple.SafariViewService"}
// [0-0] DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise.
// [0-0] PASSED in safari - /test/specs/pwa.ios.spec.js
//
//  "spec" Reporter:
// ------------------------------------------------------------------
// [iPhone XS iOS 12.4 #0-0] Running: iPhone XS on iOS 12.4 executing safari
// [iPhone XS iOS 12.4 #0-0] Session ID: 4f842a9f-280c-422e-bcf0-7c8bc1c477ba
// [iPhone XS iOS 12.4 #0-0]
// [iPhone XS iOS 12.4 #0-0] » /test/specs/pwa.ios.spec.js
// [iPhone XS iOS 12.4 #0-0] An iOS PWA
// [iPhone XS iOS 12.4 #0-0]    ✓ should be able log in
// [iPhone XS iOS 12.4 #0-0]    ✓ should be able to skip login and go to the cart page
// [iPhone XS iOS 12.4 #0-0]
// [iPhone XS iOS 12.4 #0-0] 2 passing (19.3s)

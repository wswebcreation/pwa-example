const DEFAULT_TIMEOUT = 15000;

describe('The Sauce Swag Labs Android PWA', () => {

    // Can't start the activity, it's not allowed
    // Activity: org.chromium.chrome.browser.webapps.WebappActivity
    // package: com.android.chrome
    beforeAll(()=>{
        storeAndroidPwa();
        openPwa();
    });

    beforeEach(() => {
        // Clean the session
        driver.deleteCookies('session-username')
        driver.execute('localStorage.clear()')
        driver.url('');
    });

    it('should be able log in', () => {
        /**
         * Start interacting with the app
         */
        $('#user-name').waitForDisplayed({timeout: DEFAULT_TIMEOUT});
        $('#user-name').addValue('standard_user');
        $('#password').addValue('secret_sauce');
        $('#login-button').click();
        $('#inventory_container').waitForDisplayed({timeout: DEFAULT_TIMEOUT});

        expect($('#inventory_container').isDisplayed()).toEqual(true)

    });

    it('should be able to skip login and go to the cart page', () => {
        const userCookies = `document.cookie="session-username=standard_user";`;
        const productStorage = `localStorage.setItem("cart-contents", "[3,4]");`;

        // Go to the domain and set the storage
        driver.url('');
        driver.execute(`${userCookies} ${productStorage}`);
        // Now go to the page
        driver.url('https://www.saucedemo.com/cart.html');
        $('#cart_contents_container').waitForDisplayed({timeout: DEFAULT_TIMEOUT});

        expect($('#cart_contents_container').isDisplayed()).toEqual(true)
    });
});

/**
 * Store the PWA on the home screen
 */
function storeAndroidPwa(){
    let installThroughMenu = false;
    // Open Chrome
    // Go to url
    // Wait for loaded
    driver.url('');

    // Switch to native context
    driver.switchContext('NATIVE_APP');

    // There are 2 options here. The banner is shown for the saucedemo app,
    // but this might not be something that is always shown

    // Open the menu

    ////////////////////////////////////////////////////////////////////////////////////
    // Android 11
    // accessibility id   =   More options
    // xpath              =   //android.widget.ImageButton[@content-desc="More options"]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // accessibility id   =   More options
    // xpath              =   //android.widget.ImageButton[@content-desc="More options"]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 9.0
    // accessibility id   =   More options
    // xpath              =   //android.widget.ImageButton[@content-desc="More options"]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 8.1
    // accessibility id   =   More options
    // xpath              =   //android.widget.ImageButton[@content-desc="More options"]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 7.1
    // accessibility id   =   More options
    // xpath              =   //android.widget.ImageButton[@content-desc="More options"]
    ////////////////////////////////////////////////////////////////////////////////////
    try {
      const backupAddButtonSelector = 'new UiSelector().className("android.widget.Button").textContains("Add Swag Labs to")';
      $(`android=${backupAddButtonSelector}`).waitForDisplayed({timeout:2500});
      $(`android=${backupAddButtonSelector}`).click();
    } catch (ign){
      // This is a backup if the banner is not shown
      $('~More options').click();
      installThroughMenu = true;
    }

    if (installThroughMenu) {
      // Click on add to home
      ////////////////////////////////////////////////////////////////////////////////////
      // Android 11
      // accessibility id   =   Add to Home screen
      // xpath              =   //android.widget.TextView[@content-desc="Add to Home screen"]
      ////////////////////////////////////////////////////////////////////////////////////
      // Android 10
      // accessibility id   =   Add to Home screen
      // xpath              =   //android.widget.TextView[@content-desc="Add to Home screen"]
      ////////////////////////////////////////////////////////////////////////////////////
      // Android 10
      // accessibility id   =   Add to Home screen
      // xpath              =   //android.widget.TextView[@content-desc="Add to Home screen"]
      ////////////////////////////////////////////////////////////////////////////////////
      // Android 8.1
      // accessibility id   =   Add to Home screen
      // xpath              =   //android.widget.TextView[@content-desc="Add to Home screen"]
      ////////////////////////////////////////////////////////////////////////////////////
      // Android 7.1
      // accessibility id   =   Add to Home screen
      // xpath              =   //android.widget.TextView[@content-desc="Add to Home screen"]
      ////////////////////////////////////////////////////////////////////////////////////
      try {
        $('~Add to Home screen').waitForDisplayed({timeout:2500});
        $('~Add to Home screen').click();
      } catch (ign) {
        // On newer version of Android it's `Install App`
        $('~Install app').click();
      }
    }

    // Wait for the pop-up
    // @TODO: we can change the name, but the cursor is in the wrong place
    // Check if we can clear it?
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 11
    // Not possible
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // Not possible
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 9.0
    // Not possible
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 8.1
    // xpath    =   //android.widget.EditText[@resource-id="com.android.chrome:id/text"]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 7.1
    // Not possible
    ////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    // Android 11
    // xpath              =   //android.widget.Button[contains(@text, "Add")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // xpath              =   //android.widget.Button[contains(@text, "Add")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 9.1
    // xpath              =   //android.widget.Button[contains(@text, "ADD")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 8.1
    // xpath              =   //android.widget.Button[contains(@text, "ADD")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 7.1
    // xpath              =   //android.widget.Button[contains(@text, "ADD")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Diff between Android 11/10/9.0/8.1/7.1 is that it's `Add` vs. `ADD`
    // textContains seems to be case-insensitive, although the docs say otherwise
    // https://developer.android.com/reference/androidx/test/uiautomator/UiSelector#textcontains
    try {
      const addButtonSelector = 'new UiSelector().className("android.widget.Button").textContains("Add")'
      $(`android=${addButtonSelector}`).waitForDisplayed({timeout:2500});
      $(`android=${addButtonSelector}`).click();
    } catch (ign) {
      // On newer version of Android it's `Install App`
      const backupAddHomeButtonSelector = 'new UiSelector().className("android.widget.Button").textContains("Install")'
      $(`android=${backupAddHomeButtonSelector}`).click();
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // Android 11
    // xpath    =   //android.widget.Button[contains(@text, "Add automatically")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // xpath    =   //android.widget.Button[contains(@text, "Add automatically")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 9.0
    // xpath    =   //android.widget.Button[contains(@text, "ADD AUTOMATICALLY")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 8.1
    // xpath    =   //android.widget.Button[contains(@text, "ADD AUTOMATICALLY")]
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 7.1
    // NOT SHOWN!!!
    ////////////////////////////////////////////////////////////////////////////////////
    // Diff between Android 11/10/9.0/8.1 is that it's `Add automatically` vs. `ADD AUTOMATICALLY`
    // textContains seems to be case-insensitive, although the docs say otherwise
    // https://developer.android.com/reference/androidx/test/uiautomator/UiSelector#textcontains

    // This screen is only shown with Android 8 (API Level 26) or higher, but don't let it fail if it's not there
    try {
      if (driver.capabilities.deviceApiLevel > 25) {
          const addAutomaticallySelector = 'new UiSelector().className("android.widget.Button"). textContains("Add Automatically")'
          $(`android=${addAutomaticallySelector}`).waitForDisplayed({timeout: DEFAULT_TIMEOUT});
          $(`android=${addAutomaticallySelector}`).click();
      }
    } catch (ign){
      // do nothing
    }

    // // Terminating the app will remove the PWA from the emulator and when you try to open the
    // // PWA it will open an empty PWA/Chrome browser
    // driver.terminateApp('com.android.chrome');

    // Put the app to the background
    // Android 10:  This will automatically show the home screen and the icon focussed on the screen
    // Android 9.0: This will automatically show the home screen and the icon focussed on the screen
    // Android 8.1: This will automatically show the home screen and the icon focussed on the screen
    driver.background(-1);
}

/**
 * Open the PWA
 */
function openPwa(){
    // Wait for the icon on the home screen
    driver.pause(2000);
    findPWAOnScreen();
    $('~Swag Labs').click();

    // There is only a `NATIVE_APP|CHROMIUM` context
    driver.switchContext('CHROMIUM');

    // This is what we get back for `mobile: getContexts`
    // [
    //   {
    //     "proc": "@chrome_devtools_remote",
    //     "webview": "WEBVIEW_chrome",
    //     "info": {
    //       //...
    //     },
    //     "pages": [
    //       {
    //         "description": "",
    //         "devtoolsFrontendUrl": "http://chrome-devtools-frontend.appspot.com/serve_rev/@22955682f94ce09336197bfb8dffea991fa32f0d/inspector.html?ws=127.0.0.1:10900/devtools/page/D0164AC3D0E8B1D0448046359975AC69",
    //         "id": "D0164AC3D0E8B1D0448046359975AC69",
    //         "title": "Swag Labs",
    //         "type": "page",
    //         "url": "https://www.saucedemo.com/",
    //         "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/page/D0164AC3D0E8B1D0448046359975AC69"
    //       },
    //       {
    //         "description": "",
    //         "devtoolsFrontendUrl": "http://chrome-devtools-frontend.appspot.com/serve_rev/@22955682f94ce09336197bfb8dffea991fa32f0d/inspector.html?ws=127.0.0.1:10900/devtools/page/0",
    //         "id": "0",
    //         "title": "Swag Labs",
    //         "type": "page",
    //         "url": "https://www.saucedemo.com/",
    //         "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/page/0"
    //       },
    //       {
    //         "description": "",
    //         "devtoolsFrontendUrl": "http://chrome-devtools-frontend.appspot.com/serve_rev/@22955682f94ce09336197bfb8dffea991fa32f0d/worker_app.html?ws=127.0.0.1:10900/devtools/page/98713B52139353407206F8C13D07167F",
    //         "id": "98713B52139353407206F8C13D07167F",
    //         "title": "Service Worker https://www.saucedemo.com/service-worker.js",
    //         "type": "service_worker",
    //         "url": "https://www.saucedemo.com/service-worker.js",
    //         "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/page/98713B52139353407206F8C13D07167F"
    //       },
    //       {
    //         "description": "",
    //         "devtoolsFrontendUrl": "http://chrome-devtools-frontend.appspot.com/serve_rev/@22955682f94ce09336197bfb8dffea991fa32f0d/worker_app.html?ws=127.0.0.1:10900/devtools/page/5C439E0DE9844A393E0C664A9F8073D3",
    //         "id": "5C439E0DE9844A393E0C664A9F8073D3",
    //         "title": "Service Worker https://www.saucedemo.com/service-worker.js",
    //         "type": "service_worker",
    //         "url": "https://www.saucedemo.com/service-worker.js",
    //         "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/page/5C439E0DE9844A393E0C664A9F8073D3"
    //       }
    //     ],
    //     "webviewName": "WEBVIEW_chrome"
    //   }
    // ]

    driver.waitUntil(() => {
        const contexts = driver.execute('mobile:getContexts')
        // Need to get the webviews that we can use
        const chromeWebviews = contexts
          .filter((wv) => wv.webview === 'WEBVIEW_chrome')[0].pages
          .filter((wv) => wv.type ==='page' && wv.title.includes('Swag Labs') && wv.id !== '0');

        // No valid webview available, then retry
        if(chromeWebviews.length === 0){
            return false
        }

        // Check that if we have a webview available with proper pages that the element is also visible
        for (const wv of chromeWebviews) {
            // We need to add the `CDwindow-`
            driver.switchToWindow(`CDwindow-${wv.id}`);
            if ($('#login-button').isDisplayed()) {
                return wv;
            }
        }

        // nothing was found, so do it all again
        driver.switchContext('NATIVE_APP');
        return false;
    }, {timeout: DEFAULT_TIMEOUT});
}

/**
 * Find the icon on the screen, if it's not there then swipe from bottom to top
 * and hopefully it will be in the apps screen
 */
function findPWAOnScreen(amount = 0) {
  ////////////////////////////////////////////////////////////////////////////////////
  // Android 10
  // accessibility id   =   Swag Labs
  // xpath              =   //android.widget.TextView[@content-desc="Swag Labs"]
  ////////////////////////////////////////////////////////////////////////////////////
  if (!$('~Swag Labs').isDisplayed() && amount < 2) {
    const {height, width} = driver.getWindowSize();
    const yStart = height - height / 4;
    const yEnd = 0;
    const x = width/2;
    driver.touchPerform([
      {
        action: 'press',
        options: {
          x: x,
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
          x: x,
          y: yEnd,
        },
      },
      {
        action: 'release',
      },
    ]);

    // Wait a second for the swipe to be done
    driver.pause(1000);
    findPWAOnScreen(amount + 1);
  }
}

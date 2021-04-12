const DEFAULT_TIMEOUT = 15000;

describe('An Android PWA', () => {

    // Can't start the activity, it's not allowed
    // Activity: org.chromium.chrome.browser.webapps.WebappActivity
    // package: com.android.chrome
    beforeAll(()=>{
        storeAndroidPwa();
        openPwa();
    });

    // beforeEach(()=> openPwa());
    // afterEach(()=> driver.background(-1));

    beforeEach(() => {
        // Clean the session
        driver.deleteCookies('session-username')
        driver.execute('localStorage.clear()')
        driver.refresh();
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
    // Android 10
    // accessibility id   =   More options
    // xpath              =   //android.widget.ImageButton[@content-desc="More options"]
    ////////////////////////////////////////////////////////////////////////////////////
    $('~More options').click();

    // Click on add to home
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // accessibility id   =   Add to Home screen
    // xpath              =   //android.widget.TextView[@content-desc="Add to Home screen"]
    ////////////////////////////////////////////////////////////////////////////////////
    $('~Add to Home screen').click();

    // Wait for the pop-up

    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // xpath              =   //android.widget.Button[contains(@text, "Add")]
    ////////////////////////////////////////////////////////////////////////////////////
    $('//android.widget.Button[contains(@text, "Add")]').waitForDisplayed({timeout:DEFAULT_TIMEOUT});
    $('//android.widget.Button[contains(@text, "Add")]').click();

    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // xpath              =   //android.widget.Button[contains(@text, "Add automatically")]
    ////////////////////////////////////////////////////////////////////////////////////
    $('//android.widget.Button[contains(@text, "Add automatically")]').waitForDisplayed({timeout:DEFAULT_TIMEOUT});
    $('//android.widget.Button[contains(@text, "Add automatically")]').click();

    // // Terminating the app will remove the PWA from the emulator and when you try to open the
    // // PWA it will open an empty PWA/Chrome browser
    // driver.terminateApp('com.android.chrome');

    // Put the app to the background
    // Android 10: This will automatically show the home screen
    driver.background(-1);
}

/**
 * Open the PWA
 */
function openPwa(){
    // Wait for the icon on the home screen
    ////////////////////////////////////////////////////////////////////////////////////
    // Android 10
    // accessibility id   =   Swag Labs
    // xpath              =   //android.widget.TextView[@content-desc="Swag Labs"]
    ////////////////////////////////////////////////////////////////////////////////////
    $('~Swag Labs').waitForDisplayed({timeout:DEFAULT_TIMEOUT});
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

    const context = driver.waitUntil(() => {
        const contexts = driver.execute('mobile:getContexts')
        console.log('webviews = ', JSON.stringify(contexts, null, 2))
        // Need to get the webviews that we can use
        const chromeWebviews = contexts
          .filter((wv) => wv.webview === 'WEBVIEW_chrome')[0].pages
          .filter((wv) => wv.type ==='page' && wv.title.includes('Swag Labs') && wv.id.length > 1);

        console.log('chromeWebviews:', chromeWebviews);

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

    console.log(`FINALLY SELECTING: ${JSON.stringify(context)}`);
}

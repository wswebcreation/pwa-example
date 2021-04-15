const DEFAULT_TIMEOUT = 5000;

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

  afterAll(() => {
    // // This is not allowed
    // driver.removeApp('com.apple.SafariViewService');
    // driver.execute('mobile: terminateApp', {'bundleId': 'com.apple.SafariViewService'})

    // Make sure we are in the native app context again before we remove the PWA
    driver.switchContext('NATIVE_APP');
    driver.background(-1);

    // Wait for the Swag Labs icon to be visible
    $('~Swag Labs').waitForDisplayed({timeout: DEFAULT_TIMEOUT});
    removePwa('Swag Labs');

    // For demo purpose we wait a few seconds
    driver.pause(5000);
  });

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

  if (platformVersion < 13) {
    selector = '~ActivityListView'
  } else {
    selector = `-ios predicate string:type == 'XCUIElementTypeCollectionView'`;
  }
  $(selector).waitForDisplayed({timeout: DEFAULT_TIMEOUT});

  // handle icon to home screen
  openAddToHomeScreenModal();

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

    // Wait a second for the swipe to be done
    driver.pause(1000)
    openAddToHomeScreenModal(amount + 1);
  }

  // If found click on it
  $('~Add to Home Screen').click();
}

/**
 * This method will open the PWA and set it to the right context
 */
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
  }, {timeout: 45000});
}

function removePwa(appName) {
  // Entry criteria?
  // - Make sure the app is in the background
  // - Make sure that you are on the right screen
  // Then
  // - long press `appName` and menu appears
  // Needed to have this one
  driver.pause(1000);

  driver.touchPerform([
    {
      action: 'press',
      options: {element: $(`~${appName}`).elementId},
    },
    {
      action: 'wait',
      // This will skip the delete menu button on iOS 13/14 and make it
      // the same button as for iOS 12
      options: {ms: 3000},
    },
    {
      action: 'release',
    },
  ]);

  // - wait for
  //   ////////////////////////////////////////////////////////////////////////////////////
  //   // iOS 14
  //   // accessibility id             =   -
  //   // -ios predicate string(beta)  =   -
  //   // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]/XCUIElementTypeButton[`name == "DeleteButton"`]
  //   ////////////////////////////////////////////////////////////////////////////////////
  //   // iOS 13
  //   // accessibility id             =   -
  //   // -ios predicate string(beta)  =   -
  //   // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]/XCUIElementTypeButton[`name == "DeleteButton"`]
  //   ////////////////////////////////////////////////////////////////////////////////////
  //   // iOS 12 is different in comparison to 13/14. It has the wobly icons and gives a cross on the icon
  //   // accessibility id             =   -
  //   // -ios predicate string(beta)  =   -
  //   // -ios class chain(beta)       =   **/XCUIElementTypeIcon[`label == "Swag Labs"`]/XCUIElementTypeButton[`name == "DeleteButton"`]
  //   ////////////////////////////////////////////////////////////////////////////////////
  let appDeleteButton = `-ios class chain:**/XCUIElementTypeIcon[\`label == "${appName}"\`]/XCUIElementTypeButton[\`name == "DeleteButton"\`]`
  $(appDeleteButton).waitForDisplayed({timeout: DEFAULT_TIMEOUT});
  // Due to all kinds of iOS animations we need to wait for a bit to make it more stable
  driver.pause(1000);

  // - Press it
  $(appDeleteButton).click();

  /**
   * NOTE:
   * if you use `autoAcceptAlert` in the caps it will automatically delete the app.
   * If that is what you want then remove the comments from the below code
   **/
  // // - Wait for
  // //   ////////////////////////////////////////////////////////////////////////////////////
  // //   // iOS 14
  // //   // accessibility id             =   Delete
  // //   // -ios predicate string(beta)  =   label == "Delete"
  // //   // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Delete"`]
  // //   ////////////////////////////////////////////////////////////////////////////////////
  // //   // iOS 13
  // //   // accessibility id             =   Delete
  // //   // -ios predicate string(beta)  =   label == "Delete"
  // //   // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Delete"`]
  // //   ////////////////////////////////////////////////////////////////////////////////////
  // //   // iOS 12
  // //   // accessibility id             =   Delete
  // //   // -ios predicate string(beta)  =   label == "Delete"
  // //   // -ios class chain(beta)       =   **/XCUIElementTypeButton[`label == "Delete"`]
  // //   ////////////////////////////////////////////////////////////////////////////////////
  // // - Press it
  // const deleteButtonSelector = `-ios predicate string:label == "Delete"`
  // $(deleteButtonSelector).waitForDisplayed({timeout: DEFAULT_TIMEOUT});
  // // Due to all kinds of iOS animations we need to wait for a bit to make it more stable
  // driver.pause(500)
  // $(deleteButtonSelector).click();
  // $(deleteButtonSelector).waitForDisplayed({timeout: DEFAULT_TIMEOUT, reverse: true});

  // - Verify that `appName` is not there anymore, but only do that when the Dock is visble again
  $('~Dock').waitForDisplayed()
  $(`~ ${appName}`).waitForDisplayed({timeout: DEFAULT_TIMEOUT, reverse: true});

  // Make sure it's done
  //$('~Done').click() // => This button is not showed given back by the XCUITestDriver for all platform versions
  // so we use a workaround here
  driver.execute('mobile:pressButton', {name:'home'});
}

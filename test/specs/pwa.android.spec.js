const DEFAULT_TIMEOUT = 15000;

describe('An Android PWA', () => {
    beforeAll(()=>{
        storeIosPwa();
    });

    beforeEach(()=> openPwa());
    afterEach(()=> driver.background(-1));

    it('should be able to download the PWA', () => {
        // Accept the cookie
        $('#cookiebanner').waitForDisplayed(DEFAULT_TIMEOUT);
        $('.cookies--btn.btn--green').click();
        $('#cookiebanner').waitForDisplayed(DEFAULT_TIMEOUT, true);

        // This is for demo purpose
        driver.pause(10000);

        // This succeeds, but not in the right context
    });
});

/**
 * Store the PWA on the home screen
 */
function storeIosPwa(){
    // Open the URL
    driver.url('https://www.smashingmagazine.com');

    // Switch to native context
    driver.switchContext('NATIVE_APP');

    // Open the menu
    $('~More options').click();

    // Click on add to home
    $('~Add to Home screen').click();

    // Wait for the pop-up
    $('//*[contains(@text, "ADD")]').waitForDisplayed(DEFAULT_TIMEOUT);
    $('//*[contains(@text, "ADD")]').click();
    $('//*[contains(@text, "ADD AUTOMATICALLY")]').waitForDisplayed(DEFAULT_TIMEOUT);
    $('//*[contains(@text, "ADD AUTOMATICALLY")]').click();

    // // Terminating the app will remove it from the emulator, because it's the same appid
    // driver.terminateApp('com.android.chrome');

    // Put the app to the background
    driver.background(-1);
}

/**
 * Open the PWA
 */
function openPwa(){
    // Wait for the icon on the home screen
    $('~Smashing').waitForDisplayed(DEFAULT_TIMEOUT);
    $('~Smashing').click();

    // There is only a `NATIVE_APP|CHROMIUM` context
    driver.switchContext('CHROMIUM');
}

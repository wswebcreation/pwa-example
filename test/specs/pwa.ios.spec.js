const DEFAULT_TIMEOUT = 15000;

describe('An iOS PWA', () => {
    beforeAll(() => {
        storeIosPwa();
    });

    beforeEach(() => openPwa());
    afterEach(() => driver.background(-1));

    it('should be able to close the cookie bar', () => {
        /**
         * Start interacting with the app
         */
        // Accept the cookie
        $('#cookiebanner').waitForDisplayed(DEFAULT_TIMEOUT);
        $('.cookies--btn.btn--green').click();
        $('#cookiebanner').waitForDisplayed(DEFAULT_TIMEOUT, true);
    });

    it('should be able to find articles about PWAs in the app', () => {
        // Open search
        $('#menu-button').click();

        // Wait for search and search for PWA and submit
        $('#js-search-input').waitForDisplayed(DEFAULT_TIMEOUT);
        $('#js-search-input').setValue('PWA\uE007');

        // Wait for the title and assert that it contains more than 1 article
        $('.article--post').waitForDisplayed(DEFAULT_TIMEOUT);

        expect($$('.article--post').length).toBeGreaterThan(0);
    });
});

/**
 * Store an iOS PWA to the device
 */
function storeIosPwa() {
    // Open Safari
    // Go to url
    // Wait for loaded
    driver.url('https://www.smashingmagazine.com');

    // Switch to native context
    driver.switchContext('NATIVE_APP');

    // Use ~Share
    $('~Share').click();

    // Wait for the ~ActivityListView
    $('~ActivityListView').waitForDisplayed(DEFAULT_TIMEOUT);

    // Right to left swipe for the ~Add to Home Screen
    openAddToHomeScreen();

    // A new screen will be shown
    // Wait for ~Add and press it
    // @TODO: We skipped the step to change the name of the app
    $('~Add').waitForDisplayed(DEFAULT_TIMEOUT);
    $('~Add').click();

    // Wait till the icon is visible because then we know sure that Safari is already in the background
    $('~Smashing').waitForDisplayed(15000);
}

/**
 * Scroll till you find the `~Add to Home Screen` button, but only for max 4 times
 *
 * @param {number} amount The amount of scrolls
 */
function openAddToHomeScreen(amount = 0) {
    if (!$('~Add to Home Screen').isDisplayed() && amount < 4) {
        const listRectangles = driver.getElementRect($('~ActivityListView').elementId);

        // The design of the screen is that it contains 2 equal rows,
        // the options are in the second row so take the half of that meaning 0.75% of height
        const y = listRectangles.y + Math.round(listRectangles.height * 0.75);

        driver.touchPerform([
            {
                action: 'press',
                options: {
                    x: listRectangles.width * 0.8,
                    y: y,
                },
            },
            {
                action: 'wait',
                options: {ms: 1000},
            },
            {
                action: 'moveTo',
                options: {
                    x: listRectangles.width * 0.2,
                    y: y,
                },
            },
            {
                action: 'release',
            },
        ]);

        openAddToHomeScreen(amount + 1);
    }

    // If found click on it
    $('~Add to Home Screen').click();
}

/**
 * This method will open the PWA and set it to the right context
 */
function openPwa() {
    driver.switchContext('NATIVE_APP');
    // Wait till the app icon is on the screen (this might take a while)
    // Click on it, in our case it is the ~Smashing
    $('~Smashing').waitForDisplayed(15000);
    // Store the current contexts so they can be filtered out later
    const currentContexts = driver.getContexts();
    $('~Smashing').click();

    let webviewID = 'unknown';
    let blankID;
    let tempWebviewId = 'unknown';

    driver.waitUntil(() => {
        /**
         * This is messy, sorry
         */
            // Remove the `NATIVE_APP` and Safari contexts to have clean array
        const currentPwaContexts = driver.getContexts().filter(context =>
                !currentContexts.find(currentContext => context.id === currentContext.id)
            );

        console.log('\n\ncurrentPwaContexts =', currentPwaContexts, ' \n\n');

        // Don't check anything if there is no data in the array
        if (currentPwaContexts.length === 0) {
            return false;
        }

        // There is an id of a blank page, now check if it changed to become a full page
        if (blankID) {
            // do some magic here
            const title = currentPwaContexts.find(currentContext => currentContext.id === blankID).title;
            webviewID = title.includes('Smashing Magazine — For Web Designers And Developers') ? blankID : false;

            return webviewID
        }

        // First check if there is a blank
        const blank = currentPwaContexts
            .find(currentPwaContext => currentPwaContext.title === '' && currentPwaContext.url === 'about:blank');

        if (blank) {
            blankID = blank.id;
            return false;
        } else {
            console.log('\NN\#### DO SOME MAGIC HERE TO DETERMINE THE LATEST WEBVIEW ####\N\N')
        }
    }, DEFAULT_TIMEOUT);

    driver.switchContext(webviewID);
}

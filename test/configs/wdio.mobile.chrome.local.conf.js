const { config } = require('./wdio.shared.local.appium.conf');

// ==================
// Specify Test Files
// ==================
config.specs = [
    './test/specs/pwa.android.spec.js',
];

// ============
// Capabilities
// ============
config.capabilities = [
    {
        automationName: 'UIAutomator2',
        deviceName: 'Pixel_3_11.0',
        platformName: 'Android',
        platformVersion: '11.0',
        orientation: 'PORTRAIT',
        browserName: 'chrome',
    },
    // {
    //     automationName: 'UIAutomator2',
    //     deviceName: 'Pixel_3_10.0',
    //     platformName: 'Android',
    //     platformVersion: '10.0',
    //     orientation: 'PORTRAIT',
    //     browserName: 'chrome',
    // },
    // {
    //     automationName: 'UIAutomator2',
    //     deviceName: ' Pixel_9.0',
    //     platformName: 'Android',
    //     platformVersion: '9.0',
    //     orientation: 'PORTRAIT',
    //     browserName: 'chrome',
    // },
    // {
    //     automationName: 'UIAutomator2',
    //     deviceName: ' Pixel_8.1',
    //     platformName: 'Android',
    //     platformVersion: '8.1',
    //     orientation: 'PORTRAIT',
    //     browserName: 'chrome',
    // },
];

exports.config = config;

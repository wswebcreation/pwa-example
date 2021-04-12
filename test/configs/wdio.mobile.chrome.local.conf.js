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
        // The defaults you need to have in your config
        automationName: 'UIAutomator2',
        deviceName: 'Pixel_3_10.0',
        platformName: 'Android',
        platformVersion: '10.0',
        orientation: 'PORTRAIT',
        browserName: 'chrome',
        maxInstances: 1,
        // nativeWebScreenshot: true
        // noReset: true,
        // fullReset: false
    },
];

exports.config = config;

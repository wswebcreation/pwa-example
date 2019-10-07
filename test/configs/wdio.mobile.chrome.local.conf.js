const { config } = require('./wdio.shared.conf');

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
        deviceName: 'Pixel3_9.0',
        platformName: 'Android',
        platformVersion: '9.0',
        orientation: 'PORTRAIT',
        browserName: 'chrome',
        maxInstances: 1,
    },
];

exports.config = config;

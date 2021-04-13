const { config } = require('./wdio.shared.sauce.conf');
const build = `PWA: Android Chrome build-${new Date().getTime()}`;

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
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '11.0',
        deviceOrientation: 'portrait',
        browserName: 'chrome', // version 88, does not crash
        appiumVersion: '1.20.2',
        build,
    },
    {
        automationName: 'UIAutomator2',
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '10.0',
        deviceOrientation: 'portrait',
        browserName: 'chrome', // version 88, does not crash
        appiumVersion: '1.20.2',
        build,
    },
    {
        automationName: 'UIAutomator2',
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '9.0',
        deviceOrientation: 'portrait',
        browserName: 'chrome', // version 72 => crashes when clicking on the 'Add Swag Labs...'-banner
        appiumVersion: '1.20.2',
        build,
    },
    {
        automationName: 'UIAutomator2',
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '8.1',
        deviceOrientation: 'portrait',
        browserName: 'chrome', // version 72 => crashes when clicking on the 'Add Swag Labs...'-banner
        appiumVersion: '1.20.2',
        build,
    },
    {
        automationName: 'UIAutomator2',
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '7.1',
        deviceOrientation: 'portrait',
        browserName: 'chrome',  // version 72 => crashes when clicking on the 'Add Swag Labs...'-banner
        appiumVersion: '1.20.2',
        build,
    },
];

exports.config = config;

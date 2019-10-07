const { config } = require('./wdio.shared.conf');

// ==================
// Specify Test Files
// ==================
config.specs = [
    './test/specs/pwa.ios.spec.js',
];

// ============
// Capabilities
// ============
config.capabilities = [
    {
        // The defaults you need to have in your config
        deviceName: 'iPhone X',
        platformName: 'iOS',
        platformVersion: '12.2',
        orientation: 'PORTRAIT',
        browserName: 'safari',
        maxInstances: 1,
        fullContextList: true,
        // Also tried this one but it didn't help
        // includeSafariInWebviews: true,
    },
];

exports.config = config;

const {config} = require('./wdio.shared.sauce.conf');
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
    deviceName: 'Google Pixel?.*',
    automationName: 'UIAutomator2',
    platformName: 'Android',
    deviceOrientation: 'portrait',
    browserName: 'chrome',
    name: 'PWA Test Android',
    build,
  },
];

exports.config = config;

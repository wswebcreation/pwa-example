const {config} = require('./wdio.shared.local.appium.conf');

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
  // Tested with Appium 1.20.2
  {
    deviceName: 'iPhone 11',
    platformName: 'iOS',
    platformVersion: '14.2',
    orientation: 'PORTRAIT',
    browserName: 'safari',
    maxInstances: 1,
    noReset: true,
    // Check if this is needed if we start in the Webview context
    includeSafariInWebviews: true,
  },
  // {
  //   deviceName: 'iPhone 11',
  //   platformName: 'iOS',
  //   platformVersion: '13.7',
  //   orientation: 'PORTRAIT',
  //   browserName: 'safari',
  //   maxInstances: 1,
  //   noReset: true,
  //   // Check if this is needed if we start in the Webview context
  //   includeSafariInWebviews: true,
  // },
  // {
  //   deviceName: 'iPhone XS',
  //   platformName: 'iOS',
  //   platformVersion: '12.4',
  //   orientation: 'PORTRAIT',
  //   browserName: 'safari',
  //   maxInstances: 1,
  //   noReset: true,
  //   // Check if this is needed if we start in the Webview context
  //   includeSafariInWebviews: true,
  // },
];

exports.config = config;

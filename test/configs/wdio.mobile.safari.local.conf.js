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
    noReset: true,
    // If you want to handle the delete of the PWA yourself then put this to false.
    // You then need to adjust the removePwa methods, see the comments in the iOS code.
    autoAcceptAlerts: true,
  },
  // {
  //   deviceName: 'iPhone 11',
  //   platformName: 'iOS',
  //   platformVersion: '13.7',
  //   orientation: 'PORTRAIT',
  //   browserName: 'safari',
  //   noReset: true,
  //   // If you want to handle the delete of the PWA yourself then put this to false.
  //   // You then need to adjust the removePwa methods, see the comments in the iOS code.
  //   autoAcceptAlerts: true,
  // },
  // {
  //   deviceName: 'iPhone XS',
  //   platformName: 'iOS',
  //   platformVersion: '12.4',
  //   orientation: 'PORTRAIT',
  //   browserName: 'safari',
  //   // If you want to handle the delete of the PWA yourself then put this to false.
  //   // You then need to adjust the removePwa methods, see the comments in the iOS code.
  //   autoAcceptAlerts: true,
  //   noReset: true,
  // },
  /**
   * This is for different screen sizes for scrolling
   */
  // {
  //   deviceName: 'iPhone 8',
  //   platformName: 'iOS',
  //   platformVersion: '14.2',
  //   orientation: 'PORTRAIT',
  //   browserName: 'safari',
  //   noReset: true,
  //   // If you want to handle the delete of the PWA yourself then put this to false.
  //   // You then need to adjust the removePwa methods, see the comments in the iOS code.
  //   autoAcceptAlerts: true,
  // },
  // {
  //   deviceName: 'iPhone 8',
  //   platformName: 'iOS',
  //   platformVersion: '12.4',
  //   orientation: 'PORTRAIT',
  //   browserName: 'safari',
  //   noReset: true,
  //   // If you want to handle the delete of the PWA yourself then put this to false.
  //   // You then need to adjust the removePwa methods, see the comments in the iOS code.
  //   autoAcceptAlerts: true,
  // },
];

exports.config = config;

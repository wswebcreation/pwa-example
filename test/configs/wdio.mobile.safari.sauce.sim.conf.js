const {config} = require('./wdio.shared.sauce.conf');
const build = `PWA: iOS Safari build-${new Date().getTime()}`;

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
    deviceName: 'iPhone 11 Simulator',
    platformName: 'iOS',
    platformVersion: '14.3',
    orientation: 'PORTRAIT',
    browserName: 'safari',
    // If you want to handle the delete of the PWA yourself then put this to false.
    // You then need to adjust the removePwa methods, see the comments in the iOS code.
    autoAcceptAlerts: true,
    build,
  },
  {
    deviceName: 'iPhone 11 Simulator',
    platformName: 'iOS',
    platformVersion: '13.4',
    orientation: 'PORTRAIT',
    browserName: 'safari',
    // If you want to handle the delete of the PWA yourself then put this to false.
    // You then need to adjust the removePwa methods, see the comments in the iOS code.
    autoAcceptAlerts: true,
    build,
  },
  {
    deviceName: 'iPhone XS Simulator',
    platformName: 'iOS',
    platformVersion: '12.4',
    orientation: 'PORTRAIT',
    browserName: 'safari',
    // If you want to handle the delete of the PWA yourself then put this to false.
    // You then need to adjust the removePwa methods, see the comments in the iOS code.
    autoAcceptAlerts: true,
    build,
  },
];

exports.config = config;

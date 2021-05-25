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
    // Using a private device here, but you can change it to whatever phone you like
    // deviceName: 'iPhone XS',
    deviceName: 'iPhone_Xr_12_real',
    platformName: 'iOS',
    orientation: 'PORTRAIT',
    browserName: 'safari',
    // If you want to handle the delete of the PWA yourself then put this to false.
    // You then need to adjust the removePwa methods, see the comments in the iOS code.
    autoAcceptAlerts: true,
    name: 'PWA Test iOS',
    build,
  },
];

exports.config = config;

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
  /**
   * Android 10 and 11 on Sauce use Chrome 88 or higher
   */
  {
    automationName: 'UIAutomator2',
    deviceName: 'Android GoogleAPI Emulator',
    platformName: 'Android',
    platformVersion: '11.0',
    deviceOrientation: 'portrait',
    browserName: 'chrome',
    appiumVersion: '1.20.2',
    build,
  },
  {
    automationName: 'UIAutomator2',
    deviceName: 'Android GoogleAPI Emulator',
    platformName: 'Android',
    platformVersion: '10.0',
    deviceOrientation: 'portrait',
    browserName: 'chrome',
    appiumVersion: '1.20.2',
    build,
  },
  /**
   * The following versions use Chrome 72, they crash when we click on the 'Add Swag Labs...'-banner
   */
  // {
  //   automationName: 'UIAutomator2',
  //   deviceName: 'Android GoogleAPI Emulator',
  //   platformName: 'Android',
  //   platformVersion: '9.0',
  //   deviceOrientation: 'portrait',
  //   browserName: 'chrome',
  //   appiumVersion: '1.20.2',
  //   build,
  // },
  // {
  //   automationName: 'UIAutomator2',
  //   deviceName: 'Android GoogleAPI Emulator',
  //   platformName: 'Android',
  //   platformVersion: '8.1',
  //   deviceOrientation: 'portrait',
  //   browserName: 'chrome',
  //   appiumVersion: '1.20.2',
  //   build,
  // },
  // {
  //   automationName: 'UIAutomator2',
  //   deviceName: 'Android GoogleAPI Emulator',
  //   platformName: 'Android',
  //   platformVersion: '7.1',
  //   deviceOrientation: 'portrait',
  //   browserName: 'chrome',
  //   appiumVersion: '1.20.2',
  //   build,
  // },
];

exports.config = config;

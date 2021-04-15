const { config } = require('./wdio.shared.conf');

// ======
// Appium
// ======
config.services = config.services.concat([
  [
    'appium',
    {
      // This will use the globally installed version of Appium
      command: 'appium',
      args: {
        // Auto download ChromeDriver
        relaxedSecurity: true,
      },
    },

  ],
]);

// =====================
// Server Configurations
// =====================
//
config.port = 4723;

exports.config = config;

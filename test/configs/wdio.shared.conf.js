exports.config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',

    // ==================
    // Specify Test Files
    // ==================
    // can be found in:
    // - wdio.mobile.chrome.local.conf.js
    // - wdio.mobile.safari.local.conf.js
    // - wdio.mobile.chrome.sauce.emu.conf.js
    // - wdio.mobile.safari.sauce.sim.conf.js

    // ============
    // Capabilities
    // ============
    maxInstances: 100,
    // For the rest see the specific configs

    // ===================
    // Test Configurations
    // ===================
    logLevel: 'silent',
    baseUrl: 'https://www.saucedemo.com',
    waitforTimeout: 15000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineOpts: {
        defaultTimeoutInterval: 180000,
    },
    services: [],

    // =====
    // Hooks
    // =====
}

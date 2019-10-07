exports.config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',

    // ============
    // Capabilities
    // ============
    maxInstances: 100,
    // For the rest see the specific configs

    // ===================
    // Test Configurations
    // ===================
    logLevel: 'silent',
    baseUrl: 'https://www.smashingmagazine.com',
    waitforTimeout: 15000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 180000,
    },
    port: 4723,

    // =====
    // Hooks
    // =====
    beforeSession: function() {
        require('@babel/register');
    },
}

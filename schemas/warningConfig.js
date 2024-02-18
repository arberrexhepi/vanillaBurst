
window.warningConfig = function warningConfig(sharedParts) {
    let warningConfig = {};
    passedConfig = {
        'warning': {
            'role': 'parent',
            'dir': 'client/views/warning/',
            'functionFile': 'warning',
            'render': 'pause',
            'originBurst': {'namespace':'warning'},
            'htmlPath': 'client/views/warning/warning.html',
            'cssPath': 'client/views/warning/warning.css',
            'targetDOM': 'viewbox'
        },
        ...sharedParts

    };
    warningConfig = {...vanillaConfig('warning', passedConfig)};
    return warningConfig;
};
        
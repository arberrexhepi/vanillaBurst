window.level2Config = function level2Config() {
    let level2Config = {
        'level2': {
            'dir': 'client/views/level2/',
            'functionFile': 'level2',
            'render': 'pause',
            'originBurst': 'level2',
            'htmlPath': 'client/views/level2/level2.html',
            'cssPath': 'client/views/level2/level2.css',
            'targetDOM': 'vanillaBurst' // Consider a more specific target for level-specific content
        }
    };

    return level2Config;
};

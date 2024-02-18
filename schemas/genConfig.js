window.genConfig = function genConfig(sharedParts) {
  
  let genConfig = {};
  
   passedConfig = {
      'gen': {
        'role':'parent',
        'dir': 'client/views/gen/',
        'functionFile': 'gen',
        'render': 'pause',
        'originBurst': 'gen',
        'htmlPath':'client/views/gen/gen.html',
        'cssPath':'client/views/gen/gen.css',
        'targetDOM':'viewbox',
        'subDOM':{
          'button':{
          'htmlDir':'client/components/buttons/docbutton.html',
          'cssDir':'client/components/buttons/buttons.css',
          'htmlTarget':'button-wrapper',
          'id':'docbutton',
          'class':'button round'
        },
        'parent-node':{
          'htmlDir':'client/views/gen/components/parent-node.html',
          'cssDir':'client/views/gen/components/gen.css',
          'htmlTarget':'parent-node',
          'id':'parent-node',
          'class':'parent-node'
        }
        }
      },
      ...sharedParts
    }

    genConfig = {...vanillaConfig('gen', passedConfig)}

  
  return genConfig;

  };
  
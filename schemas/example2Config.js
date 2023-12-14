window.sharedFunction2Config = function sharedFunction2Config(burstTo) {
  
  
  let sharedFunction2Config = {
       'sharedFunction2': {
         'dir': 'client/views/app/functions/',
         'functionFile': 'sharedFunction2',
         'render': 'pause',
         'htmlPath': 'client/components/close/close.html',
         'cssPath': 'client/components/close/close.css',
         'targetDOM':'button-wrapper',
         'originBurst': {
             'namespace':burstTo
         },
        
       },

     }
 
   return sharedFunction2Config;
 
   };
   
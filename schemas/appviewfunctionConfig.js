window.appviewfunctionConfig = function appviewfunctionConfig(burstTo) {
  
  
  let appviewfunctionConfig = {
       'appviewfunction': {
         'dir': 'client/views/app/functions/',
         'functionFile': 'appviewfunction',
         'render': 'pause',
         'originBurst': {
             'namespace':burstTo
         }
       },

     }
 
   return appviewfunctionConfig;
 
   };
   
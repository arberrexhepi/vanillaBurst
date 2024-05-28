// ë.frozenVanilla(
//   "stateScripts",
//   function (stateTag, stateTagPath, loadParams, historyCount, originBurst) {
//     console.log(`Preloading state: ${stateTag}`);

//     const scriptUrls = ë.schema[stateTag].scripts;
//     const preloaderUrl = ë.schema[stateTag].preloader;
//     const nonceString2 = ë.nonceBack(); // Fetch nonceString2 once
//     alert(nonceString2);
//     function loadScript(url, nonceString2) {
//       return new Promise((resolve, reject) => {
//         let script = document.querySelector(`script[src="${url}"]`);
//         if (script) {
//           document.head.removeChild(script);
//         }
//         script = document.createElement("script");
//         script.src = url;
//         script.type = "text/javascript";
//         script.setAttribute("name", "burst");
//         script.setAttribute("nonce", nonceString2);
//         script.onload = () => resolve(script);
//         script.onerror = () =>
//           reject(new Error(`Failed to load script at ${url}`));
//         document.head.appendChild(script);
//       });
//     }

//     function addScriptToHead(url, nonceString2) {
//       let script = document.querySelector(`script[src="${url}"]`);
//       if (script) {
//         document.head.removeChild(script);
//       }
//       script = document.createElement("script");
//       script.type = "text/javascript";
//       script.src = url;
//       script.setAttribute("nonce", nonceString2);
//       document.head.appendChild(script);
//     }

//     function loadScriptAndRunFunction(scriptUrls, preloaderUrl, nonceString2) {
//       return loadScript(preloaderUrl, nonceString2)
//         .then(() => {
//           addScriptToHead(preloaderUrl, nonceString2);
//           ë.preloaderAnimation();
//           return Promise.all(
//             scriptUrls.map((url) =>
//               loadScript(url, nonceString2).then(() =>
//                 addScriptToHead(url, nonceString2)
//               )
//             )
//           );
//         })
//         .then(() => {
//           if (typeof ë.render === "function") {
//             return true;
//           }
//         })
//         .catch((error) => {
//           throw error;
//         });
//     }

//     loadScriptAndRunFunction(scriptUrls, preloaderUrl, nonceString2)
//       .then(() => {
//         ë.removeLoader();
//       })
//       .catch((error) => {
//         console.error("Error loading script:", error);
//         return Promise.reject(error); // Reject the promise
//       });
//   }
// );

//[WIP]

// ë.frozenVanilla(
//   "serverBurstSubscribe",
//   async function (vanillaPromise, dataSchema, burstTime, callBack) {
//     while (true) {
//       try {
//         let serverBurstSubscribeResponse;
//         if (vanillaPromise && typeof vanillaPromise === "function") {
//           alert("yo");
//           serverBurstSubscribeResponse = await ë.serverRender(dataSchema);
//           const serverBurstSubscribeResponseParsed = JSON.parse(
//             serverBurstSubscribeResponse
//           );

//           if (callBack && typeof callBack === "function")
//             callBack(serverBurstSubscribeResponseParsed);
//           await new Promise((resolve) => setTimeout(resolve, burstTime));
//         }
//       } catch (error) {
//         throw new Error("serverBurst Subscribe Failed" + error);
//       }
//     }
//   }
// );

ë.frozenVanilla(
  "serverRender",
  function (data, runData, popstateEvent, originBurst) {
    if (data && data !== null) {
      return new Promise((resolve, reject) => {
        const url = data.url;
        const method = data.method;
        const mode = data.mode || null;
        const referralPolicy = data.referralPolicy || null;
        const redirect = data.redirect || null;
        const credentials = data.redirect || null;
        const cache = data.cache || null;
        const sustainData = data;
        const returnResult = sustainData.returnResult;
        const target = sustainData.resultTarget;
        const resultTarget = target + "Result";
        let requestData = data.data;
        let headersObject = data.headers || {};
        let headers;
        // Prepare headers and data for the request
        if (headersObject) {
          headers = new Headers(headersObject);
          if (headers.get("Content-Type") === "application/json") {
            requestData = JSON.stringify(requestData);
          }
        } else {
          headers["Content-Type"] =
            "application/x-www-form-urlencoded; charset=UTF-8";
          if (typeof requestData === "object") {
            requestData = new URLSearchParams(requestData).toString();
          }
        }

        ë.preloaderAnimation();

        let dataMethod = {};
        if (method === "POST") {
          dataMethod = {
            method: method,
            headers: headers,
            body: requestData,
          };
          requestMethod(url, dataMethod, method, headers, requestData);
        } else if (
          typeof method === "string" &&
          (method === "POST" || method === "GET")
        ) {
          dataMethod = {
            headers: headers,
          };
          if (method === "POST") {
            dataMethod.body = requestData;
          }
          requestMethod(url, dataMethod, method, headers);
        }

        function requestMethod(url, dataMethod) {
          const urlObj = new URL(url);

          const constantUrl = url;

          // // Check if the hostnames match

          fetch(url, { ...dataMethod })
            .then((response) => {
              // Handle response based on the content type
              ë.logSpacer("Response status: ", response.status);
              ë.logSpacer(
                "Response headers: ",
                Array.from(response.headers.entries())
              );
              const contentType = response.headers.get("Content-Type");
              if (contentType && contentType.includes("application/json")) {
                return response.json();
              }
              return response.text();
            })
            .then((responseData) => {
              //ë.removeLoader();
              responseData = JSON.stringify(responseData);
              if (responseData.length) {
                if (returnResult && returnResult === true) {
                  resolve(responseData);
                  result = responseData;
                  let targetResult = {};

                  targetResult[resultTarget] = {
                    value: result,
                    writable: false, // property cannot be changed
                    configurable: true, // property can be deleted
                  };

                  Object.freeze(targetResult);
                  runFunction = true;
                  resolve(targetResult);
                  return targetResult;
                } else {
                  ë.logSpacer("Server response successful and resolving here");

                  resolve(responseData);
                }
              }
            })
            .catch((error) => {
              ë.logSpacer("Error in fetch: ", error);
              reject(error);
            });
        }
      });
    }
  }
);

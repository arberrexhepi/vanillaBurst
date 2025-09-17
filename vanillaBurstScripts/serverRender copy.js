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
  async function (data, runData, queue, indexResult) {
    // alert("getting data " + JSON.stringify(data));
    if (data && data !== null) {
      return new Promise((resolve, reject) => {
        let url = data.url;
        const method = data.method;
        const mode = data.mode || null;
        const referralPolicy = data.referralPolicy || null;
        const redirect = data.redirect || null;
        const credentials = data.credentials || null;
        const cache = data.cache || null;
        const sustainData = data;
        const returnResult = sustainData.returnResult;
        const target = sustainData.resultTarget;
        const resultTarget = target + "Result";
        let requestData = data.data;
        let headersObject = data.headers || {};
        let headers;
        //for edit: so we will be checking if we are streaming first
        //for edit: let stream = data.stream || null;

        // Determine the appropriate headers and data formatting
        if (Object.keys(headersObject).length === 0) {
          headersObject["Content-Type"] = "application/json";
        }

        headers = new Headers(headersObject);

        // Handle data formatting based on the request method and content type
        if (method === "POST") {
          if (headers.get("Content-Type") === "application/json") {
            requestData = JSON.stringify(requestData);
          } else if (
            headers.get("Content-Type") === "application/x-www-form-urlencoded"
          ) {
            requestData = new URLSearchParams(requestData).toString();
          } else {
            // Handle other content types if necessary
            if (typeof requestData === "object") {
              requestData = JSON.stringify(requestData);
            }
          }
        } else if (method === "GET") {
          if (typeof requestData === "object") {
            // Append data as query parameters for GET requests
            const urlParams = new URLSearchParams(requestData).toString();
            url += `?${urlParams}`;
            requestData = null; // No body for GET requests
          }
        }

        //ë.preloaderAnimation();

        let dataMethod = {
          method: method,
          headers: headers,
        };

        if (method === "POST") {
          dataMethod.body = requestData;
        }

        requestMethod(url, dataMethod);

        async function requestMethod(url, dataMethod) {
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
              ë.logSpacer("Response data: ", responseData);
              // Check if the Content-Type is application/json
              if (headers.get("Content-Type") === "application/json") {
                // Ensure that responseData is a string before parsing
                if (typeof responseData === "string") {
                  try {
                    responseData = JSON.parse(responseData); // Parse the JSON string into a JavaScript object
                  } catch (error) {
                    console.error("Failed to parse JSON:", error);
                    reject(new Error("Invalid JSON response"));
                    return;
                  }
                }
              }
              if (responseData) {
                if (returnResult && returnResult === true) {
                  let targetResult = {};

                  if (queue === true) {
                    // Initialize targetResult[resultTarget] as an object if not already initialized
                    if (!targetResult[resultTarget]) {
                      targetResult[resultTarget] = {};
                    }

                    // Spread both indexResult and responseData into targetResult[resultTarget]
                    targetResult[resultTarget] = {
                      ...indexResult, // New index result data
                      ...responseData, // New response data
                    };
                  } else {
                    targetResult[resultTarget] = {
                      value: responseData,
                      writable: false, // property cannot be changed
                      configurable: true, // property can be deleted
                    };
                  }

                  Object.freeze(targetResult);
                  resolve(targetResult);
                } else {
                  console.log("Server response successful and resolving here");
                  resolve(responseData);
                }
              } else {
                reject(new Error("Empty response data"));
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

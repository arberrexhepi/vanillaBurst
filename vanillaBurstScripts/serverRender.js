let streamingDone = false;
ë.frozenVanilla(
  "serverRender",
  async function (data, runData, queue, indexResult) {
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
        let stream = data.stream || false; // Check if streaming is enabled

        // Determine headers
        if (Object.keys(headersObject).length === 0) {
          headersObject["Content-Type"] = "application/json";
        }

        headers = new Headers(headersObject);

        // Format data based on method
        if (method === "POST") {
          if (headers.get("Content-Type") === "application/json") {
            requestData = JSON.stringify(requestData);
          } else if (
            headers.get("Content-Type") === "application/x-www-form-urlencoded"
          ) {
            requestData = new URLSearchParams(requestData).toString();
          } else {
            if (typeof requestData === "object") {
              requestData = JSON.stringify(requestData);
            }
          }
        } else if (method === "GET") {
          if (typeof requestData === "object") {
            const urlParams = new URLSearchParams(requestData).toString();
            url += `?${urlParams}`;
            requestData = null;
          }
        }

        let dataMethod = {
          method: method,
          headers: headers,
        };

        if (method === "POST") {
          dataMethod.body = requestData;
        }
        //stream = true;
        if (stream) {
          handleStreamingResponse(
            url,
            dataMethod,
            resolve,
            reject,
            returnResult,
            queue,
            indexResult,
            resultTarget
          );
        } else {
          handleStandardResponse(
            url,
            dataMethod,
            resolve,
            reject,
            returnResult,
            queue,
            indexResult,
            resultTarget
          );
        }
      });
    }
  }
);

/**
 * Handles standard (non-streaming) fetch response
 */
async function handleStandardResponse(
  url,
  dataMethod,
  resolve,
  reject,
  returnResult,
  queue,
  indexResult,
  resultTarget
) {
  fetch(url, { ...dataMethod })
    .then((response) => {
      ë.logSpacer("Response status: ", response.status);
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return response.text();
    })
    .then((responseData) => {
      processFinalResponse(
        responseData,
        resolve,
        reject,
        returnResult,
        queue,
        indexResult,
        resultTarget
      );
    })
    .catch((error) => {
      ë.logSpacer("Error in fetch: ", error);
      reject(error);
    });
}

/**
 * Handles streaming response
 */
async function handleStreamingResponse(
  url,
  dataMethod,
  resolve,
  reject,
  returnResult,
  queue,
  indexResult,
  resultTarget
) {
  fetch(url, { ...dataMethod })
    .then((response) => {
      if (!response.body) throw new Error("No response body for streaming");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      function processStream({ done, value }) {
        if (done) {
          processFinalResponse(
            accumulatedResponse,
            resolve,
            reject,
            returnResult,
            queue,
            indexResult,
            resultTarget
          );
          return;
        }
        streamingDone = false;
        let uniqueId = crypto.randomUUID();
        let chunk = null;
        chunk = decoder.decode(value, { stream: true });
        function safeJSONParse(input) {
          try {
            // Attempt normal parse
            return JSON.parse(input);
          } catch (e) {
            try {
              input = input.replace(/}\s*{/g, "},{").replace(/]\s*\[/g, "],[");
              input = (input || "").trim();

              // Attempt to parse batched input: }{ -> },{ or ][ -> ],[
              const batched =
                "[" +
                input.replace(/}\s*{/g, "},{").replace(/]\s*\[/g, "],[") +
                "]";
              return JSON.parse(batched);
            } catch (err) {
              console.warn("Failed to parse stream input:", input);
              return null;
            }
          }
        }
        chunk = safeJSONParse(chunk);
        chunk["uniqueId"] = uniqueId; // Add unique ID to chunk

        accumulatedResponse = chunk; // Append new data to the response
        try {
          chunk = JSON.parse(chunk);
        } catch (error) {
          chunk = chunk;
        }
        if (
          (chunk &&
            chunk !== "" &&
            typeof chunk === "object" &&
            (chunk.stream_status === "done" ||
              (chunk.stream_type === "stream_status" &&
                chunk.stream_data === "done"))) ||
          chunk.success === false ||
          chunk.success === true
        ) {
          ë.logSpacer("Stream status: ", chunk.stream_status);
          ë.signalStore.set(
            `accumulatedResponse_${resultTarget}`,
            accumulatedResponse
          );
          streamingDone = true;
        } else {
          ë.logSpacer(chunk);
          //generate unique id
          console.log(resultTarget);
          console.log("chunk", chunk);
          ë.signalStore.set(`stream_${resultTarget}`, chunk);
          ë.signalStore.set(
            `accumulatedResponse_${resultTarget}`,
            accumulatedResponse
          );
        }

        //ë.logSpacer("Accumulated response: ", accumulatedResponse);
        reader.read().then(processStream);
      }

      return reader.read().then(processStream);
    })
    .catch((error) => {
      ë.logSpacer("Error in streaming fetch: ", error);
      reject(error);
    });
}

/**
 * Processes the final response to match expected client format
 */
function processFinalResponse(
  responseData,
  resolve,
  reject,
  returnResult,
  queue,
  indexResult,
  resultTarget
) {
  try {
    if (typeof responseData === "string") {
      responseData = JSON.parse(responseData);
    }
  } catch (error) {
    console.log(responseData);
    console.error("Failed to parse JSON:", error);
    reject(new Error("Invalid JSON response"));
    return;
  }

  if (responseData) {
    if (returnResult && returnResult === true) {
      let targetResult = {};

      if (queue === true) {
        if (!targetResult[resultTarget]) {
          targetResult[resultTarget] = {};
        }

        targetResult[resultTarget] = {
          ...indexResult,
          ...responseData,
        };
      } else {
        targetResult[resultTarget] = {
          value: responseData,
          writable: false,
          configurable: true,
        };
      }

      Object.freeze(targetResult);
      resolve(targetResult);
    } else {
      ë.logSpacer("Server response successful and resolving here");
      resolve(responseData);
    }
  } else {
    reject(new Error("Empty response data"));
  }
}

ë.frozenVanilla(
  "serverRenderSignal",
  async function ({
    signal,
    calling,
    vanillaPromise,
    callback,
    dataSchema,
    renderAction = "serverBurst",
    onFinish = null,
  }) {
    // 1. Init/clear the signal
    ë.signalStore.set(signal, "");

    // 2. Subscribe the callback
    if (callback && typeof callback === "function") {
      ë.vanillaAccessor(vanillaPromise, signal, [calling, callback]);
    } else {
      ë.vanillaAccessor(vanillaPromise, signal, calling);
    }

    // 3. Await server render (or whatever async action)
    const result = await serverRender(dataSchema, renderAction);
    if (streamingDone) {
      // 4. Cleanup: clear signal and unsubscribe callback
      onFinish?.(result); // Call onFinish if provided
      ë.clearSignal(signal, callback);
    }
    return result;
  }
);

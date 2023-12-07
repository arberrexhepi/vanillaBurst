window.serverRender = async function serverRender(data, runData, serverResult, popstateEvent, originBurst) {
    runData = window.runData;
    if (runData === "serverBurst") {
        return new Promise((resolve, reject) => {
            if (window.serverResult) {
                serverResult = window.serverResult;
            } else {
                serverResult = {};
                window.serverResult = serverResult;
            }

            const url = window.data.url;
            const method = window.data.method;
            const mode = window.data.mode || null;
            const referralPolicy = window.data.referralPolicy || null;
            const redirect = window.data.redirect || null;
            const credentials = window.data.redirect || null;
            const cache = window.data.cache || null;
            const sustainData = window.data;
            const returnResult = sustainData.returnResult;
            console.log("server has got data ", sustainData.resultTarget);
            const target = sustainData.resultTarget;
            const resultTarget = target + 'Result';
            let requestData = window.data.data;
            let headers = {};

            // Prepare headers and data for the request
            if (window.data.contentType) {
                headers['Content-Type'] = window.data.contentType;
                if (window.data.contentType.includes('application/json')) {
                    requestData = JSON.stringify(requestData);
                }
            } else {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                if (typeof requestData === 'object') {
                    requestData = new URLSearchParams(requestData).toString();
                }
            }

            window.preloaderAnimation();
   
            let dataMethod = {};
            if (method==='POST'){
                dataMethod = {
                    method: method,
                    headers: headers,
                    body
                    : requestData
                }
                requestMethod(url, dataMethod, method, headers, requestData)

            }
            else if(method === 'GET'){
                dataMethod = null;
                requestMethod(url, dataMethod, method, headers)

            }
         
            function requestMethod(url, dataMethod){

            fetch(url, 
                {...dataMethod}).then(response => {
                // Handle response based on the content type
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                }
                return response.text();
            }).then(responseData => {
                window.removeLoader();
                console.log(JSON.stringify(responseData));
                if (responseData.length) {
                    if (returnResult && returnResult === "true") {
                        resolve(responseData);

                        result = responseData;
                        console.log("server result at serverRender" + result);

                        runFunction = "functionBurst";
                        serverResult[resultTarget] = result;
                        window.serverResult = serverResult;
                    } else {
                        console.log('done');
                        resolve(responseData);

                        runFunction = "functionBurst";
                        return window.runFunction;
                    }
                }
            }).catch(error => {
                console.error("Error in fetch: ", error);
                reject(error);
            });
        }
        });

        
        
    }
}

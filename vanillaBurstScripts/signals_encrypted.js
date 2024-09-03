//test from here TO DO
//WIP not implemented
ë.frozenVanilla(
  "signalBurst",
  async function (signalObject, signalFunction, signalResult) {
    signalResult = signalResult;
    if (signalObject === undefined) {
      return;
    }

    async function getDecryptedData(item) {
      let encryptedItem = JSON.parse(localStorage.getItem(item)) || {};
      if (Object.keys(encryptedItem).length === 0) {
        return {};
      }

      let decryptedItem = await decryptData(
        new Uint8Array(Object.values(encryptedItem.encryptedData)),
        encryptedItem.key,
        new Uint8Array(encryptedItem.iv)
      );

      return decryptedItem;
    }

    let originBurst = await getDecryptedData("originBurst");

    if (signalResult === undefined) {
      signalResult = originBurst?.signalBurst?.signalResult;
    }

    if (originBurst?.signalBurst !== undefined) {
      originBurst.signalBurst = {
        ...originBurst.signalBurst,
        [ë.stateRoute]: {
          signal: signalObject,
          signalResult: signalResult,
        },
      };
    } else {
      originBurst["signalBurst"] = {
        [renderSchema.landing]: {
          signal: signalObject,
          signalResult: signalResult,
        },
      };
    }

    let encryptedOriginBurst = await encryptData(originBurst);
    localStorage.setItem("originBurst", JSON.stringify(encryptedOriginBurst));

    if (Array.isArray(signalFunction) && signalFunction.length > 1) {
      let promiseChain = Promise.resolve();

      signalFunction.forEach(function (element) {
        promiseChain = promiseChain.then(function () {
          if (typeof ë[element] === "function") {
            return ë[element](); // Call the function if it's indeed a function
          } else {
            console.error("signalBurst: No such function", element);
          }
        });
      });
    } else {
      if (typeof ë[signalFunction] === "function") {
        ë[signalFunction]();
      } else {
        console.error("signalBurst: No such function", signalFunction);
      }
    }
  }
);

ë.frozenVanilla("getSignal", async function getSignal(signalSend) {
  let encryptedSignalBurst =
    JSON.parse(localStorage.getItem("signalBurst")) || {};
  let encryptedOriginBurst =
    JSON.parse(localStorage.getItem("originBurst")) || {};

  let signalBurst = await decryptData(
    new Uint8Array(Object.values(encryptedSignalBurst.encryptedData)),
    encryptedSignalBurst.key,
    new Uint8Array(encryptedSignalBurst.iv)
  );

  let originBurst = await decryptData(
    new Uint8Array(Object.values(encryptedOriginBurst.encryptedData)),
    encryptedOriginBurst.key,
    new Uint8Array(encryptedOriginBurst.iv)
  );

  if (originBurst?.signalBurst === undefined) {
    signalSend = undefined;
  } else {
    signalSend = signalBurst[signalSend];
  }
  return signalSend;
});

ë.onpopstate = function (event) {
  ë.signalBurst("load", ["getSignal"]);
  ë.runBurst = "functionBurst";
};

async function decryptData(encryptedData, key, iv) {
  const decoder = new TextDecoder();
  const decryptedData = await ë.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );
  return JSON.parse(decoder.decode(decryptedData));
}

///CHUNKING TO DB //TODO
// async function saveStateToDb(state) {
//   const encryptedState = await encryptData(state);
//   // Save encryptedState to the database
// }

// async function loadStateFromDb() {
//   // Load encryptedState from the database
//   const encryptedState = await getEncryptedStateFromDb();
//   const state = await decryptData(encryptedState);
//   return state;
// }

//////
//////// ë TO LOCALSTORAGE AND BACK STRATEGY
/////temporary session (active browsing)
// Initialize the state in memory
// ë.encryptedState = await encryptData(initialState);

// // Update the state in memory as the user interacts with the application
// function updateState(newState) {
//   ë.encryptedState = await encryptData(newState);
// }

// // Save the state to localStorage when the user leaves the page
// ë.addEventListener('beforeunload', function (event) {
//   localStorage.setItem('encryptedState', JSON.stringify(ë.encryptedState));
// });

// ë.addEventListener('beforeunload', async function (event) {
//   // Save the current state to localStorage
//   let originBurst = await getDecryptedData("originBurst");
//   let encryptedOriginBurst = await encryptData(originBurst);
//   localStorage.setItem("originBurst", JSON.stringify(encryptedOriginBurst));
// });

// ë.addEventListener('load', async function (event) {
//   // Load the saved state from localStorage when the page is loaded
//   let encryptedOriginBurst = JSON.parse(localStorage.getItem("originBurst"));
//   if (encryptedOriginBurst) {
//     let originBurst = await decryptData(encryptedOriginBurst);
//     // Continue from where the user left off...
//   }
// });

////localstorage size check
ë.frozenVanilla(
  "storeCheck",
  function () {
    let total = 0;
    for (let x in localStorage) {
      let data = localStorage.getItem(x);
      let storageSizeBytes = new Blob([data]).size;
      let storageSizeKB = storageSizeBytes / 1024;
      total += storageSizeKB;
    }

    return total;
  },
  false
);
let totalCacheKB = ë.frozenVanilla.get("storeCheck")();
if (totalCacheKB > localCacheMax * 0.9) {
  alert("LocalStorage is almost full, clearing...");
  localStorage.clear();
}
ë.logSpacer(
  `Current usage: ${totalCacheKB} KB, limit: ${localCacheMax} KB`,
  null,
  null,
  true
);
/////////////////

//as in "a vanillaMessage..!"
ë.frozenVanilla(
  "vanillaMess",
  function (scoopTag, vanillaMessage, data, typeCheck) {
    if (ë.vanillaStock !== true) {
      new Error().stack;
      return "";
    }

    if (
      (ë.vanillaMessCaller && ë.vanillaMessCaller !== null) ||
      ë.vanillaMessCaller !== undefined
    ) {
      if (
        ë.vanillaMessCaller &&
        ë.vanillaMessCaller !== null &&
        !ë.vanillaMessCaller.includes(scoopTag)
      ) {
        // If scoop is defined but not included in vanillaMessCaller, return nothing

        return;
      }
    }

    let vanillaTableMess = {
      myMessage: `[vanillaScoop: ${scoopTag}]: ${vanillaMessage}`,
      expectingType: typeCheck,
      message: "",
      data: data,
      stack: null,
    };

    if (
      (data && data !== null) ||
      (data && data !== null && typeCheck && typeCheck !== null)
    ) {
      try {
        if (typeCheck === "check") {
          if (data instanceof Text) {
            vanillaTableMess.message += "Instance of Text";
          }
          vanillaTableMess.message +=
            "The data has returned:" + JSON.stringify(data);
          vanillaTableMess.message += "Data type: " + typeof data;
          vanillaTableMess.stack = new Error().stack;
        }
        if (typeCheck === "array" || typeCheck === "array") {
          if (Array.isArray(data)) {
            vanillaTableMess.message += "Data is array: " + data;
            vanillaTableMess.data = JSON.stringify(data);
          } else {
            vanillaTableMess.message += "Data is not an array: ";
            vanillaTableMess.stack = new Error().stack;
          }
        }

        if (typeCheck === "object" || typeCheck === "array") {
          if (
            typeof data === "object" &&
            data !== null &&
            !Array.isArray(data)
          ) {
            if (data instanceof Node) {
              vanillaTableMess.message += "Data is a DOM node";
            } else if (data instanceof Function) {
              vanillaTableMess.message += "Data is a function";
            } else if (data instanceof Date) {
              vanillaTableMess.message += "Data is a date";
            } else if (data instanceof RegExp) {
              vanillaTableMess.message += "Data is a regular expression";
            } else if (data instanceof Text) {
              vanillaTableMess.message += "Instance of Text";
            } else {
              vanillaTableMess.message += "Data is an object";
            }
            vanillaTableMess.data = data;
          } else {
            vanillaTableMess.message += "Data is not an object: ";
            vanillaTableMess.data = data;
          }
        }

        if (typeCheck === "string" || typeCheck === "array") {
          if (typeof data === "string") {
            vanillaTableMess.message += "String is a string";
          } else {
            vanillaTableMess.message += "Data is not a string: ";
          }
        }

        if (typeCheck === "number" || typeCheck === "array") {
          if (typeof data === "number" || data === 0) {
            vanillaTableMess.message += "Number is Number: " + data;
          } else {
            vanillaTableMess.message += "Data is not a number: ";
          }
        }

        if (typeCheck === "boolean" || typeCheck === "array") {
          if (typeof data === "boolean") {
            vanillaTableMess.message += "Boolean: " + true;
            vanillaTableMess.data = data;
          } else {
            vanillaTableMess.message += "Boolean: " + false;
          }
        }

        if (typeCheck === "function" || typeCheck === "array") {
          if (typeof data === "function") {
            vanillaTableMess.message += "Function is Function: " + data.name;
          } else {
            vanillaTableMess.message += "Data is not a function ";
          }
        }

        if (typeCheck === "undefined" || typeCheck === "array") {
          if (typeof data === "undefined") {
            vanillaTableMess.message += "Data is indeed undefined";
          } else {
            vanillaTableMess.message +=
              "Data is not undefined, hope that's what you wanted to hear! ";
          }
        }

        if (typeCheck === "null" || typeCheck === "array") {
          if (data === null) {
            vanillaTableMess.message += "Data is null";
          } else {
            vanillaTableMess.message += "Data is not null";
          }
        }

        if (typeCheck === "symbol" || typeCheck === "array") {
          if (typeof data === "symbol") {
            return true;
          } else {
            vanillaTableMess.message += "Data is not a symbol";
          }
        }

        if (typeCheck === "bigint" || typeCheck === "array") {
          if (typeof data === "bigint") {
            vanillaTableMess.message += "Data is a bigint";
          } else {
            vanillaTableMess.message += "Data is not a bigint";
          }
        }
      } catch (error) {
        runError(
          vanillaTableMess ||
            "[vanillaMess] Something went wrong with the checks",
          error
        );
        vanillaTableMess["error"] = error;
        //throw new Error(vanillaTableMess);
      }
    } else {
      runError(
        ((vanillaTableMess.message = "Data is either undefined, null, or 0"),
        new Error(vanillaTableMess)),
        data
      );
    }
    function runError(vanillaTableMess, data) {
      return vanillaTableMess;
    }

    while (true) {
      vanillaMessage.stack = new Error().stack;
      console.table(vanillaTableMess);
      return console.warn("Scoop Message (see table above)");
    }
  }
);

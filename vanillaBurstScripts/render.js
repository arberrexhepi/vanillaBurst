 /**
 * Asynchronously renders the application based on the provided schema.
 * 
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @global
 * 
 * @description
 * The render function is responsible for initializing the rendering process of the requested state.
 * It iterates over the customFunctions defined in the renderSchema and executes those
 * marked with the role "rollCall" and render mode "burst". It leverages the childFunction
 * to perform the actual rendering logic.
 *  * @throws {ConsoleWarning} If the renderSchema is not provided, a warning is logged.
 */

 window.render = async function render(renderSchema) {
    window.renderSchema = renderSchema;


    if (renderSchema) {
      runRoll = "rollBurst";
      window.runRoll = runRoll;

      getFunctions = window.renderSchema.customFunctions

      for (let functionName in getFunctions) {

        getFunction = getFunctions[functionName];

        if (getFunction.role == "rollCall" && getFunction.render == "burst") {

          window.rollCall = functionName;
          await window.childFunction(renderSchema, rollCall, runRoll);

        }


      }

    }
    else {
      console.warn("There are no views defined in this app");
    }
  }

  window.render = render;

  //render data


  


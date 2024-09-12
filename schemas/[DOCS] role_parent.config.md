ë.frozenVanilla("viewConfig", function () {

//required
let seo = {
title: "vanilla JS Framework",
description:
"",
keywords: [],
author: "",
image: ë.baseUrlImages + "og.png",
url: ë.domainUrl + ë.stateTagPath,
siteName: "",
};

//required
let viewConfig = {
view: {
role: "parent", //required
fetchDOM: true, //if view has html and css, //required for views also referred to as role: "parent"
render: "pause", //waits for runtime (99% of the time default pause is correct use)
originBurst: {}, //optional object that can pass default props to the view.js file being configed by viewConfig.js configuration
container: "viewbox", //views are always hooked to viewbox
...{ seo: seo }, //always pass the seo object here
components: { //optional but recommended, optional because fetchDOM pulls html and css and does not require any additional components to actually render
//this is how to declare the components (examples, use actual components for OUTPUT
fetchComponents: {
sample:{
data: [
{
id: "docbutton",
namespace: "homeview",
container: "header-button", //this container needs to be in the view.html
text: "View Documentation",
classNames: "headerbutton mydocbutton", //classNames to add to the component
//add any additional data that should be passed to component

},
//to call this component more than once simply add an additional object in the data array. Make sure container is targeted specifically where each needs to appear (although same container is possible without overrides.
{
... same format, different or same container, different ids
}
],
}
//below are more examples
mynav: {
data: [
{
id: "mainNav", //this container sh
namespace: "homeview", //by passing namespace to component, you can control the component render, keeping more of the logic within the component instead of all in this data object.
container: "navigation-container", //this container needs to be in the view.html
text: "Jump to Docs",
route: "documentation",
},
],
},
heroHeader: {
data: [
{
id: "heroHeader-component",
namespace: "homeview",
container: "heroHeader-component", //this container needs to be in the view.html
},
],
},
actionButton: {
data: [
{
id: "docbutton",
namespace: "homeview",
container: "header-button",
text: "View Documentation",
classNames: "headerbutton mydocbutton",
route: "documentation",
},
{
id: "body-actionButton-component",
namespace: "homeview",
container: "body-button", //this container needs to be in the view.html
classNames: "headerbutton mydocbutton",
text: "Jump to Docs",
route: "documentation",
},
],
},
},
},
},

};

return (viewConfig = { ...vanillaConfig("view", viewConfig) }); //required
});

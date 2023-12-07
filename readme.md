vanillaBurst
Copyright arbër inc

www.arber.inc
www.vanillaburst.com

What is VanillaBurst?
It promotes a disciplined approach to software application design. Defining views and components upfront can serve as both documentation and a blueprint for development, making it clearer for anyone who works on the project to understand the architecture and flow of the application.

Usage 📖
Define Your Schema:
Create a schema that outlines your application's structure, states, and behavior.

Invoke VanillaBurst:
Call the VanillaBurst renderer with your schema via event loadParams to bring your application to life.

Extend and Customize:
Use custom functions, plugins, or extensions to tailor VanillaBurst to your specific needs.

Documentation 📚
For a deep dive into VanillaBurst's concepts, functionalities, and best practices, check out our official documentation.

Contributing 🤝
We will be welcoming contributions! So if you'd like to contribute, stay tuned for updates on when you can fork the repository and make changes as you'd like.

License 📄
This project is currently for arbër inc's use for internal and client purposes but may extend to MIT licensing in the near future.

Support & Feedback 💌
For general support and feedback, please reach out to us at support@vanillaburst.com.

Define a view "part" in routes/config/parts ie. loginmodalConfig.js 
loadSchema.js - load the scripts from routes/config/parts (these are your views)
schema.js - "import" the configs of each of the views and add them to the schema object ie: let loginmodal= window.loginmodalConfig(); 


CAREFUL with 'render':'burst' and 'render':'pause'

Render flag is only for load management on application LOAD. It should ONLY be set to PAUSE if you expect a function to NOT run again for the lifecycle of the app, unless specificially reset to BURST.

Here's additional verbage: On application load, certain functions are set to "pause" to manage loading efficiently.
Once a function is used, its state changes to "burst" to signify that it's now active or has been executed.
Resetting this state back to "pause" after the function has been activated can have unintended consequences by preventing its reactivation or recall when needed.
Since the state is reset when the application is reloaded, there's no need to manually revert it during the application's runtime.
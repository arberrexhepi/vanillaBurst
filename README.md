## **1\. Introduction: The vanillaBurst Architectural Mandate (WIP)**

### **1.1 The Vanilla JS Paradigm and Architectural Philosophy**

The vanillaburst framework represents an architectural decision to return to the core capabilities of JavaScript, leveraging the efficiency and speed inherent in a Vanilla JS approach while providing modern structural guarantees typically associated with heavy frameworks.1 This framework is positioned as a solution for crafting robust web applications without relying on external dependencies or complex build pipelines.1 The design philosophy is rooted in rigorously exploiting the foundational capabilities of the browser platform.

This guiding architectural principle is explicitly articulated as taking "advantage of the platform".3 Rather than reinventing functionalities,

vanillaburst integrates native browser features, including Web Components, Shadow DOM, client-side routing, and PWA APIs, to deliver reactivity and declarative templating.1 This structural solution imposes a high degree of discipline, shifting the project complexity away from managing volatile dependencies and towards rigorous, declarative architectural planning accomplished entirely through configuration files.4 This foundational constraint is instrumental in maintaining the purity of the underlying JavaScript code while guaranteeing a scalable and robust application structure.

### **1.2 Defining the vanillaApp and Core Components**

The final, prepared project built and managed by the framework is uniformly referred to as the vanillaApp.4 The framework is versatile; it can be deployed for greenfield development or integrated into existing JavaScript projects to control their behavior.4

A central goal of the vanillaburst architecture is abstraction, specifically freeing the developer from low-level resource management. The application plan is codified entirely within configurations, which dictate rendering, resource loading, and state orchestration.4 Consequently, the developer's primary focus shifts exclusively to writing application logic within isolated functional units known as

customFunction files, as the framework assumes full responsibility for resource file management and view rendering processes.4 This partitioning of responsibility ensures functional clarity and architectural coherence.

## **2\. Project Initialization and The Config-Driven Architecture**

The operational premise of vanillaburst is its config-driven architecture, which establishes the application structure, dependency loading, and resource management orchestration prior to execution.

### **2.1 Minimal File Structure Requirements**

The framework allows for an extremely lean initial project structure. For basic operation, the system requires only three core files, irrespective of whether the goal is merely file promising or full application control: globals/config.json, viewConfig.js, and view.js.4

This minimal triad suggests a clear separation of architectural concerns established by the framework:

1. **globals/config.json:** This file serves as the main application constant store, managing global settings, application-wide directives, and defining foundational dependencies.
2. **viewConfig.js:** This file specifically orchestrates the structure and rendering promises for individual views or application "landings," mapping components and resources to specific endpoints.4
3. **view.js:** This file contains the entry point for the application logic, typically housing the primary customFunction code that defines the view's functionality.

This mandated structure aligns with common JavaScript modularization principles, encouraging developers to split complex logic by module or component rather than writing a single monolithic file.5

### **2.2 Endpoint-Based Load Balancing and File Delivery**

A critical performance and reliability feature of vanillaburst is its capability for load balancing, which manages the packing and delivery of project files based on the specified endpoint.4 This mechanism guarantees that the

vanillaApp only loads resources necessary for the current view, dramatically reducing initial load times and minimizing potential scope conflicts.

Developers activate specific resource sets by appending the burst query parameter to the URL, such as ?burst=home.4 By linking resource delivery to explicit endpoints defined in the configuration, the framework achieves precise control over the loading sequence and execution scope. The direct benefit of this configuration-driven resource control is heightened reliability, particularly in environments where script loading can be unpredictable (e.g., complex content management systems like WordPress), ensuring that developer functions are guaranteed to fire exactly when and where intended.4

## **3\. The Central Configuration System: Directives and Schemas**

Configuration objects within vanillaburst are not passive settings; they are declarative directives that establish a central, transparent operational contract for the application.4 This declarative approach is the cornerstone of the framework's architecture, enabling predictability and high observability.

### **3.1 configs: Orchestrating the State Rendering Promise**

Configuration objects, collectively referred to as configs, function as a comprehensive set of instructions that govern the state rendering promise of the vanillaBurst application.4 This centralized structure is designed to provide the developer with a "central observable overview" of how an application landing, a

customFunction, or the entire vanillaApp will behave.4

The profound benefit of defining an operational plan through configs is that it systematically automates the rendering process, thereby allowing the developer to focus on pure functionality without manually managing complex file loading and rendering pipelines.4

#### **3.1.1 Core Configuration Manifest: The globals/config.json Breakdown**

The globals/config.json file serves as the core manifest, dictating application routing, resource paths, component packaging, and security policies. Its structure provides a holistic view of the application's intended operational architecture:

- **Routing and Navigation:**
  - **defaultAppRoute**: Specifies the initial view the application loads.
  - **registeredRoutes**: Lists all available high-level application endpoints (e.g., "homeview", "documentation", "generate").
- **Resource Mapping:**
  - **baseUrlIcons, baseUrlImages, baseUrlStyles**: Defines constant base paths for loading assets, centralizing resource management and supporting environment-specific configurations.
- **Component Packaging and Delivery Logic:**
  - **packages**: Defines collections of components that logically belong together (e.g., "appShells" containing "navigation", "heroHeader", "myfooter"). These collections are reusable blocks of application logic.
  - **schemaParts**: Maps a specific route (e.g., "homeview") to the required component packages (e.g., "appShells", "homeviewToppings"). This configuration is crucial for the framework's load balancing, as it dictates exactly which components must be packed and delivered for a given endpoint, ensuring optimal performance and scope isolation.
- **Feature Flags and Vendor Management:**
  - **vanillaScoops**: Enables or disables various optional framework functionalities (e.g., "vanillaAnimation": true, "gptScoop": \["homeview"\]).
  - **vendors**: Specifies app-wide third-party JavaScript dependencies (e.g., "vendors": \["jQuery.min.js"\]).
- **Content Security Policy (CSP):**
  - **trustedSources**: Defines strict security boundaries for the application, categorized by resource type (e.g., img-src, connect-src). This section is mandatory for robust security and explicitly lists all approved domains for connections and asset loading.

### **3.2 Detailed landingConfig Reference: Dependency Scoping**

The viewConfig.js relies on configuration objects, such as landingConfig, that dictate the specific setup, behavioral parameters, and required dependencies for an individual application "landing" or view.4

A significant feature within the configuration system is dependency management via the **vendors** directive, which can be configured at two levels:

1. **Application-Wide Availability (in globals/config.json):** Vendors intended for use across the entire application can be declared in the primary globals/config.json file using the format: "vendors": \["jQuery.min.js"\]. The value must be the filename of the vendor JavaScript file located within the project's dedicated vendors folder. In the future, the framework plans to support passing CDN links, which will necessitate allowing these external sources within the trustedSources configuration of the globals/config.json file for proper Content Security Policy (CSP) compliance.
2. **Scoped Availability (in landingConfig):** For libraries needed only by a specific view, the **passedVendors** property is used within the landingConfig. If a third-party library is listed here, the corresponding customFunction associated with that landing is granted access to use that library.4

This dual-level approach represents a sophisticated method for maintaining the "vanilla" purity of the core framework while acknowledging the real-world need for controlled interoperability with existing dependencies. By managing vendor inclusion through configuration, the framework actively scopes the dependency, preventing global namespace conflicts and ensuring accurate loading order, which is essential for preserving the integrity of the vanilla core.4

### **3.3 The dataSchema and Automated I/O Contract**

The **dataSchema** object is a pivotal element of the configuration system, defined within the configuration of either a **landing** (e.g., via landingConfig in viewConfig.js) or a **component**. It serves as the formal contract defining the structure and behavior of expected data payloads, particularly those anticipated from server interactions.4

The dataSchema can be defined as a single object or as an array of API controlling schemas, enabling the orchestration of multiple, distinct API calls (single response or streaming) from a single, central point. This comprehensive configuration acts as a superb observable documentation of how all API calls are expected to behave, making it easy to audit and update server interaction logic for all related landing and component functions.

This schema is central to orchestrating data fetching via the ë.serverRender API. Key functional directives within the dataSchema include:

- **Caching and Targeting:** Developers can configure the schema to cache results for performance and specify a target function or an arbitrary name where the fetched data results should be passed.
- **Security:** The schema can be configured to use data publicly or to require secure handling, distinguishing between public and secret data contexts.
- **Streaming:** By setting stream: true, the schema dictates that the server response should be handled as a continuous stream of results rather than a single response payload.
  - **Streaming Signal Registration:** When streaming is enabled and a resultTarget (e.g., "chatbox") is defined, the framework registers each incoming data chunk as a signal. The resulting signal name is constructed by prepending "stream\_" to the resultTarget value (e.g., "stream_chatbox"). Developers can subscribe to these continuous signal updates (e.g., using a callback function like addMessageToChatBox()) via the specialized API call: ë.serverRenderSignal({signal: "stream_chatbox", calling: "publisher", vanillaPromise, callBack: addMessageToChatbox, dataSchema, renderAction: "serverBurst", onFinish: optionalCallBack}).
- **Execution Control and Dynamic Reference:**
  - Setting autorun: true enables the framework to automatically execute the associated server call during the application lifecycle.
  - If autorun is omitted or set to false, the operation is only executed manually when the developer explicitly calls the API via ë.serverRender(dataSchema, "serverBurst").
  - When running manually, the scoped functions can not only access the schema but, crucially, through the **vanillaPromise**, a developer can reference the schema to dynamically control the payload and feature flags for the ë.serverRender API communication.

While the ë.serverRender API is highly powerful and recommended for leveraging the full suite of vanillaBurst capabilities—such as automated signal tracking, caching, and security management defined in the dataSchema—the underlying framework principle of utilizing Vanilla JavaScript means developers are in no way limited and remain free to use standard network APIs, like the Fetch API, directly as they please.

The configuration of a dataSchema provides a significant automation benefit: it removes the necessity for additional boilerplate setups when communicating with the server for default operations.4 The framework automatically processes incoming server responses. Provided the server returns a signal type and data, the framework utilizes this information; otherwise, it defaults to issuing standardized application signals, specifically

ready or fail.4 This functionality mandates a structured, predictable API response format from the backend integration. By abstracting low-level network failure detection into high-level, application-specific signals, the framework greatly simplifies developer workflow and enhances the reliability of data exchange.

A summary of the core configuration directives that govern the architectural behavior is provided below:

Configuration Directives and Schema Reference

| Directive/Object | Location                            | Primary Purpose                                                                      | Key Properties/Usage                                                                                                            | Architectural Role                 |
| :--------------- | :---------------------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------- |
| configs          | Application Root                    | Defines overarching state rendering and application flow.4                           | Facilitates Observability and Declarative Planning.4                                                                            | Application Orchestrator           |
| landingConfig    | View/Landing Config (viewConfig.js) | Defines the setup and dependencies for a specific view or endpoint.4                 | passedVendors (Managed inclusion and scoping of third-party libraries).4                                                        | Resource and Dependency Scoping    |
| dataSchema       | View/Landing or Component Config    | Defines the structure of expected data payloads, particularly for server responses.4 | stream: true, autorun: true, target (Mapping data to functions/names), Caching, Security, Array support for multiple API calls. | I/O Contract and Signal Automation |

## **4\. State Management Architecture: Immutability and State Promise**

The vanillaburst state management model is intentionally constrained, built around the principle of enforced immutability to ensure predictable application behavior and maintain the central observability defined in the configuration directives.

### **4.1 The vanillaPromise: The Guaranteed State Channel**

The central mechanism for state interaction is the **vanillaPromise**. This is a guarantee provided by the vanillaApp runtime, serving as the required access point through which developers must communicate with and retrieve the application state.4

This is a non-negotiable architectural constraint. Developers are not permitted to interact directly with raw state objects. Instead, they must utilize the vanillaPromise interface. This mediation ensures that all state transitions are tracked and controlled by the framework, which is vital for maintaining the configuration's promise of a "central observable overview" of application operation.4

### **4.2 Enforced Functional Purity: The customFunction Wrapper**

A key architectural defense mechanism is the strict handling of the developer's core logic unit, the **customFunction**. This function is systematically enveloped by a framework helper function during application preparation.4

The explicit purpose of this wrapping is to **disallow mutation of the function** itself.4 This mechanism enforces a high degree of functional purity on the developer's code. In practice, the developer’s

customFunction is responsible for calculating necessary effects and requests (Signals); however, it is strictly isolated from the critical task of state transformation. The actual state transformation logic is handled internally by the framework via the vanillaPromise and signal processing system. This separation guarantees that state changes are predictable, centralized, and traceable, preventing unexpected side effects often encountered in less-disciplined Vanilla JS applications.

### **4.3 storeBurst: Caching and Localized Scoping**

The framework employs **storeBurst** as its dedicated data storage mechanism. Its primary architectural role is two-fold: state caching and data localization.4

storeBurst is responsible for controlling the scope of data, ensuring that information is cached and localized "where needed".4 This mechanism is leveraged directly by the signal dispatcher (

window.myBurst()) to manage the data payload of internal signals.4 By ensuring that data carried by signals is appropriately localized and scoped, the framework successfully prevents unintended state leakage or interaction across the various distinct application landings or endpoints managed by the load-balancing system.

### **4.4 The Immutable Registry: ë.frozenVanilla**

The utility function **ë.frozenVanilla** serves a crucial dual purpose within the application architecture. It acts as the immutable registry for both core framework APIs and developer-defined functions/APIs. 4

1. **State Observation Point:** It provides a globally accessible, read-only snapshot of the application state, useful for auditing, debugging, and passive data consumption without permitting direct, unmediated mutation. This upholds the state contract guaranteed by the vanillaPromise.
2. **Protected API Registry:** Developers can extend the framework by registering their own functions or APIs through ë.frozenVanilla. By wrapping these functionalities within this registry, the framework ensures that they cannot be executed unless specifically run within the application's intended scope. This mechanism effectively protects internal framework and developer logic from external access or potential injections via browser tools (such as the console), maintaining the security and integrity of the application's core functionality.

## **5\. Interactivity, Signals, and Helper Function API Reference**

The vanillaburst architecture abstracts complex application interactivity and data exchange into a formalized system of Signals, managed through a small set of highly reliable, immutable helper functions. This system is divided into two primary signal types: State Signals and Interaction Signals.

### **5.1 State Signals and Persistence via storeBurst**

State Signals govern the main application flow and are managed primarily through the **storeBurst** mechanism. Its architectural role is two-fold: state caching and data localization/persistence.4

The developer initiates a State Signal using the primary public dispatcher, **window.myBurst()**.4 When called,

myBurst() leverages storeBurst to cache and manage the data payload.4 The

storeBurst mechanism controls the scope of this data, ensuring it is localized "where needed" 4, and uses persistent storage (e.g.,

localStorage) to cache signal data payloads (signalBurst) and configuration data (originBurst) across distinct application landings. This ensures data isolation while maintaining necessary persistence for the main application state and flow control.

### **5.2 Server Communication Helper: serverRender**

External data exchange is managed by the simplified server communication helper function, **serverRender**.4 This utility is designed to streamline and abstract the intricacies of network I/O, facilitating dynamic interaction with external data sources.

When serverRender is combined with a defined dataSchema 4, it automatically manages the expected response types, enabling rapid data availability and simplifying error handling by translating server responses into application-ready Signals (e.g.,

ready or fail).4

### **5.3 Helper Function Integrity**

A mandatory principle of the vanillaburst system is the intrinsic integrity of its internal API. All framework helper functions, including both window.myBurst() and serverRender, are intentionally engineered to be immutable.4 This architectural guarantee ensures that the fundamental tools used by the developer to manage application state and interact with the environment are entirely predictable and free from unintended side effects.

### **5.4 Interaction Signals: signalStore, vanillaAccessor, and Security**

Interaction Signals facilitate component-level communication and observable data exchange, built on a highly restricted, secure internal messaging bus known as **signalStore**. This store is designed to enforce maximum security and predictability for data and functional access.

#### **Signal Store Security Model**

The signalStore implements a strict security model to prevent unauthorized access or mutation:

1. **Immutability:** When a value is set using ë.signalStore.set(), the data or function is immediately frozen using Object.freeze(). This ensures the signal's payload cannot be mutated after creation, upholding the framework's immutability principle.
2. **Authorized Caller:** Direct access to signalStore is blocked. The internal getter (ë.signalStore.get()) is protected by requiring a specific, framework-internal entity, the **ë.vanillaAccessor**, to be the allowedCaller. If the calling function does not match this authorized signature, the access is denied.
3. **Secret/Token Validation:** Even the authorized caller must provide a valid secret (a token, often retrieved from a cookie) that must match a secret associated with the requested signal/state object. This two-factor validation (authorized function \+ correct secret) ensures data is only accessed by the correct application instance, preventing scope conflicts and external interference.

#### **The Signal Gateway: ë.vanillaAccessor**

The ë.vanillaAccessor function acts as the required, authorized gateway for all Interaction Signal operations:

- **Reading Signals:** It calls the highly protected ë.signalStore.get(), providing the necessary secret and identifying itself as the allowedCaller.
- **Writing Signals (Updates):** For component-level state changes, vanillaAccessor provides an updateValue function (which internally calls ë.signalStore.set()), enabling the component to publish new, immutable signal values.
- **Subscription:** When provided with an external developer callback, vanillaAccessor uses ë.signalStore.subscribe() to register the callback. It then immediately executes the callback with the current signal value and ensures the subscription is tracked on the global ë object to prevent redundant subscriptions. This establishes the observable pattern for components.

#### **The Signal Orchestrator: ë.signalRunner**

The **ë.signalRunner** is an orchestrator utility designed to simplify the setup of multiple signal subscriptions at once. It accepts a signalPack (a map of signals and their corresponding developer callbacks) and iterates through it, efficiently calling ë.vanillaAccessor for each pairing. This ensures that every necessary signal is read, and its associated callback is subscribed to future updates via the protected vanillaAccessor pathway.

Core Framework API and Component Reference (Detailed)

| Component/API Call | Type                                 | Function                                                                                                                                          | Interaction Channel             | Purity/Integrity Note                                                                                         |
| :----------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------ | :------------------------------------------------------------------------------------------------------------ |
| vanillaPromise     | State Access Guarantee               | Provides developer access and the required communication pathway to the centralized, observable state.4                                           | Direct State Interface          | Enforces mandatory mediation of all state changes.                                                            |
| storeBurst         | Caching & Scoping Mechanism          | Caches and localizes State Signal data, utilizing localStorage for cross-landing persistence.4                                                    | Used internally by myBurst()    | Essential for guaranteeing data isolation across application endpoints.                                       |
| signalStore        | Interaction Signal Bus               | Internal, secure storage for observable, component-level data and functions.                                                                      | Internal Messaging System       | Enforces immutability via Object.freeze() and access control via allowedCaller and secret.                    |
| window.myBurst()   | State Signal Dispatcher (Helper)     | Executes internal State Signals, facilitating dynamic data interaction and state change requests.4                                                | Internal Messaging System       | Primary public interface for triggering functional requests and state change intentions.                      |
| ë.vanillaAccessor  | Interaction Signal Gateway           | The _only_ authorized component to read/write signalStore. Handles subscriptions and returns signal value/update function pair.                   | Internal API Interface          | Implements the **security contract** (Authorized Caller).                                                     |
| ë.signalRunner     | Multi-Signal Orchestrator            | Processes multiple signal/callback pairs, setting up subscriptions and initial value reads via vanillaAccessor.                                   | Internal API Interface          | Automates the observable setup process.                                                                       |
| serverRender       | Server I/O Utility (Helper Function) | Provides a simplified, abstracted function for server communication and API interaction.4                                                         | External Data Request           | Abstracts low-level data fetching and integrates with dataSchema automation.                                  |
| customFunction     | Developer Code Unit                  | Contains the application logic unit defined for a specific view or component.4                                                                    | Called by vanillaApp runtime    | **Strictly wrapped** by the framework to prohibit mutation of the function itself.4                           |
| ë.frozenVanilla    | Protected Registry/Snapshot          | Provides an immutable view of state and registers internal functions/APIs, protecting them from unauthorized external (e.g., console) execution.4 | Global Observation/API Registry | Supports debugging, observation, and ensures APIs are only callable within the established application scope. |

## **6\. Implementation and Workflow Best Practices**

Successful development within the vanillaburst paradigm requires adherence to the architectural constraints, focusing on modularity and configuration-driven orchestration.

### **6.1 Developing Modular customFunction Units**

The code written within a customFunction benefits from high flexibility. It can consist of purely Vanilla JavaScript, utilize the framework's internal helper functions (such as serverRender or window.myBurst()), or incorporate code written for specific third-party libraries (e.g., jQuery) provided those libraries have been explicitly configured and included via the landingConfig's passedVendors property.4

For maintaining clarity and manageability in larger projects, the application logic should be split according to the principle of single responsibility, typically aligning files by component or module. This practice directly supports the structured approach mandated by the framework's configuration directives, preventing the accumulation of unwieldy, lengthy JavaScript files.5

### **6.2 The Application Life Cycle Flow**

The vanillaApp execution adheres to a well-defined life cycle managed entirely by the framework runtime:

1. **Configuration Loading:** The application begins by processing the globals/config.json and viewConfig.js files. These directives establish the application-wide parameters, the execution plan, the required dependencies, and the dataSchema.4
2. **Resource Loading and Balancing:** Based on the current URL endpoint (identified by the ?burst=... parameter), the framework's load-balancing system dynamically packs and delivers only the necessary JS and vendor files, governed by the schemaParts and packages configuration in globals/config.json.4
3. **Application Initialization:** The vanillaApp runtime is instantiated. During this phase, the critical state channel, the vanillaPromise, is established, providing the future point of access to the application state.4
4. **Logic Wrapping and Execution:** The developer's customFunction is retrieved, wrapped in a helper function to enforce functional immutability 4, and executed within its designated scope.
5. **Interaction and Signaling:** Developers utilize the API helpers, such as window.myBurst() for internal communication or serverRender for external I/O. For component-specific communication, they utilize the signalRunner and vanillaAccessor pattern.
6. **State Transformation and Observation:** Signals are processed internally by the framework. State Signals utilize storeBurst for data management and localization.4 Interaction Signals are processed by  
   signalStore and relayed to subscribers via vanillaAccessor. Successful processing results in an update to the application state, which is then made accessible through the vanillaPromise and observable via the read-only ë.frozenVanilla snapshot.4

### **6.3 Dependency Management Strategy**

The framework implements a nuanced strategy for dependency management that distinguishes between minimal operational needs and comprehensive deployment requirements.

The configuration system (specifically landingConfig.passedVendors and the global vendors array in globals/config.json) dictates the minimum set of dependencies required for a specific unit of code to run correctly.4 This approach establishes the "loosest possible dependency versions that are still workable," clearly stating what the application package requires to function.6

This internal declaration of dependencies is architecturally separated from the external deployment process. Deployment manifests (analogous to Python's requirements.txt file) are defined outside the core framework configuration. These deployment manifests are responsible for declaring an exhaustive, version-pinned list of all necessary packages required to make an entire deployment work, including non-functional tools and environmental dependencies.6 This separation prevents redundancy and ensures that the framework's architectural integrity is maintained while supporting highly specific, version-controlled deployment environments.

## **7\. Conclusion: The Value Proposition of vanillaBurst**

The vanillaburst framework offers a disciplined, high-performance pathway for modern web development rooted in core Vanilla JavaScript principles. Its unique architectural value proposition is derived from two primary features: the enforcement of functional purity and the centralization of all orchestration via declarative configuration.

By systematically wrapping developer code to disallow function mutation 4 and mandating state access through the

vanillaPromise 4, the framework guarantees predictable state behavior, eliminating entire classes of common asynchronous state bugs.

Furthermore, its config-driven architecture, which utilizes globals/config.json, viewConfig.js, and specialized directives like dataSchema and landingConfig 4, acts as a sophisticated resource manager. This system ensures precise, endpoint-specific load balancing.4 This ability to control the exact timing and scope of resource loading makes

vanillaburst exceptionally robust for integration into existing, complex systems, providing a reliable solution where traditional dependency-heavy frameworks often fail due to scope leakage or unpredictable script execution order.4 In summary,

vanillaburst successfully transforms the speed of Vanilla JS into a structured, scalable, and highly observable application architecture.

#### **Works cited**

1. Vanilla JS: You Might Not Need that Library \- Maximiliano Firtman \- YouTube, accessed September 28, 2025, [https://www.youtube.com/watch?v=V2eM0EdTfmk](https://www.youtube.com/watch?v=V2eM0EdTfmk)
2. Vanilla JS: You Might Not Need a Framework by Max Firtman | Preview \- YouTube, accessed September 28, 2025, [https://www.youtube.com/watch?v=l7r_e_oc61c](https://www.youtube.com/watch?v=l7r_e_oc61c)
3. The Basic Vanilla JavaScript Project Setup \- In Plain English, accessed September 28, 2025, [https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f](https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f)
4. arberrexhepi/vanillaBurst \- GitHub, accessed September 28, 2025, [https://github.com/arberrexhepi/vanillaBurstGame](https://github.com/arberrexhepi/vanillaBurstGame)
5. How to structure my Vanilla JS project code better? : r/learnjavascript \- Reddit, accessed September 28, 2025, [https://www.reddit.com/r/learnjavascript/comments/jxj42p/how_to_structure_my_vanilla_js_project_code_better/](https://www.reddit.com/r/learnjavascript/comments/jxj42p/how_to_structure_my_vanilla_js_project_code_better/)
6. Reference requirements.txt for the install_requires kwarg in setuptools setup.py file, accessed September 28, 2025, [https://stackoverflow.com/questions/14399534/reference-requirements-txt-for-the-install-requires-kwarg-in-setuptools-setup-py](https://stackoverflow.com/questions/14399534/reference-requirements-txt-for-the-install-requires-kwarg-in-setuptools-setup-py)
7. install_requires vs requirements files \- Python Packaging User Guide, accessed September 28, 2025, [https://packaging.python.org/discussions/install-requires-vs-requirements/](https://packaging.python.org/discussions/install-requires-vs-requirements/)

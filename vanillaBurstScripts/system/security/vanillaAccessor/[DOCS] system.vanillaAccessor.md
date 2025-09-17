# Vanilla Accessor Module Documentation

This document explains the functionality of the Vanilla Accessor module which provides access and management for signals and callbacks in the system.

## Overview

The module exposes two main functions:

- **ë.frozenVanilla**  
  Sets up a signal accessor. It accepts a promise, a signal identifier, and a "calling" parameter (which may be an array or a simple identifier).

- **ë.signalRunner**  
  Processes a collection of signals (referred to as a "signalPack") and executes the corresponding callbacks. It supports different signal pack structures for backward compatibility and grouping.

## Function Details

### ë.frozenVanilla

Signature:

```js
ë.frozenVanilla("vanillaAccessor", function (vanillaPromise, signal, calling) { ... });
```

#### Parameters

- **vanillaPromise**:  
  A promise representing an asynchronous operation or a dependency required by the signal accessor.

- **signal**:  
  A string identifier for the signal in question.

- **calling**:  
  Can be:
  - An array: Interpreted as `[actualCalling, callback]`
    - **actualCalling**: Name or identifier for subscribing.
    - **callback**: The function to execute on signal updates.
    - **externalCallBack**: descriptive name usage for **callBack**
  - A non-array value: Used directly for backwards compatibility or if value does not need to run a function.

#### Behavior

- **For Array `calling`:**

  - Retrieves the current value for the signal using `ë.signalStore.get`.
  - Subscribes the external callback (if not already subscribed) so that it will be called on subsequent signal updates.
  - Creates an update function (`updateValue`) which calls `ë.signalStore.set` to update the signal.
  - Returns an array containing the retrieved value and the updater function.

- **For Non-array `calling`:**
  - Returns the value retrieved by `ë.signalStore.get` for backward compatibility.

### ë.signalRunner

Signature:

```js
ë.signalRunner = function (signalPack, vanillaPromise) { ... };
```

#### Parameters

- **signalPack**:  
  A collection of signals formatted in one of two ways:
  - **Direct structure:**  
    An object with a `calling` property that is an object mapping signal names to callback functions.
  - **Nested structure:**  
    Signals grouped under keys such as `imageUI` or another group name.
- **vanillaPromise**:  
  The promise that is used when processing each signal through `ë.frozenVanilla`.

#### Behavior

- **Logging and Debugging:**  
  Outputs debug information to the console to help trace its operation.

- **Direct Structure Processing:**

  - Iterates over each property in `signalPack.calling`.
  - For each signal, it retrieves (and subscribes) the associated callback using `ë.frozenVanilla`.

- **Nested Structure Processing:**

  - Iterates through each group.
  - For each signal in the group:
    - Logs processing details.
    - Uses the group name as the key when calling `ë.frozenVanilla`.

- The function returns an object (`results`) containing the processed signal values.

## Example Usage

Below is an example snippet that shows how signals might be set up and processed:

```js
// Set initial signal
const signalMessage = "hello from imageUI.js";
ë.signalStore.set("helloMessage", signalMessage); // signalname, value

// Define a signal pack containing signal names and associated callbacks
const signalPack = {
  logoFunc: {
    // where the signal was originally set, e.g., in logoFunc.js
    latestImageGeneration: updateButtons,
    stream_logoResult: updateLogoStatus,
  },
  imageUI: {
    helloMessage: (message) => {
      alert(message);
    },
  },
};

ë.signalRunner(signalPack, vanillaPromise); //call the signal subscription in bulk
```

This example demonstrates how to set a signal's initial value and define a pack that registers callbacks to be executed when signals are updated.

## Summary

- **ë.frozenVanilla**:  
  Manages signal retrieval, callback subscription, and provides a mechanism for updating signal values.

- **ë.signalRunner**:  
  Provides a way to process multiple signals (either in a direct or nested structure) and ensuring corresponding callbacks are triggered.

Use this documentation as a guide for understanding or extending the functionality within the Vanilla Accessor module.

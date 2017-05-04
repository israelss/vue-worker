# VueWorker

> A Vue.js plugin to use webworkers in a simply way.

DISCLAIMER: This plugin is in beta stage, and is not production ready!

## Why

Create and use [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) can be cumbersome sometimes. This plugin aims to facilitate the use of Web Workers within Vue components.

## How to install and use

```
yarn add vue-worker
```

Then add in main.js:

```javascript
import Vue from 'vue'
import VueWorker from 'vue-worker'
Vue.use(VueWorker)
```

That will inject a property into Vue (and pass it to every child component), with a default name of `$worker`, which can be accessed using `this.$worker` inside any Vue component.

You can change that name when registering the plugin:

```javascript
import VueWorker from 'vue-worker'
Vue.use(VueWorker, '$desired-name')
```

### Methods

There are two methods in `$worker`. Both are intended to be used like promises.

#### this.$worker.run

The most basic and straightforward is `run`, and you use it like this:

```javascript
this.$worker.run(func)
```

Where `func` is the function to be runned in worker.

E.g.:

```javascript
// run() works like Promise.resolve(), but in another thread
this.$worker.run(() => 'Function in other thread')
  .then(console.log) // logs 'Function in other thread'
```

This method creates a disposable web worker, runs and returns the result of given function and closes the worker.

#### this.$worker.create

If you plan to reuse a worker, you should use the `create` method.

It creates a reusable worker (not really, more on this ahead) with determined actions to be runned through its `postMessage()` or `postAll()` methods.

You use it like this:

```javascript
let worker = this.$worker.create(actionsArray)
```

Where `actionsArray` is an array of objects with two fields, `message` and `func`. Essentially, it is a messages-actions map.

The first field is the message which will be given to `postMessage()` or `postAll()` methods, to run the correspondent function, that is the second field.

E.g.:

```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1'},
  { message: 'func2', func: () => 'Working on func2'},
  { message: 'func3', func: () => 'Working on func3'}
]

let worker = this.$worker.create(actions)

// postMessage() works like Promise.resolve(), but in another thread
worker.postMessage('func1')
  .then(console.log) // logs 'Working on func1'

worker.postMessage('func2')
  .then(console.log) // logs 'Working on func2'

worker.postMessage('func3')
  .then(console.log) // logs 'Working on func3'

// postAll() works like Promise.all(), but in another thread
worker.postAll(['func1', 'func2', 'func3'])
  .then(console.log) // logs ['func1', 'func2', 'func3']
```

### Closing workers?

You may be thinking: "How do I terminate those reusable workers if there's no `close()` or `terminate()` methods?"

Well, when you create a reusable worker, you don't receive a real Web Worker.

Instead, you get an object which holds the given messages-actions map, and when you call `postMessage()` or `postAll()` it will, under the hood, call `run()` with the correspondent functions.

So, to "terminate" a "worker" when it is not needed anymore, you can just do:

```javascript
let worker = this.$worker.create(actions)

// use the worker

worker = null
```

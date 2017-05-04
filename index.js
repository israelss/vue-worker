const _disposablePost = worker => message =>
  new Promise((resolve, reject) => {
    worker.onmessage = event => resolve(event.data)
    worker.onerror = e => {
      console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`)
      reject(e)
    }
    worker.postMessage({ message: message })
  })

const _post = actions => (msg) => {
  const jsonMsg = JSON.stringify(msg)
  let work = actions
    .filter(({ message }) => JSON.stringify(message) === jsonMsg)
    .map(action => action.func)
    .pop()

  if (!work) {
    work = `
      self.onmessage = event => {
        console.warn('WARN! ${jsonMsg} is not a registered action for this worker')
        self.postMessage('${jsonMsg} is not a registered action for this worker')
        close()
      }
    `
  }

  return _run(work)
}

function _postAll (arr = null) {
  if (!arr) {
    const error = new TypeError(`You should provide an array of postMessage calls.\nReceived: ${arr}`)
    console.error(error)
    throw error
  }
  const allWorks = arr.map(msg => this.postMessage(msg))
  return Promise.all(allWorks)
}

function _createDisposableWorker (response) {
  const URL = window.URL || window.webkitURL
  const blob = new Blob([response], { type: 'application/javascript' })
  const worker = new Worker(URL.createObjectURL(blob))

  worker.post = _disposablePost(worker)
  return worker
}

function _createReusableWorker (namedWorks) {
  const worker = {
    actions: namedWorks,
    postMessage: _post(namedWorks),
    postAll: _postAll
  }
  return worker
}

function _createSinglePromise (response) {
  const worker = _createDisposableWorker(response)
  return worker.post('')
}

const _makeResponse = work => {
  if (typeof work === 'function') {
    return `
      self.onmessage = event => {
        const result = ${work}()
        self.postMessage(result)
        close()
      }
    `
  }

  if (typeof work === 'string') {
    return work
  }
}
function _run (work = null) {
  if (!work || (typeof work !== 'function' && typeof work !== 'string')) {
    const error = new TypeError(`You should provide a function or a worker string.\nReceived: ${work}`)
    console.error(error)
    throw error
  }

  const response = _makeResponse(work)

  return _createSinglePromise(response)
}

function _create (namedWorks = null) {
  if (!namedWorks) {
    const error = new TypeError(`You should provide an array of objects.\nReceived: ${namedWorks}`)
    console.error(error)
    throw error
  }

  return _createReusableWorker(namedWorks)
}

const WorkerWrapper = {
  create: _create,
  run: _run
}

export default {
  install (Vue, name = '$worker') {
    Object.defineProperty(Vue.prototype, name, { value: WorkerWrapper })
  }
}

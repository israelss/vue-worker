import SimpleWebWorker from 'simple-web-worker'

export default {
  install (Vue, name = '$worker') {
    Object.defineProperty(Vue.prototype, name, { value: SimpleWebWorker })
  }
}

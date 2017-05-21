import SimpleWebWorker from 'simple-web-worker'

export default {
  install: function(Vue, name) {
    if (! name) name = '$worker';

    Object.defineProperty(Vue.prototype, name, { value: SimpleWebWorker })
  }
}

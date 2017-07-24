'use strict';

exports.__esModule = true;

var _simpleWebWorker = require('simple-web-worker');

var _simpleWebWorker2 = _interopRequireDefault(_simpleWebWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  install: function install(Vue, name) {
    name = name || '$worker';
    Object.defineProperty(Vue.prototype, name, { value: _simpleWebWorker2.default });
  }
};

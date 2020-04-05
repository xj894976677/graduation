(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 14:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/*!**************************************************!*\
  !*** E:/graduation/snp-uniapp/commen/tim/tim.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _timJsSdk = _interopRequireDefault(__webpack_require__(/*! tim-js-sdk */ 16));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
// import COS from "cos-js-sdk-v5";


var options = {
  SDKAppID: 1400341324 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};
// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
var tim = _timJsSdk.default.create(options); // SDK 实例通常用 tim 表示
var TIMData = _timJsSdk.default;
// 注册 COS SDK 插件
// tim.registerPlugin({'cos-js-sdk': COS});



/* eslint-disable require-jsdoc */
function genTestUserSig(userID) {
  var SDKAPPID = 1400341324;
  var EXPIRETIME = 604800;
  var SECRETKEY = 'cb4f000d17f071fe098354f0f38b8e1f1505677f87715037df4fa0876cbb6c0b';

  if (SDKAPPID === '' || SECRETKEY === '') {
    alert(
    '请先配置好您的账号信息： SDKAPPID 及 SECRETKEY ' +
    '\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in js/debug/GenerateTestUserSig.js');

  }
  var generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);
  var userSig = generator.genTestUserSig(userID);
  return {
    sdkAppId: SDKAPPID,
    userSig: userSig };

}var _default =

{
  tim: tim,
  TIMData: TIMData,
  genTestUserSig: genTestUserSig };exports.default = _default;

/***/ }),

/***/ 151:
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 152);


/***/ }),

/***/ 152:
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 153);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 153:
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ 16:
/*!******************************************************************!*\
  !*** E:/graduation/snp-uniapp/node_modules/tim-js-sdk/tim-js.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {!function (e, t) { true ? module.exports = t() : undefined;}(void 0, function () {var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};function t(e, t) {return e(t = { exports: {} }, t.exports), t.exports;}var n,r,o,i = "object",a = function a(e) {return e && e.Math == Math && e;},s = a(typeof globalThis == i && globalThis) || a(typeof window == i && window) || a(typeof self == i && self) || a(typeof e == i && e) || Function("return this")(),u = function u(e) {try {return !!e();} catch (t) {return 1;}},c = !u(function () {return 7 != Object.defineProperty({}, "a", { get: function get() {return 7;} }).a;}),l = {}.propertyIsEnumerable,p = Object.getOwnPropertyDescriptor,f = { f: p && !l.call({ 1: 2 }, 1) ? function (e) {var t = p(this, e);return !!t && t.enumerable;} : l },h = function h(e, t) {return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t };},g = {}.toString,d = function d(e) {return g.call(e).slice(8, -1);},_ = "".split,m = u(function () {return !Object("z").propertyIsEnumerable(0);}) ? function (e) {return "String" == d(e) ? _.call(e, "") : Object(e);} : Object,v = function v(e) {if (null == e) throw TypeError("Can't call method on " + e);return e;},y = function y(e) {return m(v(e));},E = function E(e) {return "object" == typeof e ? null !== e : "function" == typeof e;},S = function S(e, t) {if (!E(e)) return e;var n, r;if (t && "function" == typeof (n = e.toString) && !E(r = n.call(e))) return r;if ("function" == typeof (n = e.valueOf) && !E(r = n.call(e))) return r;if (!t && "function" == typeof (n = e.toString) && !E(r = n.call(e))) return r;throw TypeError("Can't convert object to primitive value");},I = {}.hasOwnProperty,C = function C(e, t) {return I.call(e, t);},T = s.document,M = E(T) && E(T.createElement),O = function O(e) {return M ? T.createElement(e) : {};},A = !c && !u(function () {return 7 != Object.defineProperty(O("div"), "a", { get: function get() {return 7;} }).a;}),D = Object.getOwnPropertyDescriptor,N = { f: c ? D : function (e, t) {if (e = y(e), t = S(t, 1), A) try {return D(e, t);} catch (n) {}if (C(e, t)) return h(!f.f.call(e, t), e[t]);} },L = function L(e) {if (!E(e)) throw TypeError(String(e) + " is not an object");return e;},R = Object.defineProperty,P = { f: c ? R : function (e, t, n) {if (L(e), t = S(t, 1), L(n), A) try {return R(e, t, n);} catch (r) {}if ("get" in n || "set" in n) throw TypeError("Accessors not supported");return "value" in n && (e[t] = n.value), e;} },G = c ? function (e, t, n) {return P.f(e, t, h(1, n));} : function (e, t, n) {return e[t] = n, e;},k = function k(e, t) {try {G(s, e, t);} catch (n) {s[e] = t;}return t;},w = t(function (e) {var t = s["__core-js_shared__"] || k("__core-js_shared__", {});(e.exports = function (e, n) {return t[e] || (t[e] = void 0 !== n ? n : {});})("versions", []).push({ version: "3.2.1", mode: "global", copyright: "© 2019 Denis Pushkarev (zloirock.ru)" });}),b = w("native-function-to-string", Function.toString),U = s.WeakMap,F = "function" == typeof U && /native code/.test(b.call(U)),x = 0,q = Math.random(),j = function j(e) {return "Symbol(" + String(void 0 === e ? "" : e) + ")_" + (++x + q).toString(36);},B = w("keys"),H = function H(e) {return B[e] || (B[e] = j(e));},V = {},K = s.WeakMap;if (F) {var Y = new K(),z = Y.get,W = Y.has,X = Y.set;n = function n(e, t) {return X.call(Y, e, t), t;}, r = function r(e) {return z.call(Y, e) || {};}, o = function o(e) {return W.call(Y, e);};} else {var J = H("state");V[J] = 1, n = function n(e, t) {return G(e, J, t), t;}, r = function r(e) {return C(e, J) ? e[J] : {};}, o = function o(e) {return C(e, J);};}var Q = { set: n, get: r, has: o, enforce: function enforce(e) {return o(e) ? r(e) : n(e, {});}, getterFor: function getterFor(e) {return function (t) {var n;if (!E(t) || (n = r(t)).type !== e) throw TypeError("Incompatible receiver, " + e + " required");return n;};} },Z = t(function (e) {var t = Q.get,n = Q.enforce,r = String(b).split("toString");w("inspectSource", function (e) {return b.call(e);}), (e.exports = function (e, t, o, i) {var a = i ? !!i.unsafe : 0,u = i ? !!i.enumerable : 0,c = i ? !!i.noTargetGet : 0;"function" == typeof o && ("string" != typeof t || C(o, "name") || G(o, "name", t), n(o).source = r.join("string" == typeof t ? t : "")), e !== s ? (a ? !c && e[t] && (u = 1) : delete e[t], u ? e[t] = o : G(e, t, o)) : u ? e[t] = o : k(t, o);})(Function.prototype, "toString", function () {return "function" == typeof this && t(this).source || b.call(this);});}),$ = s,ee = function ee(e) {return "function" == typeof e ? e : void 0;},te = function te(e, t) {return arguments.length < 2 ? ee($[e]) || ee(s[e]) : $[e] && $[e][t] || s[e] && s[e][t];},ne = Math.ceil,re = Math.floor,oe = function oe(e) {return isNaN(e = +e) ? 0 : (e > 0 ? re : ne)(e);},ie = Math.min,ae = function ae(e) {return e > 0 ? ie(oe(e), 9007199254740991) : 0;},se = Math.max,ue = Math.min,ce = function ce(e, t) {var n = oe(e);return n < 0 ? se(n + t, 0) : ue(n, t);},le = function le(e) {return function (t, n, r) {var o,i = y(t),a = ae(i.length),s = ce(r, a);if (e && n != n) {for (; a > s;) {if ((o = i[s++]) != o) return 1;}} else for (; a > s; s++) {if ((e || s in i) && i[s] === n) return e || s || 0;}return !e && -1;};},pe = { includes: le(1), indexOf: le(0) },fe = pe.indexOf,he = function he(e, t) {var n,r = y(e),o = 0,i = [];for (n in r) {!C(V, n) && C(r, n) && i.push(n);}for (; t.length > o;) {C(r, n = t[o++]) && (~fe(i, n) || i.push(n));}return i;},ge = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],de = ge.concat("length", "prototype"),_e = { f: Object.getOwnPropertyNames || function (e) {return he(e, de);} },me = { f: Object.getOwnPropertySymbols },ve = te("Reflect", "ownKeys") || function (e) {var t = _e.f(L(e)),n = me.f;return n ? t.concat(n(e)) : t;},ye = function ye(e, t) {for (var n = ve(t), r = P.f, o = N.f, i = 0; i < n.length; i++) {var a = n[i];C(e, a) || r(e, a, o(t, a));}},Ee = /#|\.prototype\./,Se = function Se(e, t) {var n = Ce[Ie(e)];return n == Me ? 1 : n == Te ? 0 : "function" == typeof t ? u(t) : !!t;},Ie = Se.normalize = function (e) {return String(e).replace(Ee, ".").toLowerCase();},Ce = Se.data = {},Te = Se.NATIVE = "N",Me = Se.POLYFILL = "P",Oe = Se,Ae = N.f,De = function De(e, t) {var n,r,o,i,a,u = e.target,c = e.global,l = e.stat;if (n = c ? s : l ? s[u] || k(u, {}) : (s[u] || {}).prototype) for (r in t) {if (i = t[r], o = e.noTargetGet ? (a = Ae(n, r)) && a.value : n[r], !Oe(c ? r : u + (l ? "." : "#") + r, e.forced) && void 0 !== o) {if (typeof i == typeof o) continue;ye(i, o);}(e.sham || o && o.sham) && G(i, "sham", 1), Z(n, r, i, e);}},Ne = function Ne(e) {if ("function" != typeof e) throw TypeError(String(e) + " is not a function");return e;},Le = function Le(e, t, n) {if (Ne(e), void 0 === t) return e;switch (n) {case 0:return function () {return e.call(t);};case 1:return function (n) {return e.call(t, n);};case 2:return function (n, r) {return e.call(t, n, r);};case 3:return function (n, r, o) {return e.call(t, n, r, o);};}return function () {return e.apply(t, arguments);};},Re = function Re(e) {return Object(v(e));},Pe = Array.isArray || function (e) {return "Array" == d(e);},Ge = !!Object.getOwnPropertySymbols && !u(function () {return !String(Symbol());}),ke = s.Symbol,we = w("wks"),be = function be(e) {return we[e] || (we[e] = Ge && ke[e] || (Ge ? ke : j)("Symbol." + e));},Ue = be("species"),Fe = function Fe(e, t) {var n;return Pe(e) && ("function" != typeof (n = e.constructor) || n !== Array && !Pe(n.prototype) ? E(n) && null === (n = n[Ue]) && (n = void 0) : n = void 0), new (void 0 === n ? Array : n)(0 === t ? 0 : t);},xe = [].push,qe = function qe(e) {var t = 1 == e,n = 2 == e,r = 3 == e,o = 4 == e,i = 6 == e,a = 5 == e || i;return function (s, u, c, l) {for (var p, f, h = Re(s), g = m(h), d = Le(u, c, 3), _ = ae(g.length), v = 0, y = l || Fe, E = t ? y(s, _) : n ? y(s, 0) : void 0; _ > v; v++) {if ((a || v in g) && (f = d(p = g[v], v, h), e)) if (t) E[v] = f;else if (f) switch (e) {case 3:return 1;case 5:return p;case 6:return v;case 2:xe.call(E, p);} else if (o) return 0;}return i ? -1 : r || o ? o : E;};},je = { forEach: qe(0), map: qe(1), filter: qe(2), some: qe(3), every: qe(4), find: qe(5), findIndex: qe(6) },Be = function Be(e, t) {var n = [][e];return !n || !u(function () {n.call(null, t || function () {throw 1;}, 1);});},He = je.forEach,Ve = Be("forEach") ? function (e) {return He(this, e, arguments.length > 1 ? arguments[1] : void 0);} : [].forEach;De({ target: "Array", proto: 1, forced: [].forEach != Ve }, { forEach: Ve });var Ke = function Ke(e, t, n, r) {try {return r ? t(L(n)[0], n[1]) : t(n);} catch (i) {var o = e.return;throw void 0 !== o && L(o.call(e)), i;}},Ye = {},ze = be("iterator"),We = Array.prototype,Xe = function Xe(e) {return void 0 !== e && (Ye.Array === e || We[ze] === e);},Je = function Je(e, t, n) {var r = S(t);r in e ? P.f(e, r, h(0, n)) : e[r] = n;},Qe = be("toStringTag"),Ze = "Arguments" == d(function () {return arguments;}()),$e = function $e(e) {var t, n, r;return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (n = function (e, t) {try {return e[t];} catch (n) {}}(t = Object(e), Qe)) ? n : Ze ? d(t) : "Object" == (r = d(t)) && "function" == typeof t.callee ? "Arguments" : r;},et = be("iterator"),tt = function tt(e) {if (null != e) return e[et] || e["@@iterator"] || Ye[$e(e)];},nt = function nt(e) {var t,n,r,o,i = Re(e),a = "function" == typeof this ? this : Array,s = arguments.length,u = s > 1 ? arguments[1] : void 0,c = void 0 !== u,l = 0,p = tt(i);if (c && (u = Le(u, s > 2 ? arguments[2] : void 0, 2)), null == p || a == Array && Xe(p)) for (n = new a(t = ae(i.length)); t > l; l++) {Je(n, l, c ? u(i[l], l) : i[l]);} else for (o = p.call(i), n = new a(); !(r = o.next()).done; l++) {Je(n, l, c ? Ke(o, u, [r.value, l], 1) : r.value);}return n.length = l, n;},rt = be("iterator"),ot = 0;try {var it = 0,at = { next: function next() {return { done: !!it++ };}, return: function _return() {ot = 1;} };at[rt] = function () {return this;}, Array.from(at, function () {throw 2;});} catch (Hg) {}var st = function st(e, t) {if (!t && !ot) return 0;var n = 0;try {var r = {};r[rt] = function () {return { next: function next() {return { done: n = 1 };} };}, e(r);} catch (Hg) {}return n;},ut = !st(function (e) {Array.from(e);});De({ target: "Array", stat: 1, forced: ut }, { from: nt });var ct = Object.keys || function (e) {return he(e, ge);},lt = c ? Object.defineProperties : function (e, t) {L(e);for (var n, r = ct(t), o = r.length, i = 0; o > i;) {P.f(e, n = r[i++], t[n]);}return e;},pt = te("document", "documentElement"),ft = H("IE_PROTO"),ht = function ht() {},_gt = function gt() {var e,t = O("iframe"),n = ge.length;for (t.style.display = "none", pt.appendChild(t), t.src = String("javascript:"), (e = t.contentWindow.document).open(), e.write("<script>document.F=Object<\/script>"), e.close(), _gt = e.F; n--;) {delete _gt.prototype[ge[n]];}return _gt();},dt = Object.create || function (e, t) {var n;return null !== e ? (ht.prototype = L(e), n = new ht(), ht.prototype = null, n[ft] = e) : n = _gt(), void 0 === t ? n : lt(n, t);};V[ft] = 1, De({ target: "Object", stat: 1, sham: !c }, { create: dt });var _t = u(function () {ct(1);});De({ target: "Object", stat: 1, forced: _t }, { keys: function keys(e) {return ct(Re(e));} });var mt,vt,yt,Et = function Et(e) {return function (t, n) {var r,o,i = String(v(t)),a = oe(n),s = i.length;return a < 0 || a >= s ? e ? "" : void 0 : (r = i.charCodeAt(a)) < 55296 || r > 56319 || a + 1 === s || (o = i.charCodeAt(a + 1)) < 56320 || o > 57343 ? e ? i.charAt(a) : r : e ? i.slice(a, a + 2) : o - 56320 + (r - 55296 << 10) + 65536;};},St = { codeAt: Et(0), charAt: Et(1) },It = !u(function () {function e() {}return e.prototype.constructor = null, Object.getPrototypeOf(new e()) !== e.prototype;}),Ct = H("IE_PROTO"),Tt = Object.prototype,Mt = It ? Object.getPrototypeOf : function (e) {return e = Re(e), C(e, Ct) ? e[Ct] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? Tt : null;},Ot = be("iterator"),At = 0;[].keys && ("next" in (yt = [].keys()) ? (vt = Mt(Mt(yt))) !== Object.prototype && (mt = vt) : At = 1), null == mt && (mt = {}), C(mt, Ot) || G(mt, Ot, function () {return this;});var Dt = { IteratorPrototype: mt, BUGGY_SAFARI_ITERATORS: At },Nt = P.f,Lt = be("toStringTag"),Rt = function Rt(e, t, n) {e && !C(e = n ? e : e.prototype, Lt) && Nt(e, Lt, { configurable: 1, value: t });},Pt = Dt.IteratorPrototype,Gt = function Gt() {return this;},kt = function kt(e, t, n) {var r = t + " Iterator";return e.prototype = dt(Pt, { next: h(1, n) }), Rt(e, r, 0), Ye[r] = Gt, e;},wt = Object.setPrototypeOf || ("__proto__" in {} ? function () {var e,t = 0,n = {};try {(e = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(n, []), t = n instanceof Array;} catch (Hg) {}return function (n, r) {return L(n), function (e) {if (!E(e) && null !== e) throw TypeError("Can't set " + String(e) + " as a prototype");}(r), t ? e.call(n, r) : n.__proto__ = r, n;};}() : void 0),bt = Dt.IteratorPrototype,Ut = Dt.BUGGY_SAFARI_ITERATORS,Ft = be("iterator"),xt = function xt() {return this;},qt = function qt(e, t, n, r, o, i, a) {kt(n, t, r);var s,u,c,l = function l(e) {if (e === o && d) return d;if (!Ut && e in h) return h[e];switch (e) {case "keys":case "values":case "entries":return function () {return new n(this, e);};}return function () {return new n(this);};},p = t + " Iterator",f = 0,h = e.prototype,g = h[Ft] || h["@@iterator"] || o && h[o],d = !Ut && g || l(o),_ = "Array" == t && h.entries || g;if (_ && (s = Mt(_.call(new e())), bt !== Object.prototype && s.next && (Mt(s) !== bt && (wt ? wt(s, bt) : "function" != typeof s[Ft] && G(s, Ft, xt)), Rt(s, p, 1))), "values" == o && g && "values" !== g.name && (f = 1, d = function d() {return g.call(this);}), h[Ft] !== d && G(h, Ft, d), Ye[t] = d, o) if (u = { values: l("values"), keys: i ? d : l("keys"), entries: l("entries") }, a) for (c in u) {!Ut && !f && c in h || Z(h, c, u[c]);} else De({ target: t, proto: 1, forced: Ut || f }, u);return u;},jt = St.charAt,Bt = Q.set,Ht = Q.getterFor("String Iterator");qt(String, "String", function (e) {Bt(this, { type: "String Iterator", string: String(e), index: 0 });}, function () {var e,t = Ht(this),n = t.string,r = t.index;return r >= n.length ? { value: void 0, done: 1 } : (e = jt(n, r), t.index += e.length, { value: e, done: 0 });});var Vt = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };for (var Kt in Vt) {var Yt = s[Kt],zt = Yt && Yt.prototype;if (zt && zt.forEach !== Ve) try {G(zt, "forEach", Ve);} catch (Hg) {zt.forEach = Ve;}}var Wt = { SDK_READY: "sdkStateReady", SDK_NOT_READY: "sdkStateNotReady", SDK_DESTROY: "sdkDestroy", MESSAGE_SENDING: "onMessageSending", MESSAGE_SEND_SUCCESS: "onMessageSendSuccess", MESSAGE_SEND_FAIL: "onMessageSendFail", MESSAGE_RECEIVED: "onMessageReceived", APPLY_ADD_FRIEND_SUCCESS: "addFriendApplySendSuccess", APPLY_ADD_FRIEND_FAIL: "addFriendApplySendFail", GET_PENDENCY_SUCCESS: "getPendencySuccess", GET_PENDENCY_FAIL: "getPendencyFail", DELETE_PENDENCY_SUCCESS: "deletePendencySuccess", DELETE_PENDENCY_FAIL: "deletePendencyFail", REPLY_PENDENCY_SUCCESS: "replyPendencySuccess", REPLY_PENDENCY_FAIL: "replyPendencyFail", CONVERSATION_LIST_UPDATED: "onConversationListUpdated", GROUP_LIST_UPDATED: "onGroupListUpdated", GROUP_SYSTEM_NOTICE_RECEIVED: "receiveGroupSystemNotice", LOGIN_CHANGE: "loginStatusChange", LOGOUT_SUCCESS: "logoutSuccess", PROFILE_GET_SUCCESS: "getProfileSuccess", PROFILE_GET_FAIL: "getProfileFail", PROFILE_UPDATED: "onProfileUpdated", PROFILE_UPDATE_MY_PROFILE_FAIL: "updateMyProfileFail", FRIENDLIST_GET_SUCCESS: "getFriendListSuccess", FRIENDLIST_GET_FAIL: "getFriendsFail", FRIEND_DELETE_SUCCESS: "deleteFriendSuccess", FRIEND_DELETE_FAIL: "deleteFriendFail", BLACKLIST_ADD_SUCCESS: "addBlacklistSuccess", BLACKLIST_ADD_FAIL: "addBlacklistFail", BLACKLIST_GET_SUCCESS: "getBlacklistSuccess", BLACKLIST_GET_FAIL: "getBlacklistFail", BLACKLIST_UPDATED: "blacklistUpdated", BLACKLIST_DELETE_FAIL: "deleteBlacklistFail", KICKED_OUT: "kickedOut", ERROR: "error" },Xt = { MSG_TEXT: "TIMTextElem", MSG_IMAGE: "TIMImageElem", MSG_SOUND: "TIMSoundElem", MSG_AUDIO: "TIMSoundElem", MSG_FILE: "TIMFileElem", MSG_FACE: "TIMFaceElem", MSG_VIDEO: "TIMVideoFileElem", MSG_GEO: "TIMLocationElem", MSG_GRP_TIP: "TIMGroupTipElem", MSG_GRP_SYS_NOTICE: "TIMGroupSystemNoticeElem", MSG_CUSTOM: "TIMCustomElem", CONV_C2C: "C2C", CONV_GROUP: "GROUP", CONV_SYSTEM: "@TIM#SYSTEM", GRP_PRIVATE: "Private", GRP_PUBLIC: "Public", GRP_CHATROOM: "ChatRoom", GRP_AVCHATROOM: "AVChatRoom", GRP_MBR_ROLE_OWNER: "Owner", GRP_MBR_ROLE_ADMIN: "Admin", GRP_MBR_ROLE_MEMBER: "Member", GRP_TIP_MBR_JOIN: 1, GRP_TIP_MBR_QUIT: 2, GRP_TIP_MBR_KICKED_OUT: 3, GRP_TIP_MBR_SET_ADMIN: 4, GRP_TIP_MBR_CANCELED_ADMIN: 5, GRP_TIP_GRP_PROFILE_UPDATED: 6, GRP_TIP_MBR_PROFILE_UPDATED: 7, MSG_REMIND_ACPT_AND_NOTE: "AcceptAndNotify", MSG_REMIND_ACPT_NOT_NOTE: "AcceptNotNotify", MSG_REMIND_DISCARD: "Discard", GENDER_UNKNOWN: "Gender_Type_Unknown", GENDER_FEMALE: "Gender_Type_Female", GENDER_MALE: "Gender_Type_Male", KICKED_OUT_MULT_ACCOUNT: "mutipleAccount", KICKED_OUT_MULT_DEVICE: "mutipleDevice", ALLOW_TYPE_ALLOW_ANY: "AllowType_Type_AllowAny", ALLOW_TYPE_NEED_CONFIRM: "AllowType_Type_NeedConfirm", ALLOW_TYPE_DENY_ANY: "AllowType_Type_DenyAny", FORBID_TYPE_NONE: "AdminForbid_Type_None", FORBID_TYPE_SEND_OUT: "AdminForbid_Type_SendOut", JOIN_OPTIONS_FREE_ACCESS: "FreeAccess", JOIN_OPTIONS_NEED_PERMISSION: "NeedPermission", JOIN_OPTIONS_DISABLE_APPLY: "DisableApply", JOIN_STATUS_SUCCESS: "JoinedSuccess", JOIN_STATUS_ALREADY_IN_GROUP: "AlreadyInGroup", JOIN_STATUS_WAIT_APPROVAL: "WaitAdminApproval", GRP_PROFILE_OWNER_ID: "ownerID", GRP_PROFILE_CREATE_TIME: "createTime", GRP_PROFILE_LAST_INFO_TIME: "lastInfoTime", GRP_PROFILE_MEMBER_NUM: "memberNum", GRP_PROFILE_MAX_MEMBER_NUM: "maxMemberNum", GRP_PROFILE_JOIN_OPTION: "joinOption", GRP_PROFILE_INTRODUCTION: "introduction", GRP_PROFILE_NOTIFICATION: "notification" },Jt = be("species"),Qt = function Qt(e) {return !u(function () {var t = [];return (t.constructor = {})[Jt] = function () {return { foo: 1 };}, 1 !== t[e](Boolean).foo;});},Zt = je.map;De({ target: "Array", proto: 1, forced: !Qt("map") }, { map: function map(e) {return Zt(this, e, arguments.length > 1 ? arguments[1] : void 0);} });var $t = [].slice,en = {},tn = function tn(e, t, n) {if (!(t in en)) {for (var r = [], o = 0; o < t; o++) {r[o] = "a[" + o + "]";}en[t] = Function("C,a", "return new C(" + r.join(",") + ")");}return en[t](e, n);},nn = Function.bind || function (e) {var t = Ne(this),n = $t.call(arguments, 1),r = function r() {var o = n.concat($t.call(arguments));return this instanceof r ? tn(t, o.length, o) : t.apply(e, o);};return E(t.prototype) && (r.prototype = t.prototype), r;};function rn(e) {return (rn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;})(e);}function on(e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}function an(e, t) {for (var n = 0; n < t.length; n++) {var r = t[n];r.enumerable = r.enumerable || 0, r.configurable = 1, "value" in r && (r.writable = 1), Object.defineProperty(e, r.key, r);}}function sn(e, t, n) {return t && an(e.prototype, t), n && an(e, n), e;}function un(e, t, n) {return t in e ? Object.defineProperty(e, t, { value: n, enumerable: 1, configurable: 1, writable: 1 }) : e[t] = n, e;}function cn(e, t) {var n = Object.keys(e);if (Object.getOwnPropertySymbols) {var r = Object.getOwnPropertySymbols(e);t && (r = r.filter(function (t) {return Object.getOwnPropertyDescriptor(e, t).enumerable;})), n.push.apply(n, r);}return n;}function ln(e) {for (var t = 1; t < arguments.length; t++) {var n = null != arguments[t] ? arguments[t] : {};t % 2 ? cn(n, 1).forEach(function (t) {un(e, t, n[t]);}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : cn(n).forEach(function (t) {Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));});}return e;}function pn(e, t) {if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: 1, configurable: 1 } }), t && hn(e, t);}function fn(e) {return (fn = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {return e.__proto__ || Object.getPrototypeOf(e);})(e);}function hn(e, t) {return (hn = Object.setPrototypeOf || function (e, t) {return e.__proto__ = t, e;})(e, t);}function gn(e, t, n) {return (gn = function () {if ("undefined" == typeof Reflect || !Reflect.construct) return 0;if (Reflect.construct.sham) return 0;if ("function" == typeof Proxy) return 1;try {return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), 1;} catch (e) {return 0;}}() ? Reflect.construct : function (e, t, n) {var r = [null];r.push.apply(r, t);var o = new (Function.bind.apply(e, r))();return n && hn(o, n.prototype), o;}).apply(null, arguments);}function dn(e) {var t = "function" == typeof Map ? new Map() : void 0;return (dn = function dn(e) {if (null === e || (n = e, -1 === Function.toString.call(n).indexOf("[native code]"))) return e;var n;if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");if (void 0 !== t) {if (t.has(e)) return t.get(e);t.set(e, r);}function r() {return gn(e, arguments, fn(this).constructor);}return r.prototype = Object.create(e.prototype, { constructor: { value: r, enumerable: 0, writable: 1, configurable: 1 } }), hn(r, e);})(e);}function _n(e) {if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e;}function mn(e, t) {return !t || "object" != typeof t && "function" != typeof t ? _n(e) : t;}function vn(e, t) {return function (e) {if (Array.isArray(e)) return e;}(e) || function (e, t) {var n = [],r = 1,o = 0,i = void 0;try {for (var a, s = e[Symbol.iterator](); !(r = (a = s.next()).done) && (n.push(a.value), !t || n.length !== t); r = 1) {;}} catch (u) {o = 1, i = u;} finally {try {r || null == s.return || s.return();} finally {if (o) throw i;}}return n;}(e, t) || function () {throw new TypeError("Invalid attempt to destructure non-iterable instance");}();}function yn(e) {return function (e) {if (Array.isArray(e)) {for (var t = 0, n = new Array(e.length); t < e.length; t++) {n[t] = e[t];}return n;}}(e) || function (e) {if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e);}(e) || function () {throw new TypeError("Invalid attempt to spread non-iterable instance");}();}De({ target: "Function", proto: 1 }, { bind: nn });var En = function () {function e() {on(this, e), this.cache = [], this.options = null;}return sn(e, [{ key: "use", value: function value(e) {if ("function" != typeof e) throw "middleware must be a function";return this.cache.push(e), this;} }, { key: "next", value: function value(e) {if (this.middlewares && this.middlewares.length > 0) return this.middlewares.shift().call(this, this.options, this.next.bind(this));} }, { key: "run", value: function value(e) {return this.middlewares = this.cache.map(function (e) {return e;}), this.options = e, this.next();} }]), e;}(),Sn = be("isConcatSpreadable"),In = !u(function () {var e = [];return e[Sn] = 0, e.concat()[0] !== e;}),Cn = Qt("concat"),Tn = function Tn(e) {if (!E(e)) return 0;var t = e[Sn];return void 0 !== t ? !!t : Pe(e);};De({ target: "Array", proto: 1, forced: !In || !Cn }, { concat: function concat(e) {var t,n,r,o,i,a = Re(this),s = Fe(a, 0),u = 0;for (t = -1, r = arguments.length; t < r; t++) {if (i = -1 === t ? a : arguments[t], Tn(i)) {if (u + (o = ae(i.length)) > 9007199254740991) throw TypeError("Maximum allowed index exceeded");for (n = 0; n < o; n++, u++) {n in i && Je(s, u, i[n]);}} else {if (u >= 9007199254740991) throw TypeError("Maximum allowed index exceeded");Je(s, u++, i);}}return s.length = u, s;} });var Mn = P.f,On = Function.prototype,An = On.toString,Dn = /^\s*function ([^ (]*)/;!c || "name" in On || Mn(On, "name", { configurable: 1, get: function get() {try {return An.call(this).match(Dn)[1];} catch (Hg) {return "";}} });var Nn = t(function (t, n) {var r, o, i, a, s, u, c, l, p, f, h, g, d, _, m, v, y, E, S, I;t.exports = (r = "function" == typeof Promise, o = "object" == typeof self ? self : e, i = "undefined" != typeof Symbol, a = "undefined" != typeof Map, s = "undefined" != typeof Set, u = "undefined" != typeof WeakMap, c = "undefined" != typeof WeakSet, l = "undefined" != typeof DataView, p = i && void 0 !== Symbol.iterator, f = i && void 0 !== Symbol.toStringTag, h = s && "function" == typeof Set.prototype.entries, g = a && "function" == typeof Map.prototype.entries, d = h && Object.getPrototypeOf(new Set().entries()), _ = g && Object.getPrototypeOf(new Map().entries()), m = p && "function" == typeof Array.prototype[Symbol.iterator], v = m && Object.getPrototypeOf([][Symbol.iterator]()), y = p && "function" == typeof String.prototype[Symbol.iterator], E = y && Object.getPrototypeOf(""[Symbol.iterator]()), S = 8, I = -1, function (e) {var t = typeof e;if ("object" !== t) return t;if (null === e) return "null";if (e === o) return "global";if (Array.isArray(e) && (0 == f || !(Symbol.toStringTag in e))) return "Array";if ("object" == typeof window && null !== window) {if ("object" == typeof window.location && e === window.location) return "Location";if ("object" == typeof window.document && e === window.document) return "Document";if ("object" == typeof window.navigator) {if ("object" == typeof window.navigator.mimeTypes && e === window.navigator.mimeTypes) return "MimeTypeArray";if ("object" == typeof window.navigator.plugins && e === window.navigator.plugins) return "PluginArray";}if (("function" == typeof window.HTMLElement || "object" == typeof window.HTMLElement) && e instanceof window.HTMLElement) {if ("BLOCKQUOTE" === e.tagName) return "HTMLQuoteElement";if ("TD" === e.tagName) return "HTMLTableDataCellElement";if ("TH" === e.tagName) return "HTMLTableHeaderCellElement";}}var n = f && e[Symbol.toStringTag];if ("string" == typeof n) return n;var i = Object.getPrototypeOf(e);return i === RegExp.prototype ? "RegExp" : i === Date.prototype ? "Date" : r && i === Promise.prototype ? "Promise" : s && i === Set.prototype ? "Set" : a && i === Map.prototype ? "Map" : c && i === WeakSet.prototype ? "WeakSet" : u && i === WeakMap.prototype ? "WeakMap" : l && i === DataView.prototype ? "DataView" : a && i === _ ? "Map Iterator" : s && i === d ? "Set Iterator" : m && i === v ? "Array Iterator" : y && i === E ? "String Iterator" : null === i ? "Object" : Object.prototype.toString.call(e).slice(S, I);});});De({ target: "Array", stat: 1 }, { isArray: Pe });var Ln = _e.f,Rn = {}.toString,Pn = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],Gn = { f: function f(e) {return Pn && "[object Window]" == Rn.call(e) ? function (e) {try {return Ln(e);} catch (Hg) {return Pn.slice();}}(e) : Ln(y(e));} },kn = { f: be },wn = P.f,bn = function bn(e) {var t = $.Symbol || ($.Symbol = {});C(t, e) || wn(t, e, { value: kn.f(e) });},Un = je.forEach,Fn = H("hidden"),xn = be("toPrimitive"),qn = Q.set,jn = Q.getterFor("Symbol"),Bn = Object.prototype,_Hn = s.Symbol,Vn = s.JSON,Kn = Vn && Vn.stringify,Yn = N.f,zn = P.f,Wn = Gn.f,Xn = f.f,Jn = w("symbols"),Qn = w("op-symbols"),Zn = w("string-to-symbol-registry"),$n = w("symbol-to-string-registry"),er = w("wks"),tr = s.QObject,nr = !tr || !tr.prototype || !tr.prototype.findChild,rr = c && u(function () {return 7 != dt(zn({}, "a", { get: function get() {return zn(this, "a", { value: 7 }).a;} })).a;}) ? function (e, t, n) {var r = Yn(Bn, t);r && delete Bn[t], zn(e, t, n), r && e !== Bn && zn(Bn, t, r);} : zn,or = function or(e, t) {var n = Jn[e] = dt(_Hn.prototype);return qn(n, { type: "Symbol", tag: e, description: t }), c || (n.description = t), n;},ir = Ge && "symbol" == typeof _Hn.iterator ? function (e) {return "symbol" == typeof e;} : function (e) {return Object(e) instanceof _Hn;},ar = function ar(e, t, n) {e === Bn && ar(Qn, t, n), L(e);var r = S(t, 1);return L(n), C(Jn, r) ? (n.enumerable ? (C(e, Fn) && e[Fn][r] && (e[Fn][r] = 0), n = dt(n, { enumerable: h(0, 0) })) : (C(e, Fn) || zn(e, Fn, h(1, {})), e[Fn][r] = 1), rr(e, r, n)) : zn(e, r, n);},sr = function sr(e, t) {L(e);var n = y(t),r = ct(n).concat(pr(n));return Un(r, function (t) {c && !ur.call(n, t) || ar(e, t, n[t]);}), e;},ur = function ur(e) {var t = S(e, 1),n = Xn.call(this, t);return this === Bn && C(Jn, t) && !C(Qn, t) ? 0 : n || !C(this, t) || !C(Jn, t) || C(this, Fn) && this[Fn][t] ? n : 1;},cr = function cr(e, t) {var n = y(e),r = S(t, 1);if (n !== Bn || !C(Jn, r) || C(Qn, r)) {var o = Yn(n, r);return !o || !C(Jn, r) || C(n, Fn) && n[Fn][r] || (o.enumerable = 1), o;}},lr = function lr(e) {var t = Wn(y(e)),n = [];return Un(t, function (e) {C(Jn, e) || C(V, e) || n.push(e);}), n;},pr = function pr(e) {var t = e === Bn,n = Wn(t ? Qn : y(e)),r = [];return Un(n, function (e) {!C(Jn, e) || t && !C(Bn, e) || r.push(Jn[e]);}), r;};Ge || (Z((_Hn = function Hn() {if (this instanceof _Hn) throw TypeError("Symbol is not a constructor");var e = arguments.length && void 0 !== arguments[0] ? String(arguments[0]) : void 0,t = j(e),n = function n(e) {this === Bn && n.call(Qn, e), C(this, Fn) && C(this[Fn], t) && (this[Fn][t] = 0), rr(this, t, h(1, e));};return c && nr && rr(Bn, t, { configurable: 1, set: n }), or(t, e);}).prototype, "toString", function () {return jn(this).tag;}), f.f = ur, P.f = ar, N.f = cr, _e.f = Gn.f = lr, me.f = pr, c && (zn(_Hn.prototype, "description", { configurable: 1, get: function get() {return jn(this).description;} }), Z(Bn, "propertyIsEnumerable", ur, { unsafe: 1 })), kn.f = function (e) {return or(be(e), e);}), De({ global: 1, wrap: 1, forced: !Ge, sham: !Ge }, { Symbol: _Hn }), Un(ct(er), function (e) {bn(e);}), De({ target: "Symbol", stat: 1, forced: !Ge }, { for: function _for(e) {var t = String(e);if (C(Zn, t)) return Zn[t];var n = _Hn(t);return Zn[t] = n, $n[n] = t, n;}, keyFor: function keyFor(e) {if (!ir(e)) throw TypeError(e + " is not a symbol");if (C($n, e)) return $n[e];}, useSetter: function useSetter() {nr = 1;}, useSimple: function useSimple() {nr = 0;} }), De({ target: "Object", stat: 1, forced: !Ge, sham: !c }, { create: function create(e, t) {return void 0 === t ? dt(e) : sr(dt(e), t);}, defineProperty: ar, defineProperties: sr, getOwnPropertyDescriptor: cr }), De({ target: "Object", stat: 1, forced: !Ge }, { getOwnPropertyNames: lr, getOwnPropertySymbols: pr }), De({ target: "Object", stat: 1, forced: u(function () {me.f(1);}) }, { getOwnPropertySymbols: function getOwnPropertySymbols(e) {return me.f(Re(e));} }), Vn && De({ target: "JSON", stat: 1, forced: !Ge || u(function () {var e = _Hn();return "[null]" != Kn([e]) || "{}" != Kn({ a: e }) || "{}" != Kn(Object(e));}) }, { stringify: function stringify(e) {for (var t, n, r = [e], o = 1; arguments.length > o;) {r.push(arguments[o++]);}if (n = t = r[1], (E(t) || void 0 !== e) && !ir(e)) return Pe(t) || (t = function t(e, _t2) {if ("function" == typeof n && (_t2 = n.call(this, e, _t2)), !ir(_t2)) return _t2;}), r[1] = t, Kn.apply(Vn, r);} }), _Hn.prototype[xn] || G(_Hn.prototype, xn, _Hn.prototype.valueOf), Rt(_Hn, "Symbol"), V[Fn] = 1;var fr = P.f,hr = s.Symbol;if (c && "function" == typeof hr && (!("description" in hr.prototype) || void 0 !== hr().description)) {var gr = {},dr = function dr() {var e = arguments.length < 1 || void 0 === arguments[0] ? void 0 : String(arguments[0]),t = this instanceof dr ? new hr(e) : void 0 === e ? hr() : hr(e);return "" === e && (gr[t] = 1), t;};ye(dr, hr);var _r = dr.prototype = hr.prototype;_r.constructor = dr;var mr = _r.toString,vr = "Symbol(test)" == String(hr("test")),yr = /^Symbol\((.*)\)[^)]+$/;fr(_r, "description", { configurable: 1, get: function get() {var e = E(this) ? this.valueOf() : this,t = mr.call(e);if (C(gr, e)) return "";var n = vr ? t.slice(7, -1) : t.replace(yr, "$1");return "" === n ? void 0 : n;} }), De({ global: 1, forced: 1 }, { Symbol: dr });}bn("iterator");var Er = be("unscopables"),Sr = Array.prototype;null == Sr[Er] && G(Sr, Er, dt(null));var Ir = function Ir(e) {Sr[Er][e] = 1;},Cr = pe.includes;De({ target: "Array", proto: 1 }, { includes: function includes(e) {return Cr(this, e, arguments.length > 1 ? arguments[1] : void 0);} }), Ir("includes");var Tr = pe.indexOf,Mr = [].indexOf,Or = !!Mr && 1 / [1].indexOf(1, -0) < 0,Ar = Be("indexOf");De({ target: "Array", proto: 1, forced: Or || Ar }, { indexOf: function indexOf(e) {return Or ? Mr.apply(this, arguments) || 0 : Tr(this, e, arguments.length > 1 ? arguments[1] : void 0);} });var Dr = Q.set,Nr = Q.getterFor("Array Iterator"),Lr = qt(Array, "Array", function (e, t) {Dr(this, { type: "Array Iterator", target: y(e), index: 0, kind: t });}, function () {var e = Nr(this),t = e.target,n = e.kind,r = e.index++;return !t || r >= t.length ? (e.target = void 0, { value: void 0, done: 1 }) : "keys" == n ? { value: r, done: 0 } : "values" == n ? { value: t[r], done: 0 } : { value: [r, t[r]], done: 0 };}, "values");Ye.Arguments = Ye.Array, Ir("keys"), Ir("values"), Ir("entries");var Rr = [].join,Pr = m != Object,Gr = Be("join", ",");De({ target: "Array", proto: 1, forced: Pr || Gr }, { join: function join(e) {return Rr.call(y(this), void 0 === e ? "," : e);} });var kr = be("species"),wr = [].slice,br = Math.max;De({ target: "Array", proto: 1, forced: !Qt("slice") }, { slice: function slice(e, t) {var n,r,o,i = y(this),a = ae(i.length),s = ce(e, a),u = ce(void 0 === t ? a : t, a);if (Pe(i) && ("function" != typeof (n = i.constructor) || n !== Array && !Pe(n.prototype) ? E(n) && null === (n = n[kr]) && (n = void 0) : n = void 0, n === Array || void 0 === n)) return wr.call(i, s, u);for (r = new (void 0 === n ? Array : n)(br(u - s, 0)), o = 0; s < u; s++, o++) {s in i && Je(r, o, i[s]);}return r.length = o, r;} }), De({ target: "Date", stat: 1 }, { now: function now() {return new Date().getTime();} });var Ur = Date.prototype,Fr = Ur.toString,xr = Ur.getTime;new Date(NaN) + "" != "Invalid Date" && Z(Ur, "toString", function () {var e = xr.call(this);return e == e ? Fr.call(this) : "Invalid Date";});var qr = function qr(e, t, n) {var r, o;return wt && "function" == typeof (r = t.constructor) && r !== n && E(o = r.prototype) && o !== n.prototype && wt(e, o), e;},jr = "\t\n\x0B\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF",Br = "[" + jr + "]",Hr = RegExp("^" + Br + Br + "*"),Vr = RegExp(Br + Br + "*$"),Kr = function Kr(e) {return function (t) {var n = String(v(t));return 1 & e && (n = n.replace(Hr, "")), 2 & e && (n = n.replace(Vr, "")), n;};},Yr = { start: Kr(1), end: Kr(2), trim: Kr(3) },zr = _e.f,Wr = N.f,Xr = P.f,Jr = Yr.trim,Qr = s.Number,Zr = Qr.prototype,$r = "Number" == d(dt(Zr)),eo = function eo(e) {var t,n,r,o,i,a,s,u,c = S(e, 0);if ("string" == typeof c && c.length > 2) if (43 === (t = (c = Jr(c)).charCodeAt(0)) || 45 === t) {if (88 === (n = c.charCodeAt(2)) || 120 === n) return NaN;} else if (48 === t) {switch (c.charCodeAt(1)) {case 66:case 98:r = 2, o = 49;break;case 79:case 111:r = 8, o = 55;break;default:return +c;}for (a = (i = c.slice(2)).length, s = 0; s < a; s++) {if ((u = i.charCodeAt(s)) < 48 || u > o) return NaN;}return parseInt(i, r);}return +c;};if (Oe("Number", !Qr(" 0o1") || !Qr("0b1") || Qr("+0x1"))) {for (var to, no = function no(e) {var t = arguments.length < 1 ? 0 : e,n = this;return n instanceof no && ($r ? u(function () {Zr.valueOf.call(n);}) : "Number" != d(n)) ? qr(new Qr(eo(t)), n, no) : eo(t);}, ro = c ? zr(Qr) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), oo = 0; ro.length > oo; oo++) {C(Qr, to = ro[oo]) && !C(no, to) && Xr(no, to, Wr(Qr, to));}no.prototype = Zr, Zr.constructor = no, Z(s, "Number", no);}var io = Gn.f,ao = u(function () {return !Object.getOwnPropertyNames(1);});De({ target: "Object", stat: 1, forced: ao }, { getOwnPropertyNames: io });var so = {};so[be("toStringTag")] = "z";var uo = "[object z]" !== String(so) ? function () {return "[object " + $e(this) + "]";} : so.toString,co = Object.prototype;uo !== co.toString && Z(co, "toString", uo, { unsafe: 1 });var lo = Yr.trim,po = s.parseInt,fo = /^[+-]?0[Xx]/,ho = 8 !== po(jr + "08") || 22 !== po(jr + "0x16") ? function (e, t) {var n = lo(String(e));return po(n, t >>> 0 || (fo.test(n) ? 16 : 10));} : po;De({ global: 1, forced: parseInt != ho }, { parseInt: ho });var go,_o,mo,vo = s.Promise,yo = function yo(e, t, n) {for (var r in t) {Z(e, r, t[r], n);}return e;},Eo = be("species"),So = function So(e) {var t = te(e),n = P.f;c && t && !t[Eo] && n(t, Eo, { configurable: 1, get: function get() {return this;} });},Io = function Io(e, t, n) {if (!(e instanceof t)) throw TypeError("Incorrect " + (n ? n + " " : "") + "invocation");return e;},Co = t(function (e) {var t = function t(e, _t3) {this.stopped = e, this.result = _t3;};(e.exports = function (e, n, r, o, i) {var a,s,u,c,l,p,f = Le(n, r, o ? 2 : 1);if (i) a = e;else {if ("function" != typeof (s = tt(e))) throw TypeError("Target is not iterable");if (Xe(s)) {for (u = 0, c = ae(e.length); c > u; u++) {if ((l = o ? f(L(p = e[u])[0], p[1]) : f(e[u])) && l instanceof t) return l;}return new t(0);}a = s.call(e);}for (; !(p = a.next()).done;) {if ((l = Ke(a, f, p.value, o)) && l instanceof t) return l;}return new t(0);}).stop = function (e) {return new t(1, e);};}),To = be("species"),Mo = function Mo(e, t) {var n,r = L(e).constructor;return void 0 === r || null == (n = L(r)[To]) ? t : Ne(n);},Oo = s.location,Ao = s.setImmediate,Do = s.clearImmediate,No = s.process,Lo = s.MessageChannel,Ro = s.Dispatch,Po = 0,Go = {},ko = function ko(e) {if (Go.hasOwnProperty(e)) {var t = Go[e];delete Go[e], t();}},wo = function wo(e) {return function () {ko(e);};},bo = function bo(e) {ko(e.data);},Uo = function Uo(e) {s.postMessage(e + "", Oo.protocol + "//" + Oo.host);};Ao && Do || (Ao = function Ao(e) {for (var t = [], n = 1; arguments.length > n;) {t.push(arguments[n++]);}return Go[++Po] = function () {("function" == typeof e ? e : Function(e)).apply(void 0, t);}, go(Po), Po;}, Do = function Do(e) {delete Go[e];}, "process" == d(No) ? go = function go(e) {No.nextTick(wo(e));} : Ro && Ro.now ? go = function go(e) {Ro.now(wo(e));} : Lo ? (mo = (_o = new Lo()).port2, _o.port1.onmessage = bo, go = Le(mo.postMessage, mo, 1)) : !s.addEventListener || "function" != typeof postMessage || s.importScripts || u(Uo) ? go = "onreadystatechange" in O("script") ? function (e) {pt.appendChild(O("script")).onreadystatechange = function () {pt.removeChild(this), ko(e);};} : function (e) {setTimeout(wo(e), 0);} : (go = Uo, s.addEventListener("message", bo, 0)));var Fo,xo,qo,jo,Bo,Ho,Vo,Ko,Yo = { set: Ao, clear: Do },zo = te("navigator", "userAgent") || "",Wo = N.f,Xo = Yo.set,Jo = s.MutationObserver || s.WebKitMutationObserver,Qo = s.process,Zo = s.Promise,$o = "process" == d(Qo),ei = Wo(s, "queueMicrotask"),ti = ei && ei.value;ti || (Fo = function Fo() {var e, t;for ($o && (e = Qo.domain) && e.exit(); xo;) {t = xo.fn, xo = xo.next;try {t();} catch (Hg) {throw xo ? jo() : qo = void 0, Hg;}}qo = void 0, e && e.enter();}, $o ? jo = function jo() {Qo.nextTick(Fo);} : Jo && !/(iphone|ipod|ipad).*applewebkit/i.test(zo) ? (Bo = 1, Ho = document.createTextNode(""), new Jo(Fo).observe(Ho, { characterData: 1 }), jo = function jo() {Ho.data = Bo = !Bo;}) : Zo && Zo.resolve ? (Vo = Zo.resolve(void 0), Ko = Vo.then, jo = function jo() {Ko.call(Vo, Fo);}) : jo = function jo() {Xo.call(s, Fo);});var ni,ri,oi,ii,ai = ti || function (e) {var t = { fn: e, next: void 0 };qo && (qo.next = t), xo || (xo = t, jo()), qo = t;},si = function si(e) {var t, n;this.promise = new e(function (e, r) {if (void 0 !== t || void 0 !== n) throw TypeError("Bad Promise constructor");t = e, n = r;}), this.resolve = Ne(t), this.reject = Ne(n);},ui = { f: function f(e) {return new si(e);} },ci = function ci(e, t) {if (L(e), E(t) && t.constructor === e) return t;var n = ui.f(e);return (0, n.resolve)(t), n.promise;},li = function li(e) {try {return { error: 0, value: e() };} catch (Hg) {return { error: 1, value: Hg };}},pi = Yo.set,fi = be("species"),hi = "Promise",gi = Q.get,di = Q.set,_i = Q.getterFor(hi),_mi = vo,vi = s.TypeError,yi = s.document,Ei = s.process,Si = s.fetch,Ii = Ei && Ei.versions,Ci = Ii && Ii.v8 || "",Ti = ui.f,Mi = Ti,Oi = "process" == d(Ei),Ai = !!(yi && yi.createEvent && s.dispatchEvent),Di = Oe(hi, function () {var e = _mi.resolve(1),t = function t() {},n = (e.constructor = {})[fi] = function (e) {e(t, t);};return !((Oi || "function" == typeof PromiseRejectionEvent) && e.then(t) instanceof n && 0 !== Ci.indexOf("6.6") && -1 === zo.indexOf("Chrome/66"));}),Ni = Di || !st(function (e) {_mi.all(e).catch(function () {});}),Li = function Li(e) {var t;return E(e) && "function" == typeof (t = e.then) ? t : 0;},Ri = function Ri(e, t, n) {if (!t.notified) {t.notified = 1;var r = t.reactions;ai(function () {for (var o = t.value, i = 1 == t.state, a = 0; r.length > a;) {var s,u,c,l = r[a++],p = i ? l.ok : l.fail,f = l.resolve,h = l.reject,g = l.domain;try {p ? (i || (2 === t.rejection && wi(e, t), t.rejection = 1), 1 == p ? s = o : (g && g.enter(), s = p(o), g && (g.exit(), c = 1)), s === l.promise ? h(vi("Promise-chain cycle")) : (u = Li(s)) ? u.call(s, f, h) : f(s)) : h(o);} catch (Hg) {g && !c && g.exit(), h(Hg);}}t.reactions = [], t.notified = 0, n && !t.rejection && Gi(e, t);});}},Pi = function Pi(e, t, n) {var r, o;Ai ? ((r = yi.createEvent("Event")).promise = t, r.reason = n, r.initEvent(e, 0, 1), s.dispatchEvent(r)) : r = { promise: t, reason: n }, (o = s["on" + e]) ? o(r) : "unhandledrejection" === e && function (e, t) {var n = s.console;n && n.error && (1 === arguments.length ? n.error(e) : n.error(e, t));}("Unhandled promise rejection", n);},Gi = function Gi(e, t) {pi.call(s, function () {var n,r = t.value;if (ki(t) && (n = li(function () {Oi ? Ei.emit("unhandledRejection", r, e) : Pi("unhandledrejection", e, r);}), t.rejection = Oi || ki(t) ? 2 : 1, n.error)) throw n.value;});},ki = function ki(e) {return 1 !== e.rejection && !e.parent;},wi = function wi(e, t) {pi.call(s, function () {Oi ? Ei.emit("rejectionHandled", e) : Pi("rejectionhandled", e, t.value);});},bi = function bi(e, t, n, r) {return function (o) {e(t, n, o, r);};},Ui = function Ui(e, t, n, r) {t.done || (t.done = 1, r && (t = r), t.value = n, t.state = 2, Ri(e, t, 1));},Fi = function Fi(e, t, n, r) {if (!t.done) {t.done = 1, r && (t = r);try {if (e === n) throw vi("Promise can't be resolved itself");var o = Li(n);o ? ai(function () {var r = { done: 0 };try {o.call(n, bi(Fi, e, r, t), bi(Ui, e, r, t));} catch (Hg) {Ui(e, r, Hg, t);}}) : (t.value = n, t.state = 1, Ri(e, t, 0));} catch (Hg) {Ui(e, { done: 0 }, Hg, t);}}};Di && (_mi = function mi(e) {Io(this, _mi, hi), Ne(e), ni.call(this);var t = gi(this);try {e(bi(Fi, this, t), bi(Ui, this, t));} catch (Hg) {Ui(this, t, Hg);}}, (ni = function ni(e) {di(this, { type: hi, done: 0, notified: 0, parent: 0, reactions: [], rejection: 0, state: 0, value: void 0 });}).prototype = yo(_mi.prototype, { then: function then(e, t) {var n = _i(this),r = Ti(Mo(this, _mi));return r.ok = "function" == typeof e ? e : 1, r.fail = "function" == typeof t && t, r.domain = Oi ? Ei.domain : void 0, n.parent = 1, n.reactions.push(r), 0 != n.state && Ri(this, n, 0), r.promise;}, catch: function _catch(e) {return this.then(void 0, e);} }), ri = function ri() {var e = new ni(),t = gi(e);this.promise = e, this.resolve = bi(Fi, e, t), this.reject = bi(Ui, e, t);}, ui.f = Ti = function Ti(e) {return e === _mi || e === oi ? new ri(e) : Mi(e);}, "function" == typeof vo && (ii = vo.prototype.then, Z(vo.prototype, "then", function (e, t) {var n = this;return new _mi(function (e, t) {ii.call(n, e, t);}).then(e, t);}), "function" == typeof Si && De({ global: 1, enumerable: 1, forced: 1 }, { fetch: function fetch(e) {return ci(_mi, Si.apply(s, arguments));} }))), De({ global: 1, wrap: 1, forced: Di }, { Promise: _mi }), Rt(_mi, hi, 0), So(hi), oi = $.Promise, De({ target: hi, stat: 1, forced: Di }, { reject: function reject(e) {var t = Ti(this);return t.reject.call(void 0, e), t.promise;} }), De({ target: hi, stat: 1, forced: Di }, { resolve: function resolve(e) {return ci(this, e);} }), De({ target: hi, stat: 1, forced: Ni }, { all: function all(e) {var t = this,n = Ti(t),r = n.resolve,o = n.reject,i = li(function () {var n = Ne(t.resolve),i = [],a = 0,s = 1;Co(e, function (e) {var u = a++,c = 0;i.push(void 0), s++, n.call(t, e).then(function (e) {c || (c = 1, i[u] = e, --s || r(i));}, o);}), --s || r(i);});return i.error && o(i.value), n.promise;}, race: function race(e) {var t = this,n = Ti(t),r = n.reject,o = li(function () {var o = Ne(t.resolve);Co(e, function (e) {o.call(t, e).then(n.resolve, r);});});return o.error && r(o.value), n.promise;} });var xi,qi,ji = function ji() {var e = L(this),t = "";return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.dotAll && (t += "s"), e.unicode && (t += "u"), e.sticky && (t += "y"), t;},Bi = RegExp.prototype.exec,Hi = String.prototype.replace,Vi = Bi,Ki = (xi = /a/, qi = /b*/g, Bi.call(xi, "a"), Bi.call(qi, "a"), 0 !== xi.lastIndex || 0 !== qi.lastIndex),Yi = void 0 !== /()??/.exec("")[1];(Ki || Yi) && (Vi = function Vi(e) {var t,n,r,o,i = this;return Yi && (n = new RegExp("^" + i.source + "$(?!\\s)", ji.call(i))), Ki && (t = i.lastIndex), r = Bi.call(i, e), Ki && r && (i.lastIndex = i.global ? r.index + r[0].length : t), Yi && r && r.length > 1 && Hi.call(r[0], n, function () {for (o = 1; o < arguments.length - 2; o++) {void 0 === arguments[o] && (r[o] = void 0);}}), r;});var zi = Vi;De({ target: "RegExp", proto: 1, forced: /./.exec !== zi }, { exec: zi });var Wi = RegExp.prototype,Xi = Wi.toString,Ji = u(function () {return "/a/b" != Xi.call({ source: "a", flags: "b" });}),Qi = "toString" != Xi.name;(Ji || Qi) && Z(RegExp.prototype, "toString", function () {var e = L(this),t = String(e.source),n = e.flags;return "/" + t + "/" + String(void 0 === n && e instanceof RegExp && !("flags" in Wi) ? ji.call(e) : n);}, { unsafe: 1 });var Zi = be("match"),$i = function $i(e) {var t;return E(e) && (void 0 !== (t = e[Zi]) ? !!t : "RegExp" == d(e));},ea = function ea(e) {if ($i(e)) throw TypeError("The method doesn't accept regular expressions");return e;},ta = be("match");De({ target: "String", proto: 1, forced: !function (e) {var t = /./;try {"/./"[e](t);} catch (n) {try {return t[ta] = 0, "/./"[e](t);} catch (r) {}}return 0;}("includes") }, { includes: function includes(e) {return !!~String(v(this)).indexOf(ea(e), arguments.length > 1 ? arguments[1] : void 0);} });var na = be("species"),ra = !u(function () {var e = /./;return e.exec = function () {var e = [];return e.groups = { a: "7" }, e;}, "7" !== "".replace(e, "$<a>");}),oa = !u(function () {var e = /(?:)/,t = e.exec;e.exec = function () {return t.apply(this, arguments);};var n = "ab".split(e);return 2 !== n.length || "a" !== n[0] || "b" !== n[1];}),ia = function ia(e, t, n, r) {var o = be(e),i = !u(function () {var t = {};return t[o] = function () {return 7;}, 7 != ""[e](t);}),a = i && !u(function () {var t = 0,n = /a/;return n.exec = function () {return t = 1, null;}, "split" === e && (n.constructor = {}, n.constructor[na] = function () {return n;}), n[o](""), !t;});if (!i || !a || "replace" === e && !ra || "split" === e && !oa) {var s = /./[o],c = n(o, ""[e], function (e, t, n, r, o) {return t.exec === zi ? i && !o ? { done: 1, value: s.call(t, n, r) } : { done: 1, value: e.call(n, t, r) } : { done: 0 };}),l = c[0],p = c[1];Z(String.prototype, e, l), Z(RegExp.prototype, o, 2 == t ? function (e, t) {return p.call(e, this, t);} : function (e) {return p.call(e, this);}), r && G(RegExp.prototype[o], "sham", 1);}},aa = St.charAt,sa = function sa(e, t, n) {return t + (n ? aa(e, t).length : 1);},ua = function ua(e, t) {var n = e.exec;if ("function" == typeof n) {var r = n.call(e, t);if ("object" != typeof r) throw TypeError("RegExp exec method returned something other than an Object or null");return r;}if ("RegExp" !== d(e)) throw TypeError("RegExp#exec called on incompatible receiver");return zi.call(e, t);};ia("match", 1, function (e, t, n) {return [function (t) {var n = v(this),r = null == t ? void 0 : t[e];return void 0 !== r ? r.call(t, n) : new RegExp(t)[e](String(n));}, function (e) {var r = n(t, e, this);if (r.done) return r.value;var o = L(e),i = String(this);if (!o.global) return ua(o, i);var a = o.unicode;o.lastIndex = 0;for (var s, u = [], c = 0; null !== (s = ua(o, i));) {var l = String(s[0]);u[c] = l, "" === l && (o.lastIndex = sa(i, ae(o.lastIndex), a)), c++;}return 0 === c ? null : u;}];});var ca = Math.max,la = Math.min,pa = Math.floor,fa = /\$([$&'`]|\d\d?|<[^>]*>)/g,ha = /\$([$&'`]|\d\d?)/g;ia("replace", 2, function (e, t, n) {return [function (n, r) {var o = v(this),i = null == n ? void 0 : n[e];return void 0 !== i ? i.call(n, o, r) : t.call(String(o), n, r);}, function (e, o) {var i = n(t, e, this, o);if (i.done) return i.value;var a = L(e),s = String(this),u = "function" == typeof o;u || (o = String(o));var c = a.global;if (c) {var l = a.unicode;a.lastIndex = 0;}for (var p = [];;) {var f = ua(a, s);if (null === f) break;if (p.push(f), !c) break;"" === String(f[0]) && (a.lastIndex = sa(s, ae(a.lastIndex), l));}for (var h, g = "", d = 0, _ = 0; _ < p.length; _++) {f = p[_];for (var m = String(f[0]), v = ca(la(oe(f.index), s.length), 0), y = [], E = 1; E < f.length; E++) {y.push(void 0 === (h = f[E]) ? h : String(h));}var S = f.groups;if (u) {var I = [m].concat(y, v, s);void 0 !== S && I.push(S);var C = String(o.apply(void 0, I));} else C = r(m, s, v, y, S, o);v >= d && (g += s.slice(d, v) + C, d = v + m.length);}return g + s.slice(d);}];function r(e, n, r, o, i, a) {var s = r + e.length,u = o.length,c = ha;return void 0 !== i && (i = Re(i), c = fa), t.call(a, c, function (t, a) {var c;switch (a.charAt(0)) {case "$":return "$";case "&":return e;case "`":return n.slice(0, r);case "'":return n.slice(s);case "<":c = i[a.slice(1, -1)];break;default:var l = +a;if (0 === l) return t;if (l > u) {var p = pa(l / 10);return 0 === p ? t : p <= u ? void 0 === o[p - 1] ? a.charAt(1) : o[p - 1] + a.charAt(1) : t;}c = o[l - 1];}return void 0 === c ? "" : c;});}});var ga = be("iterator"),da = be("toStringTag"),_a = Lr.values;for (var ma in Vt) {var va = s[ma],ya = va && va.prototype;if (ya) {if (ya[ga] !== _a) try {G(ya, ga, _a);} catch (Hg) {ya[ga] = _a;}if (ya[da] || G(ya, da, ma), Vt[ma]) for (var Ea in Lr) {if (ya[Ea] !== Lr[Ea]) try {G(ya, Ea, Lr[Ea]);} catch (Hg) {ya[Ea] = Lr[Ea];}}}}var Sa = Yr.trim,Ia = s.parseFloat,Ca = 1 / Ia(jr + "-0") != -Infinity ? function (e) {var t = Sa(String(e)),n = Ia(t);return 0 === n && "-" == t.charAt(0) ? -0 : n;} : Ia;De({ global: 1, forced: parseFloat != Ca }, { parseFloat: Ca });var Ta,Ma = "undefined" != typeof window,Oa = "undefined" != typeof wx && "function" == typeof wx.getSystemInfoSync && "function" == typeof wx.canIUse,Aa = Ma && window.navigator && window.navigator.userAgent || "",Da = /AppleWebKit\/([\d.]+)/i.exec(Aa),Na = (Da && parseFloat(Da.pop()), /iPad/i.test(Aa)),La = (/iPhone/i.test(Aa), /iPod/i.test(Aa), (Ta = Aa.match(/OS (\d+)_/i)) && Ta[1] && Ta[1], /Android/i.test(Aa)),Ra = function () {var e = Aa.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);if (!e) return null;var t = e[1] && parseFloat(e[1]),n = e[2] && parseFloat(e[2]);return t && n ? parseFloat(e[1] + "." + e[2]) : t || null;}(),Pa = (La && /webkit/i.test(Aa), /Firefox/i.test(Aa), /Edge/i.test(Aa)),Ga = !Pa && /Chrome/i.test(Aa),ka = (function () {var e = Aa.match(/Chrome\/(\d+)/);e && e[1] && parseFloat(e[1]);}(), /MSIE/.test(Aa)),wa = (/MSIE\s8\.0/.test(Aa), function () {var e = /MSIE\s(\d+)\.\d/.exec(Aa),t = e && parseFloat(e[1]);return !t && /Trident\/7.0/i.test(Aa) && /rv:11.0/.test(Aa) && (t = 11), t;}()),ba = (/Safari/i.test(Aa), /TBS\/\d+/i.test(Aa)),Ua = (function () {var e = Aa.match(/TBS\/(\d+)/i);if (e && e[1]) e[1];}(), !ba && /MQQBrowser\/\d+/i.test(Aa), !ba && / QQBrowser\/\d+/i.test(Aa), /(micromessenger|webbrowser)/i.test(Aa), /Windows/i.test(Aa), /MAC OS X/i.test(Aa), /MicroMessenger/i.test(Aa), Math.max),Fa = Math.min;De({ target: "Array", proto: 1, forced: !Qt("splice") }, { splice: function splice(e, t) {var n,r,o,i,a,s,u = Re(this),c = ae(u.length),l = ce(e, c),p = arguments.length;if (0 === p ? n = r = 0 : 1 === p ? (n = 0, r = c - l) : (n = p - 2, r = Fa(Ua(oe(t), 0), c - l)), c + n - r > 9007199254740991) throw TypeError("Maximum allowed length exceeded");for (o = Fe(u, r), i = 0; i < r; i++) {(a = l + i) in u && Je(o, i, u[a]);}if (o.length = r, n < r) {for (i = l; i < c - r; i++) {s = i + n, (a = i + r) in u ? u[s] = u[a] : delete u[s];}for (i = c; i > c - r + n; i--) {delete u[i - 1];}} else if (n > r) for (i = c - r; i > l; i--) {s = i + n - 1, (a = i + r - 1) in u ? u[s] = u[a] : delete u[s];}for (i = 0; i < n; i++) {u[i + l] = arguments[i + 2];}return u.length = c - r + n, o;} });var xa = !u(function () {return Object.isExtensible(Object.preventExtensions({}));}),qa = t(function (e) {var t = P.f,n = j("meta"),r = 0,o = Object.isExtensible || function () {return 1;},i = function i(e) {t(e, n, { value: { objectID: "O" + ++r, weakData: {} } });},a = e.exports = { REQUIRED: 0, fastKey: function fastKey(e, t) {if (!E(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;if (!C(e, n)) {if (!o(e)) return "F";if (!t) return "E";i(e);}return e[n].objectID;}, getWeakData: function getWeakData(e, t) {if (!C(e, n)) {if (!o(e)) return 1;if (!t) return 0;i(e);}return e[n].weakData;}, onFreeze: function onFreeze(e) {return xa && a.REQUIRED && o(e) && !C(e, n) && i(e), e;} };V[n] = 1;}),ja = (qa.REQUIRED, qa.fastKey, qa.getWeakData, qa.onFreeze, P.f),Ba = qa.fastKey,Ha = Q.set,Va = Q.getterFor,Ka = (function (e, t, n, r, o) {var i = s[e],a = i && i.prototype,c = i,l = r ? "set" : "add",p = {},f = function f(e) {var t = a[e];Z(a, e, "add" == e ? function (e) {return t.call(this, 0 === e ? 0 : e), this;} : "delete" == e ? function (e) {return o && !E(e) ? 0 : t.call(this, 0 === e ? 0 : e);} : "get" == e ? function (e) {return o && !E(e) ? void 0 : t.call(this, 0 === e ? 0 : e);} : "has" == e ? function (e) {return o && !E(e) ? 0 : t.call(this, 0 === e ? 0 : e);} : function (e, n) {return t.call(this, 0 === e ? 0 : e, n), this;});};if (Oe(e, "function" != typeof i || !(o || a.forEach && !u(function () {new i().entries().next();})))) c = n.getConstructor(t, e, r, l), qa.REQUIRED = 1;else if (Oe(e, 1)) {var h = new c(),g = h[l](o ? {} : -0, 1) != h,d = u(function () {h.has(1);}),_ = st(function (e) {new i(e);}),m = !o && u(function () {for (var e = new i(), t = 5; t--;) {e[l](t, t);}return !e.has(-0);});_ || ((c = t(function (t, n) {Io(t, c, e);var o = qr(new i(), t, c);return null != n && Co(n, o[l], o, r), o;})).prototype = a, a.constructor = c), (d || m) && (f("delete"), f("has"), r && f("get")), (m || g) && f(l), o && a.clear && delete a.clear;}p[e] = c, De({ global: 1, forced: c != i }, p), Rt(c, e), o || n.setStrong(c, e, r);}("Map", function (e) {return function () {return e(this, arguments.length ? arguments[0] : void 0);};}, { getConstructor: function getConstructor(e, t, n, r) {var o = e(function (e, i) {Io(e, o, t), Ha(e, { type: t, index: dt(null), first: void 0, last: void 0, size: 0 }), c || (e.size = 0), null != i && Co(i, e[r], e, n);}),i = Va(t),a = function a(e, t, n) {var r,o,a = i(e),u = s(e, t);return u ? u.value = n : (a.last = u = { index: o = Ba(t, 1), key: t, value: n, previous: r = a.last, next: void 0, removed: 0 }, a.first || (a.first = u), r && (r.next = u), c ? a.size++ : e.size++, "F" !== o && (a.index[o] = u)), e;},s = function s(e, t) {var n,r = i(e),o = Ba(t);if ("F" !== o) return r.index[o];for (n = r.first; n; n = n.next) {if (n.key == t) return n;}};return yo(o.prototype, { clear: function clear() {for (var e = i(this), t = e.index, n = e.first; n;) {n.removed = 1, n.previous && (n.previous = n.previous.next = void 0), delete t[n.index], n = n.next;}e.first = e.last = void 0, c ? e.size = 0 : this.size = 0;}, delete: function _delete(e) {var t = i(this),n = s(this, e);if (n) {var r = n.next,o = n.previous;delete t.index[n.index], n.removed = 1, o && (o.next = r), r && (r.previous = o), t.first == n && (t.first = r), t.last == n && (t.last = o), c ? t.size-- : this.size--;}return !!n;}, forEach: function forEach(e) {for (var t, n = i(this), r = Le(e, arguments.length > 1 ? arguments[1] : void 0, 3); t = t ? t.next : n.first;) {for (r(t.value, t.key, this); t && t.removed;) {t = t.previous;}}}, has: function has(e) {return !!s(this, e);} }), yo(o.prototype, n ? { get: function get(e) {var t = s(this, e);return t && t.value;}, set: function set(e, t) {return a(this, 0 === e ? 0 : e, t);} } : { add: function add(e) {return a(this, e = 0 === e ? 0 : e, e);} }), c && ja(o.prototype, "size", { get: function get() {return i(this).size;} }), o;}, setStrong: function setStrong(e, t, n) {var r = t + " Iterator",o = Va(t),i = Va(r);qt(e, t, function (e, t) {Ha(this, { type: r, target: e, state: o(e), kind: t, last: void 0 });}, function () {for (var e = i(this), t = e.kind, n = e.last; n && n.removed;) {n = n.previous;}return e.target && (e.last = n = n ? n.next : e.state.first) ? "keys" == t ? { value: n.key, done: 0 } : "values" == t ? { value: n.value, done: 0 } : { value: [n.key, n.value], done: 0 } : (e.target = void 0, { value: void 0, done: 1 });}, n ? "entries" : "values", !n, 1), So(t);} }, 1), [].push),Ya = Math.min,za = !u(function () {return !RegExp(4294967295, "y");});ia("split", 2, function (e, t, n) {var r;return r = "c" == "abbc".split(/(b)*/)[1] || 4 != "test".split(/(?:)/, -1).length || 2 != "ab".split(/(?:ab)*/).length || 4 != ".".split(/(.?)(.?)/).length || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function (e, n) {var r = String(v(this)),o = void 0 === n ? 4294967295 : n >>> 0;if (0 === o) return [];if (void 0 === e) return [r];if (!$i(e)) return t.call(r, e, o);for (var i, a, s, u = [], c = (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "") + (e.sticky ? "y" : ""), l = 0, p = new RegExp(e.source, c + "g"); (i = zi.call(p, r)) && !((a = p.lastIndex) > l && (u.push(r.slice(l, i.index)), i.length > 1 && i.index < r.length && Ka.apply(u, i.slice(1)), s = i[0].length, l = a, u.length >= o));) {p.lastIndex === i.index && p.lastIndex++;}return l === r.length ? !s && p.test("") || u.push("") : u.push(r.slice(l)), u.length > o ? u.slice(0, o) : u;} : "0".split(void 0, 0).length ? function (e, n) {return void 0 === e && 0 === n ? [] : t.call(this, e, n);} : t, [function (t, n) {var o = v(this),i = null == t ? void 0 : t[e];return void 0 !== i ? i.call(t, o, n) : r.call(String(o), t, n);}, function (e, o) {var i = n(r, e, this, o, r !== t);if (i.done) return i.value;var a = L(e),s = String(this),u = Mo(a, RegExp),c = a.unicode,l = (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.unicode ? "u" : "") + (za ? "y" : "g"),p = new u(za ? a : "^(?:" + a.source + ")", l),f = void 0 === o ? 4294967295 : o >>> 0;if (0 === f) return [];if (0 === s.length) return null === ua(p, s) ? [s] : [];for (var h = 0, g = 0, d = []; g < s.length;) {p.lastIndex = za ? g : 0;var _,m = ua(p, za ? s : s.slice(g));if (null === m || (_ = Ya(ae(p.lastIndex + (za ? 0 : g)), s.length)) === h) g = sa(s, g, c);else {if (d.push(s.slice(h, g)), d.length === f) return d;for (var v = 1; v <= m.length - 1; v++) {if (d.push(m[v]), d.length === f) return d;}g = h = _;}}return d.push(s.slice(h)), d;}];}, !za);var Wa,Xa,Ja = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};Wa = "undefined" != typeof console ? console : void 0 !== Ja && Ja.console ? Ja.console : "undefined" != typeof window && window.console ? window.console : {};for (var Qa = function Qa() {}, Za = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"], $a = Za.length; $a--;) {Xa = Za[$a], console[Xa] || (Wa[Xa] = Qa);}Wa.methods = Za;var es = Wa,ts = -1,ns = function () {if (Oa) {var e = wx.getSystemInfoSync().SDKVersion;if (void 0 === e || void 0 === wx.getLogManager) return 0;if (function (e, t) {e = e.split("."), t = t.split(".");var n = Math.max(e.length, t.length);for (; e.length < n;) {e.push("0");}for (; t.length < n;) {t.push("0");}for (var r = 0; r < n; r++) {var o = parseInt(e[r]),i = parseInt(t[r]);if (o > i) return 1;if (o < i) return -1;}return 0;}(e, "2.1.0") >= 0) return wx.getLogManager().log("I can use wx log. SDKVersion=" + e), 1;}return 0;}(),rs = new Map();function os() {var e = new Date();return "TIM " + e.toLocaleTimeString("en-US", { hour12: 0 }) + "." + function (e) {var t;switch (e.toString().length) {case 1:t = "00" + e;break;case 2:t = "0" + e;break;default:t = e;}return t;}(e.getMilliseconds()) + ":";}var is = { _data: [], _length: 0, _visible: 0, arguments2String: function arguments2String(e) {var t;if (1 === e.length) t = os() + e[0];else {t = os();for (var n = 0, r = e.length; n < r; n++) {ds(e[n]) ? _s(e[n]) ? t += Is(e[n]) : t += JSON.stringify(e[n]) : t += e[n], t += " ";}}return t;}, debug: function debug() {if (ts <= -1) {var e = this.arguments2String(arguments);is.record(e, "debug"), es.debug(e), ns && wx.getLogManager().debug(e);}}, log: function log() {if (ts <= 0) {var e = this.arguments2String(arguments);is.record(e, "log"), es.log(e), ns && wx.getLogManager().log(e);}}, info: function info() {if (ts <= 1) {var e = this.arguments2String(arguments);is.record(e, "info"), es.info(e), ns && wx.getLogManager().info(e);}}, warn: function warn() {if (ts <= 2) {var e = this.arguments2String(arguments);is.record(e, "warn"), es.warn(e), ns && wx.getLogManager().warn(e);}}, error: function error() {if (ts <= 3) {var e = this.arguments2String(arguments);is.record(e, "error"), es.error(e), ns && wx.getLogManager().warn(e);}}, time: function time(e) {rs.set(e, Es.now());}, timeEnd: function timeEnd(e) {if (rs.has(e)) {var t = Es.now() - rs.get(e);return rs.delete(e), t;}return es.warn("未找到对应label: ".concat(e, ", 请在调用 logger.timeEnd 前，调用 logger.time")), 0;}, setLevel: function setLevel(e) {e < 4 && es.log(os() + "set level from " + ts + " to " + e), ts = e;}, record: function record(e, t) {ns || (1100 === is._length && (is._data.splice(0, 100), is._length = 1e3), is._length++, is._data.push("".concat(e, " [").concat(t, "] \n")));}, getLog: function getLog() {return is._data;} },as = function as(e) {return "map" === ms(e);},ss = function ss(e) {return "set" === ms(e);},us = function us(e) {return "file" === ms(e);},cs = function cs(e) {return null !== e && ("number" == typeof e && !isNaN(e - 0) || "object" === rn(e) && e.constructor === Number);},ls = function ls(e) {return "string" == typeof e;},ps = function ps(e) {return null !== e && "object" === rn(e);},fs = function fs(e) {return ps(e) && e.__proto__ === Object.prototype;},hs = function hs(e) {return "function" == typeof Array.isArray ? Array.isArray(e) : "array" === ms(e);},gs = function gs(e) {return void 0 === e;},ds = function ds(e) {return hs(e) || ps(e);},_s = function _s(e) {return e instanceof Error;},ms = function ms(e) {return Object.prototype.toString.call(e).match(/^\[object (.*)\]$/)[1].toLowerCase();},vs = function vs(e) {if ("string" != typeof e) return 0;var t = e[0];return /[^a-zA-Z0-9]/.test(t) ? 0 : 1;},ys = 0;Date.now || (Date.now = function () {return new Date().getTime();});var Es = { now: function now() {0 === ys && (ys = Date.now() - 1);var e = Date.now() - ys;return e > 4294967295 ? (ys += 4294967295, Date.now() - ys) : e;}, utc: function utc() {return Math.round(Date.now() / 1e3);} },Ss = function e(t, n, r, o) {if (!ds(t) || !ds(n)) return 0;for (var i, a = 0, s = Object.keys(n), u = 0, c = s.length; u < c; u++) {if (i = s[u], !(gs(n[i]) || r && r.includes(i))) if (ds(t[i]) && ds(n[i])) a += e(t[i], n[i], r, o);else {if (o && o.includes(n[i])) continue;t[i] !== n[i] && (t[i] = n[i], a += 1);}}return a;},Is = function Is(e) {return JSON.stringify(e, ["message", "code"]);},Cs = function Cs(e) {if (0 === e.length) return 0;for (var t = 0, n = 0, r = "undefined" != typeof document && void 0 !== document.characterSet ? document.characterSet : "UTF-8"; void 0 !== e[t];) {n += e[t++].charCodeAt[t] <= 255 ? 1 : 0 == r ? 3 : 2;}return n;},Ts = function Ts(e) {var t = e || 99999999;return Math.round(Math.random() * t);},Ms = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",Os = Ms.length,As = function As(e, t) {for (var n in e) {if (e[n] === t) return 1;}return 0;},Ds = {},Ns = function Ns(e) {return e === Xt.GRP_PUBLIC;},Ls = function Ls(e) {return e === Xt.GRP_AVCHATROOM;};function Rs(e, t) {var n = {};return Object.keys(e).forEach(function (r) {n[r] = t(e[r], r);}), n;}var Ps = Object.prototype.hasOwnProperty;function Gs(e) {if (null == e) return 1;if ("boolean" == typeof e) return 0;if ("number" == typeof e) return 0 === e;if ("string" == typeof e) return 0 === e.length;if ("function" == typeof e) return 0 === e.length;if (Array.isArray(e)) return 0 === e.length;if (e instanceof Error) return "" === e.message;if (fs(e)) {for (var t in e) {if (Ps.call(e, t)) return 0;}return 1;}return as(e) || ss(e) || us(e) ? 0 === e.size : 0;}function ks(e, t, n) {if (void 0 === t) return 1;var r = 1;if ("object" === Nn(t).toLowerCase()) Object.keys(t).forEach(function (o) {var i = 1 === e.length ? e[0][o] : void 0;r = ws(i, t[o], n, o) ? r : 0;});else if ("array" === Nn(t).toLowerCase()) for (var o = 0; o < t.length; o++) {r = ws(e[o], t[o], n, t[o].name) ? r : 0;}if (r) return r;throw new Error("Params validate failed.");}function ws(e, t, n, r) {if (void 0 === t) return 1;var o = 1;return t.required && Gs(e) && (es.error("TIM [".concat(n, '] Missing required params: "').concat(r, '".')), o = 0), Gs(e) || Nn(e).toLowerCase() === t.type.toLowerCase() || (es.error("TIM [".concat(n, '] Invalid params: type check failed for "').concat(r, '".Expected ').concat(t.type, ".")), o = 0), t.validator && !t.validator(e) && (es.error("TIM [".concat(n, "] Invalid params: custom validator check failed for params.")), o = 0), o;}var bs = { login: { userID: { type: "String", required: 1 }, userSig: { type: "String", required: 1 } }, addToBlacklist: { userIDList: { type: "Array", required: 1 } }, mutilParam: [{ name: "paramName", type: "Number", required: 1 }, { name: "paramName", type: "String", required: 1 }], on: [{ name: "eventName", type: "String", required: 1 }, { name: "listener", type: "Function", required: 0 }], sendMessage: [{ name: "message", type: "Object", required: 1 }], getMessageList: { conversationID: { type: "String", required: 1 }, nextReqMessageID: { type: "String" }, count: { type: "Number", validator: function validator(e) {return gs(e) || /^[1-9][0-9]*$/.test(e) ? 1 : (console.warn("getMessageList 接口的 count 参数必须为正整数"), 0);} } }, getConversationProfile: [{ name: "conversationID", type: "String", required: 1, validator: function validator(e) {return e ? ls(t = e) && t.slice(0, 3) === Xt.CONV_C2C || function (e) {return ls(e) && e.slice(0, 5) === Xt.CONV_GROUP;}(e) || function (e) {return ls(e) && e === Xt.CONV_SYSTEM;}(e) ? 1 : (console.warn("非法的会话 ID:".concat(e, "。会话 ID 组成方式：\n      C2C + userID（单聊）\n      GROUP + groupID（群聊）\n      @TIM#SYSTEM（系统通知会话）")), 0) : 0;var t;} }], deleteConversation: [{ name: "conversationID", type: "String", required: 1 }], getGroupList: { groupProfileFilter: { type: "Array" } }, getGroupProfile: { groupID: { type: "String", required: 1 }, groupCustomFieldFilter: { type: "Array" }, memberCustomFieldFilter: { type: "Array" } }, getGroupProfileAdvance: { groupIDList: { type: "Array", required: 1 } }, createGroup: { name: { type: "String", required: 1 } }, joinGroup: { groupID: { type: "String", required: 1 }, type: { type: "String" }, applyMessage: { type: "String" } }, quitGroup: [{ name: "groupID", type: "String", required: 1 }], handleApplication: { message: { type: "Object", required: 1 }, handleAction: { type: "String", required: 1 }, handleMessage: { type: "String" } }, changeGroupOwner: { groupID: { type: "String", required: 1 }, newOwnerID: { type: "String", required: 1 } }, updateGroupProfile: { groupID: { type: "String", required: 1 } }, dismissGroup: [{ name: "groupID", type: "String", required: 1 }], searchGroupByID: [{ name: "groupID", type: "String", required: 1 }], getGroupMemberList: { groupID: { type: "String", required: 1 }, offset: { type: "Number" }, count: { type: "Number" } }, addGroupMemeber: { groupID: { type: "String", required: 1 }, userIDList: { type: "Array", required: 1 } }, setGroupMemberRole: { groupID: { type: "String", required: 1 }, userID: { type: "String", required: 1 }, role: { type: "String", required: 1 } }, setGroupMemberMuteTime: { groupID: { type: "String", required: 1 }, userID: { type: "String" }, muteTime: { type: "Number", validator: function validator(e) {return e >= 0;} } }, setGroupMemberNameCard: { groupID: { type: "String", required: 1 }, userID: { type: "String" }, nameCard: { type: "String", required: 1, validator: function validator(e) {return 1 == /^\s+$/.test(e) ? 0 : 1;} } }, setMessageRemindType: { groupID: { type: "String", required: 1 }, messageRemindType: { type: "String", required: 1 } }, setGroupMemberCustomField: { groupID: { type: "String", required: 1 }, userID: { type: "String" }, memberCustomField: { type: "Array", required: 1 } }, deleteGroupMember: { groupID: { type: "String", required: 1 } }, createTextMessage: { to: { type: "String", required: 1 }, conversationType: { type: "String", required: 1 }, payload: { type: "Object", required: 1 } }, createCustomMessage: { to: { type: "String", required: 1 }, conversationType: { type: "String", required: 1 }, payload: { type: "Object", required: 1 } }, createImageMessage: { to: { type: "String", required: 1 }, conversationType: { type: "String", required: 1 }, payload: { type: "Object", required: 1 } }, createAudioMessage: { to: { type: "String", required: 1 }, conversationType: { type: "String", required: 1 }, payload: { type: "Object", required: 1 } }, createFileMessage: { to: { type: "String", required: 1 }, conversationType: { type: "String", required: 1 }, payload: { type: "Object", required: 1 } } },Us = { login: "login", logout: "logout", on: "on", once: "once", off: "off", setLogLevel: "setLogLevel", downloadLog: "downloadLog", registerPlugin: "registerPlugin", destroy: "destroy", createTextMessage: "createTextMessage", createFileMessage: "createFileMessage", createAudioMessage: "createAudioMessage", createImageMessage: "createImageMessage", createCustomMessage: "createCustomMessage", sendMessage: "sendMessage", resendMessage: "resendMessage", getMessageList: "getMessageList", setMessageRead: "setMessageRead", getConversationList: "getConversationList", getConversationProfile: "getConversationProfile", deleteConversation: "deleteConversation", getGroupList: "getGroupList", getGroupProfile: "getGroupProfile", createGroup: "createGroup", joinGroup: "joinGroup", updateGroupProfile: "updateGroupProfile", quitGroup: "quitGroup", dismissGroup: "dismissGroup", changeGroupOwner: "changeGroupOwner", searchGroupByID: "searchGroupByID", setMessageRemindType: "setMessageRemindType", handleGroupApplication: "handleGroupApplication", getGroupMemberList: "getGroupMemberList", addGroupMember: "addGroupMember", deleteGroupMember: "deleteGroupMember", setGroupMemberNameCard: "setGroupMemberNameCard", setGroupMemberMuteTime: "setGroupMemberMuteTime", setGroupMemberRole: "setGroupMemberRole", setGroupMemberCustomField: "setGroupMemberCustomField", getMyProfile: "getMyProfile", getUserProfile: "getUserProfile", updateMyProfile: "updateMyProfile", getBlacklist: "getBlacklist", addToBlacklist: "addToBlacklist", removeFromBlacklist: "removeFromBlacklist", getFriendList: "getFriendList" },Fs = be("iterator"),xs = !u(function () {var e = new URL("b?e=1", "http://a"),t = e.searchParams;return e.pathname = "c%20d", !t.sort || "http://a/c%20d?e=1" !== e.href || "1" !== t.get("e") || "a=1" !== String(new URLSearchParams("?a=1")) || !t[Fs] || "a" !== new URL("https://a@b").username || "b" !== new URLSearchParams(new URLSearchParams("a=b")).get("a") || "xn--e1aybc" !== new URL("http://тест").host || "#%D0%B1" !== new URL("http://a#б").hash;}),qs = Object.assign,js = !qs || u(function () {var e = {},t = {},n = Symbol();return e[n] = 7, "abcdefghijklmnopqrst".split("").forEach(function (e) {t[e] = e;}), 7 != qs({}, e)[n] || "abcdefghijklmnopqrst" != ct(qs({}, t)).join("");}) ? function (e, t) {for (var n = Re(e), r = arguments.length, o = 1, i = me.f, a = f.f; r > o;) {for (var s, u = m(arguments[o++]), l = i ? ct(u).concat(i(u)) : ct(u), p = l.length, h = 0; p > h;) {s = l[h++], c && !a.call(u, s) || (n[s] = u[s]);}}return n;} : qs,Bs = /[^\0-\u007E]/,Hs = /[.\u3002\uFF0E\uFF61]/g,Vs = "Overflow: input needs wider integers to process",Ks = Math.floor,Ys = String.fromCharCode,zs = function zs(e) {return e + 22 + 75 * (e < 26);},Ws = function Ws(e, t, n) {var r = 0;for (e = n ? Ks(e / 700) : e >> 1, e += Ks(e / t); e > 455; r += 36) {e = Ks(e / 35);}return Ks(r + 36 * e / (e + 38));},Xs = function Xs(e) {var t,n,r = [],o = (e = function (e) {for (var t = [], n = 0, r = e.length; n < r;) {var o = e.charCodeAt(n++);if (o >= 55296 && o <= 56319 && n < r) {var i = e.charCodeAt(n++);56320 == (64512 & i) ? t.push(((1023 & o) << 10) + (1023 & i) + 65536) : (t.push(o), n--);} else t.push(o);}return t;}(e)).length,i = 128,a = 0,s = 72;for (t = 0; t < e.length; t++) {(n = e[t]) < 128 && r.push(Ys(n));}var u = r.length,c = u;for (u && r.push("-"); c < o;) {var l = 2147483647;for (t = 0; t < e.length; t++) {(n = e[t]) >= i && n < l && (l = n);}var p = c + 1;if (l - i > Ks((2147483647 - a) / p)) throw RangeError(Vs);for (a += (l - i) * p, i = l, t = 0; t < e.length; t++) {if ((n = e[t]) < i && ++a > 2147483647) throw RangeError(Vs);if (n == i) {for (var f = a, h = 36;; h += 36) {var g = h <= s ? 1 : h >= s + 26 ? 26 : h - s;if (f < g) break;var d = f - g,_ = 36 - g;r.push(Ys(zs(g + d % _))), f = Ks(d / _);}r.push(Ys(zs(f))), s = Ws(a, p, c == u), a = 0, ++c;}}++a, ++i;}return r.join("");},Js = function Js(e) {var t = tt(e);if ("function" != typeof t) throw TypeError(String(e) + " is not iterable");return L(t.call(e));},Qs = be("iterator"),Zs = Q.set,$s = Q.getterFor("URLSearchParams"),eu = Q.getterFor("URLSearchParamsIterator"),tu = /\+/g,nu = Array(4),ru = function ru(e) {return nu[e - 1] || (nu[e - 1] = RegExp("((?:%[\\da-f]{2}){" + e + "})", "gi"));},ou = function ou(e) {try {return decodeURIComponent(e);} catch (Hg) {return e;}},iu = function iu(e) {var t = e.replace(tu, " "),n = 4;try {return decodeURIComponent(t);} catch (Hg) {for (; n;) {t = t.replace(ru(n--), ou);}return t;}},au = /[!'()~]|%20/g,su = { "!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+" },uu = function uu(e) {return su[e];},cu = function cu(e) {return encodeURIComponent(e).replace(au, uu);},lu = function lu(e, t) {if (t) for (var n, r, o = t.split("&"), i = 0; i < o.length;) {(n = o[i++]).length && (r = n.split("="), e.push({ key: iu(r.shift()), value: iu(r.join("=")) }));}},pu = function pu(e) {this.entries.length = 0, lu(this.entries, e);},fu = function fu(e, t) {if (e < t) throw TypeError("Not enough arguments");},hu = kt(function (e, t) {Zs(this, { type: "URLSearchParamsIterator", iterator: Js($s(e).entries), kind: t });}, "Iterator", function () {var e = eu(this),t = e.kind,n = e.iterator.next(),r = n.value;return n.done || (n.value = "keys" === t ? r.key : "values" === t ? r.value : [r.key, r.value]), n;}),gu = function gu() {Io(this, gu, "URLSearchParams");var e,t,n,r,o,i,a,s = arguments.length > 0 ? arguments[0] : void 0,u = this,c = [];if (Zs(u, { type: "URLSearchParams", entries: c, updateURL: function updateURL() {}, updateSearchParams: pu }), void 0 !== s) if (E(s)) {if ("function" == typeof (e = tt(s))) for (t = e.call(s); !(n = t.next()).done;) {if ((o = (r = Js(L(n.value))).next()).done || (i = r.next()).done || !r.next().done) throw TypeError("Expected sequence with length 2");c.push({ key: o.value + "", value: i.value + "" });} else for (a in s) {C(s, a) && c.push({ key: a, value: s[a] + "" });}} else lu(c, "string" == typeof s ? "?" === s.charAt(0) ? s.slice(1) : s : s + "");},du = gu.prototype;yo(du, { append: function append(e, t) {fu(arguments.length, 2);var n = $s(this);n.entries.push({ key: e + "", value: t + "" }), n.updateURL();}, delete: function _delete(e) {fu(arguments.length, 1);for (var t = $s(this), n = t.entries, r = e + "", o = 0; o < n.length;) {n[o].key === r ? n.splice(o, 1) : o++;}t.updateURL();}, get: function get(e) {fu(arguments.length, 1);for (var t = $s(this).entries, n = e + "", r = 0; r < t.length; r++) {if (t[r].key === n) return t[r].value;}return null;}, getAll: function getAll(e) {fu(arguments.length, 1);for (var t = $s(this).entries, n = e + "", r = [], o = 0; o < t.length; o++) {t[o].key === n && r.push(t[o].value);}return r;}, has: function has(e) {fu(arguments.length, 1);for (var t = $s(this).entries, n = e + "", r = 0; r < t.length;) {if (t[r++].key === n) return 1;}return 0;}, set: function set(e, t) {fu(arguments.length, 1);for (var n, r = $s(this), o = r.entries, i = 0, a = e + "", s = t + "", u = 0; u < o.length; u++) {(n = o[u]).key === a && (i ? o.splice(u--, 1) : (i = 1, n.value = s));}i || o.push({ key: a, value: s }), r.updateURL();}, sort: function sort() {var e,t,n,r = $s(this),o = r.entries,i = o.slice();for (o.length = 0, n = 0; n < i.length; n++) {for (e = i[n], t = 0; t < n; t++) {if (o[t].key > e.key) {o.splice(t, 0, e);break;}}t === n && o.push(e);}r.updateURL();}, forEach: function forEach(e) {for (var t, n = $s(this).entries, r = Le(e, arguments.length > 1 ? arguments[1] : void 0, 3), o = 0; o < n.length;) {r((t = n[o++]).value, t.key, this);}}, keys: function keys() {return new hu(this, "keys");}, values: function values() {return new hu(this, "values");}, entries: function entries() {return new hu(this, "entries");} }, { enumerable: 1 }), Z(du, Qs, du.entries), Z(du, "toString", function () {for (var e, t = $s(this).entries, n = [], r = 0; r < t.length;) {e = t[r++], n.push(cu(e.key) + "=" + cu(e.value));}return n.join("&");}, { enumerable: 1 }), Rt(gu, "URLSearchParams"), De({ global: 1, forced: !xs }, { URLSearchParams: gu });var _u,mu = { URLSearchParams: gu, getState: $s },vu = St.codeAt,yu = s.URL,Eu = mu.URLSearchParams,Su = mu.getState,Iu = Q.set,Cu = Q.getterFor("URL"),Tu = Math.floor,Mu = Math.pow,Ou = /[A-Za-z]/,Au = /[\d+\-.A-Za-z]/,Du = /\d/,Nu = /^(0x|0X)/,Lu = /^[0-7]+$/,Ru = /^\d+$/,Pu = /^[\dA-Fa-f]+$/,Gu = /[\u0000\u0009\u000A\u000D #%\/:?@[\\]]/,ku = /[\u0000\u0009\u000A\u000D #\/:?@[\\]]/,wu = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,bu = /[\u0009\u000A\u000D]/g,Uu = function Uu(e, t) {var n, r, o;if ("[" == t.charAt(0)) {if ("]" != t.charAt(t.length - 1)) return "Invalid host";if (!(n = xu(t.slice(1, -1)))) return "Invalid host";e.host = n;} else if (zu(e)) {if (t = function (e) {var t,n,r = [],o = e.toLowerCase().replace(Hs, ".").split(".");for (t = 0; t < o.length; t++) {n = o[t], r.push(Bs.test(n) ? "xn--" + Xs(n) : n);}return r.join(".");}(t), Gu.test(t)) return "Invalid host";if (null === (n = Fu(t))) return "Invalid host";e.host = n;} else {if (ku.test(t)) return "Invalid host";for (n = "", r = nt(t), o = 0; o < r.length; o++) {n += Ku(r[o], ju);}e.host = n;}},Fu = function Fu(e) {var t,n,r,o,i,a,s,u = e.split(".");if (u.length && "" == u[u.length - 1] && u.pop(), (t = u.length) > 4) return e;for (n = [], r = 0; r < t; r++) {if ("" == (o = u[r])) return e;if (i = 10, o.length > 1 && "0" == o.charAt(0) && (i = Nu.test(o) ? 16 : 8, o = o.slice(8 == i ? 1 : 2)), "" === o) a = 0;else {if (!(10 == i ? Ru : 8 == i ? Lu : Pu).test(o)) return e;a = parseInt(o, i);}n.push(a);}for (r = 0; r < t; r++) {if (a = n[r], r == t - 1) {if (a >= Mu(256, 5 - t)) return null;} else if (a > 255) return null;}for (s = n.pop(), r = 0; r < n.length; r++) {s += n[r] * Mu(256, 3 - r);}return s;},xu = function xu(e) {var t,n,r,o,i,a,s,u = [0, 0, 0, 0, 0, 0, 0, 0],c = 0,l = null,p = 0,f = function f() {return e.charAt(p);};if (":" == f()) {if (":" != e.charAt(1)) return;p += 2, l = ++c;}for (; f();) {if (8 == c) return;if (":" != f()) {for (t = n = 0; n < 4 && Pu.test(f());) {t = 16 * t + parseInt(f(), 16), p++, n++;}if ("." == f()) {if (0 == n) return;if (p -= n, c > 6) return;for (r = 0; f();) {if (o = null, r > 0) {if (!("." == f() && r < 4)) return;p++;}if (!Du.test(f())) return;for (; Du.test(f());) {if (i = parseInt(f(), 10), null === o) o = i;else {if (0 == o) return;o = 10 * o + i;}if (o > 255) return;p++;}u[c] = 256 * u[c] + o, 2 != ++r && 4 != r || c++;}if (4 != r) return;break;}if (":" == f()) {if (p++, !f()) return;} else if (f()) return;u[c++] = t;} else {if (null !== l) return;p++, l = ++c;}}if (null !== l) for (a = c - l, c = 7; 0 != c && a > 0;) {s = u[c], u[c--] = u[l + a - 1], u[l + --a] = s;} else if (8 != c) return;return u;},qu = function qu(e) {var t, n, r, o;if ("number" == typeof e) {for (t = [], n = 0; n < 4; n++) {t.unshift(e % 256), e = Tu(e / 256);}return t.join(".");}if ("object" == typeof e) {for (t = "", r = function (e) {for (var t = null, n = 1, r = null, o = 0, i = 0; i < 8; i++) {0 !== e[i] ? (o > n && (t = r, n = o), r = null, o = 0) : (null === r && (r = i), ++o);}return o > n && (t = r, n = o), t;}(e), n = 0; n < 8; n++) {o && 0 === e[n] || (o && (o = 0), r === n ? (t += n ? ":" : "::", o = 1) : (t += e[n].toString(16), n < 7 && (t += ":")));}return "[" + t + "]";}return e;},ju = {},Bu = js({}, ju, { " ": 1, '"': 1, "<": 1, ">": 1, "`": 1 }),Hu = js({}, Bu, { "#": 1, "?": 1, "{": 1, "}": 1 }),Vu = js({}, Hu, { "/": 1, ":": 1, ";": 1, "=": 1, "@": 1, "[": 1, "\\": 1, "]": 1, "^": 1, "|": 1 }),Ku = function Ku(e, t) {var n = vu(e, 0);return n > 32 && n < 127 && !C(t, e) ? e : encodeURIComponent(e);},Yu = { ftp: 21, file: null, gopher: 70, http: 80, https: 443, ws: 80, wss: 443 },zu = function zu(e) {return C(Yu, e.scheme);},Wu = function Wu(e) {return "" != e.username || "" != e.password;},Xu = function Xu(e) {return !e.host || e.cannotBeABaseURL || "file" == e.scheme;},Ju = function Ju(e, t) {var n;return 2 == e.length && Ou.test(e.charAt(0)) && (":" == (n = e.charAt(1)) || !t && "|" == n);},Qu = function Qu(e) {var t;return e.length > 1 && Ju(e.slice(0, 2)) && (2 == e.length || "/" === (t = e.charAt(2)) || "\\" === t || "?" === t || "#" === t);},Zu = function Zu(e) {var t = e.path,n = t.length;!n || "file" == e.scheme && 1 == n && Ju(t[0], 1) || t.pop();},$u = function $u(e) {return "." === e || "%2e" === e.toLowerCase();},ec = {},tc = {},nc = {},rc = {},oc = {},ic = {},ac = {},sc = {},uc = {},cc = {},lc = {},pc = {},fc = {},hc = {},gc = {},dc = {},_c = {},mc = {},vc = {},yc = {},Ec = {},Sc = function Sc(e, t, n, r) {var o,i,a,s,u,c = n || ec,l = 0,p = "",f = 0,h = 0,g = 0;for (n || (e.scheme = "", e.username = "", e.password = "", e.host = null, e.port = null, e.path = [], e.query = null, e.fragment = null, e.cannotBeABaseURL = 0, t = t.replace(wu, "")), t = t.replace(bu, ""), o = nt(t); l <= o.length;) {switch (i = o[l], c) {case ec:if (!i || !Ou.test(i)) {if (n) return "Invalid scheme";c = nc;continue;}p += i.toLowerCase(), c = tc;break;case tc:if (i && (Au.test(i) || "+" == i || "-" == i || "." == i)) p += i.toLowerCase();else {if (":" != i) {if (n) return "Invalid scheme";p = "", c = nc, l = 0;continue;}if (n && (zu(e) != C(Yu, p) || "file" == p && (Wu(e) || null !== e.port) || "file" == e.scheme && !e.host)) return;if (e.scheme = p, n) return void (zu(e) && Yu[e.scheme] == e.port && (e.port = null));p = "", "file" == e.scheme ? c = hc : zu(e) && r && r.scheme == e.scheme ? c = rc : zu(e) ? c = sc : "/" == o[l + 1] ? (c = oc, l++) : (e.cannotBeABaseURL = 1, e.path.push(""), c = vc);}break;case nc:if (!r || r.cannotBeABaseURL && "#" != i) return "Invalid scheme";if (r.cannotBeABaseURL && "#" == i) {e.scheme = r.scheme, e.path = r.path.slice(), e.query = r.query, e.fragment = "", e.cannotBeABaseURL = 1, c = Ec;break;}c = "file" == r.scheme ? hc : ic;continue;case rc:if ("/" != i || "/" != o[l + 1]) {c = ic;continue;}c = uc, l++;break;case oc:if ("/" == i) {c = cc;break;}c = mc;continue;case ic:if (e.scheme = r.scheme, i == _u) e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.query = r.query;else if ("/" == i || "\\" == i && zu(e)) c = ac;else if ("?" == i) e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.query = "", c = yc;else {if ("#" != i) {e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.path.pop(), c = mc;continue;}e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.query = r.query, e.fragment = "", c = Ec;}break;case ac:if (!zu(e) || "/" != i && "\\" != i) {if ("/" != i) {e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, c = mc;continue;}c = cc;} else c = uc;break;case sc:if (c = uc, "/" != i || "/" != p.charAt(l + 1)) continue;l++;break;case uc:if ("/" != i && "\\" != i) {c = cc;continue;}break;case cc:if ("@" == i) {f && (p = "%40" + p), f = 1, a = nt(p);for (var d = 0; d < a.length; d++) {var _ = a[d];if (":" != _ || g) {var m = Ku(_, Vu);g ? e.password += m : e.username += m;} else g = 1;}p = "";} else if (i == _u || "/" == i || "?" == i || "#" == i || "\\" == i && zu(e)) {if (f && "" == p) return "Invalid authority";l -= nt(p).length + 1, p = "", c = lc;} else p += i;break;case lc:case pc:if (n && "file" == e.scheme) {c = dc;continue;}if (":" != i || h) {if (i == _u || "/" == i || "?" == i || "#" == i || "\\" == i && zu(e)) {if (zu(e) && "" == p) return "Invalid host";if (n && "" == p && (Wu(e) || null !== e.port)) return;if (s = Uu(e, p)) return s;if (p = "", c = _c, n) return;continue;}"[" == i ? h = 1 : "]" == i && (h = 0), p += i;} else {if ("" == p) return "Invalid host";if (s = Uu(e, p)) return s;if (p = "", c = fc, n == pc) return;}break;case fc:if (!Du.test(i)) {if (i == _u || "/" == i || "?" == i || "#" == i || "\\" == i && zu(e) || n) {if ("" != p) {var v = parseInt(p, 10);if (v > 65535) return "Invalid port";e.port = zu(e) && v === Yu[e.scheme] ? null : v, p = "";}if (n) return;c = _c;continue;}return "Invalid port";}p += i;break;case hc:if (e.scheme = "file", "/" == i || "\\" == i) c = gc;else {if (!r || "file" != r.scheme) {c = mc;continue;}if (i == _u) e.host = r.host, e.path = r.path.slice(), e.query = r.query;else if ("?" == i) e.host = r.host, e.path = r.path.slice(), e.query = "", c = yc;else {if ("#" != i) {Qu(o.slice(l).join("")) || (e.host = r.host, e.path = r.path.slice(), Zu(e)), c = mc;continue;}e.host = r.host, e.path = r.path.slice(), e.query = r.query, e.fragment = "", c = Ec;}}break;case gc:if ("/" == i || "\\" == i) {c = dc;break;}r && "file" == r.scheme && !Qu(o.slice(l).join("")) && (Ju(r.path[0], 1) ? e.path.push(r.path[0]) : e.host = r.host), c = mc;continue;case dc:if (i == _u || "/" == i || "\\" == i || "?" == i || "#" == i) {if (!n && Ju(p)) c = mc;else if ("" == p) {if (e.host = "", n) return;c = _c;} else {if (s = Uu(e, p)) return s;if ("localhost" == e.host && (e.host = ""), n) return;p = "", c = _c;}continue;}p += i;break;case _c:if (zu(e)) {if (c = mc, "/" != i && "\\" != i) continue;} else if (n || "?" != i) {if (n || "#" != i) {if (i != _u && (c = mc, "/" != i)) continue;} else e.fragment = "", c = Ec;} else e.query = "", c = yc;break;case mc:if (i == _u || "/" == i || "\\" == i && zu(e) || !n && ("?" == i || "#" == i)) {if (".." === (u = (u = p).toLowerCase()) || "%2e." === u || ".%2e" === u || "%2e%2e" === u ? (Zu(e), "/" == i || "\\" == i && zu(e) || e.path.push("")) : $u(p) ? "/" == i || "\\" == i && zu(e) || e.path.push("") : ("file" == e.scheme && !e.path.length && Ju(p) && (e.host && (e.host = ""), p = p.charAt(0) + ":"), e.path.push(p)), p = "", "file" == e.scheme && (i == _u || "?" == i || "#" == i)) for (; e.path.length > 1 && "" === e.path[0];) {e.path.shift();}"?" == i ? (e.query = "", c = yc) : "#" == i && (e.fragment = "", c = Ec);} else p += Ku(i, Hu);break;case vc:"?" == i ? (e.query = "", c = yc) : "#" == i ? (e.fragment = "", c = Ec) : i != _u && (e.path[0] += Ku(i, ju));break;case yc:n || "#" != i ? i != _u && ("'" == i && zu(e) ? e.query += "%27" : e.query += "#" == i ? "%23" : Ku(i, ju)) : (e.fragment = "", c = Ec);break;case Ec:i != _u && (e.fragment += Ku(i, Bu));}l++;}},Ic = function Ic(e) {var t,n,r = Io(this, Ic, "URL"),o = arguments.length > 1 ? arguments[1] : void 0,i = String(e),a = Iu(r, { type: "URL" });if (void 0 !== o) if (o instanceof Ic) t = Cu(o);else if (n = Sc(t = {}, String(o))) throw TypeError(n);if (n = Sc(a, i, null, t)) throw TypeError(n);var s = a.searchParams = new Eu(),u = Su(s);u.updateSearchParams(a.query), u.updateURL = function () {a.query = String(s) || null;}, c || (r.href = Tc.call(r), r.origin = Mc.call(r), r.protocol = Oc.call(r), r.username = Ac.call(r), r.password = Dc.call(r), r.host = Nc.call(r), r.hostname = Lc.call(r), r.port = Rc.call(r), r.pathname = Pc.call(r), r.search = Gc.call(r), r.searchParams = kc.call(r), r.hash = wc.call(r));},Cc = Ic.prototype,Tc = function Tc() {var e = Cu(this),t = e.scheme,n = e.username,r = e.password,o = e.host,i = e.port,a = e.path,s = e.query,u = e.fragment,c = t + ":";return null !== o ? (c += "//", Wu(e) && (c += n + (r ? ":" + r : "") + "@"), c += qu(o), null !== i && (c += ":" + i)) : "file" == t && (c += "//"), c += e.cannotBeABaseURL ? a[0] : a.length ? "/" + a.join("/") : "", null !== s && (c += "?" + s), null !== u && (c += "#" + u), c;},Mc = function Mc() {var e = Cu(this),t = e.scheme,n = e.port;if ("blob" == t) try {return new URL(t.path[0]).origin;} catch (Hg) {return "null";}return "file" != t && zu(e) ? t + "://" + qu(e.host) + (null !== n ? ":" + n : "") : "null";},Oc = function Oc() {return Cu(this).scheme + ":";},Ac = function Ac() {return Cu(this).username;},Dc = function Dc() {return Cu(this).password;},Nc = function Nc() {var e = Cu(this),t = e.host,n = e.port;return null === t ? "" : null === n ? qu(t) : qu(t) + ":" + n;},Lc = function Lc() {var e = Cu(this).host;return null === e ? "" : qu(e);},Rc = function Rc() {var e = Cu(this).port;return null === e ? "" : String(e);},Pc = function Pc() {var e = Cu(this),t = e.path;return e.cannotBeABaseURL ? t[0] : t.length ? "/" + t.join("/") : "";},Gc = function Gc() {var e = Cu(this).query;return e ? "?" + e : "";},kc = function kc() {return Cu(this).searchParams;},wc = function wc() {var e = Cu(this).fragment;return e ? "#" + e : "";},bc = function bc(e, t) {return { get: e, set: t, configurable: 1, enumerable: 1 };};if (c && lt(Cc, { href: bc(Tc, function (e) {var t = Cu(this),n = String(e),r = Sc(t, n);if (r) throw TypeError(r);Su(t.searchParams).updateSearchParams(t.query);}), origin: bc(Mc), protocol: bc(Oc, function (e) {var t = Cu(this);Sc(t, String(e) + ":", ec);}), username: bc(Ac, function (e) {var t = Cu(this),n = nt(String(e));if (!Xu(t)) {t.username = "";for (var r = 0; r < n.length; r++) {t.username += Ku(n[r], Vu);}}}), password: bc(Dc, function (e) {var t = Cu(this),n = nt(String(e));if (!Xu(t)) {t.password = "";for (var r = 0; r < n.length; r++) {t.password += Ku(n[r], Vu);}}}), host: bc(Nc, function (e) {var t = Cu(this);t.cannotBeABaseURL || Sc(t, String(e), lc);}), hostname: bc(Lc, function (e) {var t = Cu(this);t.cannotBeABaseURL || Sc(t, String(e), pc);}), port: bc(Rc, function (e) {var t = Cu(this);Xu(t) || ("" == (e = String(e)) ? t.port = null : Sc(t, e, fc));}), pathname: bc(Pc, function (e) {var t = Cu(this);t.cannotBeABaseURL || (t.path = [], Sc(t, e + "", _c));}), search: bc(Gc, function (e) {var t = Cu(this);"" == (e = String(e)) ? t.query = null : ("?" == e.charAt(0) && (e = e.slice(1)), t.query = "", Sc(t, e, yc)), Su(t.searchParams).updateSearchParams(t.query);}), searchParams: bc(kc), hash: bc(wc, function (e) {var t = Cu(this);"" != (e = String(e)) ? ("#" == e.charAt(0) && (e = e.slice(1)), t.fragment = "", Sc(t, e, Ec)) : t.fragment = null;}) }), Z(Cc, "toJSON", function () {return Tc.call(this);}, { enumerable: 1 }), Z(Cc, "toString", function () {return Tc.call(this);}, { enumerable: 1 }), yu) {var Uc = yu.createObjectURL,Fc = yu.revokeObjectURL;Uc && Z(Ic, "createObjectURL", function (e) {return Uc.apply(yu, arguments);}), Fc && Z(Ic, "revokeObjectURL", function (e) {return Fc.apply(yu, arguments);});}Rt(Ic, "URL"), De({ global: 1, forced: !xs, sham: !c }, { URL: Ic });var xc = { NO_SDKAPPID: 2e3, NO_ACCOUNT_TYPE: 2001, NO_IDENTIFIER: 2002, NO_USERSIG: 2003, NO_SDK_INSTANCE: 2004, REQ_GET_ACCESS_LAYER_FAILED: 2020, REQ_LOGIN_FAILED: 2021, NO_TINYID: 2022, NO_A2KEY: 2023, MESSAGE_SEND_FAIL: 2100, MESSAGE_UNKNOW_ROMA_LIST_END_FLAG_FIELD: 2101, MESSAGE_ELEMENT_METHOD_UNDEFINED: 2102, MESSAGE_LIST_CONSTRUCTOR_NEED_OPTIONS: 2103, MESSAGE_PARAMETER_MISSING_TO_ACCOUNT: 2104, MESSAGE_SEND_NEED_MESSAGE_INSTANCE: 2105, MESSAGE_SEND_INVALID_CONVERSATION_TYPE: 2106, MESSAGE_RESEND_FILE_UNSUPPORTED: 2107, MESSAGE_FILE_IS_EMPTY: 2108, MESSAGE_IMAGE_UPLOAD_FAIL: 2250, MESSAGE_IMAGE_SELECT_FILE_FIRST: 2251, MESSAGE_IMAGE_TYPES_LIMIT: 2252, MESSAGE_IMAGE_SIZE_LIMIT: 2253, MESSAGE_AUDIO_UPLOAD_FAIL: 2300, MESSAGE_AUDIO_SIZE_LIMIT: 2301, MESSAGE_FILE_SELECT_FILE_FIRST: 2401, MESSAGE_FILE_SIZE_LIMIT: 2402, MESSAGE_FILE_URL_IS_EMPTY: 2403, MESSAGE_FILE_WECHAT_MINIAPP_NOT_SUPPORT: 2404, CONVERSATION_NOT_FOUND: 2500, USER_OR_GROUP_NOT_FOUND: 2501, CONVERSATION_UN_RECORDED_TYPE: 2502, ILLEGAL_GROUP_TYPE: 2600, CANNOT_JOIN_PRIVATE: 2601, CANNOT_CHANGE_OWNER_IN_AVCHATROOM: 2620, CANNOT_CHANGE_OWNER_TO_SELF: 2621, CANNOT_DISMISS_PRIVATE: 2622, JOIN_GROUP_FAIL: 2660, CANNOT_ADD_MEMBER_IN_AVCHATROOM: 2661, CANNOT_KICK_MEMBER_IN_AVCHATROOM: 2680, NOT_OWNER: 2681, CANNOT_SET_MEMBER_ROLE_IN_PRIVATE_AND_AVCHATROOM: 2682, INVALID_MEMBER_ROLE: 2683, CANNOT_SET_SELF_MEMBER_ROLE: 2684, DEL_FRIEND_INVALID_PARAM: 2700, GET_PROFILE_INVALID_PARAM: 2720, UPDATE_PROFILE_INVALID_PARAM: 2721, ADD_BLACKLIST_INVALID_PARAM: 2740, DEL_BLACKLIST_INVALID_PARAM: 2741, CANNOT_ADD_SELF_TO_BLACKLIST: 2742, NETWORK_ERROR: 2800, NETWORK_TIMEOUT: 2801, NETWORK_BASE_OPTIONS_NO_URL: 2802, NETWORK_UNDEFINED_SERVER_NAME: 2803, NETWORK_PACKAGE_UNDEFINED: 2804, SOCKET_NOT_SUPPORTED: 2850, CONVERTOR_IRREGULAR_PARAMS: 2900, NOTICE_RUNLOOP_UNEXPECTED_CONDITION: 2901, NOTICE_RUNLOOP_OFFSET_LOST: 2902, UNCAUGHT_ERROR: 2903, SDK_IS_NOT_READY: 2999, SSO_LOG_MODEL_INIT_ERROR: 3e3, LONG_POLL_KICK_OUT: 91101 },qc = { NO_SDKAPPID: "无 SDKAppID", NO_ACCOUNT_TYPE: "无 accountType", NO_IDENTIFIER: "无 userID", NO_USERSIG: "无 usersig", NO_SDK_INSTANCE: "无 SDK 实例", REQ_GET_ACCESS_LAYER_FAILED: "获取沙箱请求失败", REQ_LOGIN_FAILED: "登录请求失败", NO_TINYID: "无tinyid", NO_A2KEY: "无a2key", MESSAGE_SEND_FAIL: "消息发送失败", MESSAGE_UNKNOW_ROMA_LIST_END_FLAG_FIELD: "未知的漫游消息结束字段", MESSAGE_ELEMENT_METHOD_UNDEFINED: "消息元素未创建，因为方法未定义", MESSAGE_LIST_CONSTRUCTOR_NEED_OPTIONS: "MessageController.constructor() 需要参数 options", MESSAGE_PARAMETER_MISSING_TO_ACCOUNT: "需要 toAccount 参数", MESSAGE_SEND_NEED_MESSAGE_INSTANCE: "需要 Message 的实例", MESSAGE_SEND_INVALID_CONVERSATION_TYPE: 'Message.conversationType 只能为 "C2C"或"GROUP" ', MESSAGE_RESEND_FILE_UNSUPPORTED: "文件类消息不能使用 SDK.resendMessage() 函数重发", MESSAGE_FILE_IS_EMPTY: "无法发送空文件", MESSAGE_IMAGE_UPLOAD_FAIL: "图片上传失败", MESSAGE_IMAGE_SELECT_FILE_FIRST: "请先选择一个图片", MESSAGE_IMAGE_TYPES_LIMIT: "图片类型受限", MESSAGE_IMAGE_SIZE_LIMIT: "图片大小受限", MESSAGE_AUDIO_UPLOAD_FAIL: "语音上传失败", MESSAGE_AUDIO_SIZE_LIMIT: "语音大小受限", MESSAGE_FILE_SELECT_FILE_FIRST: "请先选择一个文件", MESSAGE_FILE_SIZE_LIMIT: "文件大小受限 ", MESSAGE_FILE_URL_IS_EMPTY: "缺少必要的参数文件 URL", MESSAGE_FILE_WECHAT_MINIAPP_NOT_SUPPORT: "微信小程序暂时不支持文件选择功能", CONVERSATION_NOT_FOUND: "没有找到相应的会话，请检查传入参数", USER_OR_GROUP_NOT_FOUND: "没有找到相应的用户或群组，请检查传入参数", CONVERSATION_UN_RECORDED_TYPE: "未记录的会话类型", ILLEGAL_GROUP_TYPE: "非法的群类型，请检查传入参数", CANNOT_JOIN_PRIVATE: "不能加入 Private 类型的群组", CANNOT_CHANGE_OWNER_IN_AVCHATROOM: "AVChatRoom 类型的群组不能转让群主", CANNOT_CHANGE_OWNER_TO_SELF: "不能把群主转让给自己", CANNOT_DISMISS_PRIVATE: "不能解散 Private 类型的群组", JOIN_GROUP_FAIL: "加群失败，请检查传入参数或重试", CANNOT_ADD_MEMBER_IN_AVCHATROOM: "AVChatRoom 类型的群不支持邀请群成员", CANNOT_KICK_MEMBER_IN_AVCHATROOM: "不能在 AVChatRoom 类型的群组踢人", NOT_OWNER: "你不是群主，只有群主才有权限操作", CANNOT_SET_MEMBER_ROLE_IN_PRIVATE_AND_AVCHATROOM: "不能在 Private / AVChatRoom 类型的群中设置群成员身份", INVALID_MEMBER_ROLE: "不合法的群成员身份，请检查传入参数", CANNOT_SET_SELF_MEMBER_ROLE: "不能设置自己的群成员身份，请检查传入参数", DEL_FRIEND_INVALID_PARAM: "传入 deleteFriend 接口的参数无效", GET_PROFILE_INVALID_PARAM: "传入 getUserProfile 接口的参数无效", UPDATE_PROFILE_INVALID_PARAM: "传入 updateMyProfile 接口的参数无效", ADD_BLACKLIST_INVALID_PARAM: "传入 addToBlacklist 接口的参数无效", DEL_BLACKLIST_INVALID_PARAM: "传入 removeFromBlacklist 接口的参数无效", CANNOT_ADD_SELF_TO_BLACKLIST: "不能拉黑自己", NETWORK_ERROR: "网络错误", NETWORK_TIMEOUT: "请求超时", NETWORK_BASE_OPTIONS_NO_URL: "网络层初始化错误，缺少 URL 参数", NETWORK_UNDEFINED_SERVER_NAME: "打包错误，未定义的 serverName", NETWORK_PACKAGE_UNDEFINED: "未定义的 packageConfig", SOCKET_NOT_SUPPORTED: "当前浏览器不支持 WebSocket", CONVERTOR_IRREGULAR_PARAMS: "不规范的参数名称", NOTICE_RUNLOOP_UNEXPECTED_CONDITION: "意料外的通知条件", NOTICE_RUNLOOP_OFFSET_LOST: "_syncOffset 丢失", UNCAUGHT_ERROR: "未经明确定义的错误", SDK_IS_NOT_READY: "接口调用时机不合理，等待 SDK 处于 ready 状态后再调用（监听 TIM.EVENT.SDK_READY 事件）", LONG_POLL_KICK_OUT: "检测到多个 web 实例登录，消息通道下线", SSO_LOG_MODEL_INIT_ERROR: "SSOLogData 数据模型初始化错误" },jc = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this))).code = e.code, n.message = e.message, n.data = e.data || {}, n;}return pn(t, dn(Error)), t;}(),Bc = "1.7.3",Hc = "537048168",Vc = "10",Kc = "protobuf",Yc = "json",zc = { HOST: { TYPE: 3, ACCESS_LAYER_TYPES: { SANDBOX: 1, TEST: 2, PRODUCTION: 3 }, CURRENT: { COMMON: "https://webim.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, PRODUCTION: { COMMON: "https://webim.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, SANDBOX: { COMMON: "https://events.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, TEST: { COMMON: "https://test.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, setCurrent: function setCurrent() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 3;switch (e) {case this.ACCESS_LAYER_TYPES.SANDBOX:this.CURRENT = this.SANDBOX, this.TYPE = this.ACCESS_LAYER_TYPES.SANDBOX;break;case this.ACCESS_LAYER_TYPES.TEST:this.CURRENT = this.TEST, this.TYPE = this.ACCESS_LAYER_TYPES.TEST;break;default:this.CURRENT = this.PRODUCTION, this.TYPE = this.ACCESS_LAYER_TYPES.PRODUCTION;}} }, NAME: { OPEN_IM: "openim", GROUP: "group_open_http_svc", FRIEND: "sns", PROFILE: "profile", RECENT_CONTACT: "recentcontact", PIC: "openpic", BIG_GROUP_NO_AUTH: "group_open_http_noauth_svc", BIG_GROUP_LONG_POLLING_NO_AUTH: "group_open_long_polling_http_noauth_svc", IM_OPEN_STAT: "imopenstat", WEB_IM: "webim", IM_COS_SIGN: "im_cos_sign_svr" }, CMD: { ACCESS_LAYER: "accesslayer", LOGIN: "login", LOGOUT_LONG_POLL: "longpollinglogout", LOGOUT_ALL: "logout", PORTRAIT_GET: "portrait_get", PORTRAIT_SET: "portrait_set", GET_LONG_POLL_ID: "getlongpollingid", LONG_POLL: "longpolling", AVCHATROOM_LONG_POLL: "get_msg", FRIEND_ADD: "friend_add", FRIEND_GET_ALL: "friend_get_all", FRIEND_DELETE: "friend_delete", RESPONSE_PENDENCY: "friend_response", GET_PENDENCY: "pendency_get", DELETE_PENDENCY: "pendency_delete", GET_BLACKLIST: "black_list_get", ADD_BLACKLIST: "black_list_add", DELETE_BLACKLIST: "black_list_delete", CREATE_GROUP: "create_group", GET_JOINED_GROUPS: "get_joined_group_list", SEND_MESSAGE: "sendmsg", SEND_GROUP_MESSAGE: "send_group_msg", GET_GROUP_INFO: "get_group_info", GET_GROUP_MEMBER_INFO: "get_group_member_info", QUIT_GROUP: "quit_group", CHANGE_GROUP_OWNER: "change_group_owner", DESTROY_GROUP: "destroy_group", ADD_GROUP_MEMBER: "add_group_member", DELETE_GROUP_MEMBER: "delete_group_member", SEARCH_GROUP_BY_ID: "get_group_public_info", APPLY_JOIN_GROUP: "apply_join_group", HANDLE_APPLY_JOIN_GROUP: "handle_apply_join_group", MODIFY_GROUP_INFO: "modify_group_base_info", MODIFY_GROUP_MEMBER_INFO: "modify_group_member_info", DELETE_GROUP_SYSTEM_MESSAGE: "deletemsg", GET_CONVERSATION_LIST: "get", DELETE_CONVERSATION: "delete", GET_MESSAGES: "getmsg", GET_C2C_ROAM_MESSAGES: "getroammsg", GET_GROUP_ROAM_MESSAGES: "group_msg_get", SET_C2C_MESSAGE_READ: "msgreaded", SET_GROUP_MESSAGE_READ: "msg_read_report", FILE_READ_AND_WRITE_AUTHKEY: "authkey", FILE_UPLOAD: "pic_up", COS_SIGN: "cos", TIM_WEB_REPORT: "tim_web_report" }, CHANNEL: { SOCKET: 1, XHR: 2, AUTO: 0 }, NAME_VERSION: { openim: "v4", group_open_http_svc: "v4", sns: "v4", profile: "v4", recentcontact: "v4", openpic: "v4", group_open_http_noauth_svc: "v1", group_open_long_polling_http_noauth_svc: "v1", imopenstat: "v4", im_cos_sign_svr: "v4", webim: "v3" } };zc.HOST.setCurrent(zc.HOST.ACCESS_LAYER_TYPES.PRODUCTION);var Wc = { request: { toAccount: "To_Account", fromAccount: "From_Account", to: "To_Account", from: "From_Account", groupID: "GroupId", avatar: "FaceUrl" }, response: { GroupId: "groupID", Member_Account: "userID", MsgList: "messageList", SyncFlag: "syncFlag", To_Account: "to", From_Account: "from", MsgSeq: "sequence", MsgRandom: "random", MsgTimeStamp: "time", MsgContent: "content", MsgBody: "elements", MsgType: "type", MsgShow: "messageShow", NextMsgSeq: "nextMessageSeq", FaceUrl: "avatar", ProfileDataMod: "profileModify", Profile_Account: "userID", ValueBytes: "value", ValueNum: "value", NoticeSeq: "noticeSequence", NotifySeq: "notifySequence", Operator_Account: "operatorID", OpType: "operationType", ReportType: "operationType", UserId: "userID", User_Account: "userID", List_Account: "userIDList", MsgOperatorMemberExtraInfo: "operatorInfo", MsgMemberExtraInfo: "memberInfoList", ImageUrl: "avatar", NickName: "nick", MsgGroupNewInfo: "newGroupProfile", Owner_Account: "ownerID", GroupName: "name", GroupFaceUrl: "avatar", GroupIntroduction: "introduction", GroupNotification: "notification", GroupApplyJoinOption: "joinOption", MsgKey: "messageKey", GroupInfo: "groupProfile", Desc: "description", Ext: "extension" }, ignoreKeyWord: ["C2C", "ID", "USP"] },Xc = { CONTEXT_UPDATED: "_contextWasUpdated", CONTEXT_RESET: "_contextWasReset", CONTEXT_A2KEY_AND_TINYID_UPDATED: "_a2KeyAndTinyIDUpdated", RUNNING_STATE_CHANGE: "_runningStateChange", SYNC_MESSAGE_C2C_START: "_noticeSynchronizationStart", SYNC_MESSAGE_C2C_PROCESSING: "_noticeIsSynchronizing", SYNC_MESSAGE_C2C_FINISHED: "_noticeIsSynchronized", SYNC_MESSAGE_GROUP_SYSTEM_NOTICE_FINISHED: "_groupSystemNoticeSyncFinished", MESSAGE_SENDING: "_sendingMessage", MESSAGE_C2C_SEND_SUCCESS: "_sendC2CMessageSuccess", MESSAGE_C2C_SEND_FAIL: "_sendC2CMessageFail", MESSAGE_SYNC_PROCESSING: "_syncMessageProcessing", MESSAGE_SYNC_FINISHED: "_syncMessageFinished", MESSAGE_C2C_INSTANT_RECEIVED: "_receiveInstantMessage", MESSAGE_C2C_RECEIVE_ROAMING_SUCCESS: "_receiveC2CRoamingMessageSuccess", MESSAGE_C2C_RECEIVE_ROAMING_FAIL: "_receiveC2CRoamingMessageFail", MESSAGE_GROUP_SEND_SUCCESS: "_sendGroupMessageSuccess", MESSAGE_GROUP_SEND_FAIL: "_sendGroupMessageFail", MESSAGE_GROUP_RECEIVE_ROAMING_SUCCESS: "_receiveGroupRoamingMessageSuccess", MESSAGE_GROUP_RECEIVE_ROAMING_FAIL: "_receiveGroupRoamingMessageFail", MESSAGE_GROUP_INSTANT_RECEIVED: "_receiveGroupInstantMessage", MESSAGE_GROUP_SYSTEM_NOTICE_RECEIVED: "_receveGroupSystemNotice", NOTICE_LONGPOLL_GETID_SUCCESS: "_getLongPollIDSuccess", NOTICE_LONGPOLL_GETID_FAIL: "_getLongPollIDFail", NOTICE_LONGPOLL_START: "_longPollStart", NOTICE_LONGPOLL_IN_POLLING: "_longPollInPolling", NOTICE_LONGPOLL_REQUEST_ARRIVED: "_longPollInArrived", NOTICE_LONGPOLL_REQUEST_NOT_ARRIVED: "_longPollInNotArrived", NOTICE_LONGPOLL_JITTER: "_longPollJitter", NOTICE_LONGPOLL_SOON_RECONNECT: "_longPollSoonReconnect", NOTICE_LONGPOLL_LONG_RECONNECT: "_longPollLongReconnect", NOTICE_LONGPOLL_DISCONNECT: "_longpollChannelDisconnect", NOTICE_LONGPOLL_STOPPED: "_longPollStopped", NOTICE_LONGPOLL_KICKED_OUT: "_longPollKickedOut", NOTICE_LONGPOLL_MUTIPLE_DEVICE_KICKED_OUT: "_longPollMitipuleDeviceKickedOut", NOTICE_LONGPOLL_NEW_C2C_NOTICE: "_longPollGetNewC2CNotice", NOTICE_LONGPOLL_NEW_C2C_MESSAGES: "_longPollGetNewC2CMessages", NOTICE_LONGPOLL_NEW_GROUP_MESSAGES: "_longPollGetNewGroupMessages", NOTICE_LONGPOLL_NEW_GROUP_TIPS: "_longPollGetNewGroupTips", NOTICE_LONGPOLL_NEW_GROUP_NOTICE: "_longPollGetNewGroupNotice", NOTICE_LONGPOLL_NEW_FRIEND_MESSAGES: "_longPollGetNewFriendMessages", NOTICE_LONGPOLL_SEQUENCE_UPDATE: "_longPollNoticeSequenceUpdate", NOTICE_LONGPOLL_PROFILE_MODIFIED: "_longPollProfileModified", NOTICE_LONGPOLL_RECEIVE_SYSTEM_ORDERS: "_longPollNoticeReceiveSystemOrders", NOTICE_LONGPOLL_RESTART: "_longpollRestart", APPLY_ADD_FRIEND_SUCCESS: "_addFriendApplySendSucess", APPLY_ADD_FRIEND_FAIL: "_addFriendApplySendFail", APPLY_GET_PENDENCY_SUCCESS: "_applyGetPendenciesSucess", APPLY_GET_PENDENCY_FAIL: "_applyGetPendenciesFail", APPLY_DELETE_SUCCESS: "_applyDeletedSucess", APPLY_DELETE_FAIL: "_applyDeletedFail", GROUP_CREATE_SUCCESS: "_createGroupSuccess", GROUP_CREATE_FAIL: "_createGroupFail", GROUP_LIST_UPDATED: "_onGroupListUpdated", SIGN_LOGIN_CHANGE: "_loginStatusChange", SIGN_LOGIN: "_login", SIGN_LOGIN_SUCCESS: "_loginSuccess", SIGN_LOGIN_FAIL: "_loginFail", SIGN_LOGININFO_UPDATED: "_signLoginInfoUpdated", SIGN_LOGOUT_EXECUTING: "_signLogoutExcuting", SIGN_LOGOUT_SUCCESS: "_logoutSuccess", SIGN_GET_ACCESS_LAYER_CHANGE: "_getAccessLayerStatusChange", SIGN_GET_ACCESS_LAYER_SUCCESS: "_getAccessLayerSuccess", SIGN_GET_ACCESS_LAYER_FAIL: "_getAccessLayerFail", ERROR_DETECTED: "_errorHasBeenDetected", CONVERSATION_LIST_UPDATED: "_onConversationListUpdated", CONVERSATION_LIST_PROFILE_UPDATED: "_onConversationListProfileUpdated", CONVERSATION_DELETED: "_conversationDeleted", PROFILE_UPDATED: "onProfileUpdated", FRIEND_GET_SUCCESS: "_getFriendsSuccess", FRIEND_GET_FAIL: "_getFriendsFail", FRIEND_DELETE_SUCCESS: "_deleteFriendSuccess", FRIEND_DELETE_FAIL: "_deleteFriendFail", BLACKLIST_ADD_SUCCESS: "_addBlacklistSuccess", BLACKLIST_ADD_FAIL: "_addBlacklistFail", BLACKLIST_GET_SUCCESS: "_getBlacklistSuccess", BLACKLIST_GET_FAIL: "_getBlacklistFail", AVCHATROOM_OPTIONS_UPDATED: "_AVChatRoomOptionsUpdated", AVCHATROOM_JOIN_SUCCESS: "joinAVChatRoomSuccess", SDK_MEMORY_STATUS_UPDATE: "_sdkMemoryStatusUpdate", SDK_READY: "_sdkStateReady", SDK_SSO_LOGGER: "_sdkSSOLogger" },Jc = je.filter;De({ target: "Array", proto: 1, forced: !Qt("filter") }, { filter: function filter(e) {return Jc(this, e, arguments.length > 1 ? arguments[1] : void 0);} }), De({ target: "Object", stat: 1, forced: Object.assign !== js }, { assign: js });var Qc = Yr.trim;function Zc(e, t) {if ("string" != typeof e && !Array.isArray(e)) throw new TypeError("Expected the input to be `string | string[]`");t = Object.assign({ pascalCase: 0 }, t);var n;return 0 === (e = Array.isArray(e) ? e.map(function (e) {return e.trim();}).filter(function (e) {return e.length;}).join("-") : e.trim()).length ? "" : 1 === e.length ? t.pascalCase ? e.toUpperCase() : e.toLowerCase() : (e !== e.toLowerCase() && (e = $c(e)), e = e.replace(/^[_.\- ]+/, "").toLowerCase().replace(/[_.\- ]+(\w|$)/g, function (e, t) {return t.toUpperCase();}).replace(/\d+(\w|$)/g, function (e) {return e.toUpperCase();}), n = e, t.pascalCase ? n.charAt(0).toUpperCase() + n.slice(1) : n);}De({ target: "String", proto: 1, forced: function (e) {return u(function () {return !!jr[e]() || "​᠎" != "​᠎"[e]() || jr[e].name !== e;});}("trim") }, { trim: function trim() {return Qc(this);} });var $c = function $c(e) {for (var t = 0, n = 0, r = 0, o = 0; o < e.length; o++) {var i = e[o];t && /[a-zA-Z]/.test(i) && i.toUpperCase() === i ? (e = e.slice(0, o) + "-" + e.slice(o), t = 0, r = n, n = 1, o++) : n && r && /[a-zA-Z]/.test(i) && i.toLowerCase() === i ? (e = e.slice(0, o - 1) + "-" + e.slice(o - 1), r = n, n = 0, t = 1) : (t = i.toLowerCase() === i && i.toUpperCase() !== i, r = n, n = i.toUpperCase() === i && i.toLowerCase() !== i);}return e;};function el(e, t, n) {var r = [],o = 0,i = function e(t, n) {if (++o > 10) return o--, t;if (hs(t)) {var i = t.map(function (t) {return ps(t) ? e(t, n) : t;});return o--, i;}if (ps(t)) {var a = (s = t, u = function u(e, t) {if (!vs(t)) return 0;if ((a = t) !== Zc(a)) {for (var o = 1, i = 0; i < Wc.ignoreKeyWord.length; i++) {if (t.includes(Wc.ignoreKeyWord[i])) {o = 0;break;}}o && r.push(t);}var a;return gs(n[t]) ? function (e) {return e[0].toUpperCase() + Zc(e).slice(1);}(t) : n[t];}, c = Object.create(null), Object.keys(s).forEach(function (e) {var t = u(s[e], e);t && (c[t] = s[e]);}), c);return a = Rs(a, function (t, r) {return hs(t) || ps(t) ? e(t, n) : t;}), o--, a;}var s, u, c;}(e, t = ln({}, Wc.request, {}, t));return r.length > 0 && n.innerEmitter.emit(Xc.ERROR_DETECTED, { code: xc.CONVERTOR_IRREGULAR_PARAMS, message: xc.CONVERTOR_IRREGULAR_PARAMS }), i;}function tl(e, t) {if (t = ln({}, Wc.response, {}, t), hs(e)) return e.map(function (e) {return ps(e) ? tl(e, t) : e;});if (ps(e)) {var n = (r = e, o = function o(e, n) {return gs(t[n]) ? Zc(n) : t[n];}, i = {}, Object.keys(r).forEach(function (e) {i[o(r[e], e)] = r[e];}), i);return n = Rs(n, function (e) {return hs(e) || ps(e) ? tl(e, t) : e;});}var r, o, i;}var nl = function () {function e(t, n) {var r = this;if (on(this, e), void 0 === n) throw new jc({ code: xc.NO_SDK_INSTANCE, message: qc.NO_SDK_INSTANCE });this.tim = n, this.method = t.method || "POST", this._initializeServerMap(), this._initializeURL(t), this._initializeRequestData(t), this.callback = function (e) {return tl(e = t.decode(e), r._getResponseMap(t));};}return sn(e, [{ key: "_initializeServerMap", value: function value() {this._serverMap = Object.create(null);var e = "";for (var t in zc.NAME) {if (Object.prototype.hasOwnProperty.call(zc.NAME, t)) switch (e = zc.NAME[t]) {case zc.NAME.PIC:this._serverMap[e] = zc.HOST.CURRENT.PIC;break;case zc.NAME.IM_COS_SIGN:this._serverMap[e] = zc.HOST.CURRENT.COS;break;default:this._serverMap[e] = zc.HOST.CURRENT.COMMON;}}} }, { key: "_getHost", value: function value(e) {if (void 0 !== this._serverMap[e]) return this._serverMap[e];throw new jc({ code: xc.NETWORK_UNDEFINED_SERVER_NAME, message: qc.NETWORK_UNDEFINED_SERVER_NAME });} }, { key: "_initializeURL", value: function value(e) {var t = e.serverName,n = e.cmd,r = this._getHost(t),o = "".concat(r, "/").concat(zc.NAME_VERSION[t], "/").concat(t, "/").concat(n);o += "?".concat(this._getQueryString(e.queryString)), this.url = o;} }, { key: "getUrl", value: function value() {return this.url.replace(/&reqtime=(\d+)/, "&reqtime=".concat(Math.ceil(+new Date() / 1e3)));} }, { key: "_initializeRequestData", value: function value(e) {var t,n = e.requestData;t = this._requestDataCleaner(n), this.requestData = e.encode(t);} }, { key: "_requestDataCleaner", value: function value(e) {var t = Array.isArray(e) ? [] : Object.create(null);for (var n in e) {Object.prototype.hasOwnProperty.call(e, n) && vs(n) && null !== e[n] && ("object" !== rn(e[n]) ? t[n] = e[n] : t[n] = this._requestDataCleaner.bind(this)(e[n]));}return t;} }, { key: "_getQueryString", value: function value(e) {var t = [];for (var n in e) {Object.prototype.hasOwnProperty.call(e, n) && ("function" != typeof e[n] ? t.push("".concat(n, "=").concat(e[n])) : t.push("".concat(n, "=").concat(e[n]())));}return t.join("&");} }, { key: "_getResponseMap", value: function value(e) {if (e.keyMaps && e.keyMaps.response && Object.keys(e.keyMaps.response).length > 0) return e.keyMaps.response;} }]), e;}(),rl = [].slice,ol = /MSIE .\./.test(zo),il = function il(e) {return function (t, n) {var r = arguments.length > 2,o = r ? rl.call(arguments, 2) : void 0;return e(r ? function () {("function" == typeof t ? t : Function(t)).apply(this, o);} : t, n);};};function al(e) {this.mixin(e);}De({ global: 1, bind: 1, forced: ol }, { setTimeout: il(s.setTimeout), setInterval: il(s.setInterval) }), al.mixin = function (e) {var t = e.prototype || e;t._isReady = 0, t.ready = function (e) {var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;if (e) return this._isReady ? void (t ? e.call(this) : setTimeout(e, 1)) : (this._readyQueue = this._readyQueue || [], void this._readyQueue.push(e));}, t.triggerReady = function () {var e = this;this._isReady = 1, setTimeout(function () {var t = e._readyQueue;e._readyQueue = [], t && t.length > 0 && t.forEach(function (e) {e.call(this);}, e);}, 1);}, t.resetReady = function () {this._isReady = 0, this._readyQueue = [];}, t.isReady = function () {return this._isReady;};};var sl = function () {function e(t) {if (on(this, e), 0 == !!t) throw new jc({ code: xc.NO_SDK_INSTANCE, message: qc.NO_SDK_INSTANCE });al.mixin(this), this.tim = t, this.innerEmitter = t.innerEmitter, this.connectionController = t.connectionController, this.packageConfig = t.packageConfig, this.packageConfig.update(t);}return sn(e, [{ key: "createPackage", value: function value(e) {var t = this.packageConfig.get(e);return t ? new nl(t, this.tim) : 0;} }, { key: "reset", value: function value() {is.warn(["method: IMController.reset() method must be implemented"].join());} }, { key: "destroy", value: function value() {is.warn("destory");} }]), e;}();De({ target: "Object", stat: 1, forced: !c, sham: !c }, { defineProperty: P.f });var ul = function () {function e(t, n) {on(this, e), this.data = t, this.tim = n, this.defaultData = {}, Object.assign(this.defaultData, t), this.initGetterAndSetter();}return sn(e, [{ key: "initGetterAndSetter", value: function value() {var e = this,t = this.tim,n = function n(_n2, r) {Object.defineProperty(e, _n2, { enumerable: 1, configurable: 1, get: function get() {return e.data[_n2];}, set: function set(r) {e.data[_n2] = r, e.onChange.bind(e)(t.context, _n2, r);} });};for (var r in e.data) {Object.prototype.hasOwnProperty.call(e.data, r) && n(r, e.data[r]);}} }, { key: "onChange", value: function value(e, t, n) {this.tim.innerEmitter.emit(Xc.CONTEXT_UPDATED, { data: { context: e, key: t, value: n } });} }, { key: "reset", value: function value() {var e = this.tim;for (var t in this.data) {Object.prototype.hasOwnProperty.call(this.data, t) && (this.data[t] = this.defaultData.hasOwnProperty(t) ? this.defaultData[t] : null);}this.tim.innerEmitter.emit(Xc.CONTEXT_RESET, { data: e.context });} }]), e;}(),cl = { SUCCESS: "JoinedSuccess", WAIT_APPROVAL: "WaitAdminApproval" },ll = { COMMON: { SUCCESS: "OK", FAIL: "FAIL" }, REQUEST: { SUCCESS: 0 }, ACCESS_LAYER: { PRODUCTION: 0, TEST: 1 }, LOGIN: { IS_LOGIN: 1, IS_NOT_LOGIN: 0 }, SYNC_MESSAGE: { SYNCHRONIZATION_START: 0, SYNCHRONIZING: 1, SYNCHRONIZED: 2 }, MESSAGE_STATUS: { UNSEND: "unSend", SUCCESS: "success", FAIL: "fail" }, GET_HISTORY_MESSAGE_STATUS: { C2C_IS_FINISHED: 1, C2C_IS_NOT_FINISHED: 0, GROUP_IS_FINISHED: 1, GROUP_IS_NOT_FINISHED: 0 }, ACCOUNT_STATUS: { SIGN_IN: 1, SIGN_OUT: 0 }, CHANNEL_STATUS: { ONLINE: 1, OFFLINE: 0 }, JOIN_GROUP_STATUS: cl, UPLOAD: { FINISHED: 1, UPLOADING: 0 } },pl = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e)))._initContext(), n._initListener(), n;}return pn(t, sl), sn(t, [{ key: "reset", value: function value() {this.tim.context.reset();} }, { key: "_IAmReady", value: function value() {this.triggerReady();} }, { key: "_initListener", value: function value() {this.tim.innerEmitter.on(Xc.SIGN_LOGIN_SUCCESS, this._updateA2KeyAndTinyID, this);} }, { key: "_updateA2KeyAndTinyID", value: function value(e) {var t = e.data,n = t.a2Key,r = t.tinyID;this.set("a2Key", n), this.set("tinyID", r), this.tim.innerEmitter.emit(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, { data: { context: this.tim.context } }), this._IAmReady();} }, { key: "get", value: function value(e) {return this.tim.context[e];} }, { key: "set", value: function value(e, t) {this.tim.context[e] = t;} }, { key: "_initContext", value: function value() {var e = this.tim.loginInfo;this.tim.context = new ul({ login: ll.LOGIN.IS_NOT_LOGIN, SDKAppID: e.SDKAppID, appIDAt3rd: null, accountType: e.accountType, identifier: e.identifier, tinyID: null, identifierNick: e.identifierNick, userSig: e.userSig, a2Key: null, contentType: "json", apn: 1 }, this.tim), this.tim.innerEmitter.on(Xc.CONTEXT_UPDATED, this._onContextMemberChange.bind(this));} }, { key: "_onContextMemberChange", value: function value(e) {var t = e.data,n = t.key,r = t.value;switch (n) {case "tinyID":r.length <= 0 ? this.tim.context.login = ll.LOGIN.IS_NOT_LOGIN : this.tim.context.login = null !== this.tim.context.a2Key ? ll.LOGIN.IS_LOGIN : ll.LOGIN.IS_NOT_LOGIN;break;case "a2Key":r.length <= 0 ? this.tim.context.login = ll.LOGIN.IS_NOT_LOGIN : this.tim.context.login = null !== this.tim.context.tinyID ? ll.LOGIN.IS_LOGIN : ll.LOGIN.IS_NOT_LOGIN;}} }]), t;}(),fl = { JSON: { TYPE: { C2C: { NOTICE: 1, COMMON: 9, EVENT: 10 }, GROUP: { COMMON: 3, TIP: 4, SYSTEM: 5, TIP2: 6 }, FRIEND: { NOTICE: 7 }, PROFILE: { NOTICE: 8 } }, SUBTYPE: { C2C: { COMMON: 0, READED: 92, KICKEDOUT: 96 }, GROUP: { COMMON: 0, LOVEMESSAGE: 1, TIP: 2, REDPACKET: 3 } }, OPTIONS: { GROUP: { JOIN: 1, QUIT: 2, KICK: 3, SET_ADMIN: 4, CANCEL_ADMIN: 5, MODIFY_GROUP_INFO: 6, MODIFY_MEMBER_INFO: 7 } } }, PROTOBUF: {}, IMAGE_TYPES: { ORIGIN: 1, LARGE: 2, SMALL: 3 }, IMAGE_FORMAT: { JPG: 1, JPEG: 1, GIF: 2, PNG: 3, BMP: 4, UNKNOWN: 255 } },hl = 1,gl = 2,dl = 3,_l = 4,ml = 5,vl = 7,yl = 8,El = 9,Sl = 10,Il = 15,Cl = 255,Tl = 2,Ml = 0,Ol = 1,Al = { NICK: "Tag_Profile_IM_Nick", GENDER: "Tag_Profile_IM_Gender", BIRTHDAY: "Tag_Profile_IM_BirthDay", LOCATION: "Tag_Profile_IM_Location", SELFSIGNATURE: "Tag_Profile_IM_SelfSignature", ALLOWTYPE: "Tag_Profile_IM_AllowType", LANGUAGE: "Tag_Profile_IM_Language", AVATAR: "Tag_Profile_IM_Image", MESSAGESETTINGS: "Tag_Profile_IM_MsgSettings", ADMINFORBIDTYPE: "Tag_Profile_IM_AdminForbidType", LEVEL: "Tag_Profile_IM_Level", ROLE: "Tag_Profile_IM_Role" },Dl = { UNKNOWN: "Gender_Type_Unknown", FEMALE: "Gender_Type_Female", MALE: "Gender_Type_Male" },Nl = { NONE: "AdminForbid_Type_None", SEND_OUT: "AdminForbid_Type_SendOut" },Ll = { NEED_CONFIRM: "AllowType_Type_NeedConfirm", ALLOW_ANY: "AllowType_Type_AllowAny", DENY_ANY: "AllowType_Type_DenyAny" },Rl = function e(t) {on(this, e), this.code = 0, this.data = t || {};},Pl = null,Gl = function Gl(e) {Pl = e;},kl = function kl(e) {return e instanceof Rl ? (is.warn("IMPromise.resolve 此函数会自动用options创建IMResponse实例，调用侧不需创建，建议修改！"), Promise.resolve(e)) : Promise.resolve(new Rl(e));},wl = function wl(e) {var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;if (e instanceof jc) return t && null !== Pl && Pl.emit(Wt.ERROR, e), Promise.reject(e);if (e instanceof Error) {is.warn("IMPromise.reject options not instanceof IMError! details:", e);var n = new jc({ code: xc.UNCAUGHT_ERROR, message: e.message });return t && null !== Pl && Pl.emit(Wt.ERROR, n), Promise.reject(n);}if (gs(e) || gs(e.code) || gs(e.message)) is.error("IMPromise.reject 必须指定code(错误码)和message(错误信息)!!!");else {if (cs(e.code) && ls(e.message)) {var r = new jc(e);return t && null !== Pl && Pl.emit(Wt.ERROR, r), Promise.reject(r);}is.error("IMPromise.reject code(错误码)必须为数字，message(错误信息)必须为字符串!!!");}},bl = "sdkReady",Ul = "login",Fl = "initConversationList",xl = "initGroupList",ql = "upload",jl = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e))).devLoginTips = 'new TIM({\n      SDKAppID: "必填",\n      accountType: "必填",\n      identifier: "必填",\n      userSig: "必填",\n      identifierNick: "可选"\n    })\n    ', n._initializeListener(), n;}return pn(t, sl), sn(t, [{ key: "login", value: function value(e) {if (1 == this._isLogin() && this._isLoginCurrentUser(e.identifier)) return this.tim.innerEmitter.emit(Xc.NOTICE_LONGPOLL_RESTART), kl(new Rl("重启消息通道"));if (this._isLogin()) {var t = "您已经登录账号".concat(e.identifier, "！如需切换账号登录，请先调用 logout 接口登出，再调用 login 接口登录。");return is.warn(t), kl(new Rl(t));}is.log("SignController.login userID=", e.identifier), is.time(Ul);var n = this._checkLoginInfo(e);return Gs(n) ? (this.tim.context.identifier = e.identifier, this.tim.context.userSig = e.userSig, this.tim.context.SDKAppID = e.SDKAppID, this.tim.context.accountType = e.accountType, this.tim.context.identifier && this.tim.context.userSig ? (this.tim.innerEmitter.emit(Xc.SIGN_LOGIN), this._accessLayer()) : void 0) : wl(n);} }, { key: "_isLogin", value: function value() {return !!this.tim.context.a2Key;} }, { key: "_isLoginCurrentUser", value: function value(e) {return this.tim.context.identifier === e;} }, { key: "_initializeListener", value: function value() {this.innerEmitter.on(Xc.NOTICE_LONGPOLL_KICKED_OUT, this._onKickedOut, this), this.innerEmitter.on(Xc.NOTICE_LONGPOLL_MUTIPLE_DEVICE_KICKED_OUT, this._onMultipleDeviceKickedOut, this);} }, { key: "_accessLayer", value: function value() {var e = this;is.log("SignController._accessLayer.");var t = this.createPackage({ name: "accessLayer", action: "query" });return this.tim.connectionController.request(t).then(function (t) {return is.log("SignController._accessLayer ok. webImAccessLayer=", t.data.webImAccessLayer), 1 === t.data.webImAccessLayer && zc.HOST.setCurrent(t.data.webImAccessLayer), e._login();}).catch(function (e) {return is.error("SignController._accessLayer error:", e), wl(e);});} }, { key: "_login", value: function value() {var e = this,t = this.createPackage({ name: "login", action: "query" });return this.connectionController.request(t).then(function (t) {if (0 == !!t.data.tinyID) throw new jc({ code: xc.NO_TINYID, message: qc.NO_TINYID });if (0 == !!t.data.a2Key) throw new jc({ code: xc.NO_A2KEY, message: qc.NO_A2KEY });return is.log("SignController.login ok. userID=".concat(e.tim.loginInfo.identifier, " loginCost=").concat(is.timeEnd(Ul), "ms")), e.tim.innerEmitter.emit(Xc.SIGN_LOGIN_SUCCESS, { data: { a2Key: t.data.a2Key, tinyID: t.data.tinyID } }), e.tim.outerEmitter.emit(Wt.LOGIN_SUCCESS), kl(t.data);}).catch(function (e) {return is.error("SignController.login error:", e), wl(e);});} }, { key: "logout", value: function value() {return is.info("SignController.logout"), this.tim.innerEmitter.emit(Xc.SIGN_LOGOUT_EXECUTING), Promise.all(this._logout(Ol), this._logout(Ml)).then(this._emitLogoutSuccess.bind(this)).catch(this._emitLogoutSuccess.bind(this));} }, { key: "_logout", value: function value(e) {var t = this.tim.notificationController,n = e === Ml ? "logout" : "longPollLogout",r = e === Ml ? { name: n, action: "query" } : { name: n, action: "query", param: { longPollID: t.getLongPollID() } },o = this.createPackage(r);return this.connectionController.request(o).catch(function (e) {return is.error("SignController._logout error:", e), wl(e);});} }, { key: "_checkLoginInfo", value: function value(e) {var t = 0,n = "";return null === e.SDKAppID ? (t = xc.NO_SDKAPPID, n = qc.NO_SDKAPPID) : null === e.accountType ? (t = xc.NO_ACCOUNT_TYPE, n = qc.NO_ACCOUNT_TYPE) : null === e.identifier ? (t = xc.NO_IDENTIFIER, n = qc.NO_IDENTIFIER) : null === e.userSig && (t = xc.NO_USERSIG, n = qc.NO_USERSIG), Gs(t) || Gs(n) ? {} : { code: t, message: n };} }, { key: "_emitLogoutSuccess", value: function value() {return this.tim.innerEmitter.emit(Xc.SIGN_LOGOUT_SUCCESS), kl({});} }, { key: "_onKickedOut", value: function value() {var e = this;this.tim.logout().then(function () {is.warn("SignController._onKickedOut kicked out.       userID=".concat(e.tim.loginInfo.identifier)), e.tim.outerEmitter.emit(Wt.KICKED_OUT, { type: Xt.KICKED_OUT_MULT_ACCOUNT });});} }, { key: "_onMultipleDeviceKickedOut", value: function value() {var e = this;this.tim.logout().then(function () {is.warn("SignController._onKickedOut kicked out.       userID=".concat(e.tim.loginInfo.identifier)), e.tim.outerEmitter.emit(Wt.KICKED_OUT, { type: Xt.KICKED_OUT_MULT_DEVICE });});} }, { key: "reset", value: function value() {} }]), t;}(),Bl = function Bl(e, t) {return function () {for (var n = new Array(arguments.length), r = 0; r < n.length; r++) {n[r] = arguments[r];}return e.apply(t, n);};},Hl = Object.prototype.toString;function Vl(e) {return "[object Array]" === Hl.call(e);}function Kl(e) {return null !== e && "object" == typeof e;}function Yl(e) {return "[object Function]" === Hl.call(e);}function zl(e, t) {if (null != e) if ("object" != typeof e && (e = [e]), Vl(e)) for (var n = 0, r = e.length; n < r; n++) {t.call(null, e[n], n, e);} else for (var o in e) {Object.prototype.hasOwnProperty.call(e, o) && t.call(null, e[o], o, e);}}var Wl = { isArray: Vl, isArrayBuffer: function isArrayBuffer(e) {return "[object ArrayBuffer]" === Hl.call(e);}, isBuffer: function isBuffer(e) {return null != e && null != e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);}, isFormData: function isFormData(e) {return "undefined" != typeof FormData && e instanceof FormData;}, isArrayBufferView: function isArrayBufferView(e) {return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer;}, isString: function isString(e) {return "string" == typeof e;}, isNumber: function isNumber(e) {return "number" == typeof e;}, isObject: Kl, isUndefined: function isUndefined(e) {return void 0 === e;}, isDate: function isDate(e) {return "[object Date]" === Hl.call(e);}, isFile: function isFile(e) {return "[object File]" === Hl.call(e);}, isBlob: function isBlob(e) {return "[object Blob]" === Hl.call(e);}, isFunction: Yl, isStream: function isStream(e) {return Kl(e) && Yl(e.pipe);}, isURLSearchParams: function isURLSearchParams(e) {return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams;}, isStandardBrowserEnv: function isStandardBrowserEnv() {return "undefined" == typeof navigator || "ReactNative" !== navigator.product && "NativeScript" !== navigator.product && "NS" !== navigator.product ? "undefined" != typeof window && "undefined" != typeof document : 0;}, forEach: zl, merge: function e() {var t = {};function n(n, r) {"object" == typeof t[r] && "object" == typeof n ? t[r] = e(t[r], n) : t[r] = n;}for (var r = 0, o = arguments.length; r < o; r++) {zl(arguments[r], n);}return t;}, deepMerge: function e() {var t = {};function n(n, r) {"object" == typeof t[r] && "object" == typeof n ? t[r] = e(t[r], n) : t[r] = "object" == typeof n ? e({}, n) : n;}for (var r = 0, o = arguments.length; r < o; r++) {zl(arguments[r], n);}return t;}, extend: function extend(e, t, n) {return zl(t, function (t, r) {e[r] = n && "function" == typeof t ? Bl(t, n) : t;}), e;}, trim: function trim(e) {return e.replace(/^\s*/, "").replace(/\s*$/, "");} };function Xl(e) {return encodeURIComponent(e).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");}var Jl = function Jl(e, t, n) {if (!t) return e;var r;if (n) r = n(t);else if (Wl.isURLSearchParams(t)) r = t.toString();else {var o = [];Wl.forEach(t, function (e, t) {null != e && (Wl.isArray(e) ? t += "[]" : e = [e], Wl.forEach(e, function (e) {Wl.isDate(e) ? e = e.toISOString() : Wl.isObject(e) && (e = JSON.stringify(e)), o.push(Xl(t) + "=" + Xl(e));}));}), r = o.join("&");}if (r) {var i = e.indexOf("#");-1 !== i && (e = e.slice(0, i)), e += (-1 === e.indexOf("?") ? "?" : "&") + r;}return e;};function Ql() {this.handlers = [];}Ql.prototype.use = function (e, t) {return this.handlers.push({ fulfilled: e, rejected: t }), this.handlers.length - 1;}, Ql.prototype.eject = function (e) {this.handlers[e] && (this.handlers[e] = null);}, Ql.prototype.forEach = function (e) {Wl.forEach(this.handlers, function (t) {null !== t && e(t);});};var Zl = Ql,$l = function $l(e, t, n) {return Wl.forEach(n, function (n) {e = n(e, t);}), e;},ep = function ep(e) {return !(!e || !e.__CANCEL__);};function tp() {throw new Error("setTimeout has not been defined");}function np() {throw new Error("clearTimeout has not been defined");}var rp = tp,op = np;function ip(e) {if (rp === setTimeout) return setTimeout(e, 0);if ((rp === tp || !rp) && setTimeout) return rp = setTimeout, setTimeout(e, 0);try {return rp(e, 0);} catch (t) {try {return rp.call(null, e, 0);} catch (t) {return rp.call(this, e, 0);}}}"function" == typeof Ja.setTimeout && (rp = setTimeout), "function" == typeof Ja.clearTimeout && (op = clearTimeout);var ap,sp = [],up = 0,cp = -1;function lp() {up && ap && (up = 0, ap.length ? sp = ap.concat(sp) : cp = -1, sp.length && pp());}function pp() {if (!up) {var e = ip(lp);up = 1;for (var t = sp.length; t;) {for (ap = sp, sp = []; ++cp < t;) {ap && ap[cp].run();}cp = -1, t = sp.length;}ap = null, up = 0, function (e) {if (op === clearTimeout) return clearTimeout(e);if ((op === np || !op) && clearTimeout) return op = clearTimeout, clearTimeout(e);try {op(e);} catch (t) {try {return op.call(null, e);} catch (t) {return op.call(this, e);}}}(e);}}function fp(e, t) {this.fun = e, this.array = t;}fp.prototype.run = function () {this.fun.apply(null, this.array);};function hp() {}var gp = hp,dp = hp,_p = hp,mp = hp,vp = hp,yp = hp,Ep = hp;var Sp = Ja.performance || {},Ip = Sp.now || Sp.mozNow || Sp.msNow || Sp.oNow || Sp.webkitNow || function () {return new Date().getTime();};var Cp = new Date();var Tp = { nextTick: function nextTick(e) {var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {t[n - 1] = arguments[n];}sp.push(new fp(e, t)), 1 !== sp.length || up || ip(pp);}, title: "browser", browser: 1, env: {}, argv: [], version: "", versions: {}, on: gp, addListener: dp, once: _p, off: mp, removeListener: vp, removeAllListeners: yp, emit: Ep, binding: function binding(e) {throw new Error("process.binding is not supported");}, cwd: function cwd() {return "/";}, chdir: function chdir(e) {throw new Error("process.chdir is not supported");}, umask: function umask() {return 0;}, hrtime: function hrtime(e) {var t = .001 * Ip.call(Sp),n = Math.floor(t),r = Math.floor(t % 1 * 1e9);return e && (n -= e[0], (r -= e[1]) < 0 && (n--, r += 1e9)), [n, r];}, platform: "browser", release: {}, config: {}, uptime: function uptime() {return (new Date() - Cp) / 1e3;} },Mp = function Mp(e, t) {Wl.forEach(e, function (n, r) {r !== t && r.toUpperCase() === t.toUpperCase() && (e[t] = n, delete e[r]);});},Op = function Op(e, t, n, r, o) {return function (e, t, n, r, o) {return e.config = t, n && (e.code = n), e.request = r, e.response = o, e.isAxiosError = 1, e.toJSON = function () {return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };}, e;}(new Error(e), t, n, r, o);},Ap = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"],Dp = Wl.isStandardBrowserEnv() ? function () {var e,t = /(msie|trident)/i.test(navigator.userAgent),n = document.createElement("a");function r(e) {var r = e;return t && (n.setAttribute("href", r), r = n.href), n.setAttribute("href", r), { href: n.href, protocol: n.protocol ? n.protocol.replace(/:$/, "") : "", host: n.host, search: n.search ? n.search.replace(/^\?/, "") : "", hash: n.hash ? n.hash.replace(/^#/, "") : "", hostname: n.hostname, port: n.port, pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname };}return e = r(window.location.href), function (t) {var n = Wl.isString(t) ? r(t) : t;return n.protocol === e.protocol && n.host === e.host;};}() : function () {return 1;},Np = Wl.isStandardBrowserEnv() ? { write: function write(e, t, n, r, o, i) {var a = [];a.push(e + "=" + encodeURIComponent(t)), Wl.isNumber(n) && a.push("expires=" + new Date(n).toGMTString()), Wl.isString(r) && a.push("path=" + r), Wl.isString(o) && a.push("domain=" + o), 1 == i && a.push("secure"), document.cookie = a.join("; ");}, read: function read(e) {var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));return t ? decodeURIComponent(t[3]) : null;}, remove: function remove(e) {this.write(e, "", Date.now() - 864e5);} } : { write: function write() {}, read: function read() {return null;}, remove: function remove() {} },Lp = function Lp(e) {return new Promise(function (t, n) {var r = e.data,o = e.headers;Wl.isFormData(r) && delete o["Content-Type"];var i = new XMLHttpRequest();if (e.auth) {var a = e.auth.username || "",s = e.auth.password || "";o.Authorization = "Basic " + btoa(a + ":" + s);}if (i.open(e.method.toUpperCase(), Jl(e.url, e.params, e.paramsSerializer), 1), i.timeout = e.timeout, i.onreadystatechange = function () {if (i && 4 === i.readyState && (0 !== i.status || i.responseURL && 0 === i.responseURL.indexOf("file:"))) {var r = "getAllResponseHeaders" in i ? function (e) {var t,n,r,o = {};return e ? (Wl.forEach(e.split("\n"), function (e) {if (r = e.indexOf(":"), t = Wl.trim(e.substr(0, r)).toLowerCase(), n = Wl.trim(e.substr(r + 1)), t) {if (o[t] && Ap.indexOf(t) >= 0) return;o[t] = "set-cookie" === t ? (o[t] ? o[t] : []).concat([n]) : o[t] ? o[t] + ", " + n : n;}}), o) : o;}(i.getAllResponseHeaders()) : null,o = { data: e.responseType && "text" !== e.responseType ? i.response : i.responseText, status: i.status, statusText: i.statusText, headers: r, config: e, request: i };!function (e, t, n) {var r = n.config.validateStatus;!r || r(n.status) ? e(n) : t(Op("Request failed with status code " + n.status, n.config, null, n.request, n));}(t, n, o), i = null;}}, i.onabort = function () {i && (n(Op("Request aborted", e, "ECONNABORTED", i)), i = null);}, i.onerror = function () {n(Op("Network Error", e, null, i)), i = null;}, i.ontimeout = function () {n(Op("timeout of " + e.timeout + "ms exceeded", e, "ECONNABORTED", i)), i = null;}, Wl.isStandardBrowserEnv()) {var u = Np,c = (e.withCredentials || Dp(e.url)) && e.xsrfCookieName ? u.read(e.xsrfCookieName) : void 0;c && (o[e.xsrfHeaderName] = c);}if ("setRequestHeader" in i && Wl.forEach(o, function (e, t) {void 0 === r && "content-type" === t.toLowerCase() ? delete o[t] : i.setRequestHeader(t, e);}), e.withCredentials && (i.withCredentials = 1), e.responseType) try {i.responseType = e.responseType;} catch (l) {if ("json" !== e.responseType) throw l;}"function" == typeof e.onDownloadProgress && i.addEventListener("progress", e.onDownloadProgress), "function" == typeof e.onUploadProgress && i.upload && i.upload.addEventListener("progress", e.onUploadProgress), e.cancelToken && e.cancelToken.promise.then(function (e) {i && (i.abort(), n(e), i = null);}), void 0 === r && (r = null), i.send(r);});},Rp = { "Content-Type": "application/x-www-form-urlencoded" };function Pp(e, t) {!Wl.isUndefined(e) && Wl.isUndefined(e["Content-Type"]) && (e["Content-Type"] = t);}var Gp,kp = { adapter: (void 0 !== Tp && "[object process]" === Object.prototype.toString.call(Tp) ? Gp = Lp : "undefined" != typeof XMLHttpRequest && (Gp = Lp), Gp), transformRequest: [function (e, t) {return Mp(t, "Accept"), Mp(t, "Content-Type"), Wl.isFormData(e) || Wl.isArrayBuffer(e) || Wl.isBuffer(e) || Wl.isStream(e) || Wl.isFile(e) || Wl.isBlob(e) ? e : Wl.isArrayBufferView(e) ? e.buffer : Wl.isURLSearchParams(e) ? (Pp(t, "application/x-www-form-urlencoded;charset=utf-8"), e.toString()) : Wl.isObject(e) ? (Pp(t, "application/json;charset=utf-8"), JSON.stringify(e)) : e;}], transformResponse: [function (e) {if ("string" == typeof e) try {e = JSON.parse(e);} catch (t) {}return e;}], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, validateStatus: function validateStatus(e) {return e >= 200 && e < 300;} };kp.headers = { common: { Accept: "application/json, text/plain, */*" } }, Wl.forEach(["delete", "get", "head"], function (e) {kp.headers[e] = {};}), Wl.forEach(["post", "put", "patch"], function (e) {kp.headers[e] = Wl.merge(Rp);});var wp = kp;function bp(e) {e.cancelToken && e.cancelToken.throwIfRequested();}var Up = function Up(e) {var t, n, r;return bp(e), e.baseURL && (r = e.url, !/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(r)) && (e.url = (t = e.baseURL, (n = e.url) ? t.replace(/\/+$/, "") + "/" + n.replace(/^\/+/, "") : t)), e.headers = e.headers || {}, e.data = $l(e.data, e.headers, e.transformRequest), e.headers = Wl.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers || {}), Wl.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (t) {delete e.headers[t];}), (e.adapter || wp.adapter)(e).then(function (t) {return bp(e), t.data = $l(t.data, t.headers, e.transformResponse), t;}, function (t) {return ep(t) || (bp(e), t && t.response && (t.response.data = $l(t.response.data, t.response.headers, e.transformResponse))), Promise.reject(t);});},Fp = function Fp(e, t) {t = t || {};var n = {};return Wl.forEach(["url", "method", "params", "data"], function (e) {void 0 !== t[e] && (n[e] = t[e]);}), Wl.forEach(["headers", "auth", "proxy"], function (r) {Wl.isObject(t[r]) ? n[r] = Wl.deepMerge(e[r], t[r]) : void 0 !== t[r] ? n[r] = t[r] : Wl.isObject(e[r]) ? n[r] = Wl.deepMerge(e[r]) : void 0 !== e[r] && (n[r] = e[r]);}), Wl.forEach(["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "maxContentLength", "validateStatus", "maxRedirects", "httpAgent", "httpsAgent", "cancelToken", "socketPath"], function (r) {void 0 !== t[r] ? n[r] = t[r] : void 0 !== e[r] && (n[r] = e[r]);}), n;};function xp(e) {this.defaults = e, this.interceptors = { request: new Zl(), response: new Zl() };}xp.prototype.request = function (e) {"string" == typeof e ? (e = arguments[1] || {}).url = arguments[0] : e = e || {}, (e = Fp(this.defaults, e)).method = e.method ? e.method.toLowerCase() : "get";var t = [Up, void 0],n = Promise.resolve(e);for (this.interceptors.request.forEach(function (e) {t.unshift(e.fulfilled, e.rejected);}), this.interceptors.response.forEach(function (e) {t.push(e.fulfilled, e.rejected);}); t.length;) {n = n.then(t.shift(), t.shift());}return n;}, xp.prototype.getUri = function (e) {return e = Fp(this.defaults, e), Jl(e.url, e.params, e.paramsSerializer).replace(/^\?/, "");}, Wl.forEach(["delete", "get", "head", "options"], function (e) {xp.prototype[e] = function (t, n) {return this.request(Wl.merge(n || {}, { method: e, url: t }));};}), Wl.forEach(["post", "put", "patch"], function (e) {xp.prototype[e] = function (t, n, r) {return this.request(Wl.merge(r || {}, { method: e, url: t, data: n }));};});var qp = xp;function jp(e) {this.message = e;}jp.prototype.toString = function () {return "Cancel" + (this.message ? ": " + this.message : "");}, jp.prototype.__CANCEL__ = 1;var Bp = jp;function Hp(e) {if ("function" != typeof e) throw new TypeError("executor must be a function.");var t;this.promise = new Promise(function (e) {t = e;});var n = this;e(function (e) {n.reason || (n.reason = new Bp(e), t(n.reason));});}Hp.prototype.throwIfRequested = function () {if (this.reason) throw this.reason;}, Hp.source = function () {var e;return { token: new Hp(function (t) {e = t;}), cancel: e };};var Vp = Hp;function Kp(e) {var t = new qp(e),n = Bl(qp.prototype.request, t);return Wl.extend(n, qp.prototype, t), Wl.extend(n, t), n;}var Yp = Kp(wp);Yp.Axios = qp, Yp.create = function (e) {return Kp(Fp(Yp.defaults, e));}, Yp.Cancel = Bp, Yp.CancelToken = Vp, Yp.isCancel = ep, Yp.all = function (e) {return Promise.all(e);}, Yp.spread = function (e) {return function (t) {return e.apply(null, t);};};var zp = Yp,Wp = Yp;zp.default = Wp;var Xp = zp,Jp = Xp.create({ timeout: 6e3, headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" } });Jp.interceptors.response.use(function (e) {var t = e.data,n = t.error_code,r = t.ErrorCode;return cs(n) && (r = n), r !== ll.REQUEST.SUCCESS && (e.data.ErrorCode = Number(r)), e;}, function (e) {return "Network Error" === e.message && (1 == Jp.defaults.withCredentials && is.warn("Network Error, try to close `IMAxios.defaults.withCredentials` to false. (IMAxios.js)"), Jp.defaults.withCredentials = 0), Promise.reject(e);});var Qp = function () {function e() {on(this, e);}return sn(e, [{ key: "request", value: function value(e) {console.warn("请注意： ConnectionBase.request() 方法必须被派生类重写:"), console.log("参数如下：\n    * @param {String} options.url string 是 开发者服务器接口地址\n    * @param {*} options.data - string/object/ArrayBuffer 否 请求的参数\n    * @param {Object} options.header - Object 否 设置请求的 header，\n    * @param {String} options.method - string GET 否 HTTP 请求方法\n    * @param {String} options.dataType - string json 否 返回的数据格式\n    * @param {String} options.responseType - string text 否 响应的数据类型\n    * @param {Boolean} isRetry - string text false 是否为重试的请求\n   ");} }, { key: "_checkOptions", value: function value(e) {if (0 == !!e.url) throw new jc({ code: xc.NETWORK_BASE_OPTIONS_NO_URL, message: qc.NETWORK_BASE_OPTIONS_NO_URL });} }, { key: "_initOptions", value: function value(e) {e.method = ["POST", "GET", "PUT", "DELETE", "OPTION"].indexOf(e.method) >= 0 ? e.method : "POST", e.dataType = e.dataType || "json", e.responseType = e.responseType || "json";} }]), e;}(),Zp = function (e) {function t() {var e;return on(this, t), (e = mn(this, fn(t).call(this))).retry = 1, e;}return pn(t, Qp), sn(t, [{ key: "request", value: function value(e) {return this._checkOptions(e), this._initOptions(e), this._requestWithRetry({ url: e.url, data: e.data, method: e.method });} }, { key: "_requestWithRetry", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;return Jp(e).catch(function (r) {return t.retry && n < t.retry ? t._requestWithRetry(e, ++n) : wl(r);});} }]), t;}(),$p = [],ef = [],tf = "undefined" != typeof Uint8Array ? Uint8Array : Array,nf = 0;function rf() {nf = 1;for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, n = e.length; t < n; ++t) {$p[t] = e[t], ef[e.charCodeAt(t)] = t;}ef["-".charCodeAt(0)] = 62, ef["_".charCodeAt(0)] = 63;}function of(e, t, n) {for (var r, o, i = [], a = t; a < n; a += 3) {r = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], i.push($p[(o = r) >> 18 & 63] + $p[o >> 12 & 63] + $p[o >> 6 & 63] + $p[63 & o]);}return i.join("");}function af(e) {var t;nf || rf();for (var n = e.length, r = n % 3, o = "", i = [], a = 0, s = n - r; a < s; a += 16383) {i.push(of(e, a, a + 16383 > s ? s : a + 16383));}return 1 === r ? (t = e[n - 1], o += $p[t >> 2], o += $p[t << 4 & 63], o += "==") : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], o += $p[t >> 10], o += $p[t >> 4 & 63], o += $p[t << 2 & 63], o += "="), i.push(o), i.join("");}function sf(e, t, n, r, o) {var i,a,s = 8 * o - r - 1,u = (1 << s) - 1,c = u >> 1,l = -7,p = n ? o - 1 : 0,f = n ? -1 : 1,h = e[t + p];for (p += f, i = h & (1 << -l) - 1, h >>= -l, l += s; l > 0; i = 256 * i + e[t + p], p += f, l -= 8) {;}for (a = i & (1 << -l) - 1, i >>= -l, l += r; l > 0; a = 256 * a + e[t + p], p += f, l -= 8) {;}if (0 === i) i = 1 - c;else {if (i === u) return a ? NaN : Infinity * (h ? -1 : 1);a += Math.pow(2, r), i -= c;}return (h ? -1 : 1) * a * Math.pow(2, i - r);}function uf(e, t, n, r, o, i) {var a,s,u,c = 8 * i - o - 1,l = (1 << c) - 1,p = l >> 1,f = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,h = r ? 0 : i - 1,g = r ? 1 : -1,d = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;for (t = Math.abs(t), isNaN(t) || Infinity === t ? (s = isNaN(t) ? 1 : 0, a = l) : (a = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -a)) < 1 && (a--, u *= 2), (t += a + p >= 1 ? f / u : f * Math.pow(2, 1 - p)) * u >= 2 && (a++, u /= 2), a + p >= l ? (s = 0, a = l) : a + p >= 1 ? (s = (t * u - 1) * Math.pow(2, o), a += p) : (s = t * Math.pow(2, p - 1) * Math.pow(2, o), a = 0)); o >= 8; e[n + h] = 255 & s, h += g, s /= 256, o -= 8) {;}for (a = a << o | s, c += o; c > 0; e[n + h] = 255 & a, h += g, a /= 256, c -= 8) {;}e[n + h - g] |= 128 * d;}var cf = {}.toString,lf = Array.isArray || function (e) {return "[object Array]" == cf.call(e);};function pf() {return hf.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;}function ff(e, t) {if (pf() < t) throw new RangeError("Invalid typed array length");return hf.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = hf.prototype : (null === e && (e = new hf(t)), e.length = t), e;}function hf(e, t, n) {if (!(hf.TYPED_ARRAY_SUPPORT || this instanceof hf)) return new hf(e, t, n);if ("number" == typeof e) {if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");return _f(this, e);}return gf(this, e, t, n);}function gf(e, t, n, r) {if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, n, r) {if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");if (t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r);hf.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = hf.prototype : e = mf(e, t);return e;}(e, t, n, r) : "string" == typeof t ? function (e, t, n) {"string" == typeof n && "" !== n || (n = "utf8");if (!hf.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');var r = 0 | Ef(t, n),o = (e = ff(e, r)).write(t, n);o !== r && (e = e.slice(0, o));return e;}(e, t, n) : function (e, t) {if (yf(t)) {var n = 0 | vf(t.length);return 0 === (e = ff(e, n)).length ? e : (t.copy(e, 0, 0, n), e);}if (t) {if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (r = t.length) != r ? ff(e, 0) : mf(e, t);if ("Buffer" === t.type && lf(t.data)) return mf(e, t.data);}var r;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");}(e, t);}function df(e) {if ("number" != typeof e) throw new TypeError('"size" argument must be a number');if (e < 0) throw new RangeError('"size" argument must not be negative');}function _f(e, t) {if (df(t), e = ff(e, t < 0 ? 0 : 0 | vf(t)), !hf.TYPED_ARRAY_SUPPORT) for (var n = 0; n < t; ++n) {e[n] = 0;}return e;}function mf(e, t) {var n = t.length < 0 ? 0 : 0 | vf(t.length);e = ff(e, n);for (var r = 0; r < n; r += 1) {e[r] = 255 & t[r];}return e;}function vf(e) {if (e >= pf()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + pf().toString(16) + " bytes");return 0 | e;}function yf(e) {return !(null == e || !e._isBuffer);}function Ef(e, t) {if (yf(e)) return e.length;if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;"string" != typeof e && (e = "" + e);var n = e.length;if (0 === n) return 0;for (var r = 0;;) {switch (t) {case "ascii":case "latin1":case "binary":return n;case "utf8":case "utf-8":case void 0:return zf(e).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2 * n;case "hex":return n >>> 1;case "base64":return Wf(e).length;default:if (r) return zf(e).length;t = ("" + t).toLowerCase(), r = 1;}}}function Sf(e, t, n) {var r = 0;if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";if ((n >>>= 0) <= (t >>>= 0)) return "";for (e || (e = "utf8");;) {switch (e) {case "hex":return bf(this, t, n);case "utf8":case "utf-8":return Pf(this, t, n);case "ascii":return kf(this, t, n);case "latin1":case "binary":return wf(this, t, n);case "base64":return Rf(this, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return Uf(this, t, n);default:if (r) throw new TypeError("Unknown encoding: " + e);e = (e + "").toLowerCase(), r = 1;}}}function If(e, t, n) {var r = e[t];e[t] = e[n], e[n] = r;}function Cf(e, t, n, r, o) {if (0 === e.length) return -1;if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = o ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {if (o) return -1;n = e.length - 1;} else if (n < 0) {if (!o) return -1;n = 0;}if ("string" == typeof t && (t = hf.from(t, r)), yf(t)) return 0 === t.length ? -1 : Tf(e, t, n, r, o);if ("number" == typeof t) return t &= 255, hf.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : Tf(e, [t], n, r, o);throw new TypeError("val must be string, number or Buffer");}function Tf(e, t, n, r, o) {var i,a = 1,s = e.length,u = t.length;if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {if (e.length < 2 || t.length < 2) return -1;a = 2, s /= 2, u /= 2, n /= 2;}function c(e, t) {return 1 === a ? e[t] : e.readUInt16BE(t * a);}if (o) {var l = -1;for (i = n; i < s; i++) {if (c(e, i) === c(t, -1 === l ? 0 : i - l)) {if (-1 === l && (l = i), i - l + 1 === u) return l * a;} else -1 !== l && (i -= i - l), l = -1;}} else for (n + u > s && (n = s - u), i = n; i >= 0; i--) {for (var p = 1, f = 0; f < u; f++) {if (c(e, i + f) !== c(t, f)) {p = 0;break;}}if (p) return i;}return -1;}function Mf(e, t, n, r) {n = Number(n) || 0;var o = e.length - n;r ? (r = Number(r)) > o && (r = o) : r = o;var i = t.length;if (i % 2 != 0) throw new TypeError("Invalid hex string");r > i / 2 && (r = i / 2);for (var a = 0; a < r; ++a) {var s = parseInt(t.substr(2 * a, 2), 16);if (isNaN(s)) return a;e[n + a] = s;}return a;}function Of(e, t, n, r) {return Xf(zf(t, e.length - n), e, n, r);}function Af(e, t, n, r) {return Xf(function (e) {for (var t = [], n = 0; n < e.length; ++n) {t.push(255 & e.charCodeAt(n));}return t;}(t), e, n, r);}function Df(e, t, n, r) {return Af(e, t, n, r);}function Nf(e, t, n, r) {return Xf(Wf(t), e, n, r);}function Lf(e, t, n, r) {return Xf(function (e, t) {for (var n, r, o, i = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {n = e.charCodeAt(a), r = n >> 8, o = n % 256, i.push(o), i.push(r);}return i;}(t, e.length - n), e, n, r);}function Rf(e, t, n) {return 0 === t && n === e.length ? af(e) : af(e.slice(t, n));}function Pf(e, t, n) {n = Math.min(e.length, n);for (var r = [], o = t; o < n;) {var i,a,s,u,c = e[o],l = null,p = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;if (o + p <= n) switch (p) {case 1:c < 128 && (l = c);break;case 2:128 == (192 & (i = e[o + 1])) && (u = (31 & c) << 6 | 63 & i) > 127 && (l = u);break;case 3:i = e[o + 1], a = e[o + 2], 128 == (192 & i) && 128 == (192 & a) && (u = (15 & c) << 12 | (63 & i) << 6 | 63 & a) > 2047 && (u < 55296 || u > 57343) && (l = u);break;case 4:i = e[o + 1], a = e[o + 2], s = e[o + 3], 128 == (192 & i) && 128 == (192 & a) && 128 == (192 & s) && (u = (15 & c) << 18 | (63 & i) << 12 | (63 & a) << 6 | 63 & s) > 65535 && u < 1114112 && (l = u);}null === l ? (l = 65533, p = 1) : l > 65535 && (l -= 65536, r.push(l >>> 10 & 1023 | 55296), l = 56320 | 1023 & l), r.push(l), o += p;}return function (e) {var t = e.length;if (t <= Gf) return String.fromCharCode.apply(String, e);var n = "",r = 0;for (; r < t;) {n += String.fromCharCode.apply(String, e.slice(r, r += Gf));}return n;}(r);}hf.TYPED_ARRAY_SUPPORT = void 0 !== Ja.TYPED_ARRAY_SUPPORT ? Ja.TYPED_ARRAY_SUPPORT : 1, hf.poolSize = 8192, hf._augment = function (e) {return e.__proto__ = hf.prototype, e;}, hf.from = function (e, t, n) {return gf(null, e, t, n);}, hf.TYPED_ARRAY_SUPPORT && (hf.prototype.__proto__ = Uint8Array.prototype, hf.__proto__ = Uint8Array), hf.alloc = function (e, t, n) {return function (e, t, n, r) {return df(t), t <= 0 ? ff(e, t) : void 0 !== n ? "string" == typeof r ? ff(e, t).fill(n, r) : ff(e, t).fill(n) : ff(e, t);}(null, e, t, n);}, hf.allocUnsafe = function (e) {return _f(null, e);}, hf.allocUnsafeSlow = function (e) {return _f(null, e);}, hf.isBuffer = function (e) {return null != e && (!!e._isBuffer || Jf(e) || function (e) {return "function" == typeof e.readFloatLE && "function" == typeof e.slice && Jf(e.slice(0, 0));}(e));}, hf.compare = function (e, t) {if (!yf(e) || !yf(t)) throw new TypeError("Arguments must be Buffers");if (e === t) return 0;for (var n = e.length, r = t.length, o = 0, i = Math.min(n, r); o < i; ++o) {if (e[o] !== t[o]) {n = e[o], r = t[o];break;}}return n < r ? -1 : r < n ? 1 : 0;}, hf.isEncoding = function (e) {switch (String(e).toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 1;default:return 0;}}, hf.concat = function (e, t) {if (!lf(e)) throw new TypeError('"list" argument must be an Array of Buffers');if (0 === e.length) return hf.alloc(0);var n;if (void 0 === t) for (t = 0, n = 0; n < e.length; ++n) {t += e[n].length;}var r = hf.allocUnsafe(t),o = 0;for (n = 0; n < e.length; ++n) {var i = e[n];if (!yf(i)) throw new TypeError('"list" argument must be an Array of Buffers');i.copy(r, o), o += i.length;}return r;}, hf.byteLength = Ef, hf.prototype._isBuffer = 1, hf.prototype.swap16 = function () {var e = this.length;if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");for (var t = 0; t < e; t += 2) {If(this, t, t + 1);}return this;}, hf.prototype.swap32 = function () {var e = this.length;if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");for (var t = 0; t < e; t += 4) {If(this, t, t + 3), If(this, t + 1, t + 2);}return this;}, hf.prototype.swap64 = function () {var e = this.length;if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");for (var t = 0; t < e; t += 8) {If(this, t, t + 7), If(this, t + 1, t + 6), If(this, t + 2, t + 5), If(this, t + 3, t + 4);}return this;}, hf.prototype.toString = function () {var e = 0 | this.length;return 0 === e ? "" : 0 === arguments.length ? Pf(this, 0, e) : Sf.apply(this, arguments);}, hf.prototype.equals = function (e) {if (!yf(e)) throw new TypeError("Argument must be a Buffer");return this === e ? 1 : 0 === hf.compare(this, e);}, hf.prototype.inspect = function () {var e = "";return this.length > 0 && (e = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), this.length > 50 && (e += " ... ")), "<Buffer " + e + ">";}, hf.prototype.compare = function (e, t, n, r, o) {if (!yf(e)) throw new TypeError("Argument must be a Buffer");if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === o && (o = this.length), t < 0 || n > e.length || r < 0 || o > this.length) throw new RangeError("out of range index");if (r >= o && t >= n) return 0;if (r >= o) return -1;if (t >= n) return 1;if (this === e) return 0;for (var i = (o >>>= 0) - (r >>>= 0), a = (n >>>= 0) - (t >>>= 0), s = Math.min(i, a), u = this.slice(r, o), c = e.slice(t, n), l = 0; l < s; ++l) {if (u[l] !== c[l]) {i = u[l], a = c[l];break;}}return i < a ? -1 : a < i ? 1 : 0;}, hf.prototype.includes = function (e, t, n) {return -1 !== this.indexOf(e, t, n);}, hf.prototype.indexOf = function (e, t, n) {return Cf(this, e, t, n, 1);}, hf.prototype.lastIndexOf = function (e, t, n) {return Cf(this, e, t, n, 0);}, hf.prototype.write = function (e, t, n, r) {if (void 0 === t) r = "utf8", n = this.length, t = 0;else if (void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;else {if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0);}var o = this.length - t;if ((void 0 === n || n > o) && (n = o), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");r || (r = "utf8");for (var i = 0;;) {switch (r) {case "hex":return Mf(this, e, t, n);case "utf8":case "utf-8":return Of(this, e, t, n);case "ascii":return Af(this, e, t, n);case "latin1":case "binary":return Df(this, e, t, n);case "base64":return Nf(this, e, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return Lf(this, e, t, n);default:if (i) throw new TypeError("Unknown encoding: " + r);r = ("" + r).toLowerCase(), i = 1;}}}, hf.prototype.toJSON = function () {return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };};var Gf = 4096;function kf(e, t, n) {var r = "";n = Math.min(e.length, n);for (var o = t; o < n; ++o) {r += String.fromCharCode(127 & e[o]);}return r;}function wf(e, t, n) {var r = "";n = Math.min(e.length, n);for (var o = t; o < n; ++o) {r += String.fromCharCode(e[o]);}return r;}function bf(e, t, n) {var r = e.length;(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);for (var o = "", i = t; i < n; ++i) {o += Yf(e[i]);}return o;}function Uf(e, t, n) {for (var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2) {o += String.fromCharCode(r[i] + 256 * r[i + 1]);}return o;}function Ff(e, t, n) {if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");if (e + t > n) throw new RangeError("Trying to access beyond buffer length");}function xf(e, t, n, r, o, i) {if (!yf(e)) throw new TypeError('"buffer" argument must be a Buffer instance');if (t > o || t < i) throw new RangeError('"value" argument is out of bounds');if (n + r > e.length) throw new RangeError("Index out of range");}function qf(e, t, n, r) {t < 0 && (t = 65535 + t + 1);for (var o = 0, i = Math.min(e.length - n, 2); o < i; ++o) {e[n + o] = (t & 255 << 8 * (r ? o : 1 - o)) >>> 8 * (r ? o : 1 - o);}}function jf(e, t, n, r) {t < 0 && (t = 4294967295 + t + 1);for (var o = 0, i = Math.min(e.length - n, 4); o < i; ++o) {e[n + o] = t >>> 8 * (r ? o : 3 - o) & 255;}}function Bf(e, t, n, r, o, i) {if (n + r > e.length) throw new RangeError("Index out of range");if (n < 0) throw new RangeError("Index out of range");}function Hf(e, t, n, r, o) {return o || Bf(e, 0, n, 4), uf(e, t, n, r, 23, 4), n + 4;}function Vf(e, t, n, r, o) {return o || Bf(e, 0, n, 8), uf(e, t, n, r, 52, 8), n + 8;}hf.prototype.slice = function (e, t) {var n,r = this.length;if ((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e), hf.TYPED_ARRAY_SUPPORT) (n = this.subarray(e, t)).__proto__ = hf.prototype;else {var o = t - e;n = new hf(o, void 0);for (var i = 0; i < o; ++i) {n[i] = this[i + e];}}return n;}, hf.prototype.readUIntLE = function (e, t, n) {e |= 0, t |= 0, n || Ff(e, t, this.length);for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {r += this[e + i] * o;}return r;}, hf.prototype.readUIntBE = function (e, t, n) {e |= 0, t |= 0, n || Ff(e, t, this.length);for (var r = this[e + --t], o = 1; t > 0 && (o *= 256);) {r += this[e + --t] * o;}return r;}, hf.prototype.readUInt8 = function (e, t) {return t || Ff(e, 1, this.length), this[e];}, hf.prototype.readUInt16LE = function (e, t) {return t || Ff(e, 2, this.length), this[e] | this[e + 1] << 8;}, hf.prototype.readUInt16BE = function (e, t) {return t || Ff(e, 2, this.length), this[e] << 8 | this[e + 1];}, hf.prototype.readUInt32LE = function (e, t) {return t || Ff(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];}, hf.prototype.readUInt32BE = function (e, t) {return t || Ff(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);}, hf.prototype.readIntLE = function (e, t, n) {e |= 0, t |= 0, n || Ff(e, t, this.length);for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {r += this[e + i] * o;}return r >= (o *= 128) && (r -= Math.pow(2, 8 * t)), r;}, hf.prototype.readIntBE = function (e, t, n) {e |= 0, t |= 0, n || Ff(e, t, this.length);for (var r = t, o = 1, i = this[e + --r]; r > 0 && (o *= 256);) {i += this[e + --r] * o;}return i >= (o *= 128) && (i -= Math.pow(2, 8 * t)), i;}, hf.prototype.readInt8 = function (e, t) {return t || Ff(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];}, hf.prototype.readInt16LE = function (e, t) {t || Ff(e, 2, this.length);var n = this[e] | this[e + 1] << 8;return 32768 & n ? 4294901760 | n : n;}, hf.prototype.readInt16BE = function (e, t) {t || Ff(e, 2, this.length);var n = this[e + 1] | this[e] << 8;return 32768 & n ? 4294901760 | n : n;}, hf.prototype.readInt32LE = function (e, t) {return t || Ff(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;}, hf.prototype.readInt32BE = function (e, t) {return t || Ff(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];}, hf.prototype.readFloatLE = function (e, t) {return t || Ff(e, 4, this.length), sf(this, e, 1, 23, 4);}, hf.prototype.readFloatBE = function (e, t) {return t || Ff(e, 4, this.length), sf(this, e, 0, 23, 4);}, hf.prototype.readDoubleLE = function (e, t) {return t || Ff(e, 8, this.length), sf(this, e, 1, 52, 8);}, hf.prototype.readDoubleBE = function (e, t) {return t || Ff(e, 8, this.length), sf(this, e, 0, 52, 8);}, hf.prototype.writeUIntLE = function (e, t, n, r) {(e = +e, t |= 0, n |= 0, r) || xf(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);var o = 1,i = 0;for (this[t] = 255 & e; ++i < n && (o *= 256);) {this[t + i] = e / o & 255;}return t + n;}, hf.prototype.writeUIntBE = function (e, t, n, r) {(e = +e, t |= 0, n |= 0, r) || xf(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);var o = n - 1,i = 1;for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) {this[t + o] = e / i & 255;}return t + n;}, hf.prototype.writeUInt8 = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 1, 255, 0), hf.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1;}, hf.prototype.writeUInt16LE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 2, 65535, 0), hf.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : qf(this, e, t, 1), t + 2;}, hf.prototype.writeUInt16BE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 2, 65535, 0), hf.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : qf(this, e, t, 0), t + 2;}, hf.prototype.writeUInt32LE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 4, 4294967295, 0), hf.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : jf(this, e, t, 1), t + 4;}, hf.prototype.writeUInt32BE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 4, 4294967295, 0), hf.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : jf(this, e, t, 0), t + 4;}, hf.prototype.writeIntLE = function (e, t, n, r) {if (e = +e, t |= 0, !r) {var o = Math.pow(2, 8 * n - 1);xf(this, e, t, n, o - 1, -o);}var i = 0,a = 1,s = 0;for (this[t] = 255 & e; ++i < n && (a *= 256);) {e < 0 && 0 === s && 0 !== this[t + i - 1] && (s = 1), this[t + i] = (e / a >> 0) - s & 255;}return t + n;}, hf.prototype.writeIntBE = function (e, t, n, r) {if (e = +e, t |= 0, !r) {var o = Math.pow(2, 8 * n - 1);xf(this, e, t, n, o - 1, -o);}var i = n - 1,a = 1,s = 0;for (this[t + i] = 255 & e; --i >= 0 && (a *= 256);) {e < 0 && 0 === s && 0 !== this[t + i + 1] && (s = 1), this[t + i] = (e / a >> 0) - s & 255;}return t + n;}, hf.prototype.writeInt8 = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 1, 127, -128), hf.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;}, hf.prototype.writeInt16LE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 2, 32767, -32768), hf.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : qf(this, e, t, 1), t + 2;}, hf.prototype.writeInt16BE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 2, 32767, -32768), hf.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : qf(this, e, t, 0), t + 2;}, hf.prototype.writeInt32LE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 4, 2147483647, -2147483648), hf.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : jf(this, e, t, 1), t + 4;}, hf.prototype.writeInt32BE = function (e, t, n) {return e = +e, t |= 0, n || xf(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), hf.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : jf(this, e, t, 0), t + 4;}, hf.prototype.writeFloatLE = function (e, t, n) {return Hf(this, e, t, 1, n);}, hf.prototype.writeFloatBE = function (e, t, n) {return Hf(this, e, t, 0, n);}, hf.prototype.writeDoubleLE = function (e, t, n) {return Vf(this, e, t, 1, n);}, hf.prototype.writeDoubleBE = function (e, t, n) {return Vf(this, e, t, 0, n);}, hf.prototype.copy = function (e, t, n, r) {if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;if (0 === e.length || 0 === this.length) return 0;if (t < 0) throw new RangeError("targetStart out of bounds");if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");if (r < 0) throw new RangeError("sourceEnd out of bounds");r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);var o,i = r - n;if (this === e && n < t && t < r) for (o = i - 1; o >= 0; --o) {e[o + t] = this[o + n];} else if (i < 1e3 || !hf.TYPED_ARRAY_SUPPORT) for (o = 0; o < i; ++o) {e[o + t] = this[o + n];} else Uint8Array.prototype.set.call(e, this.subarray(n, n + i), t);return i;}, hf.prototype.fill = function (e, t, n, r) {if ("string" == typeof e) {if ("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {var o = e.charCodeAt(0);o < 256 && (e = o);}if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");if ("string" == typeof r && !hf.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);} else "number" == typeof e && (e &= 255);if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");if (n <= t) return this;var i;if (t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e) for (i = t; i < n; ++i) {this[i] = e;} else {var a = yf(e) ? e : zf(new hf(e, r).toString()),s = a.length;for (i = 0; i < n - t; ++i) {this[i + t] = a[i % s];}}return this;};var Kf = /[^+\/0-9A-Za-z-_]/g;function Yf(e) {return e < 16 ? "0" + e.toString(16) : e.toString(16);}function zf(e, t) {var n;t = t || Infinity;for (var r = e.length, o = null, i = [], a = 0; a < r; ++a) {if ((n = e.charCodeAt(a)) > 55295 && n < 57344) {if (!o) {if (n > 56319) {(t -= 3) > -1 && i.push(239, 191, 189);continue;}if (a + 1 === r) {(t -= 3) > -1 && i.push(239, 191, 189);continue;}o = n;continue;}if (n < 56320) {(t -= 3) > -1 && i.push(239, 191, 189), o = n;continue;}n = 65536 + (o - 55296 << 10 | n - 56320);} else o && (t -= 3) > -1 && i.push(239, 191, 189);if (o = null, n < 128) {if ((t -= 1) < 0) break;i.push(n);} else if (n < 2048) {if ((t -= 2) < 0) break;i.push(n >> 6 | 192, 63 & n | 128);} else if (n < 65536) {if ((t -= 3) < 0) break;i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);} else {if (!(n < 1114112)) throw new Error("Invalid code point");if ((t -= 4) < 0) break;i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);}}return i;}function Wf(e) {return function (e) {var t, n, r, o, i, a;nf || rf();var s = e.length;if (s % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");i = "=" === e[s - 2] ? 2 : "=" === e[s - 1] ? 1 : 0, a = new tf(3 * s / 4 - i), r = i > 0 ? s - 4 : s;var u = 0;for (t = 0, n = 0; t < r; t += 4, n += 3) {o = ef[e.charCodeAt(t)] << 18 | ef[e.charCodeAt(t + 1)] << 12 | ef[e.charCodeAt(t + 2)] << 6 | ef[e.charCodeAt(t + 3)], a[u++] = o >> 16 & 255, a[u++] = o >> 8 & 255, a[u++] = 255 & o;}return 2 === i ? (o = ef[e.charCodeAt(t)] << 2 | ef[e.charCodeAt(t + 1)] >> 4, a[u++] = 255 & o) : 1 === i && (o = ef[e.charCodeAt(t)] << 10 | ef[e.charCodeAt(t + 1)] << 4 | ef[e.charCodeAt(t + 2)] >> 2, a[u++] = o >> 8 & 255, a[u++] = 255 & o), a;}(function (e) {if ((e = function (e) {return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");}(e).replace(Kf, "")).length < 2) return "";for (; e.length % 4 != 0;) {e += "=";}return e;}(e));}function Xf(e, t, n, r) {for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); ++o) {t[o + n] = e[o];}return o;}function Jf(e) {return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);}var Qf = function (e) {function t() {var e;return on(this, t), (e = mn(this, fn(t).call(this)))._request = e.promisify(wx.request), e;}return pn(t, Qp), sn(t, [{ key: "request", value: function value(e) {return this._checkOptions(e), this._initOptions(e), e = ln({}, e, { responseType: "text" }), this._request(e).then(this._handleResolve).catch(this._handleReject);} }, { key: "_handleResolve", value: function value(e) {var t = e.data,n = t.error_code,r = t.ErrorCode;return "number" == typeof n && (r = n), r !== ll.REQUEST.SUCCESS && (e.data.ErrorCode = Number("".concat(r))), e;} }, { key: "_handleReject", value: function value(e) {if (ls(e.errMsg)) {if (e.errMsg.includes("abort")) return kl({});if (e.errMsg.includes("timeout")) return wl(new jc({ code: xc.NETWORK_TIMEOUT, message: e.errMsg }));if (e.errMsg.includes("fail")) return wl(new jc({ code: xc.NETWORK_ERROR, message: e.errMsg }));}return wl(new jc(ln({ code: xc.UNCAUGHT_ERROR, message: e.message }, e)));} }, { key: "promisify", value: function value(e) {return function (t) {return new Promise(function (n, r) {var o = e(Object.assign({}, t, { success: n, fail: r }));t.updateAbort && t.updateAbort(function () {return o.abort();});});};} }]), t;}(),Zf = function () {function e() {on(this, e), this.request = 0, this.success = 0, this.fail = 0, this.reportRate = 10, this.requestTimeCost = [];}return sn(e, [{ key: "report", value: function value() {if (1 !== this.request) {if (this.request % this.reportRate != 0) return null;var e = this.avgRequestTime(),t = "runLoop reports: success=".concat(this.success, ",fail=").concat(this.fail, ",total=").concat(this.request, ",avg=").concat(e, ",cur=").concat(this.requestTimeCost[this.requestTimeCost.length - 1], ",max=").concat(Math.max.apply(null, this.requestTimeCost), ",min=").concat(Math.min.apply(null, this.requestTimeCost));is.log(t);}} }, { key: "setRequestTime", value: function value(e, t) {var n = Math.abs(t - e);100 === this.requestTimeCost.length && this.requestTimeCost.shift(), this.requestTimeCost.push(n);} }, { key: "avgRequestTime", value: function value() {for (var e, t = this.requestTimeCost.length, n = 0, r = 0; r < t; r++) {n += this.requestTimeCost[r];}return e = n / t, Math.round(100 * e) / 100;} }]), e;}(),$f = Xp.CancelToken,eh = function () {function e(t) {on(this, e), this._initializeOptions(t), this._initializeMembers(), this.status = new Zf();}return sn(e, [{ key: "destructor", value: function value() {clearTimeout(this._seedID);var e = this._index();for (var t in this) {Object.prototype.hasOwnProperty.call(this, t) && (this[t] = null);}return e;} }, { key: "setIndex", value: function value(e) {this._index = e;} }, { key: "getIndex", value: function value() {return this._index;} }, { key: "isRunning", value: function value() {return !this._stoped;} }, { key: "_initializeOptions", value: function value(e) {this.options = e;} }, { key: "_initializeMembers", value: function value() {this._index = -1, this._seedID = 0, this._requestStatus = 0, this._stoped = 0, this._intervalTime = 0, this._intervalIncreaseStep = 1e3, this._intervalDecreaseStep = 1e3, this._intervalTimeMax = 5e3, this._protectTimeout = 3e3, this._getNoticeSeq = this.options.getNoticeSeq, this._retryCount = 0, this._responseTime = Date.now(), this._responseTimeThreshold = 2e3, this.requestor = Jp, this.abort = null;} }, { key: "start", value: function value() {0 === this._seedID ? (this._stoped = 0, this._send()) : is.log('XHRRunLoop.start(), XHRRunLoop is running now, if you want to restart runLoop , please run "stop()" first.');} }, { key: "_reset", value: function value() {is.log("XHRRunLoop._reset(), reset long poll _intervalTime", this._intervalTime), this.stop(), this.start();} }, { key: "_intervalTimeIncrease", value: function value() {this._intervalTime !== this._responseTimeThreshold && (this._intervalTime < this._responseTimeThreshold && (this._intervalTime += this._intervalIncreaseStep), this._intervalTime > this._responseTimeThreshold && (this._intervalTime = this._responseTimeThreshold));} }, { key: "_intervalTimeDecrease", value: function value() {0 !== this._intervalTime && (this._intervalTime > 0 && (this._intervalTime -= this._intervalDecreaseStep), this._intervalTime < 0 && (this._intervalTime = 0));} }, { key: "_intervalTimeAdjustment", value: function value() {var e = Date.now();100 * Math.floor((e - this._responseTime) / 100) <= this._responseTimeThreshold ? this._intervalTimeIncrease() : this._intervalTimeDecrease(), this._responseTime = e;} }, { key: "_intervalTimeAdjustmentBaseOnResponseData", value: function value(e) {e.ErrorCode === ll.REQUEST.SUCCESS ? this._intervalTimeDecrease() : this._intervalTimeIncrease();} }, { key: "_send", value: function value() {var e = this;if (1 != this._requestStatus) {this._requestStatus = 1, this.status.request++, "function" == typeof this.options.before && this.options.before(this.options.pack.requestData);var t = Date.now(),n = 0;this.requestor.request({ url: this.options.pack.getUrl(), data: this.options.pack.requestData, method: this.options.pack.method, cancelToken: new $f(function (t) {e.abort = t;}) }).then(function (r) {if (e._intervalTimeAdjustmentBaseOnResponseData.bind(e)(r.data), e._retryCount > 0 && (e._retryCount = 0), e.status.success++, "function" == typeof e.options.success) try {e.options.success({ pack: e.options.pack, error: 0, data: e.options.pack.callback(r.data) });} catch (o) {is.warn("XHRRunLoop._send(), error:", o);}e._requestStatus = 0, 0 == e._stoped && (e._seedID = setTimeout(e._send.bind(e), e._intervalTime)), n = Date.now(), e.status.setRequestTime(t, n), e.status.report();}).catch(function (r) {if (e.status.fail++, e._retryCount++, e._intervalTimeAdjustment.bind(e)(), 0 == e._stoped && (e._seedID = setTimeout(e._send.bind(e), e._intervalTime)), e._requestStatus = 0, "function" == typeof e.options.fail && void 0 !== r.request) try {e.options.fail({ pack: e.options.pack, error: r, data: 0 });} catch (o) {is.warn("XHRRunLoop._send(), fail callback error:"), is.error(o);}n = Date.now(), e.status.setRequestTime(t, n), e.status.report();});}} }, { key: "stop", value: function value() {this._clearAllTimeOut(), this._stoped = 1;} }, { key: "_clearAllTimeOut", value: function value() {clearTimeout(this._seedID), this._seedID = 0;} }]), e;}(),th = function () {function e(t) {on(this, e), this._initializeOptions(t), this._initializeMembers(), this.status = new Zf();}return sn(e, [{ key: "destructor", value: function value() {clearTimeout(this._seedID);var e = this._index();for (var t in this) {Object.prototype.hasOwnProperty.call(this, t) && (this[t] = null);}return e;} }, { key: "setIndex", value: function value(e) {this._index = e;} }, { key: "isRunning", value: function value() {return !this._stoped;} }, { key: "getIndex", value: function value() {return this._index;} }, { key: "_initializeOptions", value: function value(e) {this.options = e;} }, { key: "_initializeMembers", value: function value() {this._index = -1, this._seedID = 0, this._requestStatus = 0, this._stoped = 0, this._intervalTime = 0, this._intervalIncreaseStep = 1e3, this._intervalDecreaseStep = 1e3, this._intervalTimeMax = 5e3, this._protectTimeout = 3e3, this._getNoticeSeq = this.options.getNoticeSeq, this._retryCount = 0, this._responseTime = Date.now(), this._responseTimeThreshold = 2e3, this.requestor = new Qf(), this.abort = null;} }, { key: "start", value: function value() {0 === this._seedID ? (this._stoped = 0, this._send()) : is.log('WXRunLoop.start(): WXRunLoop is running now, if you want to restart runLoop , please run "stop()" first.');} }, { key: "_reset", value: function value() {is.log("WXRunLoop.reset(), long poll _intervalMaxRate", this._intervalMaxRate), this.stop(), this.start();} }, { key: "_intervalTimeIncrease", value: function value() {this._intervalTime !== this._responseTimeThreshold && (this._intervalTime < this._responseTimeThreshold && (this._intervalTime += this._intervalIncreaseStep), this._intervalTime > this._responseTimeThreshold && (this._intervalTime = this._responseTimeThreshold));} }, { key: "_intervalTimeDecrease", value: function value() {0 !== this._intervalTime && (this._intervalTime > 0 && (this._intervalTime -= this._intervalDecreaseStep), this._intervalTime < 0 && (this._intervalTime = 0));} }, { key: "_intervalTimeAdjustment", value: function value() {var e = Date.now();100 * Math.floor((e - this._responseTime) / 100) <= this._responseTimeThreshold ? this._intervalTimeIncrease() : this._intervalTimeDecrease(), this._responseTime = e;} }, { key: "_intervalTimeAdjustmentBaseOnResponseData", value: function value(e) {e.ErrorCode === ll.REQUEST.SUCCESS ? this._intervalTimeDecrease() : this._intervalTimeIncrease();} }, { key: "_send", value: function value() {var e = this;if (1 != this._requestStatus) {var t = this;this._requestStatus = 1, this.status.request++, "function" == typeof this.options.before && this.options.before(t.options.pack.requestData);var n = Date.now(),r = 0;this.requestor.request({ url: t.options.pack.getUrl(), data: t.options.pack.requestData, method: t.options.pack.method, updateAbort: function updateAbort(t) {e.abort = t;} }).then(function (o) {if (t._intervalTimeAdjustmentBaseOnResponseData.bind(e)(o.data), t._retryCount > 0 && (t._retryCount = 0), e.status.success++, "function" == typeof t.options.success) try {e.options.success({ pack: e.options.pack, error: 0, data: e.options.pack.callback(o.data) });} catch (i) {is.warn("WXRunLoop._send(), error:", i);}t._requestStatus = 0, 0 == t._stoped && (t._seedID = setTimeout(t._send.bind(t), t._intervalTime)), r = Date.now(), e.status.setRequestTime(n, r), e.status.report();}).catch(function (o) {if (e.status.fail++, t._retryCount++, t._intervalTimeAdjustment.bind(e)(), 0 == t._stoped && (t._seedID = setTimeout(t._send.bind(t), t._intervalTime)), t._requestStatus = 0, "function" == typeof t.options.fail) try {e.options.fail({ pack: e.options.pack, error: o, data: 0 });} catch (i) {is.warn("WXRunLoop._send(), fail callback error:"), is.error(i);}r = Date.now(), e.status.setRequestTime(n, r), e.status.report();});}} }, { key: "stop", value: function value() {this._clearAllTimeOut(), this._stoped = 1;} }, { key: "_clearAllTimeOut", value: function value() {clearTimeout(this._seedID), this._seedID = 0;} }]), e;}(),nh = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e))).context = e.context, n.httpConnection = n._getHttpconnection(), n.keepAliveConnections = [], n;}return pn(t, sl), sn(t, [{ key: "initializeListener", value: function value() {this.tim.innerEmitter.on(Xc.SIGN_LOGOUT_EXECUTING, this._stopAllRunLoop, this);} }, { key: "request", value: function value(e) {var t = { url: e.url, data: e.requestData, method: e.method, callback: e.callback };return this.httpConnection.request(t).then(function (t) {return t.data = e.callback(t.data), t.data.errorCode !== ll.REQUEST.SUCCESS ? wl(new jc({ code: t.data.errorCode, message: t.data.errorInfo })) : t;});} }, { key: "createRunLoop", value: function value(e) {var t = this.createKeepAliveConnection(e);return t.setIndex(this.keepAliveConnections.push(t) - 1), t;} }, { key: "stopRunLoop", value: function value(e) {e.stop();} }, { key: "_stopAllRunLoop", value: function value() {for (var e = this.keepAliveConnections.length, t = 0; t < e; t++) {this.keepAliveConnections[t].stop();}} }, { key: "destroyRunLoop", value: function value(e) {e.stop();var t = e.destructor();this.keepAliveConnections.slice(t, 1);} }, { key: "startRunLoopExclusive", value: function value(e) {for (var t = e.getIndex(), n = 0; n < this.keepAliveConnections.length; n++) {n !== t && this.keepAliveConnections[n].stop();}e.start();} }, { key: "_getHttpconnection", value: function value() {return Oa ? new Qf() : new Zp();} }, { key: "createKeepAliveConnection", value: function value(e) {return Oa ? new th(e) : this.tim.options.runLoopNetType === Tl ? new eh(e) : (this.tim.options.runLoopNetType, "function" == typeof window.WebSocket && window.WebSocket.prototype.send, new eh(e));} }, { key: "clearAll", value: function value() {this.conn.cancelAll();} }, { key: "reset", value: function value() {this.keepAliveConnections = [];} }]), t;}();void 0 === console.table && (console.table = console.log);var rh = function rh(e, t) {e.code ? is.warn("Oops! code: ".concat(e.code), "message: ".concat(e.message), "stack: ".concat(e.stack)) : is.warn("Oops! message: ".concat(e.message), "stack: ".concat(e.stack));},oh = { f9999998: function f9999998(e) {rh(e);}, f9999999: function f9999999(e) {rh(e);}, f: function f(e) {rh(e), "未定义的错误:".concat(e.code, " , ").concat(e.message);}, f20000: function f20000(e) {rh(e);}, f20001: function f20001(e) {rh(e);}, f20002: function f20002(e) {rh(e);}, f30000: function f30000(e) {rh(e);}, f40004: function f40004(e) {rh(e);}, f40005: function f40005(e) {rh(e);}, f40006: function f40006(e) {rh(e);}, f40007: function f40007(e) {rh(e);}, f40008: function f40008(e) {rh(e);}, f50070003: function f50070003(e) {e.code.replace("500", "");rh(e);}, f50030001: function f50030001(e) {rh(e);}, f50070221: function f50070221(e) {rh(e);} };oh.echo = rh;var ih = function () {function e(t) {on(this, e), this.methods = oh, this.tim = t, this._initielizeListener();}return sn(e, [{ key: "_initielizeListener", value: function value() {this.tim.innerEmitter.on(Xc.ERROR_DETECTED, this._onErrorDetected, this);} }, { key: "ask", value: function value(e) {var t = ["f", e.code].join(""),n = oh.echo;this.methods.hasOwnProperty(t) ? this.methods[t](e) : n(e);} }, { key: "_onErrorDetected", value: function value(e) {this.ask(e), this.tim.outerEmitter.emit(Wt.ERROR, e);} }]), e;}(),ah = ["jpg", "jpeg", "gif", "png"],sh = function () {function e(t) {on(this, e), Gs(t) || (this.userID = t.userID || "", this.nick = t.nick || "", this.gender = t.gender || "", this.birthday = t.birthday || 0, this.location = t.location || "", this.selfSignature = t.selfSignature || "", this.allowType = t.allowType || Xt.ALLOW_TYPE_ALLOW_ANY, this.language = t.language || 0, this.avatar = t.avatar || "", this.messageSettings = t.messageSettings || 0, this.adminForbidType = t.adminForbidType || Xt.FORBID_TYPE_NONE, this.level = t.level || 0, this.role = t.role || 0, this.lastUpdatedTime = 0);}return sn(e, [{ key: "validate", value: function value(e) {var t = 1,n = "";for (var r in Gs(e) && (t = 0, n = "empty options"), e) {if (Object.prototype.hasOwnProperty.call(e, r)) {if (Gs(e[r]) && !ls(e[r]) && !cs(e[r])) {n = "key:" + r + ", invalid value:" + e[r], t = 0;continue;}switch (r) {case "nick":ls(e[r]) || (n = "nick should be a string", t = 0), Cs(e[r]) > 500 && (n = "nick name limited: must less than or equal to ".concat(500, " bytes, current size: ").concat(Cs(e[r]), " bytes"), t = 0);break;case "gender":As(Dl, e.gender) || (n = "key:gender, invalid value:" + e.gender, t = 0);break;case "birthday":cs(e.birthday) || (n = "birthday should be a number", t = 0);break;case "location":ls(e.location) || (n = "location should be a string", t = 0);break;case "selfSignature":ls(e.selfSignature) || (n = "selfSignature should be a string", t = 0);break;case "allowType":As(Ll, e.allowType) || (n = "key:allowType, invalid value:" + e.allowType, t = 0);break;case "language":cs(e.language) || (n = "language should be a number", t = 0);break;case "avatar":ls(e.avatar) || (n = "avatar should be a string", t = 0);break;case "messageSettings":0 !== e.messageSettings && 1 !== e.messageSettings && (n = "messageSettings should be 0 or 1", t = 0);break;case "adminForbidType":As(Nl, e.adminForbidType) || (n = "key:adminForbidType, invalid value:" + e.adminForbidType, t = 0);break;case "level":cs(e.level) || (n = "level should be a number", t = 0);break;case "role":cs(e.role) || (n = "role should be a number", t = 0);break;default:n = "unknown key:" + r, t = 0;}}}return { valid: t, tips: n };} }]), e;}(),uh = function () {function e(t) {on(this, e), this.uc = t, this.TAG = "profile", this.Actions = { Q: "query", U: "update" }, this.accountProfileMap = new Map(), this.expirationTime = 864e5;}return sn(e, [{ key: "setExpirationTime", value: function value(e) {this.expirationTime = e;} }, { key: "getUserProfile", value: function value(e) {var t = this,n = this.uc.tim,r = n.connectionController,o = n.outerEmitter,i = e.userIDList;if (!hs(i)) return is.error("ProfileHandler.getUserProfile options.userIDList 必需是数组"), wl({ code: xc.GET_PROFILE_INVALID_PARAM, message: qc.GET_PROFILE_INVALID_PARAM });e.fromAccount = this.uc.getMyAccount(), i.length > 100 && (is.warn("ProfileHandler.getUserProfile 获取用户资料人数不能超过100人"), i.length = 100);for (var a, s = [], u = [], c = 0, l = i.length; c < l; c++) {a = i[c], this.uc.isMyFriend(a) && this._containsAccount(a) ? u.push(this._getProfileFromMap(a)) : s.push(a);}if (0 === s.length) return o.emit(Wt.PROFILE_GET_SUCCESS, u), kl(u);e.toAccount = s;var p = e.bFromGetMyProfile || 0,f = this.uc.makeCapsule(this.TAG, this.Actions.Q, e);return r.request(f).then(function (e) {is.info("ProfileHandler.getUserProfile ok");var n = t._handleResponse(e).concat(u);return o.emit(Wt.PROFILE_GET_SUCCESS, n), p ? (t.uc.onGotMyProfile(), new Rl(n[0])) : new Rl(n);}).catch(function (e) {return is.error("ProfileHandler.getUserProfile error:", e), wl(e);});} }, { key: "getMyProfile", value: function value() {var e = this.uc.getMyAccount();if (is.log("ProfileHandler.getMyProfile myAccount=" + e), this._fillMap(), this._containsAccount(e)) {var t = this._getProfileFromMap(e);return is.debug("ProfileHandler.getMyProfile from cache, myProfile:" + JSON.stringify(t)), this.uc.tim.outerEmitter.emit(Wt.PROFILE_GET_SUCCESS, [t]), this.uc.onGotMyProfile(), kl(t);}return this.getUserProfile({ fromAccount: e, userIDList: [e], bFromGetMyProfile: 1 });} }, { key: "_handleResponse", value: function value(e) {for (var t, n, r = Es.now(), o = e.data.userProfileItem, i = [], a = 0, s = o.length; a < s; a++) {"@TLS#NOT_FOUND" !== o[a].to && "" !== o[a].to && (t = o[a].to, n = this._updateMap(t, this._getLatestProfileFromResponse(t, o[a].profileItem)), i.push(n));}return is.log("ProfileHandler._handleResponse cost " + (Es.now() - r) + " ms"), i;} }, { key: "_getLatestProfileFromResponse", value: function value(e, t) {var n = {};if (n.userID = e, !Gs(t)) for (var r = 0, o = t.length; r < o; r++) {switch (t[r].tag) {case Al.NICK:n.nick = t[r].value;break;case Al.GENDER:n.gender = t[r].value;break;case Al.BIRTHDAY:n.birthday = t[r].value;break;case Al.LOCATION:n.location = t[r].value;break;case Al.SELFSIGNATURE:n.selfSignature = t[r].value;break;case Al.ALLOWTYPE:n.allowType = t[r].value;break;case Al.LANGUAGE:n.language = t[r].value;break;case Al.AVATAR:n.avatar = t[r].value;break;case Al.MESSAGESETTINGS:n.messageSettings = t[r].value;break;case Al.ADMINFORBIDTYPE:n.adminForbidType = t[r].value;break;case Al.LEVEL:n.level = t[r].value;break;case Al.ROLE:n.role = t[r].value;break;default:is.warn("ProfileHandler._handleResponse unkown tag->", t[r].tag);}}return n;} }, { key: "updateMyProfile", value: function value(e) {var t = this,n = this.uc.tim,r = n.connectionController,o = n.outerEmitter,i = new sh().validate(e);if (!i.valid) return is.error("ProfileHandler.updateMyProfile info:" + i.tips), wl({ code: xc.UPDATE_PROFILE_INVALID_PARAM, message: qc.UPDATE_PROFILE_INVALID_PARAM });var a = [];for (var s in e) {Object.prototype.hasOwnProperty.call(e, s) && a.push({ tag: Al[s.toUpperCase()], value: e[s] });}var u = this.uc.makeCapsule(this.TAG, this.Actions.U, { fromAccount: this.uc.getMyAccount(), profileItem: a });return r.request(u).then(function (n) {is.info("ProfileHandler.updateMyProfile ok");var r = t._updateMap(t.uc.getMyAccount(), e);return o.emit(Wt.PROFILE_UPDATED, [r]), kl(r);}).catch(function (e) {return is.error("ProfileHandler.updateMyProfile error:", e), wl(e);});} }, { key: "onProfileModified", value: function value(e) {var t = e.data;if (!Gs(t)) {var n,r,o = t.length;is.info("ProfileHandler.onProfileModified length=" + o);for (var i = [], a = 0; a < o; a++) {n = t[a].userID, r = this._updateMap(n, this._getLatestProfileFromResponse(n, t[a].profileList)), i.push(r);}var s = this.uc.tim,u = s.innerEmitter,c = s.outerEmitter;u.emit(Xc.PROFILE_UPDATED, { data: i }), c.emit(Wt.PROFILE_UPDATED, i);}} }, { key: "_fillMap", value: function value() {if (0 === this.accountProfileMap.size) {for (var e = this._getCachedProfiles(), t = Date.now(), n = 0, r = e.length; n < r; n++) {t - e[n].lastUpdatedTime < this.expirationTime && this.accountProfileMap.set(e[n].userID, e[n]);}is.log("ProfileHandler._fillMap from chache, map.size=" + this.accountProfileMap.size);}} }, { key: "_updateMap", value: function value(e, t) {var n,r = Date.now();return this._containsAccount(e) ? (n = this._getProfileFromMap(e), Ss(n, t), n.lastUpdatedTime = r) : (n = new sh(t), (this.uc.isMyFriend(e) || e === this.uc.getMyAccount()) && (n.lastUpdatedTime = r, this.accountProfileMap.set(e, n))), this._flushMap(e === this.uc.getMyAccount()), n;} }, { key: "_flushMap", value: function value(e) {var t = yn(this.accountProfileMap.values()),n = this.uc.tim.storage;is.debug("ProfileHandler._flushMap length=".concat(t.length, " flushAtOnce=").concat(e)), n.setItem(this.TAG, t, e);} }, { key: "_containsAccount", value: function value(e) {return this.accountProfileMap.has(e);} }, { key: "_getProfileFromMap", value: function value(e) {return this.accountProfileMap.get(e);} }, { key: "_getCachedProfiles", value: function value() {var e = this.uc.tim.storage.getItem(this.TAG);return Gs(e) ? [] : e;} }, { key: "onConversationsProfileUpdated", value: function value(e) {for (var t, n, r, o = [], i = 0, a = e.length; i < a; i++) {n = (t = e[i]).userID, this._containsAccount(n) ? (r = this._getProfileFromMap(n), Ss(r, t) > 0 && o.push(n)) : o.push(t.userID);}0 !== o.length && (is.info("ProfileHandler.onConversationsProfileUpdated toAccount:", o), this.getUserProfile({ userIDList: o }));} }, { key: "reset", value: function value() {this._flushMap(1), this.accountProfileMap.clear();} }]), e;}(),ch = "".repeat || function (e) {var t = String(v(this)),n = "",r = oe(e);if (r < 0 || Infinity == r) throw RangeError("Wrong number of repetitions");for (; r > 0; (r >>>= 1) && (t += t)) {1 & r && (n += t);}return n;};De({ target: "String", proto: 1 }, { repeat: ch });var lh = function () {function e(t) {on(this, e), this.options = t ? t.options : { enablePointer: 1 }, this.pointsList = {}, this.reportText = {}, this.maxNameLen = 0, this.gapChar = "-", this.log = console.log, this.currentTask = "";}return sn(e, [{ key: "newTask", value: function value(e) {0 != this.options.enablePointer && (e || (e = ["task", this._timeFormat()].join("-")), this.pointsList[e] = [], this.currentTask = e, console.log("Pointer new Task : ".concat(this.currentTask)));} }, { key: "deleteTask", value: function value(e) {0 != this.options.enablePointer && (e || (e = this.currentTask), this.pointsList[e].length = 0, delete this.pointsList[e]);} }, { key: "dot", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",t = arguments.length > 1 ? arguments[1] : void 0;if (0 != this.options.enablePointer) {t = t || this.currentTask;var n = +new Date();this.maxNameLen = this.maxNameLen < e.length ? e.length : this.maxNameLen, this.flen = this.maxNameLen + 10, this.pointsList[t].push({ pointerName: e, time: n });}} }, { key: "_analisys", value: function value(e) {if (0 != this.options.enablePointer) {e = e || this.currentTask;for (var t = this.pointsList[e], n = t.length, r = [], o = [], i = 0; i < n; i++) {0 !== i && (o = this._analisysTowPoints(t[i - 1], t[i]), r.push(o.join("")));}return o = this._analisysTowPoints(t[0], t[n - 1], 1), r.push(o.join("")), r.join("");}} }, { key: "_analisysTowPoints", value: function value(e, t) {var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;if (0 != this.options.enablePointer) {var r = this.flen,o = t.time - e.time,i = o.toString(),a = e.pointerName + this.gapChar.repeat(r - e.pointerName.length),s = t.pointerName + this.gapChar.repeat(r - t.pointerName.length),u = this.gapChar.repeat(4 - i.length) + i,c = n ? ["%c", a, s, u, "ms\n%c"] : [a, s, u, "ms\n"];return c;}} }, { key: "report", value: function value(e) {if (0 != this.options.enablePointer) {e = e || this.currentTask;var t = this._analisys(e);this.pointsList = [];var n = this._timeFormat(),r = "Pointer[".concat(e, "(").concat(n, ")]"),o = 4 * this.maxNameLen,i = (o - r.length) / 2;console.log(["-".repeat(i), r, "-".repeat(i)].join("")), console.log("%c" + t, "color:#66a", "color:red", "color:#66a"), console.log("-".repeat(o));}} }, { key: "_timeFormat", value: function value() {var e = new Date(),t = this.zeroFix(e.getMonth() + 1, 2),n = this.zeroFix(e.getDate(), 2);return "".concat(t, "-").concat(n, " ").concat(e.getHours(), ":").concat(e.getSeconds(), ":").concat(e.getMinutes(), "~").concat(e.getMilliseconds());} }, { key: "zeroFix", value: function value(e, t) {return ("000000000" + e).slice(-t);} }, { key: "reportAll", value: function value() {if (0 != this.options.enablePointer) for (var e in this.pointsList) {Object.prototype.hasOwnProperty.call(this.pointsList, e) && this.eport(e);}} }]), e;}(),ph = function e(t, n) {on(this, e), this.userID = t;var r = {};if (r.userID = t, !Gs(n)) for (var o = 0, i = n.length; o < i; o++) {switch (n[o].tag) {case Al.NICK:r.nick = n[o].value;break;case Al.GENDER:r.gender = n[o].value;break;case Al.BIRTHDAY:r.birthday = n[o].value;break;case Al.LOCATION:r.location = n[o].value;break;case Al.SELFSIGNATURE:r.selfSignature = n[o].value;break;case Al.ALLOWTYPE:r.allowType = n[o].value;break;case Al.LANGUAGE:r.language = n[o].value;break;case Al.AVATAR:r.avatar = n[o].value;break;case Al.MESSAGESETTINGS:r.messageSettings = n[o].value;break;case Al.ADMINFORBIDTYPE:r.adminForbidType = n[o].value;break;case Al.LEVEL:r.level = n[o].value;break;case Al.ROLE:r.role = n[o].value;break;default:is.warn("snsProfileItem unkown tag->", n[o].tag);}}this.profile = new sh(r);},fh = function () {function e(t) {on(this, e), this.uc = t, this.TAG = "friend", this.Actions = { G: "get", D: "delete" }, this.friends = new Map(), this.pointer = new lh();}return sn(e, [{ key: "isMyFriend", value: function value(e) {var t = this.friends.has(e);return t || is.debug("FriendHandler.isMyFriend " + e + " is not my friend"), t;} }, { key: "_transformFriendList", value: function value(e) {if (!Gs(e) && !Gs(e.infoItem)) {is.info("FriendHandler._transformFriendList friendNum=" + e.friendNum);for (var t, n, r = e.infoItem, o = 0, i = r.length; o < i; o++) {n = r[o].infoAccount, t = new ph(n, r[o].snsProfileItem), this.friends.set(n, t);}}} }, { key: "_friends2map", value: function value(e) {var t = new Map();for (var n in e) {Object.prototype.hasOwnProperty.call(e, n) && t.set(n, e[n]);}return t;} }, { key: "getFriendList", value: function value() {var e = this,t = this.uc.tim,n = t.connectionController,r = t.outerEmitter,o = {};o.fromAccount = this.uc.getMyAccount(), is.info("FriendHandler.getFriendList myAccount=" + o.fromAccount);var i = this.uc.makeCapsule(this.TAG, this.Actions.G, o);return n.request(i).then(function (t) {is.info("FriendHandler.getFriendList ok"), e._transformFriendList(t.data);var n = yn(e.friends.values());return r.emit(Wt.FRIENDLIST_GET_SUCCESS, n), kl(n);}).catch(function (e) {return is.error("FriendHandler.getFriendList error:", JSON.stringify(e)), wl(e);});} }, { key: "deleteFriend", value: function value(e) {if (!Array.isArray(e.toAccount)) return is.error("FriendHandler.deleteFriend options.toAccount 必需是数组"), wl({ code: xc.DEL_FRIEND_INVALID_PARAM, message: qc.DEL_FRIEND_INVALID_PARAM });e.toAccount.length > 1e3 && (is.warn("FriendHandler.deleteFriend 删除好友人数不能超过1000人"), e.toAccount.length = 1e3);var t = this.uc.tim,n = t.connectionController,r = t.outerEmitter,o = this.uc.makeCapsule(this.TAG, this.Actions.D, e);return n.request(o).then(function (e) {return is.info("FriendHandler.deleteFriend ok"), r.emit(Wt.FRIEND_DELETE_SUCCESS), kl();}).catch(function (e) {return is.error("FriendHandler.deleteFriend error:", e), wl(e);});} }]), e;}(),hh = function e(t) {on(this, e), Gs || (this.userID = t.userID || "", this.timeStamp = t.timeStamp || 0);},gh = function () {function e(t) {on(this, e), this.uc = t, this.TAG = "blacklist", this.Actions = { G: "get", C: "create", D: "delete" }, this.blacklistMap = new Map(), this.startIndex = 0, this.maxLimited = 100, this.curruentSequence = 0;}return sn(e, [{ key: "getBlacklist", value: function value() {var e = this,t = this.uc.tim.connectionController,n = {};n.fromAccount = this.uc.getMyAccount(), n.maxLimited = this.maxLimited, n.startIndex = 0, n.lastSequence = this.curruentSequence;var r = this.uc.makeCapsule(this.TAG, this.Actions.G, n);return t.request(r).then(function (t) {return is.info("BlacklistHandler.getBlacklist ok"), e.curruentSequence = t.data.curruentSequence, e._handleResponse(t.data.blackListItem, 1), e._onBlacklistUpdated();}).catch(function (e) {return is.error("BlacklistHandler.getBlacklist error:", e), wl(e);});} }, { key: "addBlacklist", value: function value(e) {var t = this;if (!hs(e.userIDList)) return is.error("BlacklistHandler.addBlacklist options.userIDList 必需是数组"), wl({ code: xc.ADD_BLACKLIST_INVALID_PARAM, message: qc.ADD_BLACKLIST_INVALID_PARAM });var n = this.uc.tim.loginInfo.identifier;if (1 === e.userIDList.length && e.userIDList[0] === n) return is.error("BlacklistHandler.addBlacklist 不能把自己拉黑"), wl({ code: xc.CANNOT_ADD_SELF_TO_BLACKLIST, message: qc.CANNOT_ADD_SELF_TO_BLACKLIST });e.userIDList.includes(n) && (e.userIDList = e.userIDList.filter(function (e) {return e !== n;}), is.warn("BlacklistHandler.addBlacklist 不能把自己拉黑，已过滤"));var r = this.uc.tim.connectionController;e.fromAccount = this.uc.getMyAccount(), e.toAccount = e.userIDList;var o = this.uc.makeCapsule(this.TAG, this.Actions.C, e);return r.request(o).then(function (e) {return is.info("BlacklistHandler.addBlacklist ok"), t._handleResponse(e.data.resultItem, 1), t._onBlacklistUpdated();}).catch(function (e) {return is.error("BlacklistHandler.addBlacklist error:", e), wl(e);});} }, { key: "_handleResponse", value: function value(e, t) {if (!Gs(e)) for (var n, r, o, i = 0, a = e.length; i < a; i++) {r = e[i].to, o = e[i].resultCode, (gs(o) || 0 === o) && (t ? ((n = this.blacklistMap.has(r) ? this.blacklistMap.get(r) : new hh()).userID = r, !Gs(e[i].addBlackTimeStamp) && (n.timeStamp = e[i].addBlackTimeStamp), this.blacklistMap.set(r, n)) : this.blacklistMap.has(r) && (n = this.blacklistMap.get(r), this.blacklistMap.delete(r)));}is.log("BlacklistHandler._handleResponse total=" + this.blacklistMap.size + " bAdd=" + t);} }, { key: "deleteBlacklist", value: function value(e) {var t = this;if (!hs(e.userIDList)) return is.error("BlacklistHandler.deleteBlacklist options.userIDList 必需是数组"), wl({ code: xc.DEL_BLACKLIST_INVALID_PARAM, message: qc.DEL_BLACKLIST_INVALID_PARAM });var n = this.uc.tim.connectionController;e.fromAccount = this.uc.getMyAccount(), e.toAccount = e.userIDList;var r = this.uc.makeCapsule(this.TAG, this.Actions.D, e);return n.request(r).then(function (e) {return is.info("BlacklistHandler.deleteBlacklist ok"), t._handleResponse(e.data.resultItem, 0), t._onBlacklistUpdated();}).catch(function (e) {return is.error("BlacklistHandler.deleteBlacklist error:", e), wl(e);});} }, { key: "_onBlacklistUpdated", value: function value() {var e = this.uc.tim.outerEmitter,t = yn(this.blacklistMap.keys());return e.emit(Wt.BLACKLIST_UPDATED, t), kl(t);} }, { key: "handleBlackListDelAccount", value: function value(e) {for (var t, n = [], r = 0, o = e.length; r < o; r++) {t = e[r], this.blacklistMap.has(t) && (this.blacklistMap.delete(t), n.push(t));}n.length > 0 && (is.log("BlacklistHandler.handleBlackListDelAccount delCount=" + n.length + " : " + n.join(",")), this.tim.outerEmitter.emit(Wt.BLACKLIST_UPDATED, yn(this.blacklistMap.keys())));} }, { key: "handleBlackListAddAccount", value: function value(e) {for (var t, n = [], r = 0, o = e.length; r < o; r++) {t = e[r], this.blacklistMap.has(t) || (this.blacklistMap.set(t, new hh({ userID: t })), n.push(t));}n.length > 0 && (is.log("BlacklistHandler.handleBlackListAddAccount addCount=" + n.length + " : " + n.join(",")), this.tim.outerEmitter.emit(Wt.BLACKLIST_UPDATED, yn(this.blacklistMap.keys())));} }, { key: "reset", value: function value() {this.blacklistMap.clear(), this.startIndex = 0, this.maxLimited = 100, this.curruentSequence = 0;} }]), e;}(),dh = function () {function e(t) {on(this, e), this.uc = t, this.TAG = "applyC2C", this.Actions = { C: "create", G: "get", D: "delete", U: "update" };}return sn(e, [{ key: "applyAddFriend", value: function value(e) {var t = this,n = this.uc.tim,r = n.outerEmitter,o = n.connectionController,i = this.uc.makeCapsule(this.TAG, this.Actions.C, e),a = o.request(i);return a.then(function (e) {t.uc.isActionSuccessful("applyAddFriend", t.Actions.C, e) ? r.emit(Wt.APPLY_ADD_FRIEND_SUCCESS, { data: e.data }) : r.emit(Wt.APPLY_ADD_FRIEND_FAIL, { data: e.data });}).catch(function (e) {r.emit(Wt.APPLY_ADD_FRIEND_FAIL, { data: e });}), a;} }, { key: "getPendency", value: function value(e) {var t = this,n = this.tim,r = n.connectionController,o = n.outerEmitter,i = this.uc.makeCapsule(this.TAG, this.Actions.G, e),a = r.request(i);return a.then(function (e) {t.uc.isActionSuccessful("getPendency", t.Actions.G, e) ? o.emit(Wt.GET_PENDENCY_SUCCESS, { data: e.data }) : o.emit(Wt.GET_PENDENCY_FAIL, { data: e.data });}).catch(function (e) {o.emit(Wt.GET_PENDENCY_FAIL, { data: e });}), a;} }, { key: "deletePendency", value: function value(e) {var t = this,n = this.tim,r = n.connectionController,o = n.outerEmitter,i = this.uc.makeCapsule(this.TAG, this.Actions.D, e),a = r.request(i);return a.then(function (e) {t.uc.isActionSuccessful("deletePendency", t.Actions.D, e) ? o.emit(Wt.DELETE_PENDENCY_SUCCESS, { data: e.data }) : o.emit(Wt.DELETE_PENDENCY_FAIL, { data: e.data });}).catch(function (e) {o.emit(Wt.DELETE_PENDENCY_FAIL, { data: e });}), a;} }, { key: "replyPendency", value: function value() {var e = this,t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},n = this.tim,r = n.connectionController,o = n.outerEmitter,i = this.uc.makeCapsule(this.TAG, this.Actions.U, t),a = r.request(i);return a.then(function (t) {e.uc.isActionSuccessful("replyPendency", e.Actions.U, t) ? o.emit(Wt.REPLY_PENDENCY_SUCCESS, { data: t.data }) : o.emit(Wt.REPLY_PENDENCY_FAIL, { data: t.data });}).catch(function (e) {o.emit(Wt.REPLY_PENDENCY_FAIL, { data: e });}), a;} }]), e;}(),_h = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e))).profileHandler = new uh(_n(n)), n.friendHandler = new fh(_n(n)), n.blacklistHandler = new gh(_n(n)), n.applyC2CHandler = new dh(_n(n)), n._initializeListener(), n;}return pn(t, sl), sn(t, [{ key: "_initializeListener", value: function value(e) {var t = this.tim.innerEmitter;t.on(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this.onContextUpdated, this), t.on(Xc.NOTICE_LONGPOLL_PROFILE_MODIFIED, this.onProfileModified, this), t.on(Xc.NOTICE_LONGPOLL_NEW_FRIEND_MESSAGES, this.onNewFriendMessages, this), t.on(Xc.CONVERSATION_LIST_PROFILE_UPDATED, this.onConversationsProfileUpdated, this);} }, { key: "onContextUpdated", value: function value(e) {var t = e.data.context;0 != !!t.a2Key && 0 != !!t.tinyID && (this.profileHandler.getMyProfile(), this.friendHandler.getFriendList(), this.blacklistHandler.getBlacklist());} }, { key: "onGotMyProfile", value: function value() {this.triggerReady();} }, { key: "onProfileModified", value: function value(e) {this.profileHandler.onProfileModified(e);} }, { key: "onNewFriendMessages", value: function value(e) {is.debug("onNewFriendMessages", JSON.stringify(e.data)), Gs(e.data.blackListDelAccount) || this.blacklistHandler.handleBlackListDelAccount(e.data.blackListDelAccount), Gs(e.data.blackListAddAccount) || this.blacklistHandler.handleBlackListAddAccount(e.data.blackListAddAccount);} }, { key: "onConversationsProfileUpdated", value: function value(e) {this.profileHandler.onConversationsProfileUpdated(e.data);} }, { key: "getMyAccount", value: function value() {return this.tim.context.identifier;} }, { key: "isMyFriend", value: function value(e) {return this.friendHandler.isMyFriend(e);} }, { key: "makeCapsule", value: function value(e, t, n) {return this.createPackage({ name: e, action: t, param: n });} }, { key: "getMyProfile", value: function value() {return this.profileHandler.getMyProfile();} }, { key: "getUserProfile", value: function value(e) {return this.profileHandler.getUserProfile(e);} }, { key: "updateMyProfile", value: function value(e) {return this.profileHandler.updateMyProfile(e);} }, { key: "getFriendList", value: function value() {return this.friendHandler.getFriendList();} }, { key: "deleteFriend", value: function value(e) {return this.friendHandler.deleteFriend(e);} }, { key: "getBlacklist", value: function value() {return this.blacklistHandler.getBlacklist();} }, { key: "addBlacklist", value: function value(e) {return this.blacklistHandler.addBlacklist(e);} }, { key: "deleteBlacklist", value: function value(e) {return this.blacklistHandler.deleteBlacklist(e);} }, { key: "applyAddFriend", value: function value(e) {return this.applyC2CHandler.applyAddFriend(e);} }, { key: "getPendency", value: function value(e) {return this.applyC2CHandler.getPendency(e);} }, { key: "deletePendency", value: function value(e) {return this.applyC2CHandler.deletePendency(e);} }, { key: "replyPendency", value: function value(e) {return this.applyC2CHandler.replyPendency(e);} }, { key: "reset", value: function value() {is.warn("UserController.reset"), this.resetReady(), this.profileHandler.reset(), this.blacklistHandler.reset(), this.checkTimes = 0;} }]), t;}(),mh = [].sort,vh = [1, 2, 3],yh = u(function () {vh.sort(void 0);}),Eh = u(function () {vh.sort(null);}),Sh = Be("sort");De({ target: "Array", proto: 1, forced: yh || !Eh || Sh }, { sort: function sort(e) {return void 0 === e ? mh.call(Re(this)) : mh.call(Re(this), Ne(e));} });var Ih = function () {function e(t) {on(this, e), this.type = Xt.MSG_TEXT, this.content = { text: t.text || "" };}return sn(e, [{ key: "setText", value: function value(e) {this.content.text = e;} }, { key: "isEmpty", value: function value() {return 0 === this.content.text.length ? 1 : 0;} }]), e;}(),Ch = function () {function e(t) {on(this, e), this._imageMemoryURL = "", this._file = t.file, Oa ? this.createImageDataASURLInWXMiniApp(t.file) : this.createImageDataASURLInWeb(t.file), this._initImageInfoModel(), this.type = Xt.MSG_IMAGE, this._percent = 0, this.content = { imageFormat: fl.IMAGE_FORMAT[t.imageFormat] || fl.IMAGE_FORMAT.UNKNOWN, uuid: t.uuid, imageInfoArray: [] }, this.initImageInfoArray(t.imageInfoArray), this._defaultImage = "http://imgcache.qq.com/open/qcloud/video/act/webim-images/default.jpg", this._autoFixUrl();}return sn(e, [{ key: "_initImageInfoModel", value: function value() {var e = this;this._ImageInfoModel = function (t) {this.instanceID = Ts(9999999), this.sizeType = t.type || 0, this.size = t.size || 0, this.width = t.width || 0, this.height = t.height || 0, this.imageUrl = t.url || "", this.url = t.url || e._imageMemoryURL || e._defaultImage;}, this._ImageInfoModel.prototype = { setSizeType: function setSizeType(e) {this.sizeType = e;}, setImageUrl: function setImageUrl(e) {e && (this.imageUrl = e);}, getImageUrl: function getImageUrl() {return this.imageUrl;} };} }, { key: "initImageInfoArray", value: function value(e) {for (var t = 2, n = null, r = null; t >= 0;) {r = void 0 === e || void 0 === e[t] ? { type: 0, size: 0, width: 0, height: 0, url: "" } : e[t], (n = new this._ImageInfoModel(r)).setSizeType(t + 1), this.addImageInfo(n), t--;}} }, { key: "updateImageInfoArray", value: function value(e) {for (var t, n = this.content.imageInfoArray.length, r = 0; r < n; r++) {t = this.content.imageInfoArray[r], e.size && (t.size = e.size), e.url && t.setImageUrl(e.url), e.width && (t.width = e.width), e.height && (t.height = e.height);}} }, { key: "_autoFixUrl", value: function value() {for (var e = this.content.imageInfoArray.length, t = "", n = "", r = ["http", "https"], o = null, i = 0; i < e; i++) {this.content.imageInfoArray[i].url && "" !== (o = this.content.imageInfoArray[i]).imageUrl && (n = o.imageUrl.slice(0, o.imageUrl.indexOf("://") + 1), t = o.imageUrl.slice(o.imageUrl.indexOf("://") + 1), r.indexOf(n) < 0 && (n = "https:"), this.content.imageInfoArray[i].setImageUrl([n, t].join("")));}} }, { key: "updatePercent", value: function value(e) {this._percent = e, this._percent > 1 && (this._percent = 1);} }, { key: "updateImageFormat", value: function value(e) {this.content.imageFormat = e;} }, { key: "createImageDataASURLInWeb", value: function value(e) {void 0 !== e && e.files.length > 0 && (this._imageMemoryURL = window.URL.createObjectURL(e.files[0]));} }, { key: "createImageDataASURLInWXMiniApp", value: function value(e) {e && e.url && (this._imageMemoryURL = e.url);} }, { key: "replaceImageInfo", value: function value(e, t) {this.content.imageInfoArray[t] instanceof this._ImageInfoModel || (this.content.imageInfoArray[t] = e);} }, { key: "addImageInfo", value: function value(e) {this.content.imageInfoArray.length >= 3 || this.content.imageInfoArray.push(e);} }, { key: "isEmpty", value: function value() {return 0 === this.content.imageInfoArray.length ? 1 : "" === this.content.imageInfoArray[0].imageUrl ? 1 : 0 === this.content.imageInfoArray[0].size ? 1 : 0;} }]), e;}(),Th = function () {function e(t) {on(this, e), this.type = Xt.MSG_FACE, this.content = t || null;}return sn(e, [{ key: "isEmpty", value: function value() {return null === this.content ? 1 : 0;} }]), e;}(),Mh = function () {function e(t) {on(this, e), this.type = Xt.MSG_AUDIO, this.content = { downloadFlag: 2, second: t.second, size: t.size, url: t.url, remoteAudioUrl: "", uuid: t.uuid };}return sn(e, [{ key: "updateAudioUrl", value: function value(e) {this.content.remoteAudioUrl = e;} }, { key: "isEmpty", value: function value() {return "" === this.content.remoteAudioUrl ? 1 : 0;} }]), e;}(),Oh = { from: 1, groupID: 1, groupName: 1, to: 1 },Ah = function () {function e(t) {on(this, e), this.type = Xt.MSG_GRP_TIP, this.content = {}, this._initContent(t);}return sn(e, [{ key: "_initContent", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {switch (n) {case "remarkInfo":break;case "groupProfile":t.content.groupProfile = {}, t._initGroupProfile(e[n]);break;case "operatorInfo":case "memberInfoList":break;default:t.content[n] = e[n];}}), this.content.userIDList || (this.content.userIDList = [this.content.operatorID]);} }, { key: "_initGroupProfile", value: function value(e) {for (var t = Object.keys(e), n = 0; n < t.length; n++) {var r = t[n];Oh[r] && (this.content.groupProfile[r] = e[r]);}} }]), e;}(),Dh = { from: 1, groupID: 1, name: 1, to: 1 },Nh = function () {function e(t) {on(this, e), this.type = Xt.MSG_GRP_SYS_NOTICE, this.content = {}, this._initContent(t);}return sn(e, [{ key: "_initContent", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {switch (n) {case "memberInfoList":break;case "remarkInfo":t.content.handleMessage = e[n];break;case "groupProfile":t.content.groupProfile = {}, t._initGroupProfile(e[n]);break;default:t.content[n] = e[n];}});} }, { key: "_initGroupProfile", value: function value(e) {for (var t = Object.keys(e), n = 0; n < t.length; n++) {var r = t[n];Dh[r] && (this.content.groupProfile[r] = e[r]);}} }]), e;}(),Lh = Math.min,Rh = [].lastIndexOf,Ph = !!Rh && 1 / [1].lastIndexOf(1, -0) < 0,Gh = Be("lastIndexOf"),kh = Ph || Gh ? function (e) {if (Ph) return Rh.apply(this, arguments) || 0;var t = y(this),n = ae(t.length),r = n - 1;for (arguments.length > 1 && (r = Lh(r, oe(arguments[1]))), r < 0 && (r = n + r); r >= 0; r--) {if (r in t && t[r] === e) return r || 0;}return -1;} : Rh;De({ target: "Array", proto: 1, forced: kh !== [].lastIndexOf }, { lastIndexOf: kh });var wh = function () {function e(t) {on(this, e);var n = this._check(t);if (n instanceof jc) throw n;this.type = Xt.MSG_FILE, this._percent = 0;var r = this._getFileInfo(t);this.content = { downloadFlag: 2, fileUrl: t.url || "", uuid: t.uuid, fileName: r.name || "", fileSize: r.size || 0 };}return sn(e, [{ key: "_getFileInfo", value: function value(e) {if (e.fileName && e.fileSize) return { size: e.fileSize, name: e.fileName };if (Oa) return {};var t = e.file.files[0];return { size: t.size, name: t.name, type: t.type.slice(t.type.lastIndexOf("/") + 1).toUpperCase() };} }, { key: "updatePercent", value: function value(e) {this._percent = e, this._percent > 1 && (this._percent = 1);} }, { key: "updateFileUrl", value: function value(e) {this.content.fileUrl = e;} }, { key: "_check", value: function value(e) {if (e.size > 20971520) return new jc({ code: xc.MESSAGE_FILE_SIZE_LIMIT, message: "".concat(qc.MESSAGE_FILE_SIZE_LIMIT, ": ").concat(20971520, " bytes") });} }, { key: "isEmpty", value: function value() {return "" === this.content.fileUrl ? 1 : "" === this.content.fileName ? 1 : 0 === this.content.fileSize ? 1 : 0;} }]), e;}(),bh = function () {function e(t) {on(this, e), this.type = Xt.MSG_CUSTOM, this.content = { data: t.data || "", description: t.description || "", extension: t.extension || "" };}return sn(e, [{ key: "setData", value: function value(e) {return this.content.data = e, this;} }, { key: "setDescription", value: function value(e) {return this.content.description = e, this;} }, { key: "setExtension", value: function value(e) {return this.content.extension = e, this;} }, { key: "isEmpty", value: function value() {return 0 === this.content.data.length && 0 === this.content.description.length && 0 === this.content.extension.length ? 1 : 0;} }]), e;}(),Uh = function e(t) {on(this, e), this.type = Xt.MSG_VIDEO, this.content = { videoFormat: t.videoFormat, videoSecond: t.videoSecond, videoSize: t.videoSize, videoUrl: t.videoUrl, videoDownloadFlag: t.videoDownloadFlag, uuid: t.uuid, thumbSize: t.thumbSize, thumbWidth: t.thumbWidth, thumbHeight: t.thumbHeight, thumbDownloadFlag: t.thumbDownloadFlag, thumbUrl: t.thumbUrl };},Fh = function () {function e(t) {on(this, e), this.ID = "", this.conversationID = t.conversationID || null, this.conversationType = t.conversationType || Xt.CONV_C2C, this.conversationSubType = t.conversationSubType, this.time = t.time || Math.ceil(Date.now() / 1e3), this.sequence = t.sequence || 0, this.clientSequence = t.clientSequence || t.sequence || 0, this.random = t.random || Ts(), this.messagePriority = t.messagePriority || 0, this._elements = [], this.isPlaceMessage = 0, this.geo = {}, this.from = t.from || null, this.to = t.to || null, this.flow = "", this.isSystemMessage = t.isSystemMessage || 0, this.protocol = t.protocol || "JSON", this.isResend = 0, this.isRead = 0, this.status = t.status || ll.MESSAGE_STATUS.SUCCESS, this._error = 0, this._errorInfo = "", this.reInitialize(t.currentUser), this.extractGroupInfo(t.groupProfile || null);}return sn(e, [{ key: "getElements", value: function value() {return this._elements;} }, { key: "setError", value: function value(e, t) {"number" == typeof e && (this._error = e), this._errorInfo = t || "message elements error!";} }, { key: "extractGroupInfo", value: function value(e) {if (null !== e) {var t = e.messageFromAccountExtraInformation;this.nick = "", "string" == typeof e.fromAccountNick && (this.nick = e.fromAccountNick), this.avatar = "", "string" == typeof e.fromAccountHeadurl && (this.avatar = e.fromAccountHeadurl), this.nameCard = "", "object" === rn(t) && t.hasOwnProperty("nameCard") && (this.nameCard = t.nameCard);}} }, { key: "isError", value: function value() {return 0 === this._error ? 0 : 1;} }, { key: "getIMError", value: function value() {return new jc({ code: this._error, message: this._errorInfo });} }, { key: "_initProxy", value: function value() {this.payload = this._elements[0].content, this.type = this._elements[0].type;} }, { key: "afterOperated", value: function value(e) {this._onOperatedHandle = null, "function" == typeof e && (this._onOperatedHandle = e), 1 == this.isSendable() && this.triggerOperated();} }, { key: "triggerOperated", value: function value() {null !== this._onOperatedHandle && "function" == typeof this._onOperatedHandle && this._onOperatedHandle(this);} }, { key: "reInitialize", value: function value(e) {e && (this.status = this.from ? ll.MESSAGE_STATUS.SUCCESS : ll.MESSAGE_STATUS.UNSEND, !this.from && (this.from = e), this.isRead = 1), this._initFlow(e), this._initielizeSequence(e), this._concactConversationID(e), this.generateMessageID(e);} }, { key: "isSendable", value: function value() {return 0 === this._elements.length ? 0 : "function" != typeof this._elements[0].isEmpty ? (is.warn("".concat(this._elements[0].type, ' need "boolean : isEmpty()" method')), 0) : 1 == this._elements[0].isEmpty() ? 0 : 1;} }, { key: "_initTo", value: function value(e) {this.conversationType === Xt.CONV_GROUP && (this.to = e.groupID);} }, { key: "_initielizeSequence", value: function value(e) {0 === this.clientSequence && e && (this.clientSequence = function (e) {if (!e) return is.error("autoincrementIndex(string: key) need key parameter"), 0;if (void 0 === Ds[e]) {var t = new Date(),n = "3".concat(t.getHours()).slice(-2),r = "0".concat(t.getMinutes()).slice(-2),o = "0".concat(t.getSeconds()).slice(-2);Ds[e] = parseInt([n, r, o, "0001"].join("")), n = null, r = null, o = null, is.warn("utils.autoincrementIndex() create new sequence : ".concat(e, " = ").concat(Ds[e]));}return Ds[e]++;}(e)), 0 === this.sequence && this.conversationType === Xt.CONV_C2C && (this.sequence = this.clientSequence);} }, { key: "generateMessageID", value: function value(e) {var t = e === this.from ? 1 : 0,n = this.sequence > 0 ? this.sequence : this.clientSequence;this.ID = "".concat(this.conversationID, "-").concat(n, "-").concat(this.random, "-").concat(t);} }, { key: "_initFlow", value: function value(e) {"" !== e && (this.flow = e === this.from ? "out" : "in");} }, { key: "_concactConversationID", value: function value(e) {var t = this.to,n = "",r = this.conversationType;r !== Xt.CONV_SYSTEM ? (n = r === Xt.CONV_C2C ? e === this.from ? t : this.from : this.to, this.conversationID = "".concat(r).concat(n)) : this.conversationID = Xt.CONV_SYSTEM;} }, { key: "isElement", value: function value(e) {return e instanceof Ih || e instanceof Ch || e instanceof Th || e instanceof Mh || e instanceof wh || e instanceof Ah || e instanceof Nh || e instanceof bh;} }, { key: "setElement", value: function value(e) {var t = this;if (this.isElement(e)) return this._elements = [e], void this._initProxy();var n = function n(e) {switch (e.type) {case Xt.MSG_TEXT:t.setTextElement(e.content);break;case Xt.MSG_IMAGE:t.setImageElement(e.content);break;case Xt.MSG_AUDIO:t.setAudioElement(e.content);break;case Xt.MSG_FILE:t.setFileElement(e.content);break;case Xt.MSG_VIDEO:t.setVideoElement(e.content);break;case Xt.MSG_CUSTOM:t.setCustomElement(e.content);break;case Xt.MSG_GEO:t.setGEOElement(e.content);break;case Xt.MSG_GRP_TIP:t.setGroupTipElement(e.content);break;case Xt.MSG_GRP_SYS_NOTICE:t.setGroupSystemNoticeElement(e.content);break;case Xt.MSG_FACE:t.setFaceElement(e.content);break;default:is.warn(e.type, e.content, "no operation......");}};if (Array.isArray(e)) for (var r = 0; r < e.length; r++) {n(e[r]);} else n(e);this._initProxy();} }, { key: "setTextElement", value: function value(e) {var t = "string" == typeof e ? e : e.text,n = new Ih({ text: t });this._elements.push(n);} }, { key: "setImageElement", value: function value(e) {var t = new Ch(e);this._elements.push(t);} }, { key: "setAudioElement", value: function value(e) {var t = new Mh(e);this._elements.push(t);} }, { key: "setFileElement", value: function value(e) {var t = new wh(e);this._elements.push(t);} }, { key: "setVideoElement", value: function value(e) {var t = new Uh(e);this._elements.push(t);} }, { key: "setGEOElement", value: function value(e) {} }, { key: "setCustomElement", value: function value(e) {var t = new bh(e);this._elements.push(t);} }, { key: "setGroupTipElement", value: function value(e) {var t = new Ah(e);this._elements.push(t);} }, { key: "setGroupSystemNoticeElement", value: function value(e) {var t = new Nh(e);this._elements.push(t);} }, { key: "setFaceElement", value: function value(e) {var t = new Th(e);this._elements.push(t);} }, { key: "elements", get: function get() {return is.warn("！！！Message 实例的 elements 属性即将废弃，请尽快修改。使用 type 和 payload 属性处理单条消息，兼容组合消息使用 _elements 属性！！！"), this._elements;} }]), e;}(),xh = ["groupID", "name", "avatar", "type", "introduction", "notification", "ownerID", "selfInfo", "createTime", "infoSequence", "lastInfoTime", "lastMessage", "nextMessageSeq", "memberNum", "maxMemberNum", "memberList", "joinOption", "groupCustomField"],qh = function () {function e(t) {on(this, e), this.groupID = "", this.name = "", this.avatar = "", this.type = "", this.introduction = "", this.notification = "", this.ownerID = "", this.createTime = "", this.infoSequence = "", this.lastInfoTime = "", this.selfInfo = { messageRemindType: "", joinTime: "", nameCard: "", role: "" }, this.lastMessage = { lastTime: "", lastSequence: "", fromAccount: "", messageForShow: "" }, this.nextMessageSeq = "", this.memberNum = "", this.maxMemberNum = "", this.joinOption = "", this.groupCustomField = [], this._initGroup(t);}return sn(e, [{ key: "_initGroup", value: function value(e) {for (var t in e) {xh.indexOf(t) < 0 || (this[t] = e[t]);}} }, { key: "updateGroup", value: function value(e) {e.lastMsgTime && (this.lastMessage.lastTime = e.lastMsgTime), Ss(this, e, ["members", "errorCode", "lastMsgTime"]);} }]), e;}(),jh = function jh(e, t) {if (gs(t)) return "";switch (e) {case Xt.MSG_TEXT:return t.text;case Xt.MSG_IMAGE:return "[图片]";case Xt.MSG_GEO:return "[位置]";case Xt.MSG_AUDIO:return "[语音]";case Xt.MSG_VIDEO:return "[视频]";case Xt.MSG_FILE:return "[文件]";case Xt.MSG_CUSTOM:return "[自定义消息]";case Xt.MSG_GRP_TIP:return "[群提示消息]";case Xt.MSG_GRP_SYS_NOTICE:return "[群系统通知]";case Xt.MSG_FACE:return "[自定义表情]";default:return "";}},Bh = function Bh(e) {return gs(e) ? { lastTime: 0, lastSequence: 0, fromAccount: 0, messageForShow: "", payload: null, type: "" } : e instanceof Fh ? { lastTime: e.time || 0, lastSequence: e.sequence || 0, fromAccount: e.from || "", messageForShow: jh(e.type, e.payload), payload: e.payload || null, type: e.type || null } : ln({}, e, { messageForShow: jh(e.type, e.payload) });},Hh = function () {function e(t) {on(this, e), this.conversationID = t.conversationID || "", this.unreadCount = t.unreadCount || 0, this.type = t.type || "", this.subType = t.subType || "", this.lastMessage = Bh(t.lastMessage), this._isInfoCompleted = 0, this._initProfile(t);}return sn(e, [{ key: "_initProfile", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {switch (n) {case "userProfile":t.userProfile = e.userProfile;break;case "groupProfile":t.groupProfile = e.groupProfile;}}), gs(this.userProfile) && this.type === Xt.CONV_C2C ? this.userProfile = new sh({ userID: e.conversationID.replace("C2C", "") }) : gs(this.groupProfile) && this.type === Xt.CONV_GROUP && (this.groupProfile = new qh({ groupID: e.conversationID.replace("GROUP", "") }));} }, { key: "toAccount", get: function get() {return this.conversationID.replace("C2C", "").replace("GROUP", "");} }]), e;}(),Vh = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e))).conversationMap = new Map(), n.hasLocalConversationList = 0, n.tempGroupList = [], n._initListeners(), n;}return pn(t, sl), sn(t, [{ key: "createLocalConversation", value: function value(e) {return this.conversationMap.has(e) ? this.conversationMap.get(e) : new Hh({ conversationID: e, type: e.slice(0, 3) === Xt.CONV_C2C ? Xt.CONV_C2C : Xt.CONV_GROUP });} }, { key: "hasLocalConversation", value: function value(e) {return this.conversationMap.has(e);} }, { key: "getConversationList", value: function value() {var e = this,t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,n = !t,r = this.createPackage({ name: "conversation", action: "query" });return is.log("ConversationController.getConversationList."), this.tim.connectionController.request(r).then(function (r) {var o = r.data.conversations,i = void 0 === o ? [] : o,a = e._getConversationOptions(i);return t && e._conversationMapTreeShaking(a), e._updateLocalConversationList(a, 1), e._setStorageConversationList(), e.tempGroupList.length > 0 && (e._onUpdateConversationGroupProfile(e.tempGroupList), e.tempGroupList = []), e._isReady && e._emitConversationUpdate(n), e.triggerReady(), is.log("ConversationController.getConversationList ok."), kl({ conversationList: e.getLocalConversationList() });}).catch(function (e) {return is.error("ConversationController.getConversationList error:", e), wl(e);});} }, { key: "getConversationProfile", value: function value(e) {var t = this.conversationMap.has(e) ? this.conversationMap.get(e) : this.createLocalConversation(e);return t._isInfoCompleted || t.type === Xt.CONV_SYSTEM ? kl({ conversation: t }) : (is.log("ConversationController.getConversationProfile. conversationID:", e), this._updateUserOrGroupProfileCompletely(t).then(function (t) {return is.log("ConversationController.getConversationProfile ok. conversationID:", e), t;}).catch(function (e) {return is.error("ConversationController.getConversationProfile error:", e), wl(e);}));} }, { key: "deleteConversation", value: function value(e) {var t = this,n = {};if (!this.conversationMap.has(e)) {var r = new jc({ code: xc.CONVERSATION_NOT_FOUND, message: qc.CONVERSATION_NOT_FOUND });return wl(r);}switch (this.conversationMap.get(e).type) {case Xt.CONV_C2C:n.type = 1, n.toAccount = e.slice(3);break;case Xt.CONV_GROUP:n.type = 2, n.toGroupID = e.slice(5);break;case Xt.CONV_SYSTEM:return this.tim.groupController.deleteGroupSystemNotice({ messageList: this.tim.messageController.getLocalMessageList(e) }), this._deleteLocalConversation(e), kl({ conversationID: e });default:var o = new jc({ code: xc.CONVERSATION_UN_RECORDED_TYPE, message: qc.CONVERSATION_UN_RECORDED_TYPE });return wl(o);}is.log("ConversationController.deleteConversation. conversationID:", e);var i = this.createPackage({ name: "conversation", action: "delete", param: n });return this.tim.setMessageRead({ conversationID: e }).then(function () {return t.connectionController.request(i);}).then(function () {return is.log("ConversationController.deleteConversation ok. conversationID:", e), t._deleteLocalConversation(e), kl({ conversationID: e });}).catch(function (e) {return is.error("ConversationController.deleteConversation error:", e), wl(e);});} }, { key: "getLocalConversationList", value: function value() {return yn(this.conversationMap.values());} }, { key: "getLocalConversation", value: function value(e) {return this.conversationMap.get(e);} }, { key: "_initLocalConversationList", value: function value() {is.time(Fl), is.log("ConversationController._initLocalConversationList init");var e = this._getStorageConversationList();if (this.hasLocalConversationList = null !== e && 0 !== e.length, this.hasLocalConversationList) {for (var t = 0, n = e.length; t < n; t++) {this.conversationMap.set(e[t].conversationID, new Hh(e[t]));}this._emitConversationUpdate(1, 0);}this.getConversationList(1).then(function () {is.log("ConversationController._initLocalConversationList init ok. initCost=".concat(is.timeEnd(Fl), "ms"));});} }, { key: "_getStorageConversationList", value: function value() {return this.tim.storage.getItem("conversationMap");} }, { key: "_setStorageConversationList", value: function value() {var e = [];this.conversationMap.forEach(function (t) {var n = t.conversationID,r = t.type,o = t.subType,i = t.lastMessage,a = t.groupProfile,s = t.userProfile;e.push({ conversationID: n, type: r, subType: o, lastMessage: i, groupProfile: a, userProfile: s });}), this.tim.storage.setItem("conversationMap", e);} }, { key: "_initListeners", value: function value() {this.tim.innerEmitter.once(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._initLocalConversationList, this), this.tim.innerEmitter.on(Xc.MESSAGE_SENDING, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xc.MESSAGE_SENDINGSEND_SUCCESS, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xc.MESSAGE_GROUP_SEND_SUCCESS, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xc.MESSAGE_SYNC_PROCESSING, this._handleSyncMessages, this), this.tim.innerEmitter.on(Xc.MESSAGE_SYNC_FINISHED, this._handleSyncMessages, this), this.tim.innerEmitter.on(Xc.MESSAGE_C2C_INSTANT_RECEIVED, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xc.MESSAGE_GROUP_INSTANT_RECEIVED, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xc.MESSAGE_GROUP_SYSTEM_NOTICE_RECEIVED, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xc.GROUP_LIST_UPDATED, this._onUpdateConversationGroupProfile, this), this.tim.innerEmitter.on(Xc.PROFILE_UPDATED, this._onUpdateConversationUserProfile, this);} }, { key: "_onUpdateConversationGroupProfile", value: function value(e) {var t = this;this.hasLocalConversationList || (this.tempGroupList = e), e.forEach(function (e) {var n = "GROUP".concat(e.groupID);if (t.conversationMap.has(n)) {var r = t.conversationMap.get(n);r.groupProfile = e, r.lastMessage.lastSequence = e.nextMessageSeq - 1, r.subType || (r.subType = e.type);}}), this._emitConversationUpdate(1, 0);} }, { key: "_onUpdateConversationUserProfile", value: function value(e) {var t = this;e.data.forEach(function (e) {var n = "C2C".concat(e.userID);t.conversationMap.has(n) && (t.conversationMap.get(n).userProfile = e);}), this._emitConversationUpdate(1, 0);} }, { key: "_handleSyncMessages", value: function value(e) {this._onSendOrReceiveMessage(e, 1);} }, { key: "_onSendOrReceiveMessage", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,r = e.data.eventDataList;this._isReady ? 0 !== r.length && (this._updateLocalConversationList(r, 0, n), this._setStorageConversationList(), this._emitConversationUpdate()) : this.ready(function () {t._onSendOrReceiveMessage(e, n);});} }, { key: "_updateLocalConversationList", value: function value(e, t, n) {var r;r = this._updateTempConversations(e, t, n), this.conversationMap = new Map(this._sortConversations([].concat(yn(r.conversations), yn(this.conversationMap)))), t || this._updateUserOrGroupProfile(r.newerConversations);} }, { key: "_updateTempConversations", value: function value(e, t, n) {for (var r = [], o = [], i = 0, a = e.length; i < a; i++) {var s = new Hh(e[i]),u = this.conversationMap.get(s.conversationID);if (this.conversationMap.has(s.conversationID)) {var c = ["unreadCount", "allowType", "adminForbidType", "payload"];n && c.push("lastMessage"), Ss(u, s, c, [null, void 0, "", 0, NaN]), u.unreadCount = this._updateUnreadCount(u, s, t), n || (u.lastMessage.payload = e[i].lastMessage.payload), this.conversationMap.delete(u.conversationID), r.push([u.conversationID, u]);} else o.push(s), r.push([s.conversationID, s]);}return { conversations: r, newerConversations: o };} }, { key: "_updateUnreadCount", value: function value(e, t, n) {if ([Xt.GRP_CHATROOM, Xt.GRP_AVCHATROOM].includes(e.subType)) return 0;if (n) {if (e.type === Xt.CONV_C2C) return e.unreadCount;if (e.type === Xt.CONV_GROUP) return t.unreadCount;}return t.unreadCount + e.unreadCount;} }, { key: "_sortConversations", value: function value(e) {return e.sort(function (e, t) {return t[1].lastMessage.lastTime - e[1].lastMessage.lastTime;});} }, { key: "_updateUserOrGroupProfile", value: function value(e) {var t = this;if (0 !== e.length) {var n = [],r = [];e.forEach(function (e) {if (e.type === Xt.CONV_C2C) n.push(e.toAccount);else if (e.type === Xt.CONV_GROUP) {var o = e.toAccount;t.tim.groupController.hasLocalGroup(o) ? e.groupProfile = t.tim.groupController.getLocalGroupProfile(o) : r.push(o);}}), n.length > 0 && this.tim.getUserProfile({ userIDList: n }).then(function (e) {var n = e.data;hs(n) ? n.forEach(function (e) {t.conversationMap.get("C2C".concat(e.userID)).userProfile = e;}) : t.conversationMap.get("C2C".concat(n.userID)).userProfile = n;}), r.length > 0 && this.tim.groupController.getGroupProfileAdvance({ groupIDList: r, responseFilter: { groupBaseInfoFilter: ["Type", "Name", "FaceUrl"] } }).then(function (e) {e.data.successGroupList.forEach(function (e) {var n = "GROUP".concat(e.groupID);if (t.conversationMap.has(n)) {var r = t.conversationMap.get(n);Ss(r.groupProfile, e, [], [null, void 0, "", 0, NaN]), !r.subType && e.type && (r.subType = e.type);}});});}} }, { key: "_updateUserOrGroupProfileCompletely", value: function value(e) {var t = this;return e.type === Xt.CONV_C2C ? this.tim.getUserProfile({ userIDList: [e.toAccount] }).then(function (n) {var r = n.data;return 0 === r.length ? wl(new jc({ code: xc.USER_OR_GROUP_NOT_FOUND, message: qc.USER_OR_GROUP_NOT_FOUND })) : (e.userProfile = r[0], e._isInfoCompleted = 1, t._unshiftConversation(e), kl({ conversation: e }));}) : this.tim.getGroupProfile({ groupID: e.toAccount }).then(function (n) {return e.groupProfile = n.data.group, e._isInfoCompleted = 1, t._unshiftConversation(e), kl({ conversation: e });});} }, { key: "_unshiftConversation", value: function value(e) {e instanceof Hh && !this.conversationMap.has(e.conversationID) && (this.conversationMap = new Map([[e.conversationID, e]].concat(yn(this.conversationMap))), this._setStorageConversationList(), this._emitConversationUpdate(1, 0));} }, { key: "_deleteLocalConversation", value: function value(e) {return this.conversationMap.delete(e), this._setStorageConversationList(), this.tim.innerEmitter.emit(Xc.CONVERSATION_DELETED, e), this._emitConversationUpdate(1, 0), this.conversationMap.has(e);} }, { key: "_getConversationOptions", value: function value(e) {var t = [],n = e.map(function (e) {if (1 === e.type) {var n = { userID: e.userID, nick: e.c2CNick, avatar: e.c2CImage };return t.push(n), { conversationID: "C2C".concat(e.userID), type: "C2C", lastMessage: { lastTime: e.time, lastSequence: e.sequence, fromAccount: e.lastC2CMsgFromAccount, messageForShow: e.messageShow, type: e.lastMsg.elements[0] ? e.lastMsg.elements[0].type : null, payload: e.lastMsg.elements[0] ? e.lastMsg.elements[0].content : null }, userProfile: new sh(n) };}return { conversationID: "GROUP".concat(e.groupID), type: "GROUP", lastMessage: { lastTime: e.time, lastSequence: e.messageReadSeq + e.unreadCount, fromAccount: e.msgGroupFromAccount, messageForShow: e.messageShow, type: e.lastMsg.elements[0] ? e.lastMsg.elements[0].type : null, payload: e.lastMsg.elements[0] ? e.lastMsg.elements[0].content : null }, groupProfile: new qh({ groupID: e.groupID, name: e.groupNick, avatar: e.groupImage }), unreadCount: e.unreadCount };});return t.length > 0 && this.tim.innerEmitter.emit(Xc.CONVERSATION_LIST_PROFILE_UPDATED, { data: t }), n;} }, { key: "_emitConversationUpdate", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,n = yn(this.conversationMap.values());t && this.tim.innerEmitter.emit(Xc.CONVERSATION_LIST_UPDATED, n), e && this.tim.outerEmitter.emit(Wt.CONVERSATION_LIST_UPDATED, n);} }, { key: "_conversationMapTreeShaking", value: function value(e) {var t = this,n = new Map(yn(this.conversationMap));e.forEach(function (e) {return n.delete(e.conversationID);}), n.has(Xt.CONV_SYSTEM) && n.delete(Xt.CONV_SYSTEM);var r = this.tim.groupController.getJoinedAVChatRoom();r && n.delete("".concat(Xt.CONV_GROUP).concat(r.groupID)), yn(n.keys()).forEach(function (e) {return t.conversationMap.delete(e);});} }, { key: "reset", value: function value() {this.conversationMap.clear(), this.hasLocalConversationList = 0, this.resetReady(), this.tim.innerEmitter.once(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._initLocalConversationList, this);} }]), t;}(),Kh = je.find,Yh = 1;"find" in [] && Array(1).find(function () {Yh = 0;}), De({ target: "Array", proto: 1, forced: Yh }, { find: function find(e) {return Kh(this, e, arguments.length > 1 ? arguments[1] : void 0);} }), Ir("find");var zh = function () {function e(t) {if (on(this, e), void 0 === t) throw new jc({ code: xc.MESSAGE_LIST_CONSTRUCTOR_NEED_OPTIONS, message: qc.MESSAGE_LIST_CONSTRUCTOR_NEED_OPTIONS });if (void 0 === t.tim) throw new jc({ code: xc.MESSAGE_LIST_CONSTRUCTOR_NEED_OPTIONS, message: "".concat(qc.MESSAGE_LIST_CONSTRUCTOR_NEED_OPTIONS, ".tim") });this.list = new Map(), this.tim = t.tim, this._initializeOptions(t);}return sn(e, [{ key: "getLocalOldestMessageByConversationID", value: function value(e) {if (!e) return null;if (!this.list.has(e)) return null;var t = this.list.get(e).values();return t ? t.next().value : null;} }, { key: "_initializeOptions", value: function value(e) {this.options = {};var t = { memory: { maxDatasPerKey: 100, maxBytesPerData: 256, maxKeys: 0 }, cache: { maxDatasPerKey: 10, maxBytesPerData: 256, maxKeys: 0 } };for (var n in t) {if (Object.prototype.hasOwnProperty.call(t, n)) {if (void 0 === e[n]) {this.options[n] = t[n];continue;}var r = t[n];for (var o in r) {if (Object.prototype.hasOwnProperty.call(r, o)) {if (void 0 === e[n][o]) {this.options[n][o] = r[o];continue;}this.options[n][o] = e[n][o];}}}}} }, { key: "_parseMessageFormLikeKeyValue", value: function value(e) {return [e.conversationID, e];} }, { key: "pushIn", value: function value(e) {var t = this._parseMessageFormLikeKeyValue(e),n = 0;return void 0 === this.list.get(t[0]) && this.list.set(t[0], new Map()), this.list.has(e.conversationID) && this.list.get(e.conversationID).has(t[1].ID) && (n = 1), this.list.get(t[0]).set(t[1].ID, t[1]), n ? null : e;} }, { key: "shiftIn", value: function value(e) {Array.isArray(e) ? 0 !== e.length && this._shiftInMultipleMessages(e) : this._shiftSingleMessage(e);} }, { key: "_shiftSingleMessage", value: function value(e) {var t = this._parseMessageFormLikeKeyValue(e);if (void 0 === this.list.get(t[0])) return this.list.set(t[0], new Map()), void this.list.get(t[0]).set(t[1].ID, t[1]);var n = Array.from(this.list.get(t[0]));n.unshift([t[1].ID, t[1]]), this.list.set(t[0], new Map(n));} }, { key: "_shiftInMultipleMessages", value: function value(e) {for (var t = e.length, n = [], r = e[0].conversationID, o = this.list.has(r) ? Array.from(this.list.get(r)) : [], i = 0; i < t; i++) {n.push([e[i].ID, e[i]]);}this.list.set(r, new Map(n.concat(o)));} }, { key: "remove", value: function value(e) {var t = e.conversationID,n = e.ID;this.list.get(t).delete(n);} }, { key: "removeByConversationID", value: function value(e) {this.list.has(e) && this.list.delete(e);} }, { key: "hasLocalMessageList", value: function value(e) {return this.list.has(e);} }, { key: "getLocalMessageList", value: function value(e) {return this.hasLocalMessageList(e) ? yn(this.list.get(e).values()) : [];} }, { key: "hasLocalMessage", value: function value(e, t) {return this.hasLocalMessageList(e) ? this.list.get(e).has(t) : 0;} }, { key: "getLocalMessage", value: function value(e, t) {return this.hasLocalMessage(e, t) ? this.list.get(e).get(t) : null;} }, { key: "reset", value: function value() {this.list.clear();} }]), e;}(),Wh = function () {function e(t) {on(this, e), this.tim = t;}return sn(e, [{ key: "setMessageRead", value: function value(e) {var t = e.conversationID,n = e.messageID,r = this.tim.conversationController.getLocalConversation(t);if (!r || 0 === r.unreadCount) return kl();var o = n ? this.tim.messageController.getLocalMessage(t, n) : null;switch (r.type) {case Xt.CONV_C2C:return this._setC2CMessageRead({ conversationID: t, lastMessageTime: o ? o.time : r.lastMessage.lastTime });case Xt.CONV_GROUP:return this._setGroupMessageRead({ conversationID: t, lastMessageSeq: o ? o.sequence : r.lastMessage.lastSequence });case Xt.CONV_SYSTEM:return r.unreadCount = 0, kl();default:return kl();}} }, { key: "_setC2CMessageRead", value: function value(e) {var t = this,n = e.conversationID,r = e.lastMessageTime,o = this.tim.messageController.createPackage({ name: "conversation", action: "setC2CMessageRead", param: { C2CMsgReaded: { cookie: "", C2CMsgReadedItem: [{ toAccount: n.replace("C2C", ""), lastMessageTime: r }] } } });return this._updateIsReadAfterReadReport({ conversationID: n, lastMessageTime: r }), this._updateUnreadCount(n), this.tim.connectionController.request(o).then(function () {return new Rl();}).catch(function (e) {return t.tim.innerEmitter.emit(Xc.ERROR_DETECTED, e), Promise.reject(new Rl(e));});} }, { key: "_setGroupMessageRead", value: function value(e) {var t = this,n = e.conversationID,r = e.lastMessageSeq,o = this.tim.messageController.createPackage({ name: "conversation", action: "setGroupMessageRead", param: { groupID: n.replace("GROUP", ""), messageReadSeq: r } });return this._updateIsReadAfterReadReport({ conversationID: n, lastMessageSeq: r }), this._updateUnreadCount(n), this.tim.connectionController.request(o).then(function () {return new Rl();}).catch(function (e) {return t.tim.innerEmitter.emit(Xc.ERROR_DETECTED, e), Promise.reject(new Rl(e));});} }, { key: "_updateUnreadCount", value: function value(e) {var t = this.tim,n = t.conversationController,r = t.messageController,o = n.getLocalConversation(e),i = r.getLocalMessageList(e);o && (o.unreadCount = i.filter(function (e) {return !e.isRead;}).length);} }, { key: "_updateIsReadAfterReadReport", value: function value(e) {var t = e.conversationID,n = e.lastMessageSeq,r = e.lastMessageTime,o = this.tim.messageController.getLocalMessageList(t);if (0 !== o.length) for (var i = o.length - 1; i >= 0; i--) {var a = o[i];if (!(r && a.time > r || n && a.sequence > n)) {if ("in" === a.flow && a.isRead) break;a.isRead = 1;}}} }, { key: "updateIsRead", value: function value(e) {var t = this.tim,n = t.conversationController,r = t.messageController,o = n.getLocalConversation(e),i = r.getLocalMessageList(e);if (o && 0 !== i.length && [Xt.CONV_C2C, Xt.CONV_GROUP].includes(o.type)) for (var a = 0; a < i.length - o.unreadCount && !i[a].isRead; a++) {i[a].isRead = 1;}} }]), e;}(),Xh = je.findIndex,Jh = 1;"findIndex" in [] && Array(1).findIndex(function () {Jh = 0;}), De({ target: "Array", proto: 1, forced: Jh }, { findIndex: function findIndex(e) {return Xh(this, e, arguments.length > 1 ? arguments[1] : void 0);} }), Ir("findIndex");var Qh = function () {function e(t) {var n = t.tim,r = t.messageController;on(this, e), this.tim = n, this.messageController = r, this.completedMap = new Map(), this._initListener();}return sn(e, [{ key: "getMessageList", value: function value(e) {var t = this,n = e.conversationID,r = e.nextReqMessageID,o = e.count;(gs(o) || o > 15) && (o = 15);var i = this._computeLeftCount({ conversationID: n, nextReqMessageID: r });return this._needGetHistory({ conversationID: n, leftCount: i, count: o }) ? this.messageController.getHistoryMessages({ conversationID: n, count: 20 }).then(function () {return i = t._computeLeftCount({ conversationID: n, nextReqMessageID: r }), new Rl(t._computeResult({ conversationID: n, nextReqMessageID: r, count: o, leftCount: i }));}) : kl(this._computeResult({ conversationID: n, nextReqMessageID: r, count: o, leftCount: i }));} }, { key: "setCompleted", value: function value(e) {this.completedMap.set(e, 1);} }, { key: "deleteCompletedItem", value: function value(e) {this.completedMap.delete(e);} }, { key: "_initListener", value: function value() {var e = this;this.tim.innerEmitter.on(Xc.SDK_READY, function () {e.completedMap.set(Xt.CONV_SYSTEM, 1);}), this.tim.innerEmitter.on(Xc.AVCHATROOM_JOIN_SUCCESS, function (t) {var n = t.data;e.completedMap.set("".concat(Xt.CONV_GROUP).concat(n), 1);});} }, { key: "_getMessageListSize", value: function value(e) {return this.messageController.getLocalMessageList(e).length;} }, { key: "_needGetHistory", value: function value(e) {var t = e.conversationID,n = e.leftCount,r = e.count,o = this.tim.conversationController.getLocalConversation(t),i = o ? o.type === Xt.CONV_SYSTEM : 0,a = o ? o.subType === Xt.GRP_AVCHATROOM : 0;return i || a ? 0 : n < r && !this.completedMap.has(t);} }, { key: "_computeResult", value: function value(e) {var t = e.conversationID,n = e.nextReqMessageID,r = e.count,o = e.leftCount,i = this._computeMessageList({ conversationID: t, nextReqMessageID: n, count: r }),a = this._computeIsCompleted({ conversationID: t, leftCount: o, count: r });return { messageList: i, nextReqMessageID: this._computeNextReqMessageID({ messageList: i, isCompleted: a, conversationID: t }), isCompleted: a };} }, { key: "_computeNextReqMessageID", value: function value(e) {var t = e.messageList,n = e.isCompleted,r = e.conversationID;if (!n) return 0 === t.length ? "" : t[0].ID;var o = this.messageController.getLocalMessageList(r);return 0 === o.length ? "" : o[0].ID;} }, { key: "_computeMessageList", value: function value(e) {var t = e.conversationID,n = e.nextReqMessageID,r = e.count,o = this.messageController.getLocalMessageList(t),i = this._computeIndexEnd({ nextReqMessageID: n, messageList: o }),a = this._computeIndexStart({ indexEnd: i, count: r });return o.slice(a, i);} }, { key: "_computeIndexEnd", value: function value(e) {var t = e.messageList,n = void 0 === t ? [] : t,r = e.nextReqMessageID;return r ? n.findIndex(function (e) {return e.ID === r;}) : n.length;} }, { key: "_computeIndexStart", value: function value(e) {var t = e.indexEnd,n = e.count;return t > n ? t - n : 0;} }, { key: "_computeLeftCount", value: function value(e) {var t = e.conversationID,n = e.nextReqMessageID;return n ? this.messageController.getLocalMessageList(t).findIndex(function (e) {return e.ID === n;}) : this._getMessageListSize(t);} }, { key: "_computeIsCompleted", value: function value(e) {var t = e.conversationID;return e.leftCount <= e.count && this.completedMap.has(t) ? 1 : 0;} }, { key: "reset", value: function value() {this.completedMap.clear();} }]), e;}(),Zh = Math.floor;De({ target: "Number", stat: 1 }, { isInteger: function isInteger(e) {return !E(e) && isFinite(e) && Zh(e) === e;} });var $h = function () {function e(t, n) {on(this, e), this.options = n || { enablePointer: 1 }, this.taskName = t || ["task", this._timeFormat()].join("-"), this.pointsList = [], this.reportText = "", this.gapChar = "…", this.currentTask = "";}return sn(e, [{ key: "dot", value: function value(e) {if ("string" == typeof e) {if (0 !== e.length) {var t = Date.now();this.pointsList.push({ pointerName: e, time: t });} else is.error("PointerTask.dot(pointerName), need param: pointerName");} else is.error("PointerTask.dot(pointerName), pointerName must be string");} }, { key: "_analisys", value: function value() {for (var e = this.pointsList, t = e.length, n = [], r = [], o = 0; o < t; o++) {0 !== o && (r = this._analisysTowPoints(e[o - 1], e[o]), n.push(r.join("")));}return r = this._analisysTowPoints(e[0], e[t - 1], 1), n.push(r.join("")), n.join("");} }, { key: "_analisysTowPoints", value: function value(e, t) {var n = (t.time - e.time).toString();return ["(", e.pointerName, ")->(", t.pointerName, ")=", n, "ms;"];} }, { key: "report", value: function value() {0 != this.options.enablePointer && is.log(this.reportString());} }, { key: "reportString", value: function value() {return 1 == !!this.reportText ? this.reportText : 0 === this.pointsList.length ? "" : (this.reportText = "".concat(this.taskName, " report：").concat(this._analisys()), this.reportText);} }, { key: "_timeFormat", value: function value() {var e = new Date(),t = this.zeroFix(e.getMonth() + 1, 2),n = this.zeroFix(e.getDate(), 2);return "".concat(t, "-").concat(n, " ").concat(e.getHours(), ":").concat(e.getSeconds(), ":").concat(e.getMinutes(), ".").concat(e.getMilliseconds());} }, { key: "zeroFix", value: function value(e, t) {return Number.isInteger(t) ? t < 0 ? (is.error('PointerTask.zeroFix(num, length); param "length" must greater then zero'), "") : ("000000000" + e).slice(t = 1 + ~t) : (is.error('PointerTask.zeroFix(num, length); param "length" should be an integer'), "");} }]), e;}(),eg = function eg(e, t) {return new $h(e, t);},tg = function e(t) {on(this, e), this.value = t, this.next = null;},ng = function () {function e(t) {on(this, e), this.MAX_LENGTH = t, this.pTail = null, this.pNodeToDel = null, this.map = new Map(), is.log("SinglyLinkedList init MAX_LENGTH=".concat(this.MAX_LENGTH));}return sn(e, [{ key: "pushIn", value: function value(e) {var t = new tg(e);if (this.map.size < this.MAX_LENGTH) null === this.pTail ? (this.pTail = t, this.pNodeToDel = t) : (this.pTail.next = t, this.pTail = t), this.map.set(e, 1);else {var n = this.pNodeToDel;this.pNodeToDel = this.pNodeToDel.next, this.map.delete(n.value), n.next = null, n = null, this.pTail.next = t, this.pTail = t, this.map.set(e, 1);}} }, { key: "has", value: function value(e) {return this.map.has(e);} }, { key: "reset", value: function value() {for (var e; null !== this.pNodeToDel;) {e = this.pNodeToDel, this.pNodeToDel = this.pNodeToDel.next, e.next = null, e = null;}this.pTail = null, this.map.clear();} }]), e;}(),rg = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e)))._initializeMembers(), n._initializeListener(), n._initialzeHandlers(), n;}return pn(t, sl), sn(t, [{ key: "_initializeMembers", value: function value() {this.messagesList = new zh({ tim: this.tim }), this.currentMessageKey = {}, this.singlyLinkedList = new ng(100);} }, { key: "_initialzeHandlers", value: function value() {this.readReportHandler = new Wh(this.tim), this.getMessageHandler = new Qh({ messageController: this, tim: this.tim });} }, { key: "reset", value: function value() {this.messagesList.reset(), this.currentMessageKey = {}, this.getMessageHandler.reset(), this.singlyLinkedList.reset();} }, { key: "_initializeListener", value: function value() {var e = this.tim.innerEmitter;e.on(Xc.NOTICE_LONGPOLL_NEW_C2C_NOTICE, this._onReceiveC2CMessage, this), e.on(Xc.SYNC_MESSAGE_C2C_PROCESSING, this._onSyncMessagesProcessing, this), e.on(Xc.SYNC_MESSAGE_C2C_FINISHED, this._onSyncMessagesFinished, this), e.on(Xc.NOTICE_LONGPOLL_NEW_GROUP_MESSAGES, this._onReceiveGroupMessage, this), e.on(Xc.NOTICE_LONGPOLL_NEW_GROUP_TIPS, this._onReceiveGroupTips, this), e.on(Xc.NOTICE_LONGPOLL_NEW_GROUP_NOTICE, this._onReceiveSystemNotice, this), e.on(Xc.CONVERSATION_DELETED, this._clearConversationMessages, this);} }, { key: "sendMessageInstance", value: function value(e) {var t = this,n = eg("MessageController.sendMessageInstance(), ".concat(e.ID), this.tim.options),r = this.tim.innerEmitter;if (1 == e.isError()) {n.dot("message error"), n.report();var o = e.getIMError();return this._onSendMessageFailed(e, o), wl(o);}if (0 == e.isSendable()) {n.dot("message unsendable"), n.report();var i = new jc({ code: xc.MESSAGE_FILE_IS_EMPTY, message: qc.MESSAGE_FILE_IS_EMPTY });return this._onSendMessageFailed(e, i), wl(i);}var a = null,s = null;switch (n.dot("innerEmitter ".concat(Xc.MESSAGE_SENDING)), r.emit(Xc.MESSAGE_SENDING, { data: { eventDataList: [{ conversationID: e.conversationID, unreadCount: 0, type: e.conversationType, subType: e.conversationSubType, lastMessage: e }] } }), n.dot("init handles ".concat(e.conversationType)), e.conversationType) {case Xt.CONV_C2C:a = this._createC2CMessagePack(e), s = this._handleOnSendC2CMessageSuccess.bind(this);break;case Xt.CONV_GROUP:a = this._createGroupMessagePack(e), s = this._handleOnSendGroupMessageSuccess.bind(this);break;default:return n.dot("error ".concat(e.conversationType)), n.report(), wl(new jc({ code: xc.MESSAGE_SEND_INVALID_CONVERSATION_TYPE, message: qc.MESSAGE_SEND_INVALID_CONVERSATION_TYPE }));}return this.singlyLinkedList.pushIn(e.random), this.tim.connectionController.request(a).then(function (r) {return n.dot("send success"), e.conversationType === Xt.CONV_GROUP && (n.dot("updateID"), e.sequence = r.data.sequence, e.time = r.data.time, e.generateMessageID(t.tim.context.identifier)), n.dot("pushIn"), t.messagesList.pushIn(e), s(e, r.data), n.report(), new Rl({ message: e });}).catch(function (r) {return t._onSendMessageFailed(e, r), n.dot("send fail"), is.error("MessageController.sendMessageInstance() error:", r), n.report(), wl(new jc({ code: xc.MESSAGE_SEND_FAIL, message: qc.MESSAGE_SEND_FAIL, data: { message: e } }));});} }, { key: "resendMessage", value: function value(e) {return 1 == this._isFileLikeMessage(e) ? (is.warn("MessageController.resendMessage(), file like message can not resendBy SDK.resendMessage()"), wl(new jc({ code: xc.MESSAGE_RESEND_FILE_UNSUPPORTED, message: qc.MESSAGE_RESEND_FILE_UNSUPPORTED }))) : (e.isResend = 1, e.status = ll.MESSAGE_STATUS.UNSEND, this.sendMessageInstance(e));} }, { key: "_isFileLikeMessage", value: function value(e) {return [Xt.MSG_IMAGE, Xt.MSG_FILE, Xt.MSG_AUDIO, Xt.MSG_VIDEO].indexOf(e.type) >= 0 ? 1 : 0;} }, { key: "_resendBinaryTypeMessage", value: function value() {} }, { key: "_createC2CMessagePack", value: function value(e) {return this.createPackage({ name: "c2cMessage", action: "create", param: { toAccount: e.to, msgBody: e.getElements(), msgSeq: e.sequence, msgRandom: e.random, offlinePushInfo: { desc: "offline message push", ext: "offline message push" } } });} }, { key: "_handleOnSendC2CMessageSuccess", value: function value(e, t) {var n = this.tim,r = n.innerEmitter,o = n.outerEmitter;e.status = ll.MESSAGE_STATUS.SUCCESS, e.time = t.time, r.emit(Xc.MESSAGE_C2C_SEND_SUCCESS, { data: { eventDataList: [{ conversationID: e.conversationID, unreadCount: 0, type: e.conversationType, subType: e.conversationSubType, lastMessage: e }] } }), o.emit(Wt.MESSAGE_SEND_SUCCESS, e);} }, { key: "_createGroupMessagePack", value: function value(e) {return this.createPackage({ name: "groupMessage", action: "create", param: { groupID: e.to, msgBody: e.getElements(), random: e.random, clientSequence: e.clientSequence, offlinePushInfo: { desc: "offline message push", ext: "offline message push" } } });} }, { key: "_handleOnSendGroupMessageSuccess", value: function value(e, t) {var n = this.tim,r = n.innerEmitter,o = n.outerEmitter;e.sequence = t.sequence, e.time = t.time, e.status = ll.MESSAGE_STATUS.SUCCESS, r.emit(Xc.MESSAGE_GROUP_SEND_SUCCESS, { data: { eventDataList: [{ conversationID: e.conversationID, unreadCount: 0, type: e.conversationType, subType: e.conversationSubType, lastMessage: e }] } }), o.emit(Wt.MESSAGE_SEND_SUCCESS, e);} }, { key: "_onSendMessageFailed", value: function value(e, t) {var n = this.tim,r = n.innerEmitter,o = n.outerEmitter;e.status = ll.MESSAGE_STATUS.FAIL, r.emit(Xc.ERROR_DETECTED, t), o.emit(Wt.MESSAGE_SEND_FAIL, e);} }, { key: "_onReceiveC2CMessage", value: function value(e) {var t = this.tim,n = t.innerEmitter,r = t.outerEmitter;is.log("MessageController._onReceiveC2CMessage(), get new messages");var o = this._newC2CMessageStoredAndSummary({ notifiesList: e.data, type: Xt.CONV_C2C, C2CRemainingUnreadList: e.C2CRemainingUnreadList }),i = o.eventDataList,a = o.result;n.emit(Xc.MESSAGE_C2C_INSTANT_RECEIVED, { data: { eventDataList: i, result: a }, resource: this }), a.length > 0 && r.emit(Wt.MESSAGE_RECEIVED, a);} }, { key: "_onReceiveGroupMessage", value: function value(e) {var t = this.tim,n = t.outerEmitter,r = t.innerEmitter,o = this._newGroupMessageStoredAndSummary(e.data),i = o.eventDataList,a = o.result;i.length > 0 && (is.log("MessageController._onReceiveGroupMessage()"), r.emit(Xc.MESSAGE_GROUP_INSTANT_RECEIVED, { data: { eventDataList: i, result: a, isGroupTip: 0 } })), a.length > 0 && n.emit(Wt.MESSAGE_RECEIVED, a);} }, { key: "_onReceiveGroupTips", value: function value(e) {var t = this.tim,n = t.outerEmitter,r = t.innerEmitter,o = e.data,i = this._newGroupTipsStoredAndSummary(o, Xt.CONV_GROUP),a = i.eventDataList,s = i.result;is.log("MessageController._onReceiveGroupTips()"), r.emit(Xc.MESSAGE_GROUP_INSTANT_RECEIVED, { data: { eventDataList: a, result: s, isGroupTip: 1 } }), s.length > 0 && n.emit(Wt.MESSAGE_RECEIVED, s);} }, { key: "_onReceiveSystemNotice", value: function value(e) {var t = this.tim,n = t.outerEmitter,r = t.innerEmitter,o = e.data,i = o.groupSystemNotices,a = o.type,s = this._newSystemNoticeStoredAndSummary({ notifiesList: i, type: a }),u = s.eventDataList,c = s.result;r.emit(Xc.MESSAGE_GROUP_SYSTEM_NOTICE_RECEIVED, { data: { eventDataList: u, result: c, type: a } }), c.length > 0 && n.emit(Wt.MESSAGE_RECEIVED, c);} }, { key: "_clearConversationMessages", value: function value(e) {this.messagesList.removeByConversationID(e), this.getMessageHandler.deleteCompletedItem(e);} }, { key: "_pushIntoNoticeResult", value: function value(e, t) {var n = this.messagesList.pushIn(t),r = this.singlyLinkedList.has(t.random);null !== n && 0 == r && e.push(t);} }, { key: "_newC2CMessageStoredAndSummary", value: function value(e) {for (var t = e.notifiesList, n = e.type, r = e.C2CRemainingUnreadList, o = e.isFromSync, i = null, a = [], s = [], u = {}, c = 0, l = t.length; c < l; c++) {var p = t[c];p.currentUser = this.tim.context.identifier, p.conversationType = n, p.isSystemMessage = !!p.isSystemMessage, (i = new Fh(p)).setElement(p.elements), o || this._pushIntoNoticeResult(s, i), void 0 === u[i.conversationID] ? u[i.conversationID] = a.push({ conversationID: i.conversationID, unreadCount: "out" === i.flow ? 0 : 1, type: i.conversationType, subType: i.conversationSubType, lastMessage: i }) - 1 : (a[u[i.conversationID]].type = i.conversationType, a[u[i.conversationID]].subType = i.conversationSubType, a[u[i.conversationID]].lastMessage = i, "in" === i.flow && a[u[i.conversationID]].unreadCount++);}if (hs(r)) for (var f = function f(e, t) {var n = a.find(function (t) {return t.conversationID === "C2C".concat(r[e].from);});n && (n.unreadCount += r[e].count);}, h = 0, g = r.length; h < g; h++) {f(h);}return { eventDataList: a, result: s };} }, { key: "_newGroupMessageStoredAndSummary", value: function value(e) {for (var t = null, n = [], r = {}, o = [], i = Xt.CONV_GROUP, a = 0, s = e.length; a < s; a++) {var u = e[a];u.currentUser = this.tim.context.identifier, u.conversationType = i, u.isSystemMessage = !!u.isSystemMessage, (t = new Fh(u)).setElement(u.elements), this._pushIntoNoticeResult(o, t), void 0 === r[t.conversationID] ? r[t.conversationID] = n.push({ conversationID: t.conversationID, unreadCount: "out" === t.flow ? 0 : 1, type: t.conversationType, subType: t.conversationSubType, lastMessage: t }) - 1 : (n[r[t.conversationID]].type = t.conversationType, n[r[t.conversationID]].subType = t.conversationSubType, n[r[t.conversationID]].lastMessage = t, "in" === t.flow && n[r[t.conversationID]].unreadCount++);}return { eventDataList: n, result: o };} }, { key: "_newGroupTipsStoredAndSummary", value: function value(e, t) {for (var n = null, r = [], o = [], i = {}, a = 0, s = e.length; a < s; a++) {var u = e[a];u.currentUser = this.tim.context.identifier, u.conversationType = t, (n = new Fh(u)).setElement({ type: Xt.MSG_GRP_TIP, content: ln({}, u.elements, { groupProfile: u.groupProfile }) }), n.isSystemMessage = 0;var c = this.messagesList.pushIn(n);c && o.push(c), void 0 === i[n.conversationID] ? i[n.conversationID] = r.push({ conversationID: n.conversationID, unreadCount: "out" === n.flow ? 0 : 1, type: n.conversationType, subType: n.conversationSubType, lastMessage: n }) - 1 : (r[i[n.conversationID]].type = n.conversationType, r[i[n.conversationID]].subType = n.conversationSubType, r[i[n.conversationID]].lastMessage = n, "in" === n.flow && r[i[n.conversationID]].unreadCount++);}return { eventDataList: r, result: o };} }, { key: "_newSystemNoticeStoredAndSummary", value: function value(e) {var t = e.notifiesList,n = e.type,r = null,o = t.length,i = 0,a = [],s = { conversationID: Xt.CONV_SYSTEM, unreadCount: 0, type: Xt.CONV_SYSTEM, subType: null, lastMessage: null };for (i = 0; i < o; i++) {var u = t[i];if (u.elements.operationType !== Il) {u.currentUser = this.tim.context.identifier, u.conversationType = Xt.CONV_SYSTEM, u.conversationID = Xt.CONV_SYSTEM, (r = new Fh(u)).setElement({ type: Xt.MSG_GRP_SYS_NOTICE, content: ln({}, u.elements, { groupProfile: u.groupProfile }) }), r.isRead = 1, r.isSystemMessage = 1;var c = this.messagesList.pushIn(r);c && (a.push(c), "poll" === n && s.unreadCount++), s.subType = r.conversationSubType;}}return s.lastMessage = a[a.length - 1], { eventDataList: a.length > 0 ? [s] : [], result: a };} }, { key: "_onSyncMessagesProcessing", value: function value(e) {var t = this._newC2CMessageStoredAndSummary({ notifiesList: e.data, type: Xt.CONV_C2C, isFromSync: 1, C2CRemainingUnreadList: e.C2CRemainingUnreadList }),n = t.eventDataList,r = t.result;this.tim.innerEmitter.emit(Xc.MESSAGE_SYNC_PROCESSING, { data: { eventDataList: n, result: r }, resource: this });} }, { key: "_onSyncMessagesFinished", value: function value(e) {this.triggerReady();var t = this._newC2CMessageStoredAndSummary({ notifiesList: e.data, type: Xt.CONV_C2C, isFromSync: 1, C2CRemainingUnreadList: e.C2CRemainingUnreadList }),n = t.eventDataList,r = t.result;this.tim.innerEmitter.emit(Xc.MESSAGE_SYNC_FINISHED, { data: { eventDataList: n, result: r }, resource: this });} }, { key: "getHistoryMessages", value: function value(e) {if (e.conversationID === Xt.CONV_SYSTEM) return kl();!e.count && (e.count = 15), e.count > 20 && (e.count = 20);var t = this.messagesList.getLocalOldestMessageByConversationID(e.conversationID);t || ((t = {}).time = 0, t.sequence = 0, 0 === e.conversationID.indexOf(Xt.CONV_C2C) ? (t.to = e.conversationID.replace(Xt.CONV_C2C, ""), t.conversationType = Xt.CONV_C2C) : 0 === e.conversationID.indexOf(Xt.CONV_GROUP) && (t.to = e.conversationID.replace(Xt.CONV_GROUP, ""), t.conversationType = Xt.CONV_GROUP));var n = "";switch (t.conversationType) {case Xt.CONV_C2C:return n = e.conversationID.replace(Xt.CONV_C2C, ""), this.getC2CRoamMessages({ conversationID: e.conversationID, peerAccount: n, count: e.count, lastMessageTime: void 0 === this.currentMessageKey[e.conversationID] ? 0 : t.time });case Xt.CONV_GROUP:return this.getGroupRoamMessages({ conversationID: e.conversationID, groupID: t.to, count: e.count, sequence: t.sequence - 1 });default:return kl();}} }, { key: "getC2CRoamMessages", value: function value(e) {var t = this,n = this.tim,r = n.connectionController,o = n.innerEmitter,i = void 0 !== this.currentMessageKey[e.conversationID] ? this.currentMessageKey[e.conversationID] : "",a = this.createPackage({ name: "c2cMessage", action: "query", param: { peerAccount: e.peerAccount, count: e.count || 15, lastMessageTime: e.lastMessageTime || 0, messageKey: i } });return r.request(a).then(function (n) {var r = n.data,o = r.complete,i = r.messageList;1 === o && t.getMessageHandler.setCompleted(e.conversationID);var a = t._roamMessageStore(i, Xt.CONV_C2C, e.conversationID);return t.readReportHandler.updateIsRead(e.conversationID), t.currentMessageKey[e.conversationID] = n.data.messageKey, a;}).catch(function (e) {return o.emit(Xc.ERROR_DETECTED, e), Promise.reject(e);});} }, { key: "getC2CRoamMessagesSliced", value: function value(e) {var t = this.tim.connectionController,n = this;return function (e) {return new Promise(function (r, o) {!function e(r, o, i) {var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [],s = n.createPackage({ name: "c2cMessage", action: "query", param: { peerAccount: r.peerAccount, count: r.count || 15, lastMessageTime: r.lastMessageTime || 0, messageKey: r.messageKey || "" } }),u = t.request(s).then(function (t) {var s = t.data.messageList,u = n._roamMessageStore(s, Xt.CONV_C2C);a.push.apply(a, yn(u)), t.data.complete === ll.GET_HISTORY_MESSAGE_STATUS.C2C_IS_NOT_FINISHED ? (r.messageKey = t.data.messageKey, e(r, o, a)) : t.data.complete === ll.GET_HISTORY_MESSAGE_STATUS.C2C_IS_FINISHED ? (is.log("getC2CRoamMessages finised..."), o(new Rl(a))) : i(new jc({ code: xc.MESSAGE_UNKNOW_ROMA_LIST_END_FLAG_FIELD, message: qc.MESSAGE_UNKNOW_ROMA_LIST_END_FLAG_FIELD }));}).reject(function (e) {is.log("getC2CRoamMessages fail..."), i(e);});return u;}(e, r, o, []);});}(e);} }, { key: "getGroupRoamMessages", value: function value(e) {var t = this,n = this.tim,r = n.connectionController,o = n.groupController,i = e.sequence >= 0 ? e.sequence : o.getLocalGroupLastSequence(e.groupID);if (i < 0) return kl([]);var a = this.createPackage({ name: "groupMessage", action: "query", param: { groupID: e.groupID, count: e.count, sequence: i } });return r.request(a).then(function (n) {var r = n.data.messagesList,o = "GROUP".concat(e.groupID);Array.isArray(r) && r.length < e.count && t.getMessageHandler.setCompleted(o);var i = t._roamMessageStore(r, Xt.CONV_GROUP, o);return t.readReportHandler.updateIsRead(o), is.log("getGroupRoamMessages finished..."), i;}).catch(function (e) {return t.tim.exceptionController.ask(e), is.log("getGroupRoamMessages error..."), Promise.reject(e);});} }, { key: "_roamMessageStore", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],t = arguments.length > 1 ? arguments[1] : void 0,n = arguments.length > 2 ? arguments[2] : void 0,r = null,o = [],i = 0,a = e.length,s = null,u = t === Xt.CONV_GROUP,c = function c() {i = u ? e.length - 1 : 0, a = u ? 0 : e.length;},l = function l() {u ? --i : ++i;},p = function p() {return u ? i >= a : i < a;};for (u && 0 === e.length && this.getMessageHandler.setCompleted(n), c(); p(); l()) {0 !== e[i].elements.length || 0 !== e[i].time ? (u && 1 === e[i].sequence && this.getMessageHandler.setCompleted(n), (r = new Fh(e[i])).to = e[i].to, r.isSystemMessage = !!e[i].isSystemMessage, r.conversationType = t, s = e[i].event === fl.JSON.TYPE.GROUP.TIP ? { type: Xt.MSG_GRP_TIP, content: ln({}, e[i].elements, { groupProfile: e[i].groupProfile }) } : e[i].elements[0], r.setElement(s), r.reInitialize(this.tim.context.identifier), o.push(r)) : this.getMessageHandler.setCompleted(n);}return this.messagesList.shiftIn(o), c = l = p = null, o;} }, { key: "getLocalMessageList", value: function value(e) {return this.messagesList.getLocalMessageList(e);} }, { key: "getLocalMessage", value: function value(e, t) {return this.messagesList.getLocalMessage(e, t);} }, { key: "setMessageRead", value: function value(e) {var t = this;return new Promise(function (n, r) {t.ready(function () {t.readReportHandler.setMessageRead(e).then(n).catch(r);});});} }, { key: "getMessageList", value: function value(e) {return this.getMessageHandler.getMessageList(e);} }, { key: "createTextMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Fh(e),n = "string" == typeof e.payload ? e.payload : e.payload.text,r = new Ih({ text: n });return t.setElement(r), t;} }, { key: "createCustomMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Fh(e),n = new bh({ data: e.payload.data, description: e.payload.description, extension: e.payload.extension });return t.setElement(n), t;} }, { key: "createImageMessage", value: function value(e) {var t = this.tim.uploadController;e.currentUser = this.tim.context.identifier;var n = new Fh(e);if (Oa) {var r = e.payload.file,o = r.tempFilePaths[0],i = { url: o, name: o.slice(o.lastIndexOf("/") + 1), size: r.tempFiles[0].size, type: o.slice(o.lastIndexOf(".") + 1).toUpperCase() };e.payload.file = i;}var a = new Ch({ imageFormat: "UNKNOWN", uuid: this._generateUUID(), file: e.payload.file });return t.uploadImage({ file: e.payload.file, to: e.to, onProgress: function onProgress(t) {a.updatePercent.bind(a)(t), "function" == typeof e.onProgress && e.onProgress(t);} }).then(function (e) {var t,n = ["https://", e.location].join("");return a.updateImageFormat(e.fileType), a.updateImageInfoArray({ size: e.fileSize, url: n }), t = a._imageMemoryURL, Oa ? new Promise(function (e, n) {wx.getImageInfo({ src: t, success: function success(t) {e({ width: t.width, height: t.height });}, fail: function fail() {e({ width: 0, height: 0 });} });}) : ka && 9 === wa ? Promise.resolve({ width: 0, height: 0 }) : new Promise(function (e, n) {var r = new Image();r.onload = function () {e({ width: this.width, height: this.height }), r = null;}, r.onerror = function () {e({ width: 0, height: 0 }), r = null;}, r.src = t;});}).then(function (e) {0 !== e.width && 0 !== e.height && (is.log("MessageController.probeImageWidthHeight width=".concat(e.width, " height=").concat(e.height)), a.updateImageInfoArray({ width: e.width, height: e.height })), n.triggerOperated();}).catch(function (e) {n.status = ll.MESSAGE_STATUS.FAIL, is.warn("MessageController.createImageMessage(), error:", JSON.stringify(e));}), n.setElement(a), n;} }, { key: "createFileMessage", value: function value(e) {if (Oa) return wl({ code: xc.MESSAGE_FILE_WECHAT_MINIAPP_NOT_SUPPORT, message: qc.MESSAGE_FILE_WECHAT_MINIAPP_NOT_SUPPORT });var t = this.tim.uploadController;e.currentUser = this.tim.context.identifier;var n = new Fh(e),r = new wh({ uuid: this._generateUUID(), file: e.payload.file });return t.uploadFile({ file: e.payload.file, to: e.to, onProgress: function onProgress(t) {r.updatePercent.bind(r)(t), "function" == typeof e.onProgress && e.onProgress(t);} }).then(function (e) {var t = ["https://", e.location].join("");r.updateFileUrl(t), is.log("MessageController.createFileMessage(), file upload success, URL: ".concat(t)), n.triggerOperated();}).catch(function (e) {n.status = ll.MESSAGE_STATUS.FAIL, e.code === xc.MESSAGE_FILE_SIZE_LIMIT && n.setError(e.code, e.message), is.warn("MessageController.createFileMessage(), file upload fail, error response: ", e), n.triggerOperated();}), n.setElement(r), n;} }, { key: "createAudioMessage", value: function value(e) {if (Oa) {var t = this.tim.uploadController,n = e.payload.file;if (Oa) {var r = { url: n.tempFilePath, name: n.tempFilePath.slice(n.tempFilePath.lastIndexOf("/") + 1), size: n.fileSize, second: parseInt(n.duration) / 1e3, type: n.tempFilePath.slice(n.tempFilePath.lastIndexOf(".") + 1).toUpperCase() };e.payload.file = r;}e.currentUser = this.tim.context.identifier;var o = new Fh(e),i = new Mh({ second: Math.floor(n.duration / 1e3), size: n.fileSize, url: n.tempFilePath, uuid: this._generateUUID() });return t.uploadAudio({ file: e.payload.file, to: e.to }).then(function (e) {var t,n = -1 === (t = e.location).indexOf("http://") || -1 === t.indexOf("https://") ? "https://" + t : t.replace(/https|http/, "https");i.updateAudioUrl(n), o.triggerOperated();}).catch(function (e) {o.status = ll.MESSAGE_STATUS.FAIL, is.warn("MessageController.createAudioMessage(), error:", e), o.triggerOperated();}), o.setElement(i), o;}is.warn("createAudioMessage 目前只支持微信小程序发语音消息");} }, { key: "createFaceMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Fh(e),n = "string" == typeof e.payload ? e.payload : e.payload.text,r = new Ih({ text: n });return t.setElement(r), t;} }, { key: "_generateUUID", value: function value() {var e = this.tim.context;return "".concat(e.SDKAppID, "-").concat(e.identifier, "-").concat(function () {for (var e = "", t = 32; t > 0; --t) {e += Ms[Math.floor(Math.random() * Os)];}return e;}());} }]), t;}(),og = function () {function e(t) {on(this, e), this.userID = "", this.avatar = "", this.nick = "", this.role = "", this.joinTime = "", this.lastSendMsgTime = "", this.nameCard = "", this.muteUntil = 0, this.memberCustomField = [], this._initMember(t);}return sn(e, [{ key: "_initMember", value: function value(e) {this.updateMember(e);} }, { key: "updateMember", value: function value(e) {Ss(this, e, [], [null, void 0, "", 0, NaN]);} }, { key: "updateRole", value: function value(e) {["Owner", "Admin", "Member"].indexOf(e) < 0 || (this.role = e);} }, { key: "updateMemberCustomField", value: function value(e) {Ss(this.memberCustomField, e);} }]), e;}(),ig = function () {function e(t) {on(this, e), this.tim = t.tim, this.groupController = t.groupController, this._initListeners();}return sn(e, [{ key: "_initListeners", value: function value() {this.tim.innerEmitter.on(Xc.MESSAGE_GROUP_INSTANT_RECEIVED, this._onReceivedGroupTips, this);} }, { key: "_onReceivedGroupTips", value: function value(e) {var t = this,n = e.data,r = n.result;n.isGroupTip && r.forEach(function (e) {switch (e.payload.operationType) {case 1:t._onNewMemberComeIn(e);break;case 2:t._onMemberQuit(e);break;case 3:t._onMemberKickedOut(e);break;case 4:t._onMemberSetAdmin(e);break;case 5:t._onMemberCancelledAdmin(e);break;case 6:t._onGroupProfileModified(e);break;case 7:t._onMemberInfoModified(e);break;default:is.warn("GroupTipsHandler._onReceivedGroupTips Unhandled groupTips. operationType=", e.payload.operationType);}});} }, { key: "_onNewMemberComeIn", value: function value(e) {var t = 0,n = e.payload.groupProfile.groupID,r = e.payload.userIDList;if (this.groupController.hasLocalGroupMemberMap(n)) for (var o = 0; o < r.length; o++) {var i = r[0];if (!this.groupController.getLocalGroupMemberInfo(n, i)) {t = 1;break;}}t && this.groupController.updateGroupMemberList({ groupID: n });} }, { key: "_onMemberQuit", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController._deleteLocalGroupMembers(t, e.payload.userIDList);} }, { key: "_onMemberKickedOut", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController._deleteLocalGroupMembers(t, e.payload.userIDList);} }, { key: "_onMemberSetAdmin", value: function value(e) {var t = this,n = e.payload.groupProfile.groupID;e.payload.userIDList.forEach(function (e) {var r = t.groupController.getLocalGroupMemberInfo(n, e);r && r.updateRole(Xt.GRP_MBR_ROLE_ADMIN);});} }, { key: "_onMemberCancelledAdmin", value: function value(e) {var t = this,n = e.payload.groupProfile.groupID;e.payload.userIDList.forEach(function (e) {var r = t.groupController.getLocalGroupMemberInfo(n, e);r && r.updateRole(Xt.GRP_MBR_ROLE_MEMBER);});} }, { key: "_onGroupProfileModified", value: function value(e) {var t = this,n = e.payload.newGroupProfile,r = e.payload.groupProfile.groupID,o = this.groupController.getLocalGroupProfile(r);Object.keys(n).forEach(function (e) {switch (e) {case "ownerID":t._ownerChaged(o, n);break;default:o[e] = n[e];}}), this.groupController._emitGroupUpdate(1, 1);} }, { key: "_ownerChaged", value: function value(e, t) {var n = e.groupID,r = this.groupController.getLocalGroupProfile(n),o = this.tim.context.identifier;if (o === t.ownerID) {r.updateGroup({ selfInfo: { role: Xt.GRP_MBR_ROLE_OWNER } });var i = this.groupController.getLocalGroupMemberInfo(n, o),a = this.groupController.getLocalGroupProfile(n).ownerID,s = this.groupController.getLocalGroupMemberInfo(n, a);i && i.updateRole(Xt.GRP_MBR_ROLE_OWNER), s && s.updateRole(Xt.GRP_MBR_ROLE_MEMBER);}} }, { key: "_onMemberInfoModified", value: function value(e) {var t = this,n = e.payload.groupProfile.groupID;e.payload.msgMemberInfo.forEach(function (e) {var r = t.groupController.getLocalGroupMemberInfo(n, e.userAccount);r && e.shutupTime && (r.shutUpUntil = (Date.now() + 1e3 * e.shutupTime) / 1e3);});} }]), e;}(),ag = function () {function e(t) {on(this, e), this.groupController = t.groupController, this.tim = t.tim, this._initLiceners();}return sn(e, [{ key: "_initLiceners", value: function value() {this.tim.innerEmitter.on(Xc.MESSAGE_GROUP_SYSTEM_NOTICE_RECEIVED, this._onReceivedGroupSystemNotice, this);} }, { key: "_onReceivedGroupSystemNotice", value: function value(e) {var t = this,n = e.data,r = n.result;"sync" !== n.type && r.forEach(function (e) {switch (e.payload.operationType) {case 1:t._onApplyGroupRequest(e);break;case 2:t._onApplyGroupRequestAgreed(e);break;case 3:t._onApplyGroupRequestRefused(e);break;case 4:t._onMemberKicked(e);break;case 5:t._onGroupDismissed(e);break;case 6:break;case 7:t._onInviteGroup(e);break;case 8:t._onQuitGroup(e);break;case 9:t._onSetManager(e);break;case 10:t._onDeleteManager(e);break;case 11:case 12:case 15:break;case 255:t.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: Cl });}});} }, { key: "_onApplyGroupRequest", value: function value(e) {this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: hl });} }, { key: "_onApplyGroupRequestAgreed", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(t) || this.groupController.getGroupList(), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: gl });} }, { key: "_onApplyGroupRequestRefused", value: function value(e) {this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: dl });} }, { key: "_onMemberKicked", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(t) && (this.groupController._deleteLocalGroup(t), this.tim.conversationController._deleteLocalConversation("GROUP".concat(t))), this.groupController._emitGroupUpdate(1, 0), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: _l });} }, { key: "_onGroupDismissed", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController._deleteLocalGroup(t), this.tim.conversationController._deleteLocalConversation("GROUP".concat(t)), this.groupController._emitGroupUpdate(1, 0), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: ml });} }, { key: "_onInviteGroup", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(t) || this.groupController.getGroupList(), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: vl });} }, { key: "_onQuitGroup", value: function value(e) {var t = e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(t) && (this.groupController._deleteLocalGroup(t), this.tim.conversationController._deleteLocalConversation("GROUP".concat(t)), this.groupController._emitGroupUpdate(1, 0)), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: yl });} }, { key: "_onSetManager", value: function value(e) {var t = e.payload.groupProfile,n = t.to,r = t.groupID,o = this.groupController.getLocalGroupMemberInfo(r, n);o && o.updateRole(Xt.GRP_MBR_ROLE_ADMIN), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: El });} }, { key: "_onDeleteManager", value: function value(e) {var t = e.payload.groupProfile,n = t.to,r = t.groupID,o = this.groupController.getLocalGroupMemberInfo(r, n);o && o.updateRole(Xt.GRP_MBR_ROLE_MEMBER), this.tim.outerEmitter.emit(Wt.GROUP_SYSTEM_NOTICE_RECEIVED, { message: e, type: Sl });} }]), e;}(),sg = function () {function e(t) {var n = t.tim,r = t.groupController;on(this, e), this.tim = n, this.groupController = r, this.AVChatRoomLoop = null, this.key = "", this.startSeq = 1, this.errorCount = 0, this.group = {};}return sn(e, [{ key: "hasJoinedAVChatRoom", value: function value() {return this.group && !gs(this.group.groupID) ? 1 : 0;} }, { key: "checkJoinedAVChatRoomByID", value: function value(e) {return this.group || !gs(this.group.groupID) ? e === this.group.groupID : 0;} }, { key: "getJoinedAVChatRoom", value: function value() {return this.hasJoinedAVChatRoom() ? this.group : null;} }, { key: "_updateProperties", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {t[n] = e[n];});} }, { key: "start", value: function value() {var e = { key: this.key, startSeq: this.startSeq };if (null === this.AVChatRoomLoop) {var t = this.tim.notificationController.createPackage({ name: "AVChatRoom", action: "startLongPoll", param: e });this.AVChatRoomLoop = this.tim.connectionController.createRunLoop({ pack: t, before: this._updateRequestData.bind(this), success: this._handleSuccess.bind(this), fail: this._handleFailure.bind(this) }), this.AVChatRoomLoop.start();} else this.AVChatRoomLoop._stoped && this.AVChatRoomLoop.start();} }, { key: "stop", value: function value() {null === this.AVChatRoomLoop || this.AVChatRoomLoop._stoped || (this.AVChatRoomLoop.abort(), this.AVChatRoomLoop.stop(), this.group = {});} }, { key: "applyJoinAVChatRoom", value: function value(e) {return this._checkBeforeJoinGroup(e), this.tim.context.a2Key && this.tim.context.tinyID ? this._joinWithAuth(e) : this._joinWithoutAuth(e);} }, { key: "_joinWithAuth", value: function value(e) {var t = this;return this.groupController.applyJoinGroup(e).then(function (n) {return n.data.status === Xt.JOIN_STATUS_SUCCESS && (t.tim.innerEmitter.emit(Xc.AVCHATROOM_JOIN_SUCCESS, { data: e.groupID }), t._updateProperties({ key: n.data.longPollingKey, startSeq: 1, group: n.data.group || {} }), t.groupController._updateGroupMap([n.data.group]), t.groupController._emitGroupUpdate(1, 0), t.start()), n;}).catch(function (e) {return Promise.reject(e);});} }, { key: "_joinWithoutAuth", value: function value(e) {var t = this,n = this.groupController.createPackage({ name: "group", action: "applyJoinAVChatRoom", param: e });return this.tim.connectionController.request(n).then(function (n) {var r = n.data.longPollingKey;return is.log("AVChatRoomHandler.applyJoinAVChatRoom ok. groupID:", e.groupID), t.tim.innerEmitter.emit(Xc.AVCHATROOM_JOIN_SUCCESS, { data: e.groupID }), t._updateProperties({ key: r, startSeq: 1, group: t.groupController.getLocalGroupProfile(e.groupID) }), t.start(), new Rl({ status: cl.SUCCESS, group: t.groupController.getLocalGroupProfile(e.groupID) });}).catch(function (t) {return is.error("AVChatRoomHandler.applyJoinAVChatRoom error:".concat(t.message, ". groupID:").concat(e.groupID)), wl(t);});} }, { key: "_checkBeforeJoinGroup", value: function value(e) {if (this.hasJoinedAVChatRoom()) {if (e.groupID === this.group.groupID) return;this.group.selfInfo.role === Xt.GRP_MBR_ROLE_OWNER || this.group.ownerID === this.tim.loginInfo.identifier ? (this.groupController._deleteLocalGroup(this.group.groupID), this.tim.conversationController._deleteLocalConversation("GROUP".concat(this.group.groupID)), this.groupController._emitGroupUpdate(1, 0)) : this.groupController.quitGroup(this.group.groupID);}null !== this.AVChatRoomLoop && !this.AVChatRoomLoop._stoped && this.stop();} }, { key: "_updateRequestData", value: function value(e) {e.StartSeq = this.startSeq, e.Key = this.key;} }, { key: "_handleSuccess", value: function value(e) {this.startSeq = e.data.nextSeq, this.key = e.data.key, Array.isArray(e.data.rspMsgList) && e.data.rspMsgList.forEach(function (e) {e.to = e.groupID;}), e.data.rspMsgList && e.data.rspMsgList.length > 0 && this.tim.notificationController._eachEventArray(e.data.rspMsgList);} }, { key: "_handleFailure", value: function value(e) {e.error && (this.errorCount++, this.errorCount >= 5 && (this.stop(), this.errorCount = 0), this.tim.innerEmitter.emit(Xc.ERROR_DETECTED, e.error));} }]), e;}(),ug = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e))).groupMap = new Map(), n.groupMemberListMap = new Map(), n.hasLocalGroupList = 0, n.groupNoticeHandler = new ag({ tim: e, groupController: _n(n) }), n.groupTipsHandler = new ig({ tim: e, groupController: _n(n) }), n.AVChatRoomHandler = new sg({ tim: e, groupController: _n(n) }), n._initListeners(), n;}return pn(t, sl), sn(t, [{ key: "createGroup", value: function value(e) {var t = this;if (!["Public", "Private", "ChatRoom", "AVChatRoom"].includes(e.type)) {var n = new jc({ code: xc.ILLEGAL_GROUP_TYPE, message: qc.ILLEGAL_GROUP_TYPE });return wl(n);}Ls(e.type) && !gs(e.memberList) && e.memberList.length > 0 && (is.warn("GroupController.createGroup 创建AVChatRoom时不能添加群成员，自动忽略该字段"), e.memberList = void 0), Ns(e.type) || gs(e.joinOption) || (is.warn("GroupController.createGroup 创建Private/ChatRoom/AVChatRoom群时不能设置字段：joinOption，自动忽略该字段"), e.joinOption = void 0);var r = this.createPackage({ name: "group", action: "create", param: e });return is.log("GroupController.createGroup."), this.tim.connectionController.request(r).then(function (n) {if (is.log("GroupController.createGroup ok. groupID:", n.data.groupID), e.type === Xt.GRP_AVCHATROOM) return t.getGroupProfile({ groupID: n.data.groupID });t._updateGroupMap([ln({}, e, { groupID: n.data.groupID })]);var r = t.tim.createCustomMessage({ to: n.data.groupID, conversationType: Xt.CONV_GROUP, payload: { data: "group_create", extension: "".concat(t.tim.context.identifier, "创建群组") } });return t.tim.sendMessage(r), t._emitGroupUpdate(), t.getGroupProfile({ groupID: n.data.groupID });}).then(function (e) {var t = e.data.group;return t.selfInfo.messageRemindType = Xt.MSG_REMIND_ACPT_AND_NOTE, t.selfInfo.role = Xt.GRP_MBR_ROLE_OWNER, e;}).catch(function (e) {return is.error("GroupController.createGroup error:", e), wl(e);});} }, { key: "joinGroup", value: function value(e) {if (this.hasLocalGroup(e.groupID)) {var t = { status: Xt.JOIN_STATUS_ALREADY_IN_GROUP };return kl(t);}if (e.type === Xt.GRP_PRIVATE) {var n = new jc({ code: xc.CANNOT_JOIN_PRIVATE, message: qc.CANNOT_JOIN_PRIVATE });return this.tim.innerEmitter.emit(Xc.ERROR_DETECTED, n), wl(n);}return is.log("GroupController.joinGroup. groupID:", e.groupID), e.type === Xt.GRP_AVCHATROOM ? this.applyJoinAVChatRoom(e) : this.applyJoinGroup(e);} }, { key: "quitGroup", value: function value(e) {var t = this;this.AVChatRoomHandler.group.groupID === e && this.AVChatRoomHandler.stop();var n = this.createPackage({ name: "group", action: "quitGroup", param: { groupID: e } });return is.log("GroupController.quitGroup. groupID:", e), this.tim.connectionController.request(n).then(function () {return is.log("GroupController.quitGroup ok. groupID:", e), t._deleteLocalGroup(e), t.tim.conversationController._deleteLocalConversation("GROUP".concat(e)), t._emitGroupUpdate(1, 0), new Rl({ groupID: e });}).catch(function (t) {return is.error("GroupController.quitGroup error.  error:".concat(t, ". groupID:").concat(e)), wl(t);});} }, { key: "changeGroupOwner", value: function value(e) {var t = this;if (this.hasLocalGroup(e.groupID) && this.getLocalGroupProfile(e.groupID).type === Xt.GRP_AVCHATROOM) return wl(new jc({ code: xc.CANNOT_CHANGE_OWNER_IN_AVCHATROOM, message: qc.CANNOT_CHANGE_OWNER_IN_AVCHATROOM }));if (e.newOwnerID === this.tim.loginInfo.identifier) return wl(new jc({ code: xc.CANNOT_CHANGE_OWNER_TO_SELF, message: qc.CANNOT_CHANGE_OWNER_TO_SELF }));var n = this.createPackage({ name: "group", action: "changeGroupOwner", param: e });return is.log("GroupController.changeGroupOwner. groupID:", e.groupID), this.tim.connectionController.request(n).then(function () {is.log("GroupController.changeGroupOwner ok. groupID:", e.groupID);var n = e.groupID,r = e.newOwnerID;t.groupMap.get(n).ownerID = r;var o = t.groupMemberListMap.get(n);if (o instanceof Map) {var i = o.get(t.tim.loginInfo.identifier);gs(i) || (i.updateRole("Member"), t.groupMap.get(n).selfInfo.role = "Member");var a = o.get(r);gs(a) || a.updateRole("Owner");}return t._emitGroupUpdate(1, 0), new Rl({ group: t.groupMap.get(n) });}).catch(function (t) {return is.error("GroupController.changeGroupOwner error:".concat(t, ". groupID:").concat(e.groupID)), wl(t);});} }, { key: "dismissGroup", value: function value(e) {var t = this;if (this.hasLocalGroup(e) && this.getLocalGroupProfile(e).type === Xt.GRP_PRIVATE) return wl(new jc({ code: xc.CANNOT_DISMISS_PRIVATE, message: qc.CANNOT_DISMISS_PRIVATE }));var n = this.createPackage({ name: "group", action: "destroyGroup", param: { groupID: e } });return is.log("GroupController.dismissGroup. groupID:".concat(e)), this.tim.connectionController.request(n).then(function () {return is.log("GroupController.dismissGroup ok. groupID:".concat(e)), t._deleteLocalGroup(e), t.tim.conversationController._deleteLocalConversation("GROUP".concat(e)), t._emitGroupUpdate(1, 0), new Rl({ groupID: e });}).catch(function (t) {return is.error("GroupController.dismissGroup error:".concat(t, ". groupID:").concat(e)), wl(t);});} }, { key: "updateGroupProfile", value: function value(e) {var t = this;!this.hasLocalGroup(e.groupID) || Ns(this.getLocalGroupProfile(e.groupID).type) || gs(e.joinOption) || (is.warn("GroupController.modifyGroup: Private/ChatRoom/AVChatRoom群不能设置字段：joinOption，自动忽略该字段"), e.joinOption = void 0);var n = this.createPackage({ name: "group", action: "updateGroupProfile", param: e });return is.log("GroupController.modifyGroup. groupID:", e.groupID), this.tim.connectionController.request(n).then(function () {(is.log("GroupController.modifyGroup ok. groupID:", e.groupID), t.hasLocalGroup(e.groupID)) && (t.groupMap.get(e.groupID).updateGroup(e), t._setLocalGroupList(t.groupMap));return new Rl({ group: t.groupMap.get(e.groupID) });}).catch(function (t) {return is.log("GroupController.modifyGroup error. error:".concat(t, " groupID:").concat(e.groupID)), wl(t);});} }, { key: "setGroupMemberRole", value: function value(e) {var t = this,n = this.groupMap.get(e.groupID);if (n.selfInfo.role !== Xt.GRP_MBR_ROLE_OWNER) return wl(new jc({ code: xc.NOT_OWNER, message: qc.NOT_OWNER }));if ([Xt.GRP_PRIVATE, Xt.GRP_AVCHATROOM].includes(n.type)) return wl(new jc({ code: xc.CANNOT_SET_MEMBER_ROLE_IN_PRIVATE_AND_AVCHATROOM, message: qc.CANNOT_SET_MEMBER_ROLE_IN_PRIVATE_AND_AVCHATROOM }));if ([Xt.GRP_MBR_ROLE_ADMIN, Xt.GRP_MBR_ROLE_MEMBER].indexOf(e.role) < 0) return wl(new jc({ code: xc.INVALID_MEMBER_ROLE, message: qc.INVALID_MEMBER_ROLE }));if (e.userID === this.tim.loginInfo.identifier) return wl(new jc({ code: xc.CANNOT_SET_SELF_MEMBER_ROLE, message: qc.CANNOT_SET_SELF_MEMBER_ROLE }));is.log("GroupController.setGroupMemberRole. groupID:".concat(e.groupID, ". userID: ").concat(e.userID));var r = e.groupID,o = e.userID,i = e.role;return this._modifyGroupMemberInfo({ groupID: r, userID: o, role: i }).then(function () {is.log("GroupController.setGroupMemberRole ok. groupID:".concat(e.groupID, ". userID: ").concat(e.userID));var n = t.groupMemberListMap.get(e.groupID);return void 0 !== n && void 0 !== n.get(e.userID) && n.get(e.userID).updateRole(e.role), new Rl({ group: t.groupMap.get(e.groupID) });}).catch(function (t) {return is.error("GroupController.setGroupMemberRole error:".concat(t, ". groupID:").concat(e.groupID, ". userID:").concat(e.userID)), wl(t);});} }, { key: "setGroupMemberMuteTime", value: function value(e) {var t = this;is.log("GroupController.setGroupMemberMuteTime. groupID:".concat(e.groupID, ". userID: ").concat(e.userID));var n = e.groupID,r = e.userID,o = e.muteTime;return this._modifyGroupMemberInfo({ groupID: n, userID: r, muteTime: o }).then(function () {return is.log("GroupController.setGroupMemberMuteTime ok. groupID:".concat(e.groupID, ". userID: ").concat(e.userID)), t.updateGroupMemberList({ groupID: n });}).then(function () {return new Rl({ group: t.groupMap.get(e.groupID) });}).catch(function (t) {return is.error("GroupController.setGroupMemberMuteTime error:".concat(t, ". groupID:").concat(e.groupID, ". userID:").concat(e.userID)), wl(t);});} }, { key: "setMessageRemindType", value: function value(e) {var t = this;is.log("GroupController.setMessageRemindType. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || this.tim.loginInfo.identifier));var n = e.groupID,r = e.messageRemindType;return this._modifyGroupMemberInfo({ groupID: n, messageRemindType: r, userID: this.tim.loginInfo.identifier }).then(function () {is.log("GroupController.setMessageRemindType ok. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || t.tim.loginInfo.identifier));var n = t.groupMap.get(e.groupID);return n.selfInfo.messageRemindType = r, new Rl({ group: n });}).catch(function (n) {return is.error("GroupController.setMessageRemindType error:".concat(n, ". groupID:").concat(e.groupID, ". userID:").concat(e.userID || t.tim.loginInfo.identifier)), wl(n);});} }, { key: "setGroupMemberNameCard", value: function value(e) {var t = this;is.log("GroupController.setGroupMemberNameCard. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || this.tim.loginInfo.identifier));var n = e.groupID,r = e.userID,o = void 0 === r ? this.tim.loginInfo.identifier : r,i = e.nameCard;return this._modifyGroupMemberInfo({ groupID: n, userID: o, nameCard: i }).then(function () {is.log("GroupController.setGroupMemberNameCard ok. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || t.tim.loginInfo.identifier));var r = t.groupMemberListMap.get(n);return void 0 !== r && void 0 !== r.get(o) && r.get(o).updateMember({ nameCard: i }), o === t.tim.loginInfo.identifier && t.hasLocalGroup(n) && (t.getLocalGroupProfile(n).selfInfo.nameCard = i), new Rl({ group: t.groupMap.get(n) });}).catch(function (n) {return is.error("GroupController.setGroupMemberNameCard error:".concat(n, ". groupID:").concat(e.groupID, ". userID:").concat(e.userID || t.tim.loginInfo.identifier)), wl(n);});} }, { key: "setGroupMemberCustomField", value: function value(e) {var t = this;is.log("GroupController.setGroupMemberCustomField. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || this.tim.loginInfo.identifier));var n = e.groupID,r = e.userID,o = e.memberCustomField;return this._modifyGroupMemberInfo({ groupID: n, userID: r || this.tim.loginInfo.identifier, memberCustomField: o }).then(function () {return is.log("GroupController.setGroupMemberCustomField ok. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || t.tim.loginInfo.identifier)), t.groupMemberListMap.has(n) && t.groupMemberListMap.get(n).has(r) && t.groupMemberListMap.get(n).get(r).updateMemberCustomField(o), new Rl({ group: t.groupMap.get(n) });}).catch(function (n) {return is.error("GroupController.setGroupMemberCustomField error:".concat(n, ". groupID:").concat(e.groupID, ". userID:").concat(e.userID || t.tim.loginInfo.identifier)), wl(n);});} }, { key: "getGroupList", value: function value(e) {var t = this;is.log("GroupController.getGroupList");var n = { introduction: "Introduction", notification: "Notification", createTime: "CreateTime", ownerID: "Owner_Account", lastInfoTime: "LastInfoTime", memberNum: "MemberNum", maxMemberNum: "MaxMemberNum", joinOption: "ApplyJoinOption" },r = ["Type", "Name", "FaceUrl", "NextMsgSeq", "LastMsgTime"];e && e.groupProfileFilter && e.groupProfileFilter.forEach(function (e) {n[e] && r.push(n[e]);});var o = this.createPackage({ name: "group", action: "list", param: { responseFilter: { groupBaseInfoFilter: r, selfInfoFilter: ["Role", "JoinTime", "MsgFlag"] } } });return this.tim.connectionController.request(o).then(function (e) {var n = e.data.groups;return is.log("GroupController.getGroupList ok"), t._groupListTreeShaking(n), t._updateGroupMap(n), t.hasLocalGroupList = 1, t.tempConversationList && (t._handleUpdateGroupLastMessage(t.tempConversationList), t.tempConversationList = null), t._emitGroupUpdate(), new Rl({ groupList: t.getLocalGroups() });}).catch(function (e) {return is.error("GroupController.getGroupList error: ", e), wl(e);});} }, { key: "getGroupMemberList", value: function value(e) {var t = this,n = e.groupID,r = e.offset,o = void 0 === r ? 0 : r,i = e.count,a = void 0 === i ? 15 : i;is.log("GroupController.getGroupMemberList groupID: ".concat(n, " offset: ").concat(o, " count: ").concat(a));var s = this.createPackage({ name: "group", action: "getGroupMemberList", param: { groupID: n, offset: o, limit: a > 100 ? 100 : a, memberInfoFilter: ["Account", "Role", "JoinTime", "LastSendMsgTime", "NameCard", "ShutUpUntil"] } }),u = [];return this.connectionController.request(s).then(function (e) {var r = e.data,o = r.members,i = r.memberNum;return hs(o) && 0 !== o.length ? (t.hasLocalGroup(n) && (t.getLocalGroupProfile(n).memberNum = i), u = t._updateLocalGroupMemberList(n, o), t.tim.getUserProfile({ userIDList: o.map(function (e) {return e.userID;}) })) : Promise.resolve([]);}).then(function (e) {var r = e.data;if (!hs(r) || 0 === r.length) return kl({ memberList: [] });var o = r.map(function (e) {return { userID: e.userID, nick: e.nick, avatar: e.avatar };});return t._updateLocalGroupMemberList(n, o), is.log("GroupController.getGroupMemberList ok."), new Rl({ memberList: u });}).catch(function (e) {return is.error("GroupController.getGroupMemberList error: ", e), wl(e);});} }, { key: "getLocalGroups", value: function value() {return yn(this.groupMap.values());} }, { key: "getLocalGroupProfile", value: function value(e) {return this.groupMap.get(e);} }, { key: "hasLocalGroup", value: function value(e) {return this.groupMap.has(e);} }, { key: "getLocalGroupMemberInfo", value: function value(e, t) {return this.groupMemberListMap.has(e) ? this.groupMemberListMap.get(e).get(t) : 0;} }, { key: "hasLocalGroupMember", value: function value(e, t) {return this.groupMemberListMap.has(e) && this.groupMemberListMap.get(e).has(t);} }, { key: "hasLocalGroupMemberMap", value: function value(e) {return this.groupMemberListMap.has(e);} }, { key: "getGroupProfile", value: function value(e) {var t = this;is.log("GroupController.getGroupProfile. groupID:", e.groupID);var n = e.groupID,r = e.groupCustomFieldFilter,o = e.memberCustomFieldFilter,i = { groupIDList: [n], responseFilter: { groupBaseInfoFilter: ["Type", "Name", "Introduction", "Notification", "FaceUrl", "Owner_Account", "CreateTime", "InfoSeq", "LastInfoTime", "LastMsgTime", "MemberNum", "MaxMemberNum", "ApplyJoinOption", "NextMsgSeq"], groupCustomFieldFilter: r, memberCustomFieldFilter: o } };return this.getGroupProfileAdvance(i).then(function (r) {var o = r.data,i = o.successGroupList,a = o.failureGroupList;return is.log("GroupController.getGroupProfile ok. groupID:", e.groupID), a.length > 0 ? wl(a[0]) : i[0].type !== Xt.GRP_AVCHATROOM || t.AVChatRoomHandler.checkJoinedAVChatRoomByID(e.groupID) ? (t._updateGroupMap(i, 1), t._emitGroupUpdate(1, 0), new Rl({ group: t.groupMap.get(n) })) : new Rl({ group: new qh(i[0]) });}).catch(function (t) {return is.error("GroupController.getGroupProfile error:".concat(t, ". groupID:").concat(e.groupID)), wl(t);});} }, { key: "addGroupMember", value: function value(e) {var t = this,n = this.getLocalGroupProfile(e.groupID);if (Ls(n.type)) {var r = new jc({ code: xc.CANNOT_ADD_MEMBER_IN_AVCHATROOM, message: qc.CANNOT_ADD_MEMBER_IN_AVCHATROOM });return wl(r);}e.userIDList = e.userIDList.map(function (e) {return { userID: e };});var o = this.createPackage({ name: "group", action: "addGroupMember", param: e });return is.log("GroupController.addGroupMember. groupID:", e.groupID), this.connectionController.request(o).then(function (r) {var o = r.data.members;is.log("GroupController.addGroupMember ok. groupID:", e.groupID);var i = o.filter(function (e) {return 1 === e.result;}).map(function (e) {return e.userID;}),a = o.filter(function (e) {return 0 === e.result;}).map(function (e) {return e.userID;}),s = o.filter(function (e) {return 2 === e.result;}).map(function (e) {return e.userID;});return 0 === i.length ? new Rl({ successUserIDList: i, failureUserIDList: a, existedUserIDList: s }) : (t.updateGroupMemberList(e), new Rl({ successUserIDList: i, failureUserIDList: a, existedUserIDList: s, group: n }));}).catch(function (t) {return is.error("GroupController.addGroupMember error:".concat(t, ", groupID:").concat(e.groupID)), wl(t);});} }, { key: "deleteGroupMember", value: function value(e) {var t = this;is.log("GroupController.deleteGroupMember groupID:".concat(e.groupID, " userIDList:").concat(e.userIDList));var n = this.groupMap.get(e.groupID);if (n.type === Xt.GRP_AVCHATROOM) return wl(new jc({ code: xc.CANNOT_KICK_MEMBER_IN_AVCHATROOM, message: qc.CANNOT_KICK_MEMBER_IN_AVCHATROOM }));var r = this.createPackage({ name: "group", action: "deleteGroupMember", param: e });return this.connectionController.request(r).then(function () {return is.log("GroupController.deleteGroupMember ok"), t._deleteLocalGroupMembers(e.groupID, e.userIDList), t._emitGroupUpdate(), new Rl({ group: n, userIDList: e.userIDList });}).catch(function (t) {return is.error("GroupController.deleteGroupMember error:".concat(t.code, ", groupID:").concat(e.groupID)), wl(t);});} }, { key: "searchGroupByID", value: function value(e) {var t = { groupIDList: [e] },n = this.createPackage({ name: "group", action: "searchGroupByID", param: t });return is.log("GroupController.searchGroupByID. groupID:".concat(e)), this.connectionController.request(n).then(function (t) {var n = t.data.groupProfile;if (is.log("GroupController.searchGroupByID ok. groupID:".concat(e)), n[0].errorCode !== ll.REQUEST.SUCCESS) throw new jc({ code: n[0].errorCode, message: n[0].errorInfo });return new Rl({ group: new qh(n[0]) });}).catch(function (t) {return is.error("GroupController.searchGroupByID error:".concat(t, ", groupID:").concat(e)), wl(t);});} }, { key: "applyJoinGroup", value: function value(e) {var t = this,n = this.createPackage({ name: "group", action: "applyJoinGroup", param: e });return this.connectionController.request(n).then(function (n) {var r = n.data,o = r.joinedStatus,i = r.longPollingKey;switch (is.log("GroupController.joinGroup ok. groupID:", e.groupID), o) {case cl.WAIT_APPROVAL:return new Rl({ status: cl.WAIT_APPROVAL });case cl.SUCCESS:return t.getGroupProfile({ groupID: e.groupID }).then(function (e) {var t = { status: cl.SUCCESS, group: e.data.group };return gs(i) || (t.longPollingKey = i), new Rl(t);});default:var a = new jc({ code: xc.JOIN_GROUP_FAIL, message: qc.JOIN_GROUP_FAIL });return is.error("GroupController.joinGroup error:".concat(a, ". groupID:").concat(e.groupID)), wl(a);}}).catch(function (t) {return is.error("GroupController.joinGroup error:".concat(t, ". groupID:").concat(e.groupID)), wl(t);});} }, { key: "applyJoinAVChatRoom", value: function value(e) {return this.AVChatRoomHandler.applyJoinAVChatRoom(e);} }, { key: "handleGroupApplication", value: function value(e) {var t = this,n = e.message.payload,r = n.groupProfile.groupID,o = n.authentication,i = n.messageKey,a = n.operatorID,s = this.createPackage({ name: "group", action: "handleApplyJoinGroup", param: ln({}, e, { applicant: a, groupID: r, authentication: o, messageKey: i }) });return is.log("GroupController.handleApplication. groupID:", r), this.connectionController.request(s).then(function () {return is.log("GroupController.handleApplication ok. groupID:", r), t.updateGroupMemberList({ groupID: r });}).then(function (e) {return new Rl({ group: e });}).catch(function (e) {return is.error("GroupController.handleApplication error.  error:".concat(e, ". groupID:").concat(r)), wl(e);});} }, { key: "deleteGroupSystemNotice", value: function value(e) {if (!hs(e.messageList) || 0 === e.messageList.length) return kl();is.log("GroupController.deleteGroupSystemNotice " + e.messageList.map(function (e) {return e.ID;}));var t = this.createPackage({ name: "group", action: "deleteGroupSystemNotice", param: { messageListToDelete: e.messageList.map(function (e) {return { from: Xt.CONV_SYSTEM, messageSeq: e.clientSequence, messageRandom: e.random };}) } });return this.connectionController.request(t).then(function () {return is.log("GroupController.deleteGroupSystemNotice ok"), new Rl();}).catch(function (e) {return is.error("GroupController.deleteGroupSystemNotice error:", e), wl(e);});} }, { key: "updateGroupMemberList", value: function value(e) {var t = this,n = e.groupID,r = e.memberCustomFieldFilter,o = e.memberInfoFilter,i = { groupIDList: [n], responseFilter: { memberInfoFilter: o || ["Account", "Role", "JoinTime", "LastSendMsgTime", "NameCard", "ShutUpUntil"], memberCustomFieldFilter: r } };return this.getGroupProfileAdvance(i).then(function (e) {var r = e.data,o = r.successGroupList,i = r.failureGroupList;if (i.length > 0) return wl(i[0]);var a = [];return t._updateLocalGroupMemberList(o[0].groupID, o[0].members), t.groupMemberListMap.get(n).forEach(function (e) {var t = e.userID;a.push(t);}), t.tim.getUserProfile({ userIDList: a, tagList: ["Tag_Profile_IM_Nick", "Tag_Profile_IM_Image"] });}).then(function (e) {var r = e.data.map(function (e) {return { userID: e.userID, nick: e.nick, avatar: e.avatar };});return t._updateLocalGroupMemberList(n, r), t._emitGroupUpdate(), t.groupMap.get(n);});} }, { key: "getLocalGroupLastSequence", value: function value(e) {if (!this.groupMap.has(e)) return 0;var t = this.groupMap.get(e);return t.lastMessage.lastSequence ? t.lastMessage.lastSequence : t.nextMessageSeq - 1;} }, { key: "getGroupProfileAdvance", value: function value(e) {hs(e.groupIDList) && e.groupIDList.length > 50 && (is.warn("GroupController.getGroupProfileAdvance 获取群资料的数量不能超过50个"), e.groupIDList.length = 50), is.log("GroupController.getGroupProfileAdvance. groupIDList:", e.groupIDList);var t = this.createPackage({ name: "group", action: "query", param: e });return this.tim.connectionController.request(t).then(function (e) {is.log("GroupController.getGroupProfileAdvance ok.");var t = e.data.groups,n = t.filter(function (e) {return gs(e.errorCode) || e.errorCode === ll.REQUEST.SUCCESS;}),r = t.filter(function (e) {return e.errorCode && e.errorCode !== ll.REQUEST.SUCCESS;}).map(function (e) {return new jc({ code: Number("500".concat(e.errorCode)), message: e.errorInfo, data: { groupID: e.groupID } });});return new Rl({ successGroupList: n, failureGroupList: r });}).catch(function (t) {return is.error("GroupController.getGroupProfile error:".concat(t, ". groupID:").concat(e.groupID)), wl(t);});} }, { key: "_deleteLocalGroup", value: function value(e) {return this.groupMap.delete(e), this.groupMemberListMap.delete(e), this._setLocalGroupList(this.groupMap), this.groupMap.has(e) && this.groupMemberListMap.has(e);} }, { key: "_initGroupList", value: function value() {var e = this;(is.time(xl), is.log("GroupController._initGroupList"), this.hasLocalGroupList = this._hasLocalGroupList(), this.hasLocalGroupList) && (this._getLocalGroups().forEach(function (t) {e.groupMap.set(t[0], new qh(t[1]));}), this._emitGroupUpdate(1, 0));this.triggerReady(), is.log("GroupController._initGroupList ok. initCost=".concat(is.timeEnd(xl), "ms")), this.getGroupList();} }, { key: "_initListeners", value: function value() {var e = this.tim.innerEmitter;e.once(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._initGroupList, this), e.on(Xc.CONVERSATION_LIST_UPDATED, this._handleUpdateGroupLastMessage, this), e.on(Xc.MESSAGE_GROUP_INSTANT_RECEIVED, this._handleReceivedGroupMessage, this), e.on(Xc.PROFILE_UPDATED, this._handleProfileUpdated, this);} }, { key: "_emitGroupUpdate", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,n = this.getLocalGroups();t && this.tim.innerEmitter.emit(Xc.GROUP_LIST_UPDATED, n), e && this.tim.outerEmitter.emit(Wt.GROUP_LIST_UPDATED, n);} }, { key: "_handleReceivedGroupMessage", value: function value(e) {var t = this,n = e.data.eventDataList;Array.isArray(n) && n.forEach(function (e) {var n = e.conversationID.replace(Xt.CONV_GROUP, "");t.groupMap.has(n) && (t.groupMap.get(n).nextMessageSeq = e.lastMessage.sequence + 1);});} }, { key: "_onReceivedGroupSystemNotice", value: function value(e) {var t = e.data;this.groupNoticeHandler._onReceivedGroupNotice(t);} }, { key: "_handleUpdateGroupLastMessage", value: function value(e) {if (this.hasLocalGroupList) {for (var t = 0, n = 0; n < e.length; n++) {var r = e[n],o = r.type === Xt.CONV_GROUP;if (r.conversationID && o) {var i = r.conversationID.split(/^GROUP/)[1],a = this.getLocalGroupProfile(i);a && (a.lastMessage = r.lastMessage, t = 1);}}t && (this.groupMap = this._sortLocalGroupList(this.groupMap), this._emitGroupUpdate(1, 0));} else this.tempConversationList = e;} }, { key: "_sortLocalGroupList", value: function value(e) {var t = yn(e).filter(function (e) {var t = vn(e, 2);t[0];return !Gs(t[1].lastMessage);});return t.sort(function (e, t) {return t[1].lastMessage.lastTime - e[1].lastMessage.lastTime;}), new Map([].concat(yn(t), yn(e)));} }, { key: "_getLocalGroups", value: function value() {return this.tim.storage.getItem("groupMap");} }, { key: "_hasLocalGroupList", value: function value() {var e = this.tim.storage.getItem("groupMap");return null !== e && 0 !== e.length;} }, { key: "_setLocalGroupList", value: function value(e) {var t = [];e.forEach(function (e, n) {var r = e.name,o = e.avatar,i = e.type;t.push([n, { groupID: n, name: r, avatar: o, type: i }]);}), this.tim.storage.setItem("groupMap", t);} }, { key: "_updateGroupMap", value: function value(e) {var t = this;e.forEach(function (e) {t.groupMap.has(e.groupID) ? t.groupMap.get(e.groupID).updateGroup(e) : t.groupMap.set(e.groupID, new qh(e));}), this._setLocalGroupList(this.groupMap);} }, { key: "_updateLocalGroupMemberList", value: function value(e, t) {var n = this,r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;if (!t) return [];var o = this.groupMemberListMap.has(e) && 0 == r ? this.groupMemberListMap.get(e) : new Map(),i = t.map(function (t) {if (t.userID === n.tim.context.identifier) {var r = [null, void 0, "", 0, NaN],i = { role: t.role, joinTime: t.joinTime, nameCard: t.nameCard };Ss(n.groupMap.get(e).selfInfo, i, [], r);}return o.has(t.userID) ? o.get(t.userID).updateMember(t) : o.set(t.userID, new og(t)), o.get(t.userID);});return this.groupMemberListMap.set(e, o), i;} }, { key: "_deleteLocalGroupMembers", value: function value(e, t) {var n = this.groupMemberListMap.get(e);void 0 !== n && (t.forEach(function (e) {n.delete(e);}), this.groupMap.get(e).memberList = yn(n.values()));} }, { key: "_modifyGroupMemberInfo", value: function value(e) {var t = this.createPackage({ name: "group", action: "modifyGroupMemberInfo", param: e });return this.tim.connectionController.request(t);} }, { key: "_groupListTreeShaking", value: function value(e) {for (var t = new Map(yn(this.groupMap)), n = 0, r = e.length; n < r; n++) {t.delete(e[n].groupID);}this.AVChatRoomHandler.hasJoinedAVChatRoom() && t.delete(this.AVChatRoomHandler.group.groupID);for (var o = yn(t.keys()), i = 0, a = o.length; i < a; i++) {this.groupMap.delete(o[i]);}} }, { key: "_handleProfileUpdated", value: function value(e) {for (var t = this, n = e.data, r = function r(e) {var r = n[e];t.groupMemberListMap.forEach(function (e) {e.has(r.userID) && e.get(r.userID).updateMember({ nick: r.nick, avatar: r.avatar });});}, o = 0; o < n.length; o++) {r(o);}} }, { key: "getJoinedAVChatRoom", value: function value() {return this.AVChatRoomHandler.getJoinedAVChatRoom();} }, { key: "reset", value: function value() {this.groupMap.clear(), this.groupMemberListMap.clear(), this.hasLocalGroupList = 0, this.resetReady(), this.tim.innerEmitter.once(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._initGroupList, this);} }]), t;}(),cg = function cg() {for (var e = [], t = lg(arguments), n = 0; n < arguments.length; n++) {Number.isInteger(arguments[n]) ? e.push(arguments[n]) : e.push(1 == !!arguments[n] ? "1" : "0");}return e.join(t);},lg = function lg(e) {var t = e.length,n = e[t - 1];if ("string" != typeof n) return "";if (n.length > 1) return "";var r = e[t - 1];return delete e[t - 1], e.length -= t === e.length ? 1 : 0, r;},pg = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e)))._initializeMembers(), n._initializeStatus(), n._initializeListener(), n;}return pn(t, sl), sn(t, [{ key: "_initializeMembers", value: function value() {this.normalTimeout = 300, this.realtimeNoticeTimeout = 11e4, this.channelMaxTimeout = 3e5, this._memoryUsed = 0, this._memoryUsedThreshold = .9, this._onMemoryWarning = null;} }, { key: "_initializeStatus", value: function value() {this._initializeAccountStatus(), this._initializeChannelStatus();} }, { key: "_initializeAccountStatus", value: function value() {this.accountStatus = { lastSignInTime: 0, status: ll.ACCOUNT_STATUS.SIGN_OUT };} }, { key: "_initializeChannelStatus", value: function value() {this.channelStatus = { startTime: 0, offlineTime: 0, failCount: 0, lastRequestTime: 0, lastJitterTime: 0, jitterCount: 0, jitters: [], status: ll.CHANNEL_STATUS.OFFLINE };} }, { key: "_onMemoryRunningLow", value: function value(e) {is.warn("memory running low : ", e);} }, { key: "getChannelStatus", value: function value() {return this.channelStatus.status;} }, { key: "_channelStatusJittersUpdate", value: function value(e) {this.channelStatus.jitterCount++, this.channelStatus.lastJitterTime = e, this.channelStatus.jitters.push(e), this.channelStatus.jitters.length > 5 && this.channelStatus.jitters.pop();} }, { key: "_initializeListener", value: function value() {var e = this.tim.innerEmitter;e.on(Xc.NOTICE_LONGPOLL_START, this._onChannelStart, this), e.on(Xc.NOTICE_LONGPOLL_REQUEST_ARRIVED, this._onChannelRequestSuccess, this), e.on(Xc.NOTICE_LONGPOLL_REQUEST_NOT_ARRIVED, this._onChannelFail, this);} }, { key: "_onChannelStart", value: function value() {this.channelStatus.startTime = +new Date(), this.channelStatus.status = ll.CHANNEL_STATUS.ONLINE;} }, { key: "_getMemoryUsed", value: function value() {var e = "disabled",t = 0;return "undefined" != typeof window && void 0 !== window.performance && (t = window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit, this._memoryUsed = t, e = [Math.round(1e5 * this._memoryUsed) / 1e3, "%"].join("")), e;} }, { key: "_onChannelRequestSuccess", value: function value() {var e = this.tim,t = e.innerEmitter,n = e.outerEmitter,r = Date.now(),o = r - (this.channelStatus.lastRequestTime > 0 ? this.channelStatus.lastRequestTime : Date.now() + 100),i = cg(o < this.realtimeNoticeTimeout, o < this.channelMaxTimeout);switch (this.channelStatus.status = ll.CHANNEL_STATUS.ONLINE, this.channelStatus.failCount = 0, i) {case "11":break;case "01":t.emit(Xc.NOTICE_LONGPOLL_SOON_RECONNECT), n.emit(Wt.NOTICE_LONGPOLL_RECONNECT);break;case "00":t.emit(Xc.NOTICE_LONGPOLL_LONG_RECONNECT);}this.channelStatus.lastRequestTime = r;} }, { key: "_onChannelFail", value: function value(e) {var t = this.tim.innerEmitter,n = Date.now();this.channelStatus.status = ll.CHANNEL_STATUS.OFFLINE;var r = n - (0 === this.channelStatus.offlineTime ? this.channelStatus.lastRequestTime : this.channelStatus.offlineTime);this.channelStatus.offlineTime = n, this.channelStatus.failCount++, is.log("_onChannelFail count : ".concat(this.channelStatus.failCount, "  time diff: ").concat(r, ";")), this.channelStatus.failCount > 5 && r < 5e3 && (t.emit(Xc.NOTICE_LONGPOLL_DISCONNECT), is.error("Detected notice channel offline, please check your network!"));} }]), t;}();function fg() {return null;}var hg = function () {function e(t) {on(this, e), this.tim = t, this.isWX = Oa, this.storageQueue = new Map(), this.checkTimes = 0, this.checkTimer = setInterval(this._onCheckTimer.bind(this), 1e3), this._prefix = "", this._initListeners(), this._errorTolerantHandle();}return sn(e, [{ key: "_errorTolerantHandle", value: function value() {!this.isWX && gs(window.localStorage) && (this.getItem = fg, this.setItem = fg, this.removeItem = fg, this.clear = fg);} }, { key: "_onCheckTimer", value: function value() {if (this.checkTimes++, this.checkTimes % 20 == 0) {if (0 === this.storageQueue.size) return;this._doFlush();}} }, { key: "_doFlush", value: function value() {try {var e = 1,t = 0,n = void 0;try {for (var r, o = this.storageQueue[Symbol.iterator](); !(e = (r = o.next()).done); e = 1) {var i = vn(r.value, 2),a = i[0],s = i[1];this.isWX ? wx.setStorageSync(this._getKey(a), s) : localStorage.setItem(this._getKey(a), JSON.stringify(s));}} catch (u) {t = 1, n = u;} finally {try {e || null == o.return || o.return();} finally {if (t) throw n;}}this.storageQueue.clear();} catch (Hg) {is.error("Storage._doFlush error", Hg);}} }, { key: "_initListeners", value: function value() {this.tim.innerEmitter.once(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._updatePrefix, this);} }, { key: "_updatePrefix", value: function value() {var e = this.tim.loginInfo,t = e.SDKAppID,n = e.identifier;this._prefix = "TIM_".concat(t, "_").concat(n, "_");} }, { key: "getItem", value: function value(e) {try {return this.isWX ? wx.getStorageSync(this._getKey(e)) : JSON.parse(localStorage.getItem(this._getKey(e)));} catch (Hg) {is.error("Storage.getItem error:", Hg);}} }, { key: "setItem", value: function value(e, t) {var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;n ? this.isWX ? wx.setStorageSync(this._getKey(e), t) : localStorage.setItem(this._getKey(e), JSON.stringify(t)) : this.storageQueue.set(e, t);} }, { key: "clear", value: function value() {try {this.isWX ? wx.clearStorageSync() : localStorage.clear();} catch (Hg) {is.error("Storage.clear error:", Hg);}} }, { key: "removeItem", value: function value(e) {try {this.isWX ? wx.removeStorageSync(this._getKey(e)) : localStorage.removeItem(this._getKey(e));} catch (Hg) {is.error("Storage.removeItem error:", Hg);}} }, { key: "getSize", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "b";try {var r = { size: 0, limitSize: 5242880, unit: n };if (Object.defineProperty(r, "leftSize", { enumerable: 1, get: function get() {return r.limitSize - r.size;} }), this.isWX && (r.limitSize = 1024 * wx.getStorageInfoSync().limitSize), e) r.size = JSON.stringify(this.getItem(e)).length + this._getKey(e).length;else if (this.isWX) {var o = wx.getStorageInfoSync(),i = o.keys;i.forEach(function (e) {r.size += JSON.stringify(wx.getStorageSync(e)).length + t._getKey(e).length;});} else for (var a in localStorage) {localStorage.hasOwnProperty(a) && (r.size += localStorage.getItem(a).length + a.length);}return this._convertUnit(r);} catch (Hg) {is.error("Storage.getSize error:", Hg);}} }, { key: "_convertUnit", value: function value(e) {var t = {},n = e.unit;for (var r in t.unit = n, e) {"number" == typeof e[r] && ("kb" === n.toLowerCase() ? t[r] = Math.round(e[r] / 1024) : "mb" === n.toLowerCase() ? t[r] = Math.round(e[r] / 1024 / 1024) : t[r] = e[r]);}return t;} }, { key: "_getKey", value: function value(e) {return "".concat(this._prefix).concat(e);} }, { key: "reset", value: function value() {this._doFlush(), this.checkTimes = 0, this._prefix = "", this.tim.innerEmitter.once(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._updatePrefix, this);} }]), e;}(),gg = t(function (e) {var t = Object.prototype.hasOwnProperty,n = "~";function r() {}function o(e, t, n) {this.fn = e, this.context = t, this.once = n || 0;}function i(e, t, r, i, a) {if ("function" != typeof r) throw new TypeError("The listener must be a function");var s = new o(r, i || e, a),u = n ? n + t : t;return e._events[u] ? e._events[u].fn ? e._events[u] = [e._events[u], s] : e._events[u].push(s) : (e._events[u] = s, e._eventsCount++), e;}function a(e, t) {0 == --e._eventsCount ? e._events = new r() : delete e._events[t];}function s() {this._events = new r(), this._eventsCount = 0;}Object.create && (r.prototype = Object.create(null), new r().__proto__ || (n = 0)), s.prototype.eventNames = function () {var e,r,o = [];if (0 === this._eventsCount) return o;for (r in e = this._events) {t.call(e, r) && o.push(n ? r.slice(1) : r);}return Object.getOwnPropertySymbols ? o.concat(Object.getOwnPropertySymbols(e)) : o;}, s.prototype.listeners = function (e) {var t = n ? n + e : e,r = this._events[t];if (!r) return [];if (r.fn) return [r.fn];for (var o = 0, i = r.length, a = new Array(i); o < i; o++) {a[o] = r[o].fn;}return a;}, s.prototype.listenerCount = function (e) {var t = n ? n + e : e,r = this._events[t];return r ? r.fn ? 1 : r.length : 0;}, s.prototype.emit = function (e, t, r, o, i, a) {var s = n ? n + e : e;if (!this._events[s]) return 0;var u,c,l = this._events[s],p = arguments.length;if (l.fn) {switch (l.once && this.removeListener(e, l.fn, void 0, 1), p) {case 1:return l.fn.call(l.context), 1;case 2:return l.fn.call(l.context, t), 1;case 3:return l.fn.call(l.context, t, r), 1;case 4:return l.fn.call(l.context, t, r, o), 1;case 5:return l.fn.call(l.context, t, r, o, i), 1;case 6:return l.fn.call(l.context, t, r, o, i, a), 1;}for (c = 1, u = new Array(p - 1); c < p; c++) {u[c - 1] = arguments[c];}l.fn.apply(l.context, u);} else {var f,h = l.length;for (c = 0; c < h; c++) {switch (l[c].once && this.removeListener(e, l[c].fn, void 0, 1), p) {case 1:l[c].fn.call(l[c].context);break;case 2:l[c].fn.call(l[c].context, t);break;case 3:l[c].fn.call(l[c].context, t, r);break;case 4:l[c].fn.call(l[c].context, t, r, o);break;default:if (!u) for (f = 1, u = new Array(p - 1); f < p; f++) {u[f - 1] = arguments[f];}l[c].fn.apply(l[c].context, u);}}}return 1;}, s.prototype.on = function (e, t, n) {return i(this, e, t, n, 0);}, s.prototype.once = function (e, t, n) {return i(this, e, t, n, 1);}, s.prototype.removeListener = function (e, t, r, o) {var i = n ? n + e : e;if (!this._events[i]) return this;if (!t) return a(this, i), this;var s = this._events[i];if (s.fn) s.fn !== t || o && !s.once || r && s.context !== r || a(this, i);else {for (var u = 0, c = [], l = s.length; u < l; u++) {(s[u].fn !== t || o && !s[u].once || r && s[u].context !== r) && c.push(s[u]);}c.length ? this._events[i] = 1 === c.length ? c[0] : c : a(this, i);}return this;}, s.prototype.removeAllListeners = function (e) {var t;return e ? (t = n ? n + e : e, this._events[t] && a(this, t)) : (this._events = new r(), this._eventsCount = 0), this;}, s.prototype.off = s.prototype.removeListener, s.prototype.addListener = s.prototype.on, s.prefixed = n, s.EventEmitter = s, e.exports = s;}),dg = function dg(e) {var t, n, r, o, i;return Gs(e.context) ? (t = "", n = 0, r = 0, o = 0, i = 1) : (t = e.context.a2Key, n = e.context.tinyID, r = e.context.SDKAppID, o = e.context.contentType, i = e.context.apn), { platform: Vc, websdkappid: Hc, v: Bc, a2: t, tinyid: n, sdkappid: r, contentType: o, apn: i, reqtime: function reqtime() {return +new Date();} };},_g = function () {function e(t) {on(this, e), this.isReady = 0, this.tim = t, this.context = t.context, this._initList(), this._updateWhenCTXIsReady();}return sn(e, [{ key: "_updateWhenCTXIsReady", value: function value() {this.tim.innerEmitter.on(Xc.CONTEXT_UPDATED, this.update, this), this.tim.innerEmitter.on(Xc.CONTEXT_RESET, this.reset, this);} }, { key: "update", value: function value(e) {var t = e.context;this.context = t, this._initList();} }, { key: "reset", value: function value(e) {this.context = e.data, this._initList();} }, { key: "get", value: function value(e) {var t = e.name,n = e.action,r = e.param;if (void 0 === this.config[t]) throw new jc({ code: xc.NETWORK_PACKAGE_UNDEFINED, message: "".concat(qc.NETWORK_PACKAGE_UNDEFINED, ": PackageConfig.").concat(t) });if (void 0 === this.config[t][n]) throw new jc({ code: xc.NETWORK_PACKAGE_UNDEFINED, message: "".concat(qc.NETWORK_PACKAGE_UNDEFINED, ": PackageConfig.").concat(t, ".").concat(n) });var o = function e(t) {if (0 === Object.getOwnPropertyNames(t).length) return Object.create(null);var n = Array.isArray(t) ? [] : Object.create(null),r = "";for (var o in t) {null !== t[o] ? void 0 !== t[o] ? (r = rn(t[o]), ["string", "number", "function", "boolean"].indexOf(r) >= 0 ? n[o] = t[o] : n[o] = e(t[o])) : n[o] = void 0 : n[o] = null;}return n;}(this.config[t][n]);return o.requestData = this._initRequestData(r, o), o.encode = this._initEncoder(o), o.decode = this._initDecoder(o), o;} }, { key: "set", value: function value(e) {var t = e.key,n = e.value;if (0 != !!t) {var r = t.split(".");if (!(r.length <= 0)) {!function e(t, n, r, o) {var i = n[r];"object" === rn(t[i]) ? e(t[i], n, r + 1, o) : t[i] = o;}(this.config, r, 0, n);}}} }, { key: "_initList", value: function value() {var e;this.config = {}, this.config.accessLayer = (e = this.tim, { create: null, query: { serverName: zc.NAME.WEB_IM, cmd: zc.CMD.ACCESS_LAYER, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: { platform: Vc, identifier: e.loginInfo.identifier, usersig: e.loginInfo.userSig, contentType: e.loginInfo.contentType, apn: null !== e.context ? e.context.apn : 1, websdkappid: Hc, v: Bc }, requestData: {} }, update: null, delete: null }), this.config.login = function (e) {return { create: null, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.LOGIN, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: { websdkappid: Hc, v: Bc, platform: Vc, identifier: e.loginInfo.identifier, usersig: e.loginInfo.userSig, sdkappid: e.loginInfo.SDKAppID, accounttype: e.loginInfo.accountType, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: +new Date() / 1e3 }, requestData: { state: "Online" }, keyMaps: { request: { tinyID: "tinyId" }, response: { TinyId: "tinyID" } } }, update: null, delete: null };}(this.tim), this.config.logout = function (e) {return { create: null, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.LOGOUT_ALL, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: { websdkappid: Hc, v: Bc, platform: Vc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : "", sdkappid: null !== e.loginInfo ? e.loginInfo.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : "", reqtime: +new Date() / 1e3 }, requestData: {} }, update: null, delete: null };}(this.tim), this.config.longPollLogout = function (e) {return { create: null, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.LOGOUT_LONG_POLL, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: { websdkappid: Hc, v: Bc, platform: Vc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return Date.now();} }, requestData: { longPollID: "" }, keyMaps: { request: { longPollID: "LongPollingId" } } }, update: null, delete: null };}(this.tim), this.config.profile = function (e) {var t = dg(e),n = zc.NAME.PROFILE,r = zc.CHANNEL.XHR,o = Yc,i = [];for (var a in Al) {Object.prototype.hasOwnProperty.call(Al, a) && i.push(Al[a]);}return { query: { serverName: n, cmd: zc.CMD.PORTRAIT_GET, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [], tagList: i } }, update: { serverName: n, cmd: zc.CMD.PORTRAIT_SET, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", profileItem: [{ tag: Al.NICK, value: "" }, { tag: Al.GENDER, value: "" }, { tag: Al.ALLOWTYPE, value: "" }, { tag: Al.AVATAR, value: "" }] } } };}(this.tim), this.config.group = function (e) {var t = { websdkappid: Hc, v: Bc, platform: Vc, a2: null !== e.context && e.context.a2Key ? e.context.a2Key : void 0, tinyid: null !== e.context && e.context.tinyID ? e.context.tinyID : void 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, accounttype: null !== e.context ? e.context.accountType : 0 },n = { request: { ownerID: "Owner_Account", userID: "Member_Account", newOwnerID: "NewOwner_Account", maxMemberNum: "MaxMemberCount", groupCustomField: "AppDefinedData", memberCustomField: "AppMemberDefinedData", groupCustomFieldFilter: "AppDefinedDataFilter_Group", memberCustomFieldFilter: "AppDefinedDataFilter_GroupMember", messageRemindType: "MsgFlag", userIDList: "MemberList", groupIDList: "GroupIdList", applyMessage: "ApplyMsg", muteTime: "ShutUpTime", joinOption: "ApplyJoinOption" }, response: { GroupIdList: "groups", MsgFlag: "messageRemindType", AppDefinedData: "groupCustomField", AppMemberDefinedData: "memberCustomField", AppDefinedDataFilter_Group: "groupCustomFieldFilter", AppDefinedDataFilter_GroupMember: "memberCustomFieldFilter", InfoSeq: "infoSequence", MemberList: "members", GroupInfo: "groups", ShutUpUntil: "muteUntil", ApplyJoinOption: "joinOption" } };return { create: { serverName: zc.NAME.GROUP, cmd: zc.CMD.CREATE_GROUP, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { type: Xt.GRP_PRIVATE, name: void 0, groupID: void 0, ownerID: e.loginInfo.identifier, introduction: void 0, notification: void 0, avatar: void 0, maxMemberNum: void 0, joinOption: void 0, memberList: void 0, groupCustomField: void 0 }, keyMaps: n }, list: { serverName: zc.NAME.GROUP, cmd: zc.CMD.GET_JOINED_GROUPS, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { userID: e.loginInfo.identifier, limit: void 0, offset: void 0, groupType: void 0, responseFilter: void 0 }, keyMaps: n }, query: { serverName: zc.NAME.GROUP, cmd: zc.CMD.GET_GROUP_INFO, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupIDList: void 0, responseFilter: void 0 }, keyMaps: n }, getGroupMemberList: { serverName: zc.NAME.GROUP, cmd: zc.CMD.GET_GROUP_MEMBER_INFO, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, limit: 0, offset: 0, memberRoleFilter: void 0, memberInfoFilter: void 0 }, keyMaps: n }, quitGroup: { serverName: zc.NAME.GROUP, cmd: zc.CMD.QUIT_GROUP, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0 } }, changeGroupOwner: { serverName: zc.NAME.GROUP, cmd: zc.CMD.CHANGE_GROUP_OWNER, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, newOwnerID: void 0 }, keyMaps: n }, destroyGroup: { serverName: zc.NAME.GROUP, cmd: zc.CMD.DESTROY_GROUP, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0 } }, updateGroupProfile: { serverName: zc.NAME.GROUP, cmd: zc.CMD.MODIFY_GROUP_INFO, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, name: void 0, introduction: void 0, notification: void 0, avatar: void 0, maxMemberNum: void 0, joinOption: void 0, groupCustomField: void 0 }, keyMaps: { request: ln({}, n.request, { groupCustomField: "AppDefinedData" }), response: n.response } }, modifyGroupMemberInfo: { serverName: zc.NAME.GROUP, cmd: zc.CMD.MODIFY_GROUP_MEMBER_INFO, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, userID: void 0, messageRemindType: void 0, nameCard: void 0, role: void 0, memberCustomField: void 0, muteTime: void 0 }, keyMaps: n }, addGroupMember: { serverName: zc.NAME.GROUP, cmd: zc.CMD.ADD_GROUP_MEMBER, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, silence: void 0, userIDList: void 0 }, keyMaps: n }, deleteGroupMember: { serverName: zc.NAME.GROUP, cmd: zc.CMD.DELETE_GROUP_MEMBER, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, userIDList: void 0, reason: void 0 }, keyMaps: { request: { userIDList: "MemberToDel_Account" } } }, searchGroupByID: { serverName: zc.NAME.GROUP, cmd: zc.CMD.SEARCH_GROUP_BY_ID, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupIDList: void 0, responseFilter: { groupBasePublicInfoFilter: ["Type", "Name", "Introduction", "Notification", "FaceUrl", "CreateTime", "Owner_Account", "LastInfoTime", "LastMsgTime", "NextMsgSeq", "MemberNum", "MaxMemberNum", "ApplyJoinOption"] } }, keyMaps: { request: { groupIDList: "GroupIdList" } } }, applyJoinGroup: { serverName: zc.NAME.GROUP, cmd: zc.CMD.APPLY_JOIN_GROUP, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, applyMessage: void 0, userDefinedField: void 0 }, keyMaps: n }, applyJoinAVChatRoom: { serverName: zc.NAME.BIG_GROUP_NO_AUTH, cmd: zc.CMD.APPLY_JOIN_GROUP, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: { websdkappid: Hc, v: Bc, platform: Vc, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, accounttype: null !== e.context ? e.context.accountType : 0 }, requestData: { groupID: void 0, applyMessage: void 0, userDefinedField: void 0 }, keyMaps: n }, handleApplyJoinGroup: { serverName: zc.NAME.GROUP, cmd: zc.CMD.HANDLE_APPLY_JOIN_GROUP, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { groupID: void 0, applicant: void 0, handleAction: void 0, handleMessage: void 0, authentication: void 0, messageKey: void 0, userDefinedField: void 0 }, keyMaps: { request: { applicant: "Applicant_Account", handleAction: "HandleMsg", handleMessage: "ApprovalMsg", messageKey: "MsgKey" }, response: { MsgKey: "messageKey" } } }, deleteGroupSystemNotice: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.DELETE_GROUP_SYSTEM_MESSAGE, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: t, requestData: { messageListToDelete: void 0 }, keyMaps: { request: { messageListToDelete: "DelMsgList", messageSeq: "MsgSeq", messageRandom: "MsgRandom" } } } };}(this.tim), this.config.longPollID = function (e) {return { create: {}, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.GET_LONG_POLL_ID, channel: zc.CHANNEL.XHR, protocol: Yc, queryString: { websdkappid: Hc, v: Bc, platform: Vc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: +new Date() / 1e3 }, requestData: {}, keyMaps: { response: { LongPollingId: "longPollingID" } } }, update: {}, delete: {} };}(this.tim), this.config.longPoll = function (e) {var t = { websdkappid: Hc, v: Bc, platform: Vc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, accounttype: null !== e.context ? e.loginInfo.accountType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: Math.ceil(+new Date() / 1e3) };return { create: {}, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.LONG_POLL, channel: zc.CHANNEL.AUTO, protocol: Yc, queryString: t, requestData: { timeout: null, cookie: { notifySeq: 0, noticeSeq: 0, longPollingID: 0 } }, keyMaps: { response: { C2cMsgArray: "C2CMessageArray", GroupMsgArray: "groupMessageArray", GroupTips: "groupTips", C2cNotifyMsgArray: "C2CNotifyMessageArray", ClientSeq: "clientSequence", MsgPriority: "messagePriority", NoticeSeq: "noticeSequence", MsgContent: "content", MsgType: "type", MsgBody: "elements", ToGroupId: "to", Desc: "description", Ext: "extension", MsgFrom_AccountExtraInfo: "messageFromAccountExtraInformation" } } }, update: {}, delete: {} };}(this.tim), this.config.applyC2C = function (e) {var t = dg(e),n = zc.NAME.FRIEND,r = zc.CHANNEL.XHR,o = Yc;return { create: { serverName: n, cmd: zc.CMD.FRIEND_ADD, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", addFriendItem: [] } }, get: { serverName: n, cmd: zc.CMD.GET_PENDENCY, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", pendencyType: "Pendency_Type_ComeIn" } }, update: { serverName: n, cmd: zc.CMD.RESPONSE_PENDENCY, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", responseFriendItem: [] } }, delete: { serverName: n, cmd: zc.CMD.DELETE_PENDENCY, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", toAccount: [], pendencyType: "Pendency_Type_ComeIn" } } };}(this.tim), this.config.friend = function (e) {var t = dg(e),n = zc.NAME.FRIEND,r = zc.CHANNEL.XHR,o = Yc;return { get: { serverName: n, cmd: zc.CMD.FRIEND_GET_ALL, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", timeStamp: 0, startIndex: 0, getCount: 100, lastStandardSequence: 0, tagList: ["Tag_Profile_IM_Nick", "Tag_SNS_IM_Remark"] }, keyMaps: { request: {}, response: {} } }, delete: { serverName: n, cmd: zc.CMD.FRIEND_DELETE, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [], deleteType: "Delete_Type_Single" } } };}(this.tim), this.config.blacklist = function (e) {var t = dg(e);return { create: { serverName: zc.NAME.FRIEND, cmd: zc.CMD.ADD_BLACKLIST, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [] } }, get: { serverName: zc.NAME.FRIEND, cmd: zc.CMD.GET_BLACKLIST, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { fromAccount: "", startIndex: 0, maxLimited: 30, lastSequence: 0 } }, delete: { serverName: zc.NAME.FRIEND, cmd: zc.CMD.DELETE_BLACKLIST, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [] } }, update: {} };}(this.tim), this.config.c2cMessage = function (e) {var t = { platform: Vc, websdkappid: Hc, v: Bc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} },n = { request: { fromAccount: "From_Account", toAccount: "To_Account", msgTimeStamp: "MsgTimeStamp", msgSeq: "MsgSeq", msgRandom: "MsgRandom", msgBody: "MsgBody", count: "MaxCnt", lastMessageTime: "LastMsgTime", messageKey: "MsgKey", peerAccount: "Peer_Account", data: "Data", description: "Desc", extension: "Ext", type: "MsgType", content: "MsgContent", sizeType: "Type", uuid: "UUID", imageUrl: "URL", fileUrl: "Url", remoteAudioUrl: "Url", downloadFlag: "Download_Flag" }, response: { MsgContent: "content", MsgTime: "time", Data: "data", Desc: "description", Ext: "extension", MsgKey: "messageKey", MsgType: "type", MsgBody: "elements", Download_Flag: "downloadFlag" } };return { create: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.SEND_MESSAGE, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { fromAccount: e.loginInfo.identifier, toAccount: "", msgTimeStamp: Math.ceil(+new Date() / 1e3), msgSeq: 0, msgRandom: 0, msgBody: [] }, keyMaps: n }, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.GET_C2C_ROAM_MESSAGES, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { peerAccount: "", count: 15, lastMessageTime: 0, messageKey: "" }, keyMaps: n }, update: null, delete: null };}(this.tim), this.config.groupMessage = function (e) {var t = { platform: Vc, websdkappid: Hc, v: Bc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} },n = { request: { to: "GroupId", extension: "Ext", data: "Data", description: "Desc", random: "Random", sequence: "ReqMsgSeq", count: "ReqMsgNumber", type: "MsgType", content: "MsgContent", elements: "MsgBody", sizeType: "Type", uuid: "UUID", imageUrl: "URL", fileUrl: "Url", remoteAudioUrl: "Url", downloadFlag: "Download_Flag", clientSequence: "ClientSeq" }, response: { Random: "random", MsgTime: "time", MsgSeq: "sequence", ReqMsgSeq: "sequence", RspMsgList: "messagesList", IsPlaceMsg: "isPlaceMessage", IsSystemMsg: "isSystemMessage", ToGroupId: "to", MsgFrom_AccountExtraInfo: "messageFromAccountExtraInformation", EnumFrom_AccountType: "fromAccountType", EnumTo_AccountType: "toAccountType", GroupCode: "groupCode", MsgFlag: "messageRemindType", MsgPriority: "messagePriority", MsgBody: "elements", MsgType: "type", MsgContent: "content", IsFinished: "complete", Download_Flag: "downloadFlag", ClientSeq: "clientSequence" } };return { create: { serverName: zc.NAME.GROUP, cmd: zc.CMD.SEND_GROUP_MESSAGE, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { groupID: "", fromAccount: e.loginInfo.identifier, random: 0, clientSequence: 0, msgBody: [] }, keyMaps: n }, query: { serverName: zc.NAME.GROUP, cmd: zc.CMD.GET_GROUP_ROAM_MESSAGES, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { groupID: "", count: 15, sequence: "" }, keyMaps: n }, update: null, delete: null };}(this.tim), this.config.conversation = function (e) {var t = { platform: Vc, websdkappid: Hc, v: Bc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1 };return { query: { serverName: zc.NAME.RECENT_CONTACT, cmd: zc.CMD.GET_CONVERSATION_LIST, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { fromAccount: e.loginInfo.identifier, count: 0 }, keyMaps: { request: {}, response: { SessionItem: "conversations", ToAccount: "groupID", To_Account: "userID", UnreadMsgCount: "unreadCount", MsgGroupReadedSeq: "messageReadSeq" } } }, delete: { serverName: zc.NAME.RECENT_CONTACT, cmd: zc.CMD.DELETE_CONVERSATION, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { fromAccount: e.loginInfo.identifier, toAccount: void 0, type: 1, toGroupID: void 0 }, keyMaps: { request: { toGroupID: "ToGroupid" } } }, setC2CMessageRead: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.SET_C2C_MESSAGE_READ, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { C2CMsgReaded: void 0 }, keyMaps: { request: { lastMessageTime: "LastedMsgTime" } } }, setGroupMessageRead: { serverName: zc.NAME.GROUP, cmd: zc.CMD.SET_GROUP_MESSAGE_READ, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { groupID: void 0, messageReadSeq: void 0 }, keyMaps: { request: { messageReadSeq: "MsgReadedSeq" } } } };}(this.tim), this.config.syncMessage = function (e) {var t = { platform: Vc, websdkappid: Hc, v: Bc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return [Math.ceil(+new Date()), Math.random()].join("");} };return { create: null, query: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.GET_MESSAGES, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { cookie: "", syncFlag: 0, needAbstract: 1 }, keyMaps: { request: { fromAccount: "From_Account", toAccount: "To_Account", from: "From_Account", to: "To_Account", time: "MsgTimeStamp", sequence: "MsgSeq", random: "MsgRandom", elements: "MsgBody" }, response: { MsgList: "messageList", SyncFlag: "syncFlag", To_Account: "to", From_Account: "from", ClientSeq: "clientSequence", MsgSeq: "sequence", NoticeSeq: "noticeSequence", NotifySeq: "notifySequence", MsgRandom: "random", MsgTimeStamp: "time", MsgContent: "content", ToGroupId: "groupID", MsgKey: "messageKey", GroupTips: "groupTips", MsgBody: "elements", MsgType: "type", C2CRemainingUnreadCount: "C2CRemainingUnreadList" } } }, update: null, delete: null };}(this.tim), this.config.AVChatRoom = function (e) {return { startLongPoll: { serverName: zc.NAME.BIG_GROUP_LONG_POLLING_NO_AUTH, cmd: zc.CMD.AVCHATROOM_LONG_POLL, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: { websdkappid: Hc, v: Bc, platform: Vc, sdkappid: e.loginInfo.SDKAppID, accounttype: "792", apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} }, requestData: { USP: 1, startSeq: 1, holdTime: 90, key: void 0 }, keyMaps: { request: { USP: "USP" }, response: { ToGroupId: "groupID" } } } };}(this.tim), this.config.cosUpload = function (e) {var t = { platform: Vc, websdkappid: Hc, v: Bc, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return Date.now();} };return { create: { serverName: zc.NAME.OPEN_IM, cmd: zc.CMD.FILE_UPLOAD, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { appVersion: "2.1", fromAccount: "", toAccount: "", sequence: 0, time: function time() {return Math.ceil(Date.now() / 1e3);}, random: function random() {return Ts();}, fileStrMd5: "", fileSize: "", serverVer: 1, authKey: "", busiId: 1, pkgFlag: 1, sliceOffset: 0, sliceSize: 0, sliceData: "", contentType: "application/x-www-form-urlencoded" }, keyMaps: { request: {}, response: {} } }, update: null, delete: null };}(this.tim), this.config.cosSig = function (e) {var t = { sdkappid: function sdkappid() {return e.loginInfo.SDKAppID;}, identifier: function identifier() {return e.loginInfo.identifier;}, userSig: function userSig() {return e.context.userSig;} };return { create: null, query: { serverName: zc.NAME.IM_COS_SIGN, cmd: zc.CMD.COS_SIGN, channel: zc.CHANNEL.XHR, protocol: Yc, method: "POST", queryString: t, requestData: { cmd: "open_im_cos_svc", subCmd: "get_cos_token", duration: 300, version: 1 }, keyMaps: { request: { userSig: "usersig", subCmd: "sub_cmd", cmd: "cmd", duration: "duration", version: "version" }, response: { expired_time: "expiredTime", bucket_name: "bucketName", session_token: "sessionToken", tmp_secret_id: "secretId", tmp_secret_key: "secretKey" } } }, update: null, delete: null };}(this.tim);} }, { key: "_initRequestData", value: function value(e, t) {if (void 0 === e) return el(t.requestData, this._getRequestMap(t), this.tim);var n = t.requestData,r = Object.create(null);for (var o in n) {if (Object.prototype.hasOwnProperty.call(n, o)) {if (r[o] = "function" == typeof n[o] ? n[o]() : n[o], void 0 === e[o]) continue;r[o] = e[o];}}return r = el(r, this._getRequestMap(t), this.tim);} }, { key: "_getRequestMap", value: function value(e) {if (e.keyMaps && e.keyMaps.request && Object.keys(e.keyMaps.request).length > 0) return e.keyMaps.request;} }, { key: "_initEncoder", value: function value(e) {switch (e.protocol) {case Yc:return function (e) {if ("string" === rn(e)) try {return JSON.parse(e);} catch (Hg) {return e;}return e;};case Kc:return function (e) {return e;};default:return function (e) {return is.warn("PackageConfig._initEncoder(), unknow response type, data: ", JSON.stringify(e)), e;};}} }, { key: "_initDecoder", value: function value(e) {switch (e.protocol) {case Yc:return function (e) {if ("string" === rn(e)) try {return JSON.parse(e);} catch (Hg) {return e;}return e;};case Kc:return function (e) {return e;};default:return function (e) {return is.warn("PackageConfig._initDecoder(), unknow response type, data: ", e), e;};}} }]), e;}(),mg = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e)))._initialization(), n;}return pn(t, sl), sn(t, [{ key: "_initialization", value: function value() {this._syncOffset = "", this._syncNoticeList = [], this._syncEventArray = [], this._syncMessagesIsRunning = 0, this._syncMessagesFinished = 0, this._isLongPoll = 0, this._longPollID = 0, this._noticeSequence = 0, this._initializeListener(), this._runLoop = null;} }, { key: "getLongPollID", value: function value() {return this._longPollID;} }, { key: "_IAmReady", value: function value() {this.triggerReady();} }, { key: "reset", value: function value() {this._noticeSequence = 0, this._resetSync(), this.closeNoticeChannel();} }, { key: "_resetSync", value: function value() {this._syncOffset = "", this._syncNoticeList = [], this._syncEventArray = [], this._syncMessagesIsRunning = 0, this._syncMessagesFinished = 0;} }, { key: "_setNoticeSeqInRequestData", value: function value(e) {e.Cookie.NoticeSeq = this._noticeSequence;} }, { key: "_updatenoticeSequence", value: function value(e) {if (e) {var t = e[e.length - 1].noticeSequence;!t || "number" != typeof t || t < this._noticeSequence ? this._noticeSequence++ : this._noticeSequence = t;} else this._noticeSequence++;} }, { key: "_initializeListener", value: function value() {var e = this.tim.innerEmitter;e.on(Xc.NOTICE_LONGPOLL_RESTART, this.restartNoticeChannel, this), e.on(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._startSyncMessages, this), e.on(Xc.SYNC_MESSAGE_C2C_FINISHED, this.openNoticeChannel, this), e.on(Xc.SIGN_LOGOUT_SUCCESS, this.closeNoticeChannel, this), e.on(Xc.NOTICE_LONGPOLL_SOON_RECONNECT, this._onChannelReconnect, this), e.on(Xc.NOTICE_LONGPOLL_DISCONNECT, this._onChannelDisconnected, this);} }, { key: "openNoticeChannel", value: function value() {is.log("NotificationController.openNoticeChannel"), this._getLongPollID();} }, { key: "closeNoticeChannel", value: function value() {is.log("NotificationController.closeNoticeChannel()"), (this._runLoop instanceof eh || this._runLoop instanceof th) && (this._runLoop.abort(), this._runLoop.stop()), this._longPollID = 0, this._isLongPoll = 0, this.tim.innerEmitter.emit(Xc.NOTICE_LONGPOLL_STOPPED), this.tim.outerEmitter.emit(Wt.NOTICE_LONGPOLL_STOPPED);} }, { key: "restartNoticeChannel", value: function value() {this.closeNoticeChannel(), this.openNoticeChannel();} }, { key: "_getLongPollID", value: function value() {var e = this,t = this.tim,n = t.innerEmitter,r = t.connectionController;if (0 === this._longPollID) {var o = this.createPackage({ name: "longPollID", action: "query" });r.request(o).then(function (t) {t.data.errorCode === ll.REQUEST.SUCCESS ? e._onGetLongPollIDSuccess({ data: t.data.longPollingID }) : e._onGetLongPollIDFail({ data: t.data });}).catch(function (e) {n.emit(Xc.NOTICE_LONGPOLL_GETID_FAIL, e);});} else this._onGetLongPollIDSuccess({ data: this._longPollID });} }, { key: "_onGetLongPollIDSuccess", value: function value(e) {this.tim.packageConfig.set({ key: "long_poll_logout.query.requestData.longPollingID", value: e.data }), this.tim.packageConfig.set({ key: "longPoll.query.requestData.cookie.longPollingID", value: e.data }), this._longPollID = e.data, this._startLongPoll(), this._IAmReady();} }, { key: "_onGetLongPollIDFail", value: function value(e) {is.warn("Notification._onGetLongPollIDFail", e);} }, { key: "_startLongPoll", value: function value() {if (1 != this._isLongPoll) {is.log("NotificationController._startLongPoll...");var e = this.tim,t = e.connectionController,n = e.innerEmitter,r = this.createPackage({ name: "longPoll", action: "query" });this._isLongPoll = 1, n.emit(Xc.NOTICE_LONGPOLL_START, { data: Date.now() }), this._runLoop = t.createRunLoop({ pack: r, before: this._setNoticeSeqInRequestData.bind(this), success: this._onNoticeReceived.bind(this), fail: this._onNoticeFail.bind(this) }), this._runLoop.start();} else is.log("NotificationController._startLongPoll is running...");} }, { key: "_onChannelReconnect", value: function value(e) {this.closeNoticeChannel(), this.syncMessage();} }, { key: "_onChannelDisconnected", value: function value() {} }, { key: "_onNoticeReceived", value: function value(e) {var t = this.tim,n = t.innerEmitter,r = t.statusController,o = e.data,i = !r.getChannelStatus();if (n.emit(Xc.NOTICE_LONGPOLL_REQUEST_ARRIVED, { data: Date.now() }), o.errorCode !== ll.REQUEST.SUCCESS) {if (o.errorCode === xc.LONG_POLL_KICK_OUT) return n.emit(Xc.NOTICE_LONGPOLL_KICKED_OUT), is.log("NotificationController._onNoticeReceived(), longPollingID was kicked"), void this.closeNoticeChannel();is.log("NotificationController._onNoticeReceived(), error: ".concat(o.errorCode, ", errorInfo: ").concat(o.errorInfo)), n.emit(Xc.ERROR_DETECTED, { code: o.errorCode, message: o.errorInfo });}e.data.eventArray && 1 != i && this._eachEventArray(e.data.eventArray);} }, { key: "_onNoticeFail", value: function value(e) {this.tim.innerEmitter.emit(Xc.ERROR_DETECTED, e.error), this.tim.innerEmitter.emit(Xc.NOTICE_LONGPOLL_REQUEST_NOT_ARRIVED, { data: Date.now() });} }, { key: "_eachEventArray", value: function value(e) {var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "poll";if (hs(e)) {var n = eg("NotificationController._eachEventArray()");n.dot("start");for (var r = this.tim.innerEmitter, o = null, i = "", a = "", s = 0, u = e.length; s < u; s++) {o = e[s];var c = this._confirmCarrierType(o);n.dot("type ".concat(c));var l = cg(o.event, c, ",");switch (n.dot("condition ".concat(l)), l) {case "9,1":this._updatenoticeSequence(o.C2CMessageArray), r.emit(Xc.NOTICE_LONGPOLL_NEW_C2C_NOTICE, { data: o.C2CMessageArray, type: t }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_C2C_NOTICE));break;case "3,2":this._updatenoticeSequence(o.groupMessageArray), r.emit(Xc.NOTICE_LONGPOLL_NEW_GROUP_MESSAGES, { data: o.groupMessageArray }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_GROUP_MESSAGES));break;case "4,3":this._updatenoticeSequence(o.groupTips), r.emit(Xc.NOTICE_LONGPOLL_NEW_GROUP_TIPS, { data: o.groupTips }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_GROUP_TIPS));break;case "5,3":this._updatenoticeSequence(o.groupTips), r.emit(Xc.NOTICE_LONGPOLL_NEW_GROUP_NOTICE, { data: { groupSystemNotices: o.groupTips, type: t } }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_GROUP_NOTICE));break;case "7,7":this._updatenoticeSequence(o.friendListMod), r.emit(Xc.NOTICE_LONGPOLL_NEW_FRIEND_MESSAGES, { data: o.friendListMod }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_FRIEND_MESSAGES));break;case "8,6":this._updatenoticeSequence(o.profileModify), r.emit(Xc.NOTICE_LONGPOLL_PROFILE_MODIFIED, { data: o.profileModify }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_PROFILE_MODIFIED));break;case "10,5":if (this._updatenoticeSequence(o.C2CNotifyMessageArray), this._isKickedoutNotice(o.C2CNotifyMessageArray)) return void r.emit(Xc.NOTICE_LONGPOLL_MUTIPLE_DEVICE_KICKED_OUT);if (this._isSysCmdMsgNotify(o.C2CNotifyMessageArray)) return void r.emit(Xc.NOTICE_LONGPOLL_RECEIVE_SYSTEM_ORDERS);is.warn("NotificationController._eachEventArray() get Event condition : ".concat(l, ", only increase noticeSequence"));break;case "3,0":r.emit(Xc.NOTICE_LONGPOLL_NEW_GROUP_MESSAGES, { data: [o] }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_GROUP_MESSAGES));break;case "6,0":r.emit(Xc.NOTICE_LONGPOLL_NEW_GROUP_TIPS, { data: [o] }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_GROUP_TIPS));break;case "5,0":r.emit(Xc.NOTICE_LONGPOLL_NEW_GROUP_NOTICE, { data: { groupSystemNotices: [o], type: t } }), n.dot("emit ".concat(Xc.NOTICE_LONGPOLL_NEW_GROUP_NOTICE));break;default:this._updatenoticeSequence(), i = "".concat(xc.NOTICE_RUNLOOP_UNEXPECTED_CONDITION), a = "".concat(qc.NOTICE_RUNLOOP_UNEXPECTED_CONDITION, ": ").concat(l), r.emit(Xc.ERROR_DETECTED, new jc({ code: i, message: a, data: { condition: l, eventItem: o } })), n.dot("".concat(Xc.ERROR_DETECTED, ":").concat(i)), i = a = "";}n.report();}}} }, { key: "_confirmCarrierType", value: function value(e) {var t = { C2CMessageArray: 1, groupMessageArray: 2, groupTips: 3, messageList: 4, C2CNotifyMessageArray: 5, profileModify: 6, friendListMod: 7 },n = "";for (var r in e) {if (t.hasOwnProperty(r)) {n = r;break;}}return "" === n ? 0 : t.hasOwnProperty(n) ? t[n] : 0;} }, { key: "_isKickedoutNotice", value: function value(e) {return e[0].hasOwnProperty("kickoutMsgNotify") ? 1 : 0;} }, { key: "_isSysCmdMsgNotify", value: function value(e) {return e[0] && e[0].hasOwnProperty("sysCmdMsgNotify") ? 1 : 0;} }, { key: "_startSyncMessages", value: function value(e) {1 != this._syncMessagesFinished && this.syncMessage();} }, { key: "syncMessage", value: function value() {var e = this,t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,r = this.tim,o = r.connectionController,i = r.innerEmitter;this._syncMessagesIsRunning = 1;var a = this.createPackage({ name: "syncMessage", action: "query", param: { cookie: t, syncFlag: n } });o.request(a).then(function (t) {var n = t.data;switch (cg(n.cookie, n.syncFlag)) {case "00":case "01":i.emit(Xc.ERROR_DETECTED, { code: xc.NOTICE_RUNLOOP_OFFSET_LOST, message: qc.NOTICE_RUNLOOP_OFFSET_LOST });break;case "10":case "11":n.eventArray && e._eachEventArray(n.eventArray, "sync"), e._syncNoticeList = e._syncNoticeList.concat(n.messageList), i.emit(Xc.SYNC_MESSAGE_C2C_PROCESSING, { data: n.messageList, C2CRemainingUnreadList: n.C2CRemainingUnreadList }), e._syncOffset = n.cookie, e.syncMessage(n.cookie, n.syncFlag);break;case "12":n.eventArray && e._eachEventArray(n.eventArray, "sync"), e._syncNoticeList = e._syncNoticeList.concat(n.messageList), i.emit(Xc.SYNC_MESSAGE_C2C_FINISHED, { data: n.messageList, C2CRemainingUnreadList: n.C2CRemainingUnreadList }), e._syncOffset = n.cookie, e._syncNoticeList = [], e._syncMessagesIsRunning = 0, e._syncMessagesFinished = 1;}}).catch(function (t) {e._syncMessagesIsRunning = 0, is.error("NotificationController.syncMessage() failed, error:", JSON.stringify(t));});} }]), t;}(),vg = 1..toFixed,yg = Math.floor,Eg = function Eg(e, t, n) {return 0 === t ? n : t % 2 == 1 ? Eg(e, t - 1, n * e) : Eg(e * e, t / 2, n);},Sg = vg && ("0.000" !== 8e-5.toFixed(3) || "1" !== .9.toFixed(0) || "1.25" !== 1.255.toFixed(2) || "1000000000000000128" !== 0xde0b6b3a7640080.toFixed(0)) || !u(function () {vg.call({});});De({ target: "Number", proto: 1, forced: Sg }, { toFixed: function toFixed(e) {var t,n,r,o,i = function (e) {if ("number" != typeof e && "Number" != d(e)) throw TypeError("Incorrect invocation");return +e;}(this),a = oe(e),s = [0, 0, 0, 0, 0, 0],u = "",c = "0",l = function l(e, t) {for (var n = -1, r = t; ++n < 6;) {r += e * s[n], s[n] = r % 1e7, r = yg(r / 1e7);}},p = function p(e) {for (var t = 6, n = 0; --t >= 0;) {n += s[t], s[t] = yg(n / e), n = n % e * 1e7;}},f = function f() {for (var e = 6, t = ""; --e >= 0;) {if ("" !== t || 0 === e || 0 !== s[e]) {var n = String(s[e]);t = "" === t ? n : t + ch.call("0", 7 - n.length) + n;}}return t;};if (a < 0 || a > 20) throw RangeError("Incorrect fraction digits");if (i != i) return "NaN";if (i <= -1e21 || i >= 1e21) return String(i);if (i < 0 && (u = "-", i = -i), i > 1e-21) if (n = (t = function (e) {for (var t = 0, n = e; n >= 4096;) {t += 12, n /= 4096;}for (; n >= 2;) {t += 1, n /= 2;}return t;}(i * Eg(2, 69, 1)) - 69) < 0 ? i * Eg(2, -t, 1) : i / Eg(2, t, 1), n *= 4503599627370496, (t = 52 - t) > 0) {for (l(0, n), r = a; r >= 7;) {l(1e7, 0), r -= 7;}for (l(Eg(10, r, 1), 0), r = t - 1; r >= 23;) {p(1 << 23), r -= 23;}p(1 << r), l(1, 1), p(2), c = f();} else l(0, n), l(1 << -t, 0), c = f() + ch.call("0", a);return c = a > 0 ? u + ((o = c.length) <= a ? "0." + ch.call("0", a - o) + c : c.slice(0, o - a) + "." + c.slice(o - a)) : u + c;} });var Ig = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e)))._initializeListener(), n;}return pn(t, sl), sn(t, [{ key: "_initializeMembers", value: function value(e) {this.expiredTimeLimit = 300, this.appid = e.appid || "", this.bucketName = e.bucketName || "", this.expiredTimeOut = e.expiredTimeOut || this.expiredTimeLimit, this.region = "ap-shanghai", this.cos = null, this.cosOptions = { secretId: e.secretId, secretKey: e.secretKey, sessionToken: e.sessionToken, expiredTime: e.expiredTime }, this._initUploaderMethod();} }, { key: "_expiredTimer", value: function value() {var e = this,t = setInterval(function () {Math.ceil(Date.now() / 1e3) >= e.cosOptions.expiredTime - 20 && (e._isReady = 0, e._getAuthorizationKey(), clearInterval(t));}, 1e4);} }, { key: "_initializeListener", value: function value() {this.tim.innerEmitter.on(Xc.CONTEXT_A2KEY_AND_TINYID_UPDATED, this._initialization, this);} }, { key: "_initialization", value: function value() {this._initCOSSDKPlugin(), this.COSSDK ? (this._initializeMembers({}), this._getAuthorizationKey()) : is.warn("UploadController 没有检测到上传插件，将无法发送图片、音频、视频、文件等类型的消息。");} }, { key: "_getAuthorizationKey", value: function value() {var e = this,t = Math.ceil(Date.now() / 1e3),n = this.createPackage({ name: "cosSig", action: "query", param: { duration: this.expiredTimeLimit } });this.tim.connectionController.request(n).then(function (n) {n.data.expiredTimeOut = n.data.expiredTime - t, is.log("UploadController._getAuthorizationKey timeout=".concat(n.data.expiredTimeOut, "s")), e._initializeMembers(n.data), e._expiredTimer(), e._initUploaderMethod();}).catch(function (e) {is.warn(e);});} }, { key: "_initCOSSDKPlugin", value: function value() {var e = Oa ? "cos-wx-sdk" : "cos-js-sdk";this.COSSDK = this.tim.getPlugin(e);} }, { key: "_initUploaderMethod", value: function value() {var e = this;this.appid && (this.cos = Oa ? new this.COSSDK({ ForcePathStyle: 1, getAuthorization: this._getAuthorization.bind(this) }) : new this.COSSDK({ getAuthorization: this._getAuthorization.bind(this) }), this._cosUploadMethod = Oa ? function (t, n) {e.cos.postObject(t, n);} : function (t, n) {e.cos.uploadFiles(t, n);}, this._IAmReady());} }, { key: "_getAuthorization", value: function value(e, t) {t({ TmpSecretId: this.cosOptions.secretId, TmpSecretKey: this.cosOptions.secretKey, XCosSecurityToken: this.cosOptions.sessionToken, ExpiredTime: this.cosOptions.expiredTime });} }, { key: "_IAmReady", value: function value() {this.triggerReady();} }, { key: "uploadImage", value: function value(e) {if (!e.file) return wl(new jc({ code: xc.MESSAGE_IMAGE_SELECT_FILE_FIRST, message: qc.MESSAGE_IMAGE_SELECT_FILE_FIRST }));var t = this._checkImageType(e.file);if (1 != t) return t;var n = this._checkImageMime(e.file);if (1 != n) return n;var r = this._checkImageSize(e.file);return 1 != r ? r : this.upload(e);} }, { key: "_checkImageType", value: function value(e) {var t = "";return t = Oa ? e.url.slice(e.url.lastIndexOf(".") + 1) : e.files[0].name.slice(e.files[0].name.lastIndexOf(".") + 1), ah.indexOf(t.toLowerCase()) >= 0 ? 1 : wl(new jc({ coe: xc.MESSAGE_IMAGE_TYPES_LIMIT, message: qc.MESSAGE_IMAGE_TYPES_LIMIT }));} }, { key: "_checkImageMime", value: function value(e) {return 1;} }, { key: "_checkImageSize", value: function value(e) {return (Oa ? e.size : e.files[0].size) < 20971520 ? 1 : wl(new jc({ coe: xc.MESSAGE_IMAGE_SIZE_LIMIT, message: "".concat(qc.MESSAGE_IMAGE_SIZE_LIMIT, ": ").concat(20971520, " bytes") }));} }, { key: "uploadFile", value: function value(e) {var t = null;return e.file ? e.file.files[0].size > 20971520 ? (t = new jc({ code: xc.MESSAGE_FILE_SIZE_LIMIT, message: "".concat(qc.MESSAGE_FILE_SIZE_LIMIT, ": ").concat(20971520, " bytes") }), wl(t)) : this.upload(e) : (t = new jc({ code: xc.MESSAGE_FILE_SELECT_FILE_FIRST, message: qc.MESSAGE_FILE_SELECT_FILE_FIRST }), wl(t));} }, { key: "uploadVideo", value: function value(e) {return e.file ? this.upload(e) : wl();} }, { key: "uploadAudio", value: function value(e) {return e.file ? e.file.size > 20971520 ? wl(new jc({ code: xc.MESSAGE_AUDIO_SIZE_LIMIT, message: "".concat(qc.MESSAGE_AUDIO_SIZE_LIMIT, ": ").concat(20971520, " bytes") })) : this.upload(e) : wl(new jc({ code: xc.MESSAGE_AUDIO_UPLOAD_FAIL, message: qc.MESSAGE_AUDIO_UPLOAD_FAIL }));} }, { key: "upload", value: function value(e) {var t = this;is.time(ql);var n = Oa ? e.file : e.file.files[0];return new Promise(function (r, o) {var i = Oa ? t._createCosOptionsWXMiniApp(e) : t._createCosOptionsWeb(e),a = t;t._cosUploadMethod(i, function (e, i) {var s = Object.create(null);if (i) {if (t._isUploadError(i, e)) return o(i.files[0].error), void is.warn("UploadController.upload failed, network error:".concat(i.files[0].error.error));s.fileName = n.name, s.fileSize = n.size, s.fileType = n.type.slice(n.type.indexOf("/") + 1).toUpperCase(), s.location = Oa ? i.Location : i.files[0].data.Location;var u = is.timeEnd(ql),c = a._formatFileSize(n.size),l = a._formatSpeed(1e3 * n.size / u),p = "UploadController.upload success name=".concat(n.name, ",size=").concat(c, ",time=").concat(u, "ms,speed=").concat(l);return is.log(p), void r(s);}is.warn("UploadController.upload failed, error:".concat(e)), o(e);});});} }, { key: "_isUploadError", value: function value(e, t) {return Oa ? t ? 1 : 0 : null !== e.files[0].error ? 1 : 0;} }, { key: "_formatFileSize", value: function value(e) {return e < 1024 ? e + "B" : e < 1048576 ? Math.floor(e / 1024) + "KB" : Math.floor(e / 1048576) + "MB";} }, { key: "_formatSpeed", value: function value(e) {return e <= 1048576 ? (e / 1024).toFixed(1) + "KB/s" : (e / 1048576).toFixed(1) + "MB/s";} }, { key: "_createCosOptionsWeb", value: function value(e) {var t = this.tim.context.identifier;return { files: [{ Bucket: "".concat(this.bucketName, "-").concat(this.appid), Region: this.region, Key: "imfiles/".concat(t, "/").concat(e.to, "-").concat(Ts(9999999), "-").concat(e.file.files[0].name), Body: e.file.files[0] }], SliceSize: 1048576, onProgress: function onProgress(t) {if ("function" == typeof e.onProgress) try {e.onProgress(t.percent);} catch (n) {is.warn("onProgress callback error:"), is.error(n);}}, onFileFinish: function onFileFinish(e, t, n) {} };} }, { key: "_createCosOptionsWXMiniApp", value: function value(e) {var t = this.tim.context.identifier,n = e.file.url;return { Bucket: "".concat(this.bucketName, "-").concat(this.appid), Region: this.region, Key: "imfiles/".concat(t, "/").concat(e.to, "-").concat(e.file.name), FilePath: n, onProgress: function onProgress(t) {if (is.log(JSON.stringify(t)), "function" == typeof e.onProgress) try {e.onProgress(t.percent);} catch (n) {is.warn("onProgress callback error:"), is.error(n);}} };} }]), t;}(),Cg = { app_id: "", event_id: "", api_base: "https://pingtas.qq.com/pingd", prefix: "_mta_", version: "1.3.9", stat_share_app: 0, stat_pull_down_fresh: 0, stat_reach_bottom: 0, stat_param: 1 };function Tg() {try {var e = "s" + Mg();return wx.setStorageSync(Cg.prefix + "ssid", e), e;} catch (t) {}}function Mg(e) {for (var t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], n = 10; 1 < n; n--) {var r = Math.floor(10 * Math.random()),o = t[r];t[r] = t[n - 1], t[n - 1] = o;}for (n = r = 0; 5 > n; n++) {r = 10 * r + t[n];}return (e || "") + (r + "") + +new Date();}function Og() {try {var e = getCurrentPages(),t = "/";return 0 < e.length && (t = e.pop().__route__), t;} catch (n) {console.log("get current page path error:" + n);}}function Ag() {var e,t = { dm: "wechat.apps.xx", url: encodeURIComponent(Og() + Lg(Rg.Data.pageQuery)), pvi: "", si: "", ty: 0 };return t.pvi = ((e = function () {try {return wx.getStorageSync(Cg.prefix + "auid");} catch (t) {}}()) || (e = function () {try {var t = Mg();return wx.setStorageSync(Cg.prefix + "auid", t), t;} catch (e) {}}(), t.ty = 1), e), t.si = function () {var e = function () {try {return wx.getStorageSync(Cg.prefix + "ssid");} catch (e) {}}();return e || (e = Tg()), e;}(), t;}function Dg() {var e = function () {var e = wx.getSystemInfoSync();return { adt: encodeURIComponent(e.model), scl: e.pixelRatio, scr: e.windowWidth + "x" + e.windowHeight, lg: e.language, fl: e.version, jv: encodeURIComponent(e.system), tz: encodeURIComponent(e.platform) };}();return function (e) {wx.getNetworkType({ success: function success(t) {e(t.networkType);} });}(function (e) {try {wx.setStorageSync(Cg.prefix + "ntdata", e);} catch (t) {}}), e.ct = wx.getStorageSync(Cg.prefix + "ntdata") || "4g", e;}function Ng() {var e,t = Rg.Data.userInfo,n = [];for (e in t) {t.hasOwnProperty(e) && n.push(e + "=" + t[e]);}return t = n.join(";"), { r2: Cg.app_id, r4: "wx", ext: "v=" + Cg.version + (null !== t && "" !== t ? ";ui=" + encodeURIComponent(t) : "") };}function Lg(e) {if (!Cg.stat_param || !e) return "";e = function (e) {if (1 > Cg.ignore_params.length) return e;var t,n = {};for (t in e) {0 <= Cg.ignore_params.indexOf(t) || (n[t] = e[t]);}return n;}(e);var t,n = [];for (t in e) {n.push(t + "=" + e[t]);}return 0 < n.length ? "?" + n.join("&") : "";}var Rg = { App: { init: function init(e) {"appID" in e && (Cg.app_id = e.appID), "eventID" in e && (Cg.event_id = e.eventID), "statShareApp" in e && (Cg.stat_share_app = e.statShareApp), "statPullDownFresh" in e && (Cg.stat_pull_down_fresh = e.statPullDownFresh), "statReachBottom" in e && (Cg.stat_reach_bottom = e.statReachBottom), "ignoreParams" in e && (Cg.ignore_params = e.ignoreParams), "statParam" in e && (Cg.stat_param = e.statParam), Tg();try {"lauchOpts" in e && (Rg.Data.lanchInfo = e.lauchOpts, Rg.Data.lanchInfo.landing = 1);} catch (t) {}"autoReport" in e && e.autoReport && function () {var e = Page;Page = function Page(t) {var n = t.onLoad;t.onLoad = function (e) {n && n.call(this, e), Rg.Data.lastPageQuery = Rg.Data.pageQuery, Rg.Data.pageQuery = e, Rg.Data.lastPageUrl = Rg.Data.pageUrl, Rg.Data.pageUrl = Og(), Rg.Data.show = 0, Rg.Page.init();}, e(t);};}();} }, Page: { init: function init() {var e,t = getCurrentPages()[getCurrentPages().length - 1];t.onShow && (e = t.onShow, t.onShow = function () {if (1 == Rg.Data.show) {var t = Rg.Data.lastPageQuery;Rg.Data.lastPageQuery = Rg.Data.pageQuery, Rg.Data.pageQuery = t, Rg.Data.lastPageUrl = Rg.Data.pageUrl, Rg.Data.pageUrl = Og();}Rg.Data.show = 1, Rg.Page.stat(), e.apply(this, arguments);}), Cg.stat_pull_down_fresh && t.onPullDownRefresh && function () {var e = t.onPullDownRefresh;t.onPullDownRefresh = function () {Rg.Event.stat(Cg.prefix + "pulldownfresh", { url: t.__route__ }), e.apply(this, arguments);};}(), Cg.stat_reach_bottom && t.onReachBottom && function () {var e = t.onReachBottom;t.onReachBottom = function () {Rg.Event.stat(Cg.prefix + "reachbottom", { url: t.__route__ }), e.apply(this, arguments);};}(), Cg.stat_share_app && t.onShareAppMessage && function () {var e = t.onShareAppMessage;t.onShareAppMessage = function () {return Rg.Event.stat(Cg.prefix + "shareapp", { url: t.__route__ }), e.apply(this, arguments);};}();}, multiStat: function multiStat(e, t) {if (1 == t) Rg.Page.stat(e);else {var n = getCurrentPages()[getCurrentPages().length - 1];n.onShow && function () {var t = n.onShow;n.onShow = function () {Rg.Page.stat(e), t.call(this, arguments);};}();}}, stat: function stat(e) {if ("" != Cg.app_id) {var t = [],n = Ng();if (e && (n.r2 = e), e = [Ag(), n, Dg()], Rg.Data.lanchInfo) {e.push({ ht: Rg.Data.lanchInfo.scene }), Rg.Data.pageQuery && Rg.Data.pageQuery._mta_ref_id && e.push({ rarg: Rg.Data.pageQuery._mta_ref_id });try {1 == Rg.Data.lanchInfo.landing && (n.ext += ";lp=1", Rg.Data.lanchInfo.landing = 0);} catch (i) {}}e.push({ rdm: "/", rurl: 0 >= Rg.Data.lastPageUrl.length ? Rg.Data.pageUrl + Lg(Rg.Data.lastPageQuery) : encodeURIComponent(Rg.Data.lastPageUrl + Lg(Rg.Data.lastPageQuery)) }), e.push({ rand: +new Date() }), n = 0;for (var r = e.length; n < r; n++) {for (var o in e[n]) {e[n].hasOwnProperty(o) && t.push(o + "=" + (void 0 === e[n][o] ? "" : e[n][o]));}}wx.request({ url: Cg.api_base + "?" + t.join("&").toLowerCase() });}} }, Event: { stat: function stat(e, t) {if ("" != Cg.event_id) {var n = [],r = Ag(),o = Ng();r.dm = "wxapps.click", r.url = e, o.r2 = Cg.event_id;var i,a = void 0 === t ? {} : t,s = [];for (i in a) {a.hasOwnProperty(i) && s.push(encodeURIComponent(i) + "=" + encodeURIComponent(a[i]));}for (a = s.join(";"), o.r5 = a, a = 0, o = (r = [r, o, Dg(), { rand: +new Date() }]).length; a < o; a++) {for (var u in r[a]) {r[a].hasOwnProperty(u) && n.push(u + "=" + (void 0 === r[a][u] ? "" : r[a][u]));}}wx.request({ url: Cg.api_base + "?" + n.join("&").toLowerCase() });}} }, Data: { userInfo: null, lanchInfo: null, pageQuery: null, lastPageQuery: null, pageUrl: "", lastPageUrl: "", show: 0 } },Pg = Rg,Gg = function () {function e() {on(this, e), this.cache = [], this.MtaWX = null, this._init();}return sn(e, [{ key: "report", value: function value(e, t) {var n = this;try {Ma ? window.MtaH5 ? (window.MtaH5.clickStat(e, t), this.cache.forEach(function (e) {var t = e.name,r = e.param;window.MtaH5.clickStat(t, r), n.cache.shift();})) : this.cache.push({ name: e, param: t }) : Oa && (this.MtaWX ? (this.MtaWX.Event.stat(e, t), this.cache.forEach(function (e) {var t = e.name,r = e.param;n.MtaWX.stat(t, r), n.cache.shift();})) : this.cache.push({ name: e, param: t }));} catch (Hg) {}} }, { key: "stat", value: function value() {try {Ma && window.MtaH5 ? window.MtaH5.pgv() : Oa && this.MtaWX && this.MtaWX.Page.stat();} catch (Hg) {}} }, { key: "_init", value: function value() {try {if (Ma) {window._mtac = { autoReport: 0 };var e = document.createElement("script"),t = function () {if (Oa) return "https:";var e = window.location.protocol;return ["http:", "https:"].indexOf(e) < 0 && (e = "http:"), e;}();e.src = "".concat(t, "//pingjs.qq.com/h5/stats.js?v2.0.4"), e.setAttribute("name", "MTAH5"), e.setAttribute("sid", "500690998"), e.setAttribute("cid", "500691017");var n = document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e, n);} else Oa && (this.MtaWX = Pg, this.MtaWX.App.init({ appID: "500690995", eventID: "500691014", autoReport: 0, statParam: 1 }));} catch (Hg) {}} }]), e;}(),kg = function (e) {function t(e) {var n;return on(this, t), (n = mn(this, fn(t).call(this, e))).tim = e, n.MTA = new Gg(), n._initListener(), n;}return pn(t, sl), sn(t, [{ key: "_initListener", value: function value() {var e = this,t = this.tim.innerEmitter;this._sendMessageSuccessRateReport(), this._loginSuccessRateReport(), t.on(Xc.SDK_READY, function () {e.MTA.report("sdkappid", { value: e.tim.context.SDKAppID }), e.MTA.report("version", { value: Bg.VERSION }), e.MTA.stat();});} }, { key: "_sendMessageSuccessRateReport", value: function value() {var e = this,t = this.tim.innerEmitter;t.on(Xc.MESSAGE_SENDING, function () {e.MTA.report("sendmessage", { send: 1 });}), t.on(Xc.MESSAGE_C2C_SEND_SUCCESS, function () {e.MTA.report("sendmessage", { success: 1 });}), t.on(Xc.MESSAGE_C2C_SEND_FAIL, function () {e.MTA.report("sendmessage", { fail: 1 });}), t.on(Xc.MESSAGE_GROUP_SEND_SUCCESS, function () {e.MTA.report("sendmessage", { success: 1 });}), t.on(Xc.MESSAGE_GROUP_SEND_FAIL, function () {e.MTA.report("sendmessage", { fail: 1 });});} }, { key: "_loginSuccessRateReport", value: function value() {var e = this,t = this.tim.innerEmitter;t.on(Xc.SIGN_LOGIN, function () {e.MTA.report("login", { login: 1 });}), t.on(Xc.SIGN_LOGIN_SUCCESS, function () {e.MTA.report("login", { success: 1 });}), t.on(Xc.SIGN_LOGIN_FAIL, function () {e.MTA.report("login", { fail: 1 });});} }]), t;}(),wg = function wg(e) {return function (t, n, r, o) {Ne(n);var i = Re(t),a = m(i),s = ae(i.length),u = e ? s - 1 : 0,c = e ? -1 : 1;if (r < 2) for (;;) {if (u in a) {o = a[u], u += c;break;}if (u += c, e ? u < 0 : s <= u) throw TypeError("Reduce of empty array with no initial value");}for (; e ? u >= 0 : s > u; u += c) {u in a && (o = n(o, a[u], u, i));}return o;};},bg = { left: wg(0), right: wg(1) }.left;De({ target: "Array", proto: 1, forced: Be("reduce") }, { reduce: function reduce(e) {return bg(this, e, arguments.length, arguments.length > 1 ? arguments[1] : void 0);} });var Ug = new (function () {function e() {on(this, e), this.map = new Map(), this.thresholdValue = 10;}return sn(e, [{ key: "push", value: function value(e, t) {if (this.map.has(e)) {var n = this.map.get(e);n.push(t), this.needReport(n) && (this.report(n, e), this.map.delete(e));} else this.map.set(e, [t]);} }, { key: "needReport", value: function value(e) {return e.length === this.thresholdValue;} }, { key: "report", value: function value(e, t) {var n = e.reduce(function (e, t) {return e + t;}) / e.length,r = Math.min.apply(null, e),o = Math.max.apply(null, e);is.log("AverageCalculator.report ".concat(t, " count=").concat(e.length, " average=").concat(n, "ms max=").concat(o, "ms min=").concat(r, "ms"));} }, { key: "reset", value: function value() {this.map.clear();} }]), e;}())(),Fg = function () {function e(t) {on(this, e), al.mixin(this), this.setLogLevel(0), this._initOptions(t), this._initMemberVariables(), this._initControllers(), this._initListener(), is.info("SDK inWxMiniApp:".concat(Oa, ", SDKAppID:").concat(t.SDKAppID)), is.info("UserAgent:".concat(Aa));}return sn(e, [{ key: "login", value: function value(e) {return is.time(bl), this.loginInfo.identifier = e.identifier || e.userID, this.loginInfo.userSig = e.userSig, this.signController.login(this.loginInfo);} }, { key: "logout", value: function value() {var e = this.signController.logout();return this.resetSDK(), e;} }, { key: "on", value: function value(e, t, n) {is.debug("on", "eventName:".concat(e)), this.outerEmitter.on(e, t, n || this);} }, { key: "once", value: function value(e, t, n) {is.debug("once", "eventName:".concat(e)), this.outerEmitter.once(e, t, n || this);} }, { key: "off", value: function value(e, t, n, r) {is.debug("off", "eventName:".concat(e)), this.outerEmitter.off(e, t, n, r);} }, { key: "registerPlugin", value: function value(e) {var t = this;this.plugins || (this.plugins = {}), Object.keys(e).forEach(function (n) {t.plugins[n] = e[n];});} }, { key: "getPlugin", value: function value(e) {return this.plugins[e] || void 0;} }, { key: "setLogLevel", value: function value(e) {is.setLevel(e);} }, { key: "downloadLog", value: function value() {var e = document.createElement("a"),t = new Date(),n = new Blob(this.getLog());e.download = "TIM-" + t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + "-" + this.loginInfo.SDKAppID + "-" + this.context.identifier + ".txt", e.href = URL.createObjectURL(n), e.click(), URL.revokeObjectURL(n);} }, { key: "destroy", value: function value() {this.logout(), this.outerEmitter.emit(Wt.SDK_DESTROY, { SDKAppID: this.loginInfo.SDKAppID });} }, { key: "createTextMessage", value: function value(e) {return this.messageController.createTextMessage(e);} }, { key: "createImageMessage", value: function value(e) {return this.messageController.createImageMessage(e);} }, { key: "createAudioMessage", value: function value(e) {return this.messageController.createAudioMessage(e);} }, { key: "createFileMessage", value: function value(e) {return Oa ? wl({ code: xc.MESSAGE_FILE_WECHAT_MINIAPP_NOT_SUPPORT, message: qc.MESSAGE_FILE_WECHAT_MINIAPP_NOT_SUPPORT }) : this.messageController.createFileMessage(e);} }, { key: "createFaceMessage", value: function value(e) {return this.messageController.createFaceMessage(e);} }, { key: "createCustomMessage", value: function value(e) {return this.messageController.createCustomMessage(e);} }, { key: "sendMessage", value: function value(e) {var t = this;return e instanceof Fh ? new Promise(function (n, r) {e.afterOperated(function (e) {t.messageController.sendMessageInstance(e).then(function (e) {n(e);}).catch(function (e) {r(e);});});}) : wl(new jc({ code: xc.MESSAGE_SEND_NEED_MESSAGE_INSTANCE, message: qc.MESSAGE_SEND_NEED_MESSAGE_INSTANCE }));} }, { key: "resendMessage", value: function value(e) {return this.messageController.resendMessage(e);} }, { key: "getMessageList", value: function value(e) {return this.messageController.getMessageList(e);} }, { key: "setMessageRead", value: function value(e) {return this.messageController.setMessageRead(e);} }, { key: "getConversationList", value: function value() {return this.conversationController.getConversationList();} }, { key: "getConversationProfile", value: function value(e) {return this.conversationController.getConversationProfile(e);} }, { key: "deleteConversation", value: function value(e) {return this.conversationController.deleteConversation(e);} }, { key: "getMyProfile", value: function value() {return this.userController.getMyProfile();} }, { key: "getUserProfile", value: function value(e) {return this.userController.getUserProfile(e);} }, { key: "updateMyProfile", value: function value(e) {return this.userController.updateMyProfile(e);} }, { key: "getFriendList", value: function value() {return this.userController.getFriendList();} }, { key: "deleteFriend", value: function value(e) {return this.userController.deleteFriend(e);} }, { key: "getBlacklist", value: function value() {return this.userController.getBlacklist();} }, { key: "addToBlacklist", value: function value(e) {return this.userController.addBlacklist(e);} }, { key: "removeFromBlacklist", value: function value(e) {return this.userController.deleteBlacklist(e);} }, { key: "getGroupList", value: function value(e) {return this.groupController.getGroupList(e);} }, { key: "getGroupProfile", value: function value(e) {return this.groupController.getGroupProfile(e);} }, { key: "createGroup", value: function value(e) {return this.groupController.createGroup(e);} }, { key: "dismissGroup", value: function value(e) {return this.groupController.dismissGroup(e);} }, { key: "updateGroupProfile", value: function value(e) {return this.groupController.updateGroupProfile(e);} }, { key: "joinGroup", value: function value(e) {return this.groupController.joinGroup(e);} }, { key: "quitGroup", value: function value(e) {return this.groupController.quitGroup(e);} }, { key: "searchGroupByID", value: function value(e) {return this.groupController.searchGroupByID(e);} }, { key: "changeGroupOwner", value: function value(e) {return this.groupController.changeGroupOwner(e);} }, { key: "handleGroupApplication", value: function value(e) {return this.groupController.handleGroupApplication(e);} }, { key: "setMessageRemindType", value: function value(e) {return this.groupController.setMessageRemindType(e);} }, { key: "getGroupMemberList", value: function value(e) {return this.groupController.getGroupMemberList(e);} }, { key: "addGroupMember", value: function value(e) {return this.groupController.addGroupMember(e);} }, { key: "deleteGroupMember", value: function value(e) {return this.groupController.deleteGroupMember(e);} }, { key: "setGroupMemberMuteTime", value: function value(e) {return this.groupController.setGroupMemberMuteTime(e);} }, { key: "setGroupMemberRole", value: function value(e) {return this.groupController.setGroupMemberRole(e);} }, { key: "setGroupMemberNameCard", value: function value(e) {return this.groupController.setGroupMemberNameCard(e);} }, { key: "setGroupMemberCustomField", value: function value(e) {return this.groupController.setGroupMemberCustomField(e);} }, { key: "_initOptions", value: function value(e) {this.plugins = {}, this.loginInfo = { SDKAppID: e.SDKAppID || null, accountType: Ts(), identifier: null, userSig: null }, this.options = { runLoopNetType: e.runLoopNetType || Tl, enablePointer: e.enablePointer || 0 };} }, { key: "_initMemberVariables", value: function value() {this.context = null, this.innerEmitter = new gg(), this.outerEmitter = new gg(), Gl(this.outerEmitter), this.packageConfig = new _g(this), this.storage = new hg(this), this.outerEmitter._emit = this.outerEmitter.emit, this.outerEmitter.emit = function (e, t) {var n = arguments[0],r = [n, { name: arguments[0], data: arguments[1] }];is.debug("emit ".concat(n), r[1]), this.outerEmitter._emit.apply(this.outerEmitter, r);}.bind(this);} }, { key: "_initControllers", value: function value() {this.exceptionController = new ih(this), this.connectionController = new nh(this), this.contextController = new pl(this), this.signController = new jl(this), this.messageController = new rg(this), this.conversationController = new Vh(this), this.userController = new _h(this), this.groupController = new ug(this), this.notificationController = new mg(this), this.statusController = new pg(this), this.uploadController = new Ig(this), this.reporterController = new kg(this), this._initReadyListener();} }, { key: "_initListener", value: function value() {this.innerEmitter.on(Xc.NOTICE_LONGPOLL_LONG_RECONNECT, this._onNoticeChannelReconnectedAfterLongTime, this);} }, { key: "_initReadyListener", value: function value() {for (var e = this, t = this.readyList, n = 0, r = t.length; n < r; n++) {this[t[n]].ready(function () {return e._readyHandle();});}} }, { key: "_onNoticeChannelReconnectedAfterLongTime", value: function value(e) {is.log("reconnect after long time...", e), this.notificationController.closeNoticeChannel(), this.resetSDK(), this.login(this.loginInfo);} }, { key: "resetSDK", value: function value() {var e = this;this.initList.forEach(function (t) {e[t].reset && e[t].reset();}), this.storage.reset(), Ug.reset(), this.resetReady(), this._initReadyListener(), this.outerEmitter.emit(Wt.SDK_NOT_READY);} }, { key: "_readyHandle", value: function value() {for (var e = this.readyList, t = 1, n = 0, r = e.length; n < r; n++) {if (!this[e[n]].isReady()) {t = 0;break;}}t && (is.warn("SDK is ready. cost=".concat(is.timeEnd(bl), "ms")), this.triggerReady(), this.innerEmitter.emit(Xc.SDK_READY), this.outerEmitter.emit(Wt.SDK_READY));} }]), e;}();Fg.prototype.readyList = ["conversationController"], Fg.prototype.initList = ["exceptionController", "connectionController", "signController", "contextController", "messageController", "conversationController", "userController", "groupController", "notificationController"];var xg = { login: "login", on: "on", off: "off", ready: "ready", setLogLevel: "setLogLevel", joinGroup: "joinGroup", registerPlugin: "registerPlugin" };function qg(e, t, n) {if (e || void 0 !== xg[t]) return 1;n.innerEmitter.emit(Xc.ERROR_DETECTED, new jc({ code: xc.SDK_IS_NOT_READY, message: "".concat(qc.SDK_IS_NOT_READY, " ").concat(t) }));}var jg = {},Bg = {};return Bg.create = function (e) {if (e.SDKAppID && jg[e.SDKAppID]) return jg[e.SDKAppID];is.log("TIM.create");var t = new Fg(e);t.on(Wt.SDK_DESTROY, function (e) {jg[e.data.SDKAppID] = null, delete jg[e.data.SDKAppID];});var n = function (e) {var t = Object.create(null);return Object.keys(Us).forEach(function (n) {if (e[n]) {var r = Us[n],o = new En();t[r] = function () {var t = Array.from(arguments);return o.use(function (t, r) {if (qg(e.isReady(), n, e)) return r();}).use(function (e, t) {if (1 == ks(e, bs[n], r)) return t();}).use(function (t, r) {return e[n].apply(e, t);}), o.run(t);};}}), t;}(t);return jg[e.SDKAppID] = n, is.log("TIM.create ok"), n;}, Bg.TYPES = Xt, Bg.EVENT = Wt, Bg.VERSION = "2.1.4", is.log("TIM.VERSION: ".concat(Bg.VERSION)), Bg;});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 17:
/*!*************************************************!*\
  !*** E:/graduation/snp-uniapp/commen/commen.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var commen = {};


commen.emojiList = [
[{
  "url": "100.gif",
  alt: "[微笑]" },
{
  "url": "101.gif",
  alt: "[伤心]" },
{
  "url": "102.gif",
  alt: "[美女]" },
{
  "url": "103.gif",
  alt: "[发呆]" },
{
  "url": "104.gif",
  alt: "[墨镜]" },
{
  "url": "105.gif",
  alt: "[哭]" },
{
  "url": "106.gif",
  alt: "[羞]" },
{
  "url": "107.gif",
  alt: "[哑]" },
{
  "url": "108.gif",
  alt: "[睡]" },
{
  "url": "109.gif",
  alt: "[哭]" },
{
  "url": "110.gif",
  alt: "[囧]" },
{
  "url": "111.gif",
  alt: "[怒]" },
{
  "url": "112.gif",
  alt: "[调皮]" },
{
  "url": "113.gif",
  alt: "[笑]" },
{
  "url": "114.gif",
  alt: "[惊讶]" },
{
  "url": "115.gif",
  alt: "[难过]" },
{
  "url": "116.gif",
  alt: "[酷]" },
{
  "url": "117.gif",
  alt: "[汗]" },
{
  "url": "118.gif",
  alt: "[抓狂]" },
{
  "url": "119.gif",
  alt: "[吐]" },
{
  "url": "120.gif",
  alt: "[笑]" },
{
  "url": "121.gif",
  alt: "[快乐]" },
{
  "url": "122.gif",
  alt: "[奇]" },
{
  "url": "123.gif",
  alt: "[傲]" }],

[{
  "url": "124.gif",
  alt: "[饿]" },
{
  "url": "125.gif",
  alt: "[累]" },
{
  "url": "126.gif",
  alt: "[吓]" },
{
  "url": "127.gif",
  alt: "[汗]" },
{
  "url": "128.gif",
  alt: "[高兴]" },
{
  "url": "129.gif",
  alt: "[闲]" },
{
  "url": "130.gif",
  alt: "[努力]" },
{
  "url": "131.gif",
  alt: "[骂]" },
{
  "url": "132.gif",
  alt: "[疑问]" },
{
  "url": "133.gif",
  alt: "[秘密]" },
{
  "url": "134.gif",
  alt: "[乱]" },
{
  "url": "135.gif",
  alt: "[疯]" },
{
  "url": "136.gif",
  alt: "[哀]" },
{
  "url": "137.gif",
  alt: "[鬼]" },
{
  "url": "138.gif",
  alt: "[打击]" },
{
  "url": "139.gif",
  alt: "[bye]" },
{
  "url": "140.gif",
  alt: "[汗]" },
{
  "url": "141.gif",
  alt: "[抠]" },
{
  "url": "142.gif",
  alt: "[鼓掌]" },
{
  "url": "143.gif",
  alt: "[糟糕]" },
{
  "url": "144.gif",
  alt: "[恶搞]" },
{
  "url": "145.gif",
  alt: "[什么]" },
{
  "url": "146.gif",
  alt: "[什么]" },
{
  "url": "147.gif",
  alt: "[累]" }],

[{
  "url": "148.gif",
  alt: "[看]" },
{
  "url": "149.gif",
  alt: "[难过]" },
{
  "url": "150.gif",
  alt: "[难过]" },
{
  "url": "151.gif",
  alt: "[坏]" },
{
  "url": "152.gif",
  alt: "[亲]" },
{
  "url": "153.gif",
  alt: "[吓]" },
{
  "url": "154.gif",
  alt: "[可怜]" },
{
  "url": "155.gif",
  alt: "[刀]" },
{
  "url": "156.gif",
  alt: "[水果]" },
{
  "url": "157.gif",
  alt: "[酒]" },
{
  "url": "158.gif",
  alt: "[篮球]" },
{
  "url": "159.gif",
  alt: "[乒乓]" },
{
  "url": "160.gif",
  alt: "[咖啡]" },
{
  "url": "161.gif",
  alt: "[美食]" },
{
  "url": "162.gif",
  alt: "[动物]" },
{
  "url": "163.gif",
  alt: "[鲜花]" },
{
  "url": "164.gif",
  alt: "[枯]" },
{
  "url": "165.gif",
  alt: "[唇]" },
{
  "url": "166.gif",
  alt: "[爱]" },
{
  "url": "167.gif",
  alt: "[分手]" },
{
  "url": "168.gif",
  alt: "[生日]" },
{
  "url": "169.gif",
  alt: "[电]" },
{
  "url": "170.gif",
  alt: "[炸弹]" },
{
  "url": "171.gif",
  alt: "[刀子]" }],

[{
  "url": "172.gif",
  alt: "[足球]" },
{
  "url": "173.gif",
  alt: "[瓢虫]" },
{
  "url": "174.gif",
  alt: "[翔]" },
{
  "url": "175.gif",
  alt: "[月亮]" },
{
  "url": "176.gif",
  alt: "[太阳]" },
{
  "url": "177.gif",
  alt: "[礼物]" },
{
  "url": "178.gif",
  alt: "[抱抱]" },
{
  "url": "179.gif",
  alt: "[拇指]" },
{
  "url": "180.gif",
  alt: "[贬低]" },
{
  "url": "181.gif",
  alt: "[握手]" },
{
  "url": "182.gif",
  alt: "[剪刀手]" },
{
  "url": "183.gif",
  alt: "[抱拳]" },
{
  "url": "184.gif",
  alt: "[勾引]" },
{
  "url": "185.gif",
  alt: "[拳头]" },
{
  "url": "186.gif",
  alt: "[小拇指]" },
{
  "url": "187.gif",
  alt: "[拇指八]" },
{
  "url": "188.gif",
  alt: "[食指]" },
{
  "url": "189.gif",
  alt: "[ok]" },
{
  "url": "190.gif",
  alt: "[情侣]" },
{
  "url": "191.gif",
  alt: "[爱心]" },
{
  "url": "192.gif",
  alt: "[蹦哒]" },
{
  "url": "193.gif",
  alt: "[颤抖]" },
{
  "url": "194.gif",
  alt: "[怄气]" },
{
  "url": "195.gif",
  alt: "[跳舞]" }],

[{
  "url": "196.gif",
  alt: "[发呆]" },
{
  "url": "197.gif",
  alt: "[背着]" },
{
  "url": "198.gif",
  alt: "[伸手]" },
{
  "url": "199.gif",
  alt: "[耍帅]" },
{
  "url": "200.png",
  alt: "[微笑]" },
{
  "url": "201.png",
  alt: "[生病]" },
{
  "url": "202.png",
  alt: "[哭泣]" },
{
  "url": "203.png",
  alt: "[吐舌]" },
{
  "url": "204.png",
  alt: "[迷糊]" },
{
  "url": "205.png",
  alt: "[瞪眼]" },
{
  "url": "206.png",
  alt: "[恐怖]" },
{
  "url": "207.png",
  alt: "[忧愁]" },
{
  "url": "208.png",
  alt: "[眨眉]" },
{
  "url": "209.png",
  alt: "[闭眼]" },
{
  "url": "210.png",
  alt: "[鄙视]" },
{
  "url": "211.png",
  alt: "[阴暗]" },
{
  "url": "212.png",
  alt: "[小鬼]" },
{
  "url": "213.png",
  alt: "[礼物]" },
{
  "url": "214.png",
  alt: "[拜佛]" },
{
  "url": "215.png",
  alt: "[力量]" },
{
  "url": "216.png",
  alt: "[金钱]" },
{
  "url": "217.png",
  alt: "[蛋糕]" },
{
  "url": "218.png",
  alt: "[彩带]" },
{
  "url": "219.png",
  alt: "[礼物]" }]];



/**@dateTimeFliter 转换格林日期时间格式为常用日期格式
                    * @time[必填] 						Date  		格林日期格式
                    * @part[可选,默认:0]				Number      选择返回日期时间部分  列:0:返回所有 1:只返回日期  2:只返回时间
                    * @dateComplete[可选,默认:true] 	Boolean 	日期位数不足是否添0补齐:true:补齐,false:不补齐
                    * @timeComplete[可选,默认:true] 	Boolean 	时间位数不足是否添0补齐:true:补齐,false:不补齐
                    * @dateConnector[可选,默认:-] 		String 		年月日连接符  例: - : /
                    * @timeConnector[可选,默认::] 		String 		时间连接符   例: - : /
                    * @hour12[可选,默认:false]          Boolean     是否返回12小时制时间   例: true:返回12小时制时间   false:返回24小时制时间
                    * @return   '2019-11-25 15:05:54'  String    返回示例
                    * **/
commen.dateTimeFliter = function (time)
{var part = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;var dateComplete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;var timeComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;var dateConnector = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '-';var timeConnector = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : ':';var hour12 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  var dateStr = '';
  var timeStr = '';
  //转换日期
  if (dateComplete) {//添0补齐
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
  }
  dateStr = year + dateConnector + month + dateConnector + day;
  //转换时间
  //修改小时制
  if (hour12) {
    if (hour > 12) {
      hour = hour - 12;
      if (timeComplete) {
        if (hour < 10) {
          hour = '下午 ' + '0' + hour;
        } else {
          hour = '下午 ' + hour;
        }
      }
    } else {
      if (timeComplete) {
        if (hour < 10) {
          hour = '上午 ' + '0' + hour;
        } else {
          hour = '上午 ' + hour;
        }
      }
    }
  }
  //判断分钟与秒
  if (timeComplete) {//添0补齐
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
  }
  timeStr = hour + timeConnector + minute + timeConnector + second;
  //合成输出值
  if (part == 0) {
    return dateStr + ' ' + timeStr;
  } else if (part == 1) {
    return dateStr;
  } else if (part == 2) {
    return timeStr;
  }
  return '传参有误';
};var _default =



commen;exports.default = _default;

/***/ }),

/***/ 18:
/*!***********************************************!*\
  !*** E:/graduation/snp-uniapp/store/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 19));
var _tim = _interopRequireDefault(__webpack_require__(/*! ../commen/tim/tim */ 15));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

_vue.default.use(_vuex.default);
var store = new _vuex.default.Store({
  state: {
    isLogin: false,
    isSDKReady: false, // TIM SDK 是否 ready

    conversationActive: {}, //聊天进行中的会话
    toUserId: '', //聊天对象id
    conversationList: [], //会话列表
    currentMessageList: [] //消息列表
  },


  mutations: {
    //更新登录状态
    toggleIsLogin: function toggleIsLogin(state, isLogin) {
      state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin;
    },
    //更新TIMSDK状态
    toggleIsSDKReady: function toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady;
    },
    //退出登录重置状态
    reset: function reset(state) {
      state.isLogin = false;
      state.isSDKReady = false;
    },
    //选择好友聊天--创建会话/拼接会话id
    createConversationActive: function createConversationActive(state, toUserId) {
      state.conversationActive.conversationID = 'C2C' + toUserId;
      state.toUserId = toUserId;
      state.currentMessageList = [];
    },
    //选择已有会话聊天--更新选中会话详情
    updateConversationActive: function updateConversationActive(state, conversationItem) {
      state.conversationActive = Object.assign({}, conversationItem.conversation);
      state.toUserId = conversationItem.user.userId;
      state.currentMessageList = [];
    },
    //更新会话列表
    updateConversationList: function updateConversationList(state, newConversationList) {
      state.conversationList = newConversationList;
    },
    /**
        * 将消息插入当前会话列表
        * 调用时机：收/发消息事件触发时
        * @param {Object} state
        * @param {Message[]|Message} data
        * @returns
        */
    pushCurrentMessageList: function pushCurrentMessageList(state, data) {
      // 还没当前会话，则跳过
      if (Array.isArray(data)) {
        // 筛选出当前会话的消息
        var result = data.filter(function (item) {return item.conversationID === state.conversationActive.conversationID;});
        state.currentMessageList = [].concat(_toConsumableArray(state.currentMessageList), _toConsumableArray(result));
      } else if (data.conversationID === state.conversationActive.conversationID) {
        state.currentMessageList = [].concat(_toConsumableArray(state.currentMessageList), [data]);
      }
      console.log('1111');
      console.log(state.currentMessageList);
    },
    /**
        * 滑到顶部请求更多的历史消息
        * */
    unshiftCurrentMessageList: function unshiftCurrentMessageList(state, data) {
      console.log(data);
      if (data) {
        state.currentMessageList = [].concat(_toConsumableArray(data), _toConsumableArray(state.currentMessageList));
      }
    } },


  actions: {} });var _default =



store;exports.default = _default;

/***/ }),

/***/ 19:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 34:
/*!***************************************************!*\
  !*** E:/graduation/snp-uniapp/commen/tim/user.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var userList = [{
  user: 'tsj',
  userId: '1',
  userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwoZQweKU7MSCgswUJStDEwMDYxNDYyMTiExqRUFmUSpQ3NTU1MjAwAAiWpKZCxazMDUxtTQxtoCakpkONDPTSTuqIqnAwzXDODgvwC3RtCo93cIgMqOw0jPcKSStwsU3x8KlpCoyIzHSVqkWAA9sMBQ_-OcctwjIp0izIsLg4Mdjb28e9ytu02NUl3zsnNNwis7I0u7TULbfCwFapFgBCAjBt',
  img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1735490596,2760195857&fm=26&gp=0.jpg' },

{
  user: 'user1',
  userId: '2',
  img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2262632647,543198910&fm=26&gp=0.jpg',
  userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zIhwlDB4pTsxIKCzBQlK0MTAwNjE0NjIxOITGpFQWZRKlDc1NTUyMDAACJakpkLFrMwNTG1NDGFihZnpgPNLPALiHDMCMtNcjVKLwrOr7QMiAwKjEquqPKISPQICTPyDSk2cU11L3Ysc7RVqgUAFfgv6w__' },

{
  user: 'user2',
  userId: '3',
  img: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=366135374,1364401596&fm=26&gp=0.jpg',
  userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwsZQweKU7MSCgswUJStDEwMDYxNDYyMTiExqRUFmUSpQ3NTU1MjAwAAiWpKZCxazMDUxMzIwsoCakpkONDOt3N-AzCndJDMz2dit1MfVstgtK6XQs8TJyNDP2SvJIyo0PcyzNDg30s3TVqkWAP28Lzg_' },

{
  user: 'user3',
  userId: '4',
  img: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=275868592,2250122918&fm=26&gp=0.jpg',
  userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwiZQweKU7MSCgswUJStDEwMDYxNDYyMTiExqRUFmUSpQ3NTU1MjAwAAiWpKZCxazMDUxtTQxN4SakpkONDMsoDBcO6kyv9DL29XQN9XJI7XIJ9Er0SfMyDmxzMTNwtQgL7cswM0rKDDZVqkWAAX1Lzo_' }];var _default =






userList;exports.default = _default;

/***/ }),

/***/ 4:
/*!*******************************************!*\
  !*** E:/graduation/snp-uniapp/pages.json ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 51:
/*!***********************************************!*\
  !*** E:/graduation/snp-uniapp/common/util.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }

  var hour = parseInt(time / 3600);
  time = time % 3600;
  var minute = parseInt(time / 60);
  time = time % 60;
  var second = time;

  return [hour, minute, second].map(function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }).join(':');
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
  }

  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.') };

}

function formatMoney(value, decimals) {
  var digitsRE = /(\d{3})(?=\d)/g; //定义对比
  value = parseFloat(value); //把字符串转换成数字
  if (!isFinite(value) || !value && value !== 0) {//如果它不是有限位数或者
    return '';
  }
  //currency = currency != null ? currency : '$';//如果第二位参数为空，那么就在最前面换成$符号
  decimals = decimals != null ? decimals : 2; //如果第3位参数为空，那么就保留2位小数。5221.84
  var stringified = Math.abs(value).toFixed(decimals); //先求绝对值,然后在保留2位小数
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified; //验证合法性
  var i = _int.length % 3; //进行分割，需要几个逗号
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''; //
  var _float = decimals ? stringified.slice(-1 - decimals) : '';
  var sign = value < 0 ? '-' : '';
  return sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
}

function getClientIp() {
  // 同步方式获取数据
  try {
    var _ip = uni.getStorageSync('cip');
    if (value) {
      console.log("const value = uni.getStorageSync('cip') 同步获取 = " + value);
      return _ip;
    }
  } catch (e) {};
  // 调用搜狐API获取外网IP
  var ip = "127.0.0.1";
  uni.request({
    url: 'http://pv.sohu.com/cityjson?ie=utf-8',
    success: function success(res) {
      console.log(res);
      var resData = res.data.substring(19, res.data.length - 1);
      console.log(resData);
      var returnCitySN = JSON.parse(resData);
      var clientIp = returnCitySN['cip'];
      console.log(clientIp);
      ip = clientIp;
    } });

  //同步数据缓存
  try {
    uni.setStorageSync('cip', ip);
  } catch (e) {};
  return ip;
}

var dateUtils = {
  UNITS: {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000 },

  humanize: function humanize(milliseconds) {
    var humanize = '';
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },
  format: function format(dateStr) {
    var date = this.parse(dateStr);
    var diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    var _format = function _format(number) {
      return number < 10 ? '0' + number : number;
    };
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
    _format(date.getHours()) + ':' + _format(date.getMinutes());
  },
  parse: function parse(str) {//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  } };


function getTimeFormat(timeStamp) {
  var time = "";
  var date = new Date(parseInt(timeStamp));
  time += date.getFullYear() + "年";
  time += date.getMonth() + 1 + "月";
  time += date.getDate() + "日 ";
  time += date.getHours() + ":";
  time += date.getMinutes() + ":";
  time += date.getSeconds();
  return time;
}
module.exports = {
  getTimeFormat: getTimeFormat,
  formatTime: formatTime,
  formatLocation: formatLocation,
  formatMoney: formatMoney,
  getClientIp: getClientIp,
  dateUtils: dateUtils };
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 52:
/*!*******************************************************!*\
  !*** E:/graduation/snp-uniapp/common/graceChecker.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /**
              数据验证（表单验证）
              来自 grace.hcoder.net 
              作者 hcoder 深海
              */
module.exports = {
  error: '',
  check: function check(data, rule) {
    for (var i = 0; i < rule.length; i++) {
      if (!rule[i].checkType) {return true;}
      if (!rule[i].name) {return true;}
      if (!rule[i].errorMsg) {return true;}
      if (!data[rule[i].name]) {this.error = rule[i].errorMsg;return false;}
      switch (rule[i].checkType) {
        case 'string':
          var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'int':
          var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
          break;
        case 'between':
          if (!this.isNumber(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          var minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'betweenD':
          var reg = /^-?[1-9][0-9]?$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          var minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'betweenF':
          var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          var minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'same':
          if (data[rule[i].name] != rule[i].checkRule) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'notsame':
          if (data[rule[i].name] == rule[i].checkRule) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'email':
          var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'phoneno':
          var reg = /^1[0-9]{10,10}$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'zipcode':
          var reg = /^[0-9]{6}$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'reg':
          var reg = new RegExp(rule[i].checkRule);
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'in':
          if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
            this.error = rule[i].errorMsg;return false;
          }
          break;
        case 'notnull':
          if (data[rule[i].name] == null || data[rule[i].name].length < 1) {this.error = rule[i].errorMsg;return false;}
          break;}

    }
    return true;
  },
  isNumber: function isNumber(checkVal) {
    var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
    return reg.test(checkVal);
  } };

/***/ }),

/***/ 53:
/*!**********************************************!*\
  !*** E:/graduation/snp-uniapp/common/md5.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_RESULT__; /**
               * [js-md5]{@link https://github.com/emn178/js-md5}
               *
               * @namespace md5
               * @version 0.7.3
               * @author Chen, Yi-Cyuan [emn178@gmail.com]
               * @copyright Chen, Yi-Cyuan 2014-2017
               * @license MIT
               */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_MD5_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD =  true && __webpack_require__(/*! !webpack amd options */ 56);
  var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
  var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

  var blocks = [],buffer8;
  if (ARRAY_BUFFER) {
    var buffer = new ArrayBuffer(68);
    buffer8 = new Uint8Array(buffer);
    blocks = new Uint32Array(buffer);
  }

  if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  /**
     * @method hex
     * @memberof md5
     * @description Output hash as hex string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} Hex string
     * @example
     * md5.hex('The quick brown fox jumps over the lazy dog');
     * // equal to
     * md5('The quick brown fox jumps over the lazy dog');
     */
  /**
         * @method digest
         * @memberof md5
         * @description Output hash as bytes array
         * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
         * @returns {Array} Bytes array
         * @example
         * md5.digest('The quick brown fox jumps over the lazy dog');
         */
  /**
             * @method array
             * @memberof md5
             * @description Output hash as bytes array
             * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
             * @returns {Array} Bytes array
             * @example
             * md5.array('The quick brown fox jumps over the lazy dog');
             */
  /**
                 * @method arrayBuffer
                 * @memberof md5
                 * @description Output hash as ArrayBuffer
                 * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                 * @returns {ArrayBuffer} ArrayBuffer
                 * @example
                 * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
                 */
  /**
                     * @method buffer
                     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
                     * @memberof md5
                     * @description Output hash as ArrayBuffer
                     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                     * @returns {ArrayBuffer} ArrayBuffer
                     * @example
                     * md5.buffer('The quick brown fox jumps over the lazy dog');
                     */
  /**
                         * @method base64
                         * @memberof md5
                         * @description Output hash as base64 string
                         * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                         * @returns {String} base64 string
                         * @example
                         * md5.base64('The quick brown fox jumps over the lazy dog');
                         */
  var createOutputMethod = function createOutputMethod(outputType) {
    return function (message) {
      return new Md5(true).update(message)[outputType]();
    };
  };

  /**
      * @method create
      * @memberof md5
      * @description Create Md5 object
      * @returns {Md5} Md5 object.
      * @example
      * var hash = md5.create();
      */
  /**
          * @method update
          * @memberof md5
          * @description Create and update Md5 object
          * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
          * @returns {Md5} Md5 object.
          * @example
          * var hash = md5.update('The quick brown fox jumps over the lazy dog');
          * // equal to
          * var hash = md5.create();
          * hash.update('The quick brown fox jumps over the lazy dog');
          */
  var createMethod = function createMethod() {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Md5();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };

  var nodeWrap = function nodeWrap(method) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var nodeMethod = function nodeMethod(message) {
      if (typeof message === 'string') {
        return crypto.createHash('md5').update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw ERROR;
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
      message.constructor === Buffer) {
        return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };



  /**
      * Md5 class
      * @class Md5
      * @description This is internal class.
      * @see {@link md5.create}
      */
  function Md5(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
      this.buffer8 = buffer8;
    } else {
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        this.buffer8 = new Uint8Array(buffer);
        this.blocks = new Uint32Array(buffer);
      } else {
        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }

  /**
     * @method update
     * @memberof Md5
     * @instance
     * @description Update hash
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @see {@link md5.update}
     */
  Md5.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }

    var notString,type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw ERROR;
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw ERROR;
          }
        }
      } else {
        throw ERROR;
      }
      notString = true;
    }
    var code,index = 0,i,length = message.length,blocks = this.blocks;
    var buffer8 = this.buffer8;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            buffer8[i++] = message[index];
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              buffer8[i++] = code;
            } else if (code < 0x800) {
              buffer8[i++] = 0xc0 | code >> 6;
              buffer8[i++] = 0x80 | code & 0x3f;
            } else if (code < 0xd800 || code >= 0xe000) {
              buffer8[i++] = 0xe0 | code >> 12;
              buffer8[i++] = 0x80 | code >> 6 & 0x3f;
              buffer8[i++] = 0x80 | code & 0x3f;
            } else {
              code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
              buffer8[i++] = 0xf0 | code >> 18;
              buffer8[i++] = 0x80 | code >> 12 & 0x3f;
              buffer8[i++] = 0x80 | code >> 6 & 0x3f;
              buffer8[i++] = 0x80 | code & 0x3f;
            }
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | code >> 6) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | code >> 12) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
              blocks[i >> 2] |= (0xf0 | code >> 18) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 12 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            }
          }
        }
      }
      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Md5.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks,i = this.lastByteIndex;
    blocks[i >> 2] |= EXTRA[i & 3];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.bytes << 3;
    blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
    this.hash();
  };

  Md5.prototype.hash = function () {
    var a,b,c,d,bc,da,blocks = this.blocks;

    if (this.first) {
      a = blocks[0] - 680876937;
      a = (a << 7 | a >>> 25) - 271733879 << 0;
      d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
      d = (d << 12 | d >>> 20) + a << 0;
      c = (-271733879 ^ d & (a ^ -271733879)) + blocks[2] - 1126478375;
      c = (c << 17 | c >>> 15) + d << 0;
      b = (a ^ c & (d ^ a)) + blocks[3] - 1316259209;
      b = (b << 22 | b >>> 10) + c << 0;
    } else {
      a = this.h0;
      b = this.h1;
      c = this.h2;
      d = this.h3;
      a += (d ^ b & (c ^ d)) + blocks[0] - 680876936;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks[1] - 389564586;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks[2] + 606105819;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks[3] - 1044525330;
      b = (b << 22 | b >>> 10) + c << 0;
    }

    a += (d ^ b & (c ^ d)) + blocks[4] - 176418897;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[5] + 1200080426;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[6] - 1473231341;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[7] - 45705983;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ b & (c ^ d)) + blocks[8] + 1770035416;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[9] - 1958414417;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[10] - 42063;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[11] - 1990404162;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ b & (c ^ d)) + blocks[12] + 1804603682;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[13] - 40341101;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[14] - 1502002290;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[15] + 1236535329;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[1] - 165796510;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[6] - 1069501632;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[11] + 643717713;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[0] - 373897302;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[5] - 701558691;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[10] + 38016083;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[15] - 660478335;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[4] - 405537848;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[9] + 568446438;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[14] - 1019803690;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[3] - 187363961;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[8] + 1163531501;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[13] - 1444681467;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[2] - 51403784;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[7] + 1735328473;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[12] - 1926607734;
    b = (b << 20 | b >>> 12) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[5] - 378558;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[8] - 2022574463;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[11] + 1839030562;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[14] - 35309556;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[1] - 1530992060;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[4] + 1272893353;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[7] - 155497632;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[10] - 1094730640;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[13] + 681279174;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[0] - 358537222;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[3] - 722521979;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[6] + 76029189;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[9] - 640364487;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[12] - 421815835;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[15] + 530742520;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[2] - 995338651;
    b = (b << 23 | b >>> 9) + c << 0;
    a += (c ^ (b | ~d)) + blocks[0] - 198630844;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[5] - 57434055;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[10] - 1051523;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[15] - 30611744;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[4] - 145523070;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[2] + 718787259;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[9] - 343485551;
    b = (b << 21 | b >>> 11) + c << 0;

    if (this.first) {
      this.h0 = a + 1732584193 << 0;
      this.h1 = b - 271733879 << 0;
      this.h2 = c - 1732584194 << 0;
      this.h3 = d + 271733878 << 0;
      this.first = false;
    } else {
      this.h0 = this.h0 + a << 0;
      this.h1 = this.h1 + b << 0;
      this.h2 = this.h2 + c << 0;
      this.h3 = this.h3 + d << 0;
    }
  };

  /**
      * @method hex
      * @memberof Md5
      * @instance
      * @description Output hash as hex string
      * @returns {String} Hex string
      * @see {@link md5.hex}
      * @example
      * hash.hex();
      */
  Md5.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0,h1 = this.h1,h2 = this.h2,h3 = this.h3;

    return HEX_CHARS[h0 >> 4 & 0x0F] + HEX_CHARS[h0 & 0x0F] +
    HEX_CHARS[h0 >> 12 & 0x0F] + HEX_CHARS[h0 >> 8 & 0x0F] +
    HEX_CHARS[h0 >> 20 & 0x0F] + HEX_CHARS[h0 >> 16 & 0x0F] +
    HEX_CHARS[h0 >> 28 & 0x0F] + HEX_CHARS[h0 >> 24 & 0x0F] +
    HEX_CHARS[h1 >> 4 & 0x0F] + HEX_CHARS[h1 & 0x0F] +
    HEX_CHARS[h1 >> 12 & 0x0F] + HEX_CHARS[h1 >> 8 & 0x0F] +
    HEX_CHARS[h1 >> 20 & 0x0F] + HEX_CHARS[h1 >> 16 & 0x0F] +
    HEX_CHARS[h1 >> 28 & 0x0F] + HEX_CHARS[h1 >> 24 & 0x0F] +
    HEX_CHARS[h2 >> 4 & 0x0F] + HEX_CHARS[h2 & 0x0F] +
    HEX_CHARS[h2 >> 12 & 0x0F] + HEX_CHARS[h2 >> 8 & 0x0F] +
    HEX_CHARS[h2 >> 20 & 0x0F] + HEX_CHARS[h2 >> 16 & 0x0F] +
    HEX_CHARS[h2 >> 28 & 0x0F] + HEX_CHARS[h2 >> 24 & 0x0F] +
    HEX_CHARS[h3 >> 4 & 0x0F] + HEX_CHARS[h3 & 0x0F] +
    HEX_CHARS[h3 >> 12 & 0x0F] + HEX_CHARS[h3 >> 8 & 0x0F] +
    HEX_CHARS[h3 >> 20 & 0x0F] + HEX_CHARS[h3 >> 16 & 0x0F] +
    HEX_CHARS[h3 >> 28 & 0x0F] + HEX_CHARS[h3 >> 24 & 0x0F];
  };

  /**
      * @method toString
      * @memberof Md5
      * @instance
      * @description Output hash as hex string
      * @returns {String} Hex string
      * @see {@link md5.hex}
      * @example
      * hash.toString();
      */
  Md5.prototype.toString = Md5.prototype.hex;

  /**
                                               * @method digest
                                               * @memberof Md5
                                               * @instance
                                               * @description Output hash as bytes array
                                               * @returns {Array} Bytes array
                                               * @see {@link md5.digest}
                                               * @example
                                               * hash.digest();
                                               */
  Md5.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0,h1 = this.h1,h2 = this.h2,h3 = this.h3;
    return [
    h0 & 0xFF, h0 >> 8 & 0xFF, h0 >> 16 & 0xFF, h0 >> 24 & 0xFF,
    h1 & 0xFF, h1 >> 8 & 0xFF, h1 >> 16 & 0xFF, h1 >> 24 & 0xFF,
    h2 & 0xFF, h2 >> 8 & 0xFF, h2 >> 16 & 0xFF, h2 >> 24 & 0xFF,
    h3 & 0xFF, h3 >> 8 & 0xFF, h3 >> 16 & 0xFF, h3 >> 24 & 0xFF];

  };

  /**
      * @method array
      * @memberof Md5
      * @instance
      * @description Output hash as bytes array
      * @returns {Array} Bytes array
      * @see {@link md5.array}
      * @example
      * hash.array();
      */
  Md5.prototype.array = Md5.prototype.digest;

  /**
                                               * @method arrayBuffer
                                               * @memberof Md5
                                               * @instance
                                               * @description Output hash as ArrayBuffer
                                               * @returns {ArrayBuffer} ArrayBuffer
                                               * @see {@link md5.arrayBuffer}
                                               * @example
                                               * hash.arrayBuffer();
                                               */
  Md5.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(16);
    var blocks = new Uint32Array(buffer);
    blocks[0] = this.h0;
    blocks[1] = this.h1;
    blocks[2] = this.h2;
    blocks[3] = this.h3;
    return buffer;
  };

  /**
      * @method buffer
      * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
      * @memberof Md5
      * @instance
      * @description Output hash as ArrayBuffer
      * @returns {ArrayBuffer} ArrayBuffer
      * @see {@link md5.buffer}
      * @example
      * hash.buffer();
      */
  Md5.prototype.buffer = Md5.prototype.arrayBuffer;

  /**
                                                     * @method base64
                                                     * @memberof Md5
                                                     * @instance
                                                     * @description Output hash as base64 string
                                                     * @returns {String} base64 string
                                                     * @see {@link md5.base64}
                                                     * @example
                                                     * hash.base64();
                                                     */
  Md5.prototype.base64 = function () {
    var v1,v2,v3,base64Str = '',bytes = this.array();
    for (var i = 0; i < 15;) {
      v1 = bytes[i++];
      v2 = bytes[i++];
      v3 = bytes[i++];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
      BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
      BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
      BASE64_ENCODE_CHAR[v3 & 63];
    }
    v1 = bytes[i];
    base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
    BASE64_ENCODE_CHAR[v1 << 4 & 63] +
    '==';
    return base64Str;
  };

  var exports = createMethod();

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    /**
           * @method md5
           * @description Md5 hash function, export to global in browsers.
           * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
           * @returns {String} md5 hashes
           * @example
           * md5(''); // d41d8cd98f00b204e9800998ecf8427e
           * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
           * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
           *
           * // It also supports UTF-8 encoding
           * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
           *
           * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
           * md5([]); // d41d8cd98f00b204e9800998ecf8427e
           * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
           */
    root.md5 = exports;
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return exports;
      }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/node-libs-browser/mock/process.js */ 54), __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 54:
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 55);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ 55:
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 54)))

/***/ }),

/***/ 56:
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),

/***/ 7:
/*!************************************************************!*\
  !*** E:/graduation/snp-uniapp/pages.json?{"type":"style"} ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "uni-app", "enablePullDownRefresh": true, "backgroundTextStyle": "light", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/index/message": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/index/mine": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/login": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/register": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/information": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/changemail": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/newmail": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/forget_password": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/mail_login": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/verification_mail": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/reset_password": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/bandmail": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/userpage": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/change_information": { "usingComponents": {}, "usingAutoImportComponents": {} }, "components/choose-image/choose-image": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personal/change_headpic": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/subscriber/homepage": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/subscriber/user_list": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/write/write": { "usingComponents": { "sunui-upimg": "/components/sunui-upimg/sunui-upimg" }, "usingAutoImportComponents": {} }, "pages/subscriber/user_say": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/write/discuss": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/write/notLoginDiscuss": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/write/login_discuss": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/write/user_say_discuss": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/chat/room": { "navigationBarTitleText": "聊天室", "usingComponents": {}, "usingAutoImportComponents": {} } }, "globalStyle": { "navigationBarBackgroundColor": "#0081ff", "navigationBarTitleText": "ColorUi for UniApp", "navigationStyle": "custom", "navigationBarTextStyle": "white" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!***********************************************************!*\
  !*** E:/graduation/snp-uniapp/pages.json?{"type":"stat"} ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__0AA3F88" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
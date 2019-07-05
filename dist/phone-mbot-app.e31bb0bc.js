// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"mbot/mbot.js":[function(require,module,exports) {
'use strict';
/**
 * General configuration (UUID)
*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config =
/*#__PURE__*/
function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, [{
    key: "name",
    value: function name() {
      return "Makeblock_LE";
    }
  }, {
    key: "service",
    value: function service() {
      return "0000ffe1-0000-1000-8000-00805f9b34fb";
    }
  }, {
    key: "charateristic",
    value: function charateristic() {
      return "0000ffe3-0000-1000-8000-00805f9b34fb";
    }
  }]);

  return Config;
}(); // Const for instructions types


var TYPE_MOTOR = 0x0a,
    TYPE_RGB = 0x08,
    TYPE_SOUND = 0x07; // Const for the ports

var PORT_1 = 0x01,
    PORT_2 = 0x02,
    PORT_3 = 0x03,
    PORT_4 = 0x04,
    PORT_5 = 0x05,
    PORT_6 = 0x06,
    PORT_7 = 0x07,
    PORT_8 = 0x08,
    M_1 = 0x09,
    M_2 = 0x0a;
/**
 * Class for the robot
 * */

var MBot =
/*#__PURE__*/
function () {
  function MBot() {
    _classCallCheck(this, MBot);

    this.device = null;
    this.config = new Config();
    this.onDisconnected = this.onDisconnected.bind(this);
    this.buzzerIndex = 0;
  }
  /*
  Request the device with bluetooth
  */


  _createClass(MBot, [{
    key: "request",
    value: function request() {
      var _this = this;

      var options = {
        "filters": [{
          "name": this.config.name()
        }],
        "optionalServices": [this.config.service()]
      };
      return navigator.bluetooth.requestDevice(options).then(function (device) {
        _this.device = device;

        _this.device.addEventListener('gattserverdisconnected', _this.onDisconnected);

        return device;
      });
    }
    /**
     * Connect to the device
     * */

  }, {
    key: "connect",
    value: function connect() {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      } else {
        return this.device.gatt.connect();
      }
    }
    /**
     * Control the motors of robot
    */

  }, {
    key: "processMotor",
    value: function processMotor(valueM1, valueM2) {
      var _this2 = this;

      return this._writeCharacteristic(this._genericControl(TYPE_MOTOR, M_1, 0, valueM1)).then(function () {
        return _this2._writeCharacteristic(_this2._genericControl(TYPE_MOTOR, M_2, 0, valueM2));
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, {
    key: "processBuzzer",
    value: function processBuzzer() {
      this.buzzerIndex = (this.buzzerIndex + 1) % 8;
      return this._writeCharacteristic(this._genericControl(TYPE_SOUND, PORT_2, 22, this.buzzerIndex)).catch(function (error) {
        console.error(error);
      });
    }
  }, {
    key: "processColor",
    value: function processColor(red, blue, green) {
      var rHex = red << 8;
      var gHex = green << 16;
      var bHex = blue << 24;
      var value = rHex | gHex | bHex;

      this._writeCharacteristic(this._genericControl(TYPE_RGB, PORT_6, 0, value));
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      } else {
        return this.device.gatt.disconnect();
      }
    }
  }, {
    key: "onDisconnected",
    value: function onDisconnected() {
      console.log('Device is disconnected.');
    }
  }, {
    key: "_genericControl",
    value: function _genericControl(type, port, slot, value) {
      /*
      ff 55 len idx action device port  slot  data a
      0  1  2   3   4      5      6     7     8
      */
      // Static values
      var buf = new ArrayBuffer(16);
      var bufView = new Uint16Array(buf);
      var byte0 = 0xff,
          // Static header
      byte1 = 0x55,
          // Static header
      byte2 = 0x09,
          // len
      byte3 = 0x00,
          // idx
      byte4 = 0x02,
          // action
      byte5 = type,
          // device
      byte6 = port,
          // port
      byte7 = slot; // slot
      //dynamics values

      var byte8 = 0x00,
          // data
      byte9 = 0x00,
          // data
      byte10 = 0x00,
          // data
      byte11 = 0x00; // data
      //End of message

      var byte12 = 0x0a,
          byte13 = 0x00,
          byte14 = 0x00,
          byte15 = 0x00;

      switch (type) {
        case TYPE_MOTOR:
          // Motor M1
          // ff:55  09:00  02:0a  09:64  00:00  00:00  0a"
          // 0x55ff;0x0009;0x0a02;0x0964;0x0000;0x0000;0x000a;0x0000;
          // Motor M2
          // ff:55:09:00:02:0a:0a:64:00:00:00:00:0a                
          var tempValue = value < 0 ? parseInt("ffff", 16) + Math.max(-255, value) : Math.min(255, value);
          byte7 = tempValue & 0x00ff;
          byte8 = 0x00;
          byte8 = tempValue >> 8;
          break;

        case TYPE_RGB:
          // ff:55  09:00  02:08  06:00  5c:99  6d:00  0a
          // 0x55ff;0x0009;0x0802;0x0006;0x995c;0x006d;0x000a;0x0000;
          byte7 = 0x00;
          byte8 = value >> 8 & 0xff;
          byte9 = value >> 16 & 0xff;
          byte10 = value >> 24 & 0xff;
          break;

        case TYPE_SOUND:
          //ff:55:05:00:02:22:00:00:0a
          //ff:55:05:00:02:22:06:01:0a
          //ff:55:05:00:02:22:ee:01:0a
          //ff:55:05:00:02:22:88:01:0a
          //ff:55:05:00:02:22:b8:01:0a
          //ff:55:05:00:02:22:5d:01:0a
          //ff:55:05:00:02:22:4a:01:0a
          //ff:55:05:00:02:22:26:01:0a
          byte2 = 0x05;
          byte5 = 0x22;

          if (value === 0) {
            byte6 = 0x00;
            byte7 = 0x00;
          } else if (value === 1) {
            byte6 = 0x06;
            byte7 = 0x01;
          } else if (value === 2) {
            byte6 = 0xee;
            byte7 = 0x01;
          } else if (value === 3) {
            byte6 = 0x88;
            byte7 = 0x01;
          } else if (value === 4) {
            byte6 = 0xb8;
            byte7 = 0x01;
          } else if (value === 5) {
            byte6 = 0x5d;
            byte7 = 0x01;
          } else if (value === 6) {
            byte6 = 0x4a;
            byte7 = 0x01;
          } else {
            byte6 = 0x26;
            byte7 = 0x01;
          }

          byte8 = 0x0a;
          byte12 = 0x00;
          break;
      }

      bufView[0] = byte1 << 8 | byte0;
      bufView[1] = byte3 << 8 | byte2;
      bufView[2] = byte5 << 8 | byte4;
      bufView[3] = byte7 << 8 | byte6;
      bufView[4] = byte9 << 8 | byte8;
      bufView[5] = byte11 << 8 | byte10;
      bufView[6] = byte13 << 8 | byte12;
      bufView[7] = byte15 << 8 | byte14;
      console.log(byte0.toString(16) + ":" + byte1.toString(16) + ":" + byte2.toString(16) + ":" + byte3.toString(16) + ":" + byte4.toString(16) + ":" + byte5.toString(16) + ":" + byte6.toString(16) + ":" + byte7.toString(16) + ":" + byte8.toString(16) + ":" + byte9.toString(16) + ":" + byte10.toString(16) + ":" + byte11.toString(16) + ":" + byte12.toString(16) + ":" + byte13.toString(16) + ":" + byte14.toString(16) + ":" + byte15.toString(16) + ":");
      console.log(bufView[0].toString(16) + ":" + bufView[1].toString(16) + ":" + bufView[2].toString(16) + ":" + bufView[3].toString(16) + ":" + bufView[4].toString(16) + ":" + bufView[5].toString(16) + ":" + bufView[6].toString(16) + ":" + bufView[7].toString(16));
      return buf;
    }
  }, {
    key: "_writeCharacteristic",
    value: function _writeCharacteristic(value) {
      var _this3 = this;

      return this.device.gatt.getPrimaryService(this.config.service()).then(function (service) {
        return service.getCharacteristic(_this3.config.charateristic());
      }).then(function (characteristic) {
        return characteristic.writeValue(value);
      });
    }
  }]);

  return MBot;
}();

var DEVICE_NAME = "Makeblock_LE",
    SERVICE_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb",
    CHARACTERISTIC_UUID = "0000ffe3-0000-1000-8000-00805f9b34fb";
var mBot = new MBot();
module.exports = mBot;
},{}],"index.js":[function(require,module,exports) {
(function () {
  function pageLoad() {
    // Check the current part of Mbot
    var noBluetooth = document.getElementById("noBluetooth");
    var stepConnect = document.getElementById("stepConnect");
    var stepControl = document.getElementById("stepControl"); // Check if the bluetooth is available

    if (navigator.bluetooth == undefined) {
      console.error("No navigator.bluetooth found.");
      stepConnect.style.display = "none";
      noBluetooth.style.display = "flex";
    } else {
      // Display the connect button
      stepConnect.style.display = "flex";
      noBluetooth.style.display = "none";

      var mBot = require("./mbot/mbot"); // Check the connection


      document.getElementById("connectBtn").addEventListener('click', function () {
        // Request the device
        mBot.request().then(function () {
          // Connect to the mbot
          return mBot.connect();
        }).then(function () {
          // Connection is done, we show the controls
          stepConnect.style.display = "none";
          stepControl.style.display = "flex";
          var partBtn = document.querySelector('.part-button'); // Control the robot by buttons

          var btnUp = document.getElementById('btnUp');
          var btnDown = document.getElementById('btnDown');
          var btnLeft = document.getElementById('btnLeft');
          var btnRight = document.getElementById('btnRight');
          btnUp.addEventListener('touchstart', function () {
            mBot.processMotor(-250, 250);
          });
          btnDown.addEventListener('touchstart', function () {
            mBot.processMotor(250, -250);
          });
          btnLeft.addEventListener('touchstart', function () {
            mBot.processMotor(250, 250);
          });
          btnRight.addEventListener('touchstart', function () {
            mBot.processMotor(-250, -250);
          });
          btnUp.addEventListener('touchend', function () {
            mBot.processMotor(0, 0);
          });
          btnDown.addEventListener('touchend', function () {
            mBot.processMotor(0, 0);
          });
          btnLeft.addEventListener('touchend', function () {
            mBot.processMotor(0, 0);
          });
          btnRight.addEventListener('touchend', function () {
            mBot.processMotor(0, 0);
          });
        });
      });
    }
  }

  window.addEventListener('load', pageLoad);
})();
},{"./mbot/mbot":"mbot/mbot.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63231" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/phone-mbot-app.e31bb0bc.js.map
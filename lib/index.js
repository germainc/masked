(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _repeat = require('lodash/repeat');
var _forOwn = require('lodash/forOwn');

var MASK_CHAR = '*';
var MASK_LENGTH = 8;

var _parse = function _parse(string) {
  if (typeof string === 'string') {
    try {
      return JSON.parse(string);
    } catch (err) {
      return null;
    }
  }
  return null;
};
var _maskedString = function _maskedString(_ref) {
  var length = _ref.length,
      maskChar = _ref.maskChar;
  return _repeat(maskChar, length);
};

var masked = function masked(data, keys) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      omitKeys = _ref2.omitKeys,
      maskAll = _ref2.maskAll;

  if (!data) {
    return null;
  }
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' && !_parse(data)) {
    return data;
  }
  if (!keys) {
    throw new Error('Second parameter `keys` not given');
  }
  if (!Array.isArray(keys) && typeof keys !== 'string') {
    throw new TypeError('Expected a string or array, got ' + (typeof keys === 'undefined' ? 'undefined' : _typeof(keys)));
  }

  var newData = _parse(data) || data;
  if (Array.isArray(newData)) {
    return newData.map(function (newData) {
      return (typeof newData === 'undefined' ? 'undefined' : _typeof(newData)) === 'object' ? masked(newData, keys, { omitKeys: omitKeys, maskAll: maskAll }) : newData;
    });
  }

  newData = _extends({}, newData);
  _forOwn(newData, function (value, key) {
    var isSensitiveKey = maskAll || Array.isArray(keys) && keys.includes(key) || keys === key;

    if (omitKeys && isSensitiveKey) {
      delete newData[key];
    } else if (Array.isArray(value) && isSensitiveKey) {
      newData[key] = value.map(function () {
        return _maskedString({ length: MASK_LENGTH, maskChar: MASK_CHAR });
      });
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      newData[key] = masked(value, keys, { omitKeys: omitKeys, maskAll: maskAll || isSensitiveKey });
    } else if (isSensitiveKey) {
      newData[key] = _maskedString({ length: MASK_LENGTH, maskChar: MASK_CHAR });
    }
  });

  return typeof data === 'string' && _parse(data) ? JSON.stringify(newData) : newData;
};

module.exports = masked;

})));

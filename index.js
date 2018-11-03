'use strict';
const _repeat = require('lodash/repeat');
const _forOwn = require('lodash/forOwn');

const MASK_CHAR = '*';
const MASK_LENGTH = 8;

const _parse = string => {
  if (typeof string === 'string') {
    try {
      return JSON.parse(string);
    } catch (err) {
      return null;
    }
  }
  return null;
};
const _maskedString = ({length, maskChar}) => _repeat(maskChar, length);

const masked = (data, keys, {omitKeys, maskAll} = {}) => {
  if (!data) {
    return null;
  }
  if (typeof data !== 'object' && !_parse(data)) {
    return data;
  }
  if (!keys) {
    throw new Error('Second parameter `keys` not given');
  }
  if (!Array.isArray(keys) && typeof keys !== 'string') {
    throw new TypeError(`Expected a string or array, got ${typeof keys}`);
  }

  let newData = _parse(data) || data;
  if (Array.isArray(newData)) {
    return newData.map(newData => {
      return typeof newData === 'object' ?
        masked(newData, keys, {omitKeys, maskAll}) :
        newData;
    });
  }

  newData = {...newData};
  _forOwn(newData, (value, key) => {
    const isSensitiveKey = maskAll || (Array.isArray(keys) && keys.includes(key)) || keys === key;

    if (omitKeys && isSensitiveKey) {
      delete newData[key];
    } else if (Array.isArray(value) && isSensitiveKey) {
      newData[key] = value.map(() => _maskedString({length: MASK_LENGTH, maskChar: MASK_CHAR}));
    } else if (typeof value === 'object') {
      newData[key] = masked(value, keys, {omitKeys, maskAll: maskAll || isSensitiveKey});
    } else if (isSensitiveKey) {
      newData[key] = _maskedString({length: MASK_LENGTH, maskChar: MASK_CHAR});
    }
  });

  return (typeof data === 'string' && _parse(data)) ? JSON.stringify(newData) : newData;
};

module.exports = masked;

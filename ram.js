'use strict';

console.warn('Using ram as storage backend for poses. Poses will not be persistant, use only during development.')

var uuid = require('node-uuid');
import _ = require('lodash')
;
var STORAGE = {};

module.exports.store = function(data) {
  var path = uuid.v4();
  STORAGE[path] = data;
  return path;
}

module.exports.retrieve = function(path, callback) {
  var data = STORAGE[path];
  callback(data);
}

module.exports.delete = function(path, callback) {
  var cb = callback || _.noop;
  delete STORAGE[path];
  cb();
}

'use strict';
var uuid = require('node-uuid');
var _ = require('lodash');

var STORAGE = {};

module.exports.init = function init(config) {
    return {
        store: function(data, prefix, callback) {
            var path = prefix + '/' + uuid.v4();
            STORAGE[path] = data;
            callback(path);
        },

        retrieve: function(path, callback) {
            var data = STORAGE[path];
            callback(data);
        },

        delete: function(path, callback) {
            var cb = callback || _.noop;
            delete STORAGE[path];
            cb();
        }
    }
}

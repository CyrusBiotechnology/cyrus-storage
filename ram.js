'use strict';
var uuid = require('node-uuid');
var _ = require('lodash');

var STORAGE = {};

module.exports.init = function init(config) {
    return {
        store: function(data) {
            var path = uuid.v4();
            STORAGE[path] = data;
            return path;
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

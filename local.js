'use strict';

var uuid = require('node-uuid');
var fs = require('fs');
var streamUtils = require('./streamUtils');
var _ = require('lodash');
var assert = require('assert');

 module.exports.init = function(config) {
   var _config = _.merge(config, {
     dir: './local_storage'
   });

    return {
        store: function(data, dir, callback) {
            var callback = callback || dir;
            var dir = (typeof(dir) == 'function')? _config.dir : dir;
            assert.ok(callback);
            assert.ok(dir);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            var extension = _config.extension + (_config.compression) ? 'gz' : '';
            var path = dir + '/' + uuid.v4() + extension;
            var writeStream = fs.createWriteStream(path);
            streamUtils.writeToStorageStream(data, writeStream, _config.compression, () => {
              callback(path);
            });
        },

        retrieve: function(path, callback) {
            var readStream = fs.createReadStream(path);
            var compression = path.endsWith('.gz') ? 'gz' : undefined;
            streamUtils.readFromStorageStream(readStream, compression, function(data) {
                callback(data);
            });
        },

        delete: function(path, callback) {
            var cb = callback || _.noop;
            fs.unlink(path);
            cb();
        }
    }
}

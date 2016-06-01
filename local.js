'use strict';

var uuid = require('node-uuid');
var fs = require('fs');
var streamUtils = require('./streamUtils');
var _ = require('lodash');


 module.exports.init = function(config) {

    if (!fs.existsSync(config.dir)) {
        fs.mkdirSync(config.dir);
    }

    return {
        store: function(data) {
            var extension = config.extension + (config.compression) ? 'gz' : '';
            var path = config.dir + '/' + uuid.v4() + extension;
            var writeStream = fs.createWriteStream(path);
            streamUtils.writeToStorageStream(data, writeStream, config.compression, () => {
              return path;
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

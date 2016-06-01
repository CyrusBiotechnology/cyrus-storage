'use strict';

var uuid = require('node-uuid');
var streamUtils = require('./streamUtils');

export function init(config) {

    var gcloud = require('gcloud')({
        projectId: config.project
    });
    import _ = require('lodash');
    var gcs = gcloud.storage();

    return {
        store: function(data) {
            var bucket = gcs.bucket(config.bucket);
            var extension = config.extension + (config.compression) ? 'gz' : '';
            var path = uuid.v4() + extension;
            var writeStream = bucket.file(path).createWriteStream();
            streamUtils.writeToStorageStream(data, writeStream, config.compression);
            return path;

        },

        retrieve: function(path, callback) {
            var bucket = gcs.bucket(config.bucket)
            var readStream = bucket.file(path).createReadStream();
            var compression = (path.endsWith('.gz')) ? 'gz' : undefined;
            streamUtils.readFromStorageStream(readStream, compression, function(data) {
                callback(data);
            });
        },

        delete: function(path, callback) {
            var cb = callback || _.noop;
            var bucket = gcs.bucket(config.bucket)
            bucket.file(path).delete(function() {
                cb();
            });

        }
    }
}

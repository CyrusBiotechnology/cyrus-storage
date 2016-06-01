'use strict';

var uuid = require('node-uuid');
var streamUtils = require('./streamUtils');
var _ = require('lodash');
var assert = require('assert');

module.exports.init = function(config) {
  config = config || {};
  config.compression = config.compression || false;
  config.extension = config.extension || '.txt';

    assert.ok(config.project);

    var gcs = require('gcloud')({
        projectId: config.project
    }).storage();

    return {
        store: function(data, bucketId, callback) {
          var callback = callback || bucketId;
          var bucketId = (typeof(bucketId) == 'function')? config.bucketId : bucketId;
          assert.ok(callback);
          assert.ok(bucketId);

            var bucket = gcs.bucket(bucketId);
            var extension = config.extension + (config.compression) ? '.gz' : '';
            var filename = uuid.v4() + extension;
            var writeStream = bucket.file(filename).createWriteStream();
            streamUtils.writeToStorageStream(data, writeStream, config.compression, () => {
              callback(bucketId + '/' + filename);
            });
        },

        retrieve: function(path, callback) {
            var splitPath = path.split('/');
            var bucketId = splitPath[0];
            var filename = splitPath[1];
            var bucket = gcs.bucket(bucketId);
            var readStream = bucket.file(filename).createReadStream();
            var compression = (path.endsWith('.gz')) ? 'gz' : undefined;
            streamUtils.readFromStorageStream(readStream, compression, function(data) {
                callback(data);
            });
        },

        delete: function(path, callback) {
            var splitPath = path.split('/');
            var bucketId = splitPath[0];
            var filename = splitPath[1];
            var cb = callback || _.noop;
            var bucket = gcs.bucket(bucketId)
            bucket.file(filename).delete(function() {
                cb();
            });

        }
    }
}

'use strict';

var uuid = require('node-uuid');
var streamUtils = require('./streamUtils');
var _ = require('lodash');
var assert = require('assert');



function _uploadToGcs(data, bucket, filename, compression, callback) {
    var writeStream = bucket.file(filename).createWriteStream();
    streamUtils.writeToStorageStream(data, writeStream, compression, callback);
}

module.exports.init = function(config) {
    var _config = _.merge(config, {
      compression: false,
      extension: '.txt',
      dir: ''
    });

    assert.ok(_config.project, 'Project ID is a mandary argument.');

    var gcs = require('gcloud')({
        projectId: _config.project
    }).storage();

    return {
        store: function(data, bucketId, dir, filename, callback) {
            var callback = callback || filename || dir || bucketId;
            var dir = ((typeof(dir) == 'function') || (dir === undefined)) ? _config.dir : dir;
            var bucketId = ((typeof(bucketId) == 'function') || (bucketId === undefined)) ? _config.bucketId : bucketId;
            var extension = _config.extension + ((_config.compression)? '.gz' : '');
            var filename = ((typeof(filename) == 'function') || (filename === undefined)) ?  (uuid.v4() + extension) : filename;
	          var path = ((dir)? (dir + '/') : '') + filename;
            assert.ok(callback, 'callback missing.');
            assert.ok(bucketId, 'missing bucket id');


            var bucket = gcs.bucket(bucketId);

            bucket.exists((err, exists) => {
                if (exists) {
                    _uploadToGcs(data, bucket, path, _config.compression, () => {
                        callback(bucket.name + '/' + path);
                    });
                } else {
                    gcs.createBucket(bucketId, function(err, bucket) {
                        if (!err) {
                            _uploadToGcs(data, bucket, path, _config.compression, () => {
                                callback(bucket.name + path);
                            });
                        } else {
                            console.log('Unable to create bucket');
                            throw Error(err);
                        }
                    });
                }
            });
        },

        retrieve: function(path, callback) {
            var splitPath = path.split('/');
            var bucketId = splitPath[0];
            var filename = _.join(_.slice(splitPath, 1), '/');
            var bucket = gcs.bucket(bucketId);
            var readStream = bucket.file(filename).createReadStream();
            var compression = path.endsWith('.gz');
            streamUtils.readFromStorageStream(readStream, compression, function(data) {
                callback(data);
            });
        },

        delete: function(path, callback) {
            var splitPath = path.split('/');
            var bucketId = splitPath[0];
            var filename = _.join(_.slice(splitPath, 1), '/');
            var cb = callback || _.noop;
            var bucket = gcs.bucket(bucketId)
            bucket.file(filename).delete(function() {
                cb();
            });

        }
    }
}

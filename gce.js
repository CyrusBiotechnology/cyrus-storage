'use strict';

console.info('Using Google cloud for pdb data storage');

var config = require('../config/environment');
var uuid = require('node-uuid');
var streamUtils = require('./streamUtils');


var gcloud = require('gcloud')({
  projectId: config.storage.gcloud.project
});
import _ = require('lodash')
;
var gcs = gcloud.storage();


module.exports.store = function(data) {
  var bucket = gcs.bucket(config.storage.gcloud.bucket);
  var extension = (config.storage.compression === 'gz')? '.pdb.gz' : '.pdb';
  var path = uuid.v4() + extension;
  var writeStream = bucket.file(path).createWriteStream();
  streamUtils.writeToStorageStream(data, writeStream);
  return path;

}

module.exports.retrieve = function(path, callback) {
  var bucket = gcs.bucket(config.storage.gcloud.bucket)
  var readStream = bucket.file(path).createReadStream();
  var compression = (path.endsWith('.gz'))? 'gz' : undefined;
  streamUtils.readFromStorageStream(readStream, compression, function(data) {
    callback(data);
  });
}

module.exports.delete = function(path, callback) {
  var cb = callback || _.noop;
  var bucket = gcs.bucket(config.storage.gcloud.bucket)
  bucket.file(path).delete(function() {
    cb();
  });

}

'use strict';

console.warn('Using local drive for pdb data storage');

var config = require('../config/environment');
var uuid = require('node-uuid');
var fs = require('fs');
var streamUtils = require('./streamUtils');
import _ = require('lodash')
;


if (!fs.existsSync(config.storage.local.dir)){
    fs.mkdirSync(config.storage.local.dir);
}


module.exports.store = function(data) {
  var extension = (config.storage.compression === 'gz')? 'pdb.gz' : '.pdb';
  var path = config.storage.local.dir + '/'+ uuid.v4() + extension;
  var writeStream = fs.createWriteStream(path);
  streamUtils.writeToStorageStream(data, writeStream);
  return path;
}

module.exports.retrieve = function(path, callback) {
  var readStream = fs.createReadStream(path);
  var compression = path.endsWith('.gz') ? 'gz' : undefined;
  streamUtils.readFromStorageStream(readStream, compression, function(data) {
    callback(data);
  });
}

module.exports.delete = function(path, callback) {
  var cb = callback || _.noop;
  fs.unlink(path);
  cb();
}

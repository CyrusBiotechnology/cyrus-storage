'use strict';
var stream = require('stream');
var config = require('../config/environment');
var zlib = require('zlib');

module.exports.writeToStorageStream = function(data, writeStream) {
  var readStream = new stream.PassThrough();
  readStream.write(data);
  readStream.end();
  var zip = (config.storage.compression === 'gz')? zlib.createGzip() : new stream.PassThrough();
  readStream.pipe(zip).pipe(writeStream);
}

module.exports.readFromStorageStream = function(readStream, compression, callback) {
  var unzip = (compression === 'gz')? zlib.createGunzip(): new stream.PassThrough();
  readStream.pipe(unzip);
  var data = '';
  unzip
  .on('data', function (chunk) {
    data += chunk;
  })
  .on('end', function () {
    callback(data);
  });
}

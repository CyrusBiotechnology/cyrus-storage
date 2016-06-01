'use strict';
var stream = require('stream');
var zlib = require('zlib');
var _ = require('lodash');

module.exports.writeToStorageStream = function(data, writeStream, compression, callback) {
  var cb = callback || _.noop;
  var readStream = new stream.PassThrough();
  readStream.write(data);
  readStream.end();
  var zip = (compression === 'gz')? zlib.createGzip() : new stream.PassThrough();
  readStream.pipe(zip).pipe(writeStream).on('finish', cb);
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

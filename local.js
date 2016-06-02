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
        store: function(data, bucketDir, dir, filename, callback) {


            var callback = callback || filename || dir || bucketDir;
            var dir = ((typeof(dir) == 'function') || (dir === undefined)) ? _config.dir : dir;
            var bucketDir = ((typeof(bucketDir) == 'function') || (bucketDir === undefined)) ? _config.bucketDir : bucketDir;
            var extension = _config.extension + ((_config.compression)? '.gz' : '');
            var filename = ((typeof(filename) == 'function') || (filename === undefined)) ?  (uuid.v4() + extension) : filename;
            var splitPath = [bucketDir, dir, filename];
            var path = _.join(splitPath, '/');
            assert.ok(callback, 'callback missing.');
            assert.ok(bucketDir, 'missing bucket dir');

            console.log('path: ', path);

            _(_.map(
              _.range(splitPath.length-1),
              (i) => {return _.join(_.slice(splitPath,0,i+1), '/')}

            )).forEach( (folder) => {
              console.log('- ', folder);

              if (!fs.existsSync(folder)) {
                console.log('~ ', folder);
                fs.mkdirSync(folder);
              }
            });


            var writeStream = fs.createWriteStream('./' + path);
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

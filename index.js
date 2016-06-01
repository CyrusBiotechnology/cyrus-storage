'use strict';


module.exports.init = function(storageType, config) {
  return require('./' + storageType + '.js').init(config);
}

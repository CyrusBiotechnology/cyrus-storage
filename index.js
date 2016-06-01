'use strict';

var config = require('../config/environment');
module.exports = require('../storage/' + config.storage.backend + '.js');

/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let r = require('requiem');

module.exports = {
  touchEnabled: function() {
    var touch = r.hasClass(document.documentElement, 'touch');
    return touch;
  }
};

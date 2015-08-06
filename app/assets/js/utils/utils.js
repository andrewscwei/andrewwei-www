/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports =
{
    touchEnabled: function()
    {
        var touch = vars.hasClass(document.documentElement, 'touch');
        return touch;
    }
};

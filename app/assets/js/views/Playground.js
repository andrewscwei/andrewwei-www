/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');
var utils = require('../utils/utils');

module.exports = (function()
{
    class Playground extends vars.Element
    {
        init()
        {
            vars.changeElementState(this.children.bio, 'active');
            super.init();
        }
    }

    return Playground;
}());

/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports = (function()
{
    class Playground extends vars.Element
    {
        init()
        {
            vars.changeElementState(this.getChild('bio'), 'active');
            super.init();
        }
    }

    return Playground;
}());

/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

module.exports =
{
    touchEnabled: function()
    {
        var touch = document.documentElement.classList.contains('touch');
        return touch;
    }
};

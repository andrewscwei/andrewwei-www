/**
 *  andrewwei mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

module.exports =
{
    touchEnabled: function()
    {
        var touch = document.documentElement.classList.contains('touch');
        return touch;
    },

    /**
     * Changes the state of a child element.
     * @param  {Object} element
     * @param  {String} state
     */
    changeElementState: function(element, state)
    {
        if (!element) return;
        if (element.classList.contains('state'+state)) return;

        element.className = element.className.replace(/(^|\s)state-\S+/g, '');
        element.classList.add('state-'+state);
    }
};
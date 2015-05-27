/**
 *  andrewwei mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports = (function() {

var utils = require('../utils/utils');

var State =
{
    COLLAPSED: 0,
    EXPANDED: 1
};

/**
 * Creates a new NavController instance.
 */
function NavController(init)
{
    vars.Element.call(this, init);
} var parent = vars.inherit(NavController, vars.Element);

/**
 * @property
 *
 * Dictionary of essential child elements.
 *
 * @type {Object}
 */
Object.defineProperty(NavController.prototype, 'children', { value: {}});

/**
 * @property
 *
 * Specifies the current state of this NavController instance.
 *
 * @type {Number}
 */
Object.defineProperty(NavController.prototype, 'state',
{
    get: function()
    {
        return this._state || State.COLLAPSED;
    },

    set: function(value)
    {
        this._state = value;

        var body = document.getElementById('body');

        switch (value)
        {
            case State.EXPANDED:
            {
                utils.changeElementState(this.element, 'expanded');
                utils.changeElementState(this.children.switch, 'active');
                utils.changeElementState(body, 'shifted');
                break;
            }

            default:
            {
                utils.changeElementState(this.element, 'collapsed');
                utils.changeElementState(this.children.switch, 'inactive');
                utils.changeElementState(body, 'unshifted');
                break;
            }
        }
    }
});

/**
 * @inheritDoc
 */
NavController.prototype.init = function()
{
    this.children.switch = this.element.querySelectorAll('button.menu')[0];

    if (utils.touchEnabled())
    {
        this.children.switch.addEventListener(vars.EventType.TOUCH.TOUCH_START, this._onSwitchActivate.bind(this));
    }
    else
    {
        this.children.switch.addEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchActivate.bind(this));
    }

    this.state = State.COLLAPSED;

    parent.prototype.init.call(this);
};

/**
 * @inheritDoc
 */
NavController.prototype.destroy = function()
{
    if (utils.touchEnabled())
    {
        this.children.switch.removeEventListener(vars.EventType.TOUCH.TOUCH_START, this._onSwitchActivate);
    }
    else
    {
        this.children.switch.removeEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchActivate);
    }

    parent.prototype.destroy.call(this);
};

/**
 * @private
 *
 * Handler invoked whenever the menu button is activated.
 *
 * @param  {Object} event
 */
NavController.prototype._onSwitchActivate = function(event)
{
    switch (this.state)
    {
        case State.EXPANDED:
        {
            this.state = State.COLLAPSED;
            break;
        }

        default:
        {
            this.state = State.EXPANDED;
            break;
        }
    }
};

return NavController; }());

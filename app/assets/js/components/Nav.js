/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports = (function()
{
    var utils = require('../utils/utils');

    var State =
    {
        COLLAPSED: 0,
        EXPANDED: 1
    };

    class Nav extends vars.Element
    {
        /**
         * @inheritDoc
         */
        init()
        {
            if (utils.touchEnabled())
            {
                this.getChild('controls.switch').addEventListener(vars.EventType.TOUCH.TOUCH_END, this._onSwitchActivate.bind(this));
            }
            else
            {
                this.getChild('controls.switch').addEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchActivate.bind(this));
                document.addEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchDeactivate.bind(this));
            }

            this.state = State.COLLAPSED;

            if (this.getChild('controls.return'))
            {
                vars.changeElementState(this.getChild('controls'), 'returnable');
            }

            super.init();
        }

        /**
         * @inheritDoc
         */
        destroy()
        {
            if (utils.touchEnabled())
            {
                this.getChild('controls.switch').removeEventListener(vars.EventType.TOUCH.TOUCH_END, this._onSwitchActivate);
            }
            else
            {
                this.getChild('controls.switch').removeEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchActivate);
                document.removeEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchDeactivate.bind(this));
            }

            super.destroy();
        }

        /**
         * @private
         * Handler invoked whenever the menu button is activated.
         * @param  {Object} event
         */
        _onSwitchActivate(event)
        {
            if (!utils.touchEnabled() && this.state === State.EXPANDED) return;

            if (this.state === State.EXPANDED)
            {
                this.state = State.COLLAPSED;
            }
            else
            {
                this.state = State.EXPANDED;
            }
        }

        /**
         * @private
         * Handler invoked whenever the menu button is deactivated.
         * @param  {Object} event
         */
        _onSwitchDeactivate(event)
        {
            if (this.state === State.COLLAPSED) return;

            var mouseX = event.clientX;
            var panelRect = vars.getRect(this.element.getElementsByClassName('panel')[0]);

            if (mouseX > panelRect.width)
            {
                this.state = State.COLLAPSED;
            }
        }

        /**
         * @inheritDoc
         */
        __define_properties()
        {
            /**
             * @property
             * Specifies the current state of this NavController instance.
             * @type {Number}
             */
            Object.defineProperty(this, 'state',
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
                            vars.changeElementState(this.element, 'expanded');
                            vars.changeElementState(this.getChild('controls.switch'), 'active');
                            vars.changeElementState(body, 'shifted');
                            break;
                        }

                        default:
                        {
                            vars.changeElementState(this.element, 'collapsed');
                            vars.changeElementState(this.getChild('controls.switch'), 'inactive');
                            vars.changeElementState(body, 'unshifted');
                            break;
                        }
                    }
                }
            });

            super.__define_properties();
        }
    }

    return Nav;
}());

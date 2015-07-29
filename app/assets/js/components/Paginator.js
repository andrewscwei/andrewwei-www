/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports = (function()
{
    var utils = require('../utils/utils');

    class Paginator extends vars.Element
    {
        init()
        {
            this.updateDelegate.responsive = true;
            this.refreshRate = 20.0;

            var prev = this.getChild('prev');
            var next = this.getChild('next');

            if (!utils.touchEnabled())
            {
                if (prev)
                {
                    prev.addEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
                    prev.addEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
                }

                if (next)
                {
                    next.addEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
                    next.addEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
                }
            }

            super.init();
        }

        destroy()
        {
            var prev = this.getChild('prev');
            var next = this.getChild('next');

            if (!utils.touchEnabled())
            {
                if (prev)
                {
                    prev.removeEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
                    prev.removeEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
                }

                if (next)
                {
                    next.removeEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
                    next.removeEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
                }
            }

            super.destroy();
        }

        /**
         * @inheritDoc
         */
        update()
        {
            if (this.updateDelegate.isDirty(vars.DirtyType.POSITION))
            {
                var rect = vars.getViewportRect();

                if (rect.top >= 0)
                {
                    if ((rect.bottom > rect.height) || (rect.bottom >= document.height))
                    {
                        vars.changeElementState(this.getChild('prev.newer'), 'visible');
                        vars.changeElementState(this.getChild('next.older'), 'visible');
                    }
                    else
                    {
                        vars.changeElementState(this.getChild('prev.newer'), 'hidden');
                        vars.changeElementState(this.getChild('next.older'), 'hidden');
                    }
                }
            }

            super.update();
        }

        /**
         * @private
         *
         * Handler invoked when the 'prev' div is moused over.
         *
         * @param  {Object} event
         */
        _onPrevMouseOver(event)
        {
            vars.changeElementState(this.getChild('prev.newest'), 'visible');
        }

        /**
         * @private
         *
         * Handler invoked when the 'prev' div is moused out.
         *
         * @param  {Object} event
         */
        _onPrevMouseOut(event)
        {
            vars.changeElementState(this.getChild('prev.newest'), 'hidden');
        }

        /**
         * @private
         *
         * Handler invoked when the 'next' div is moused over.
         *
         * @param  {Object} event
         */
        _onNextMouseOver(event)
        {
            vars.changeElementState(this.getChild('next.oldest'), 'visible');
        }

        /**
         * @private
         *
         * Handler invoked when the 'next' div is moused out.
         *
         * @param  {Object} event
         */
        _onNextMouseOut(event)
        {
            vars.changeElementState(this.getChild('next.oldest'), 'hidden');
        }
    }

    return Paginator;
}());

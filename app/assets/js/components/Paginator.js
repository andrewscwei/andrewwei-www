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

            if (!utils.touchEnabled())
            {
                if (this.children.prev)
                {
                    this.children.prev.element.addEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
                    this.children.prev.element.addEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
                }

                if (this.children.next)
                {
                    this.children.next.element.addEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
                    this.children.next.element.addEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
                }
            }

            super.init();
        }

        destroy()
        {
            if (!utils.touchEnabled())
            {
                if (this.children.prev)
                {
                    this.children.prev.element.removeEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
                    this.children.prev.element.removeEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
                }

                if (this.children.prev)
                {
                    this.children.next.element.removeEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
                    this.children.next.element.removeEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
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
                        if (this.children.prev) vars.changeElementState(this.children.prev.children.newer, 'visible');
                        if (this.children.next) vars.changeElementState(this.children.next.children.older, 'visible');
                    }
                    else
                    {
                        if (this.children.prev) vars.changeElementState(this.children.prev.children.newer, 'hidden');
                        if (this.children.next) vars.changeElementState(this.children.next.children.older, 'hidden');
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
            vars.changeElementState(this.children.prev.children.newest, 'visible');
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
            vars.changeElementState(this.children.prev.children.newest, 'hidden');
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
            vars.changeElementState(this.children.next.children.oldest, 'visible');
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
            vars.changeElementState(this.children.next.children.oldest, 'hidden');
        }
    }

    return Paginator;
}());

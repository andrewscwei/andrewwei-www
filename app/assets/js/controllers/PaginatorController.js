/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports = (function() {

var utils = require('../utils/utils');

/**
 * Creates a new PaginatorController instance.
 */
function PaginatorController(init)
{
    vars.Element.call(this, init || document.getElementById('paginator'));
} var parent = vars.inherit(PaginatorController, vars.Element);

/**
 * @property
 *
 * Dictionary of essential child elements.
 *
 * @type {Object}
 */
Object.defineProperty(PaginatorController.prototype, 'children', { value: {}});

/**
 * @inheritDoc
 */
PaginatorController.prototype.init = function()
{
    this.updateDelegate.responsive = true;
    this.refreshRate = 20.0;

    this.children.prev = this.element.getElementsByClassName('prev')[0];
    this.children.next = this.element.getElementsByClassName('next')[0];
    this.children.newest = this.element.getElementsByClassName('paginator newest')[0];
    this.children.newer = this.element.getElementsByClassName('paginator newer')[0];
    this.children.older = this.element.getElementsByClassName('paginator older')[0];
    this.children.oldest = this.element.getElementsByClassName('paginator oldest')[0];

    if (!utils.touchEnabled())
    {
        if (this.children.prev)
        {
            this.children.prev.addEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
            this.children.prev.addEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
        }

        if (this.children.next)
        {
            this.children.next.addEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
            this.children.next.addEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
        }
    }

    parent.prototype.init.call(this);
};

/**
 * @inheritDoc
 */
PaginatorController.prototype.destroy = function()
{
    if (!utils.touchEnabled())
    {
        if (this.children.prev)
        {
            this.children.prev.removeEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
            this.children.prev.removeEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
        }

        if (this.children.prev)
        {
            this.children.next.removeEventListener(vars.EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
            this.children.next.removeEventListener(vars.EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
        }
    }

    parent.prototype.destroy.call(this);
};

/**
 * @inheritDoc
 */
PaginatorController.prototype.update = function(dirtyTypes)
{
    if (this.updateDelegate.isDirty(vars.DirtyType.POSITION))
    {
        var rect = vars.getViewportRect();

        if (rect.top >= 0)
        {
            if ((rect.bottom > rect.height) || (rect.bottom >= document.height))
            {
                utils.changeElementState(this.children.newer, 'visible');
                utils.changeElementState(this.children.older, 'visible');
            }
            else
            {
                utils.changeElementState(this.children.newer, 'hidden');
                utils.changeElementState(this.children.older, 'hidden');
            }
        }
    }

    parent.prototype.update.call(this, dirtyTypes);
};

/**
 * @private
 *
 * Handler invoked when the 'prev' div is moused over.
 *
 * @param  {Object} event
 */
PaginatorController.prototype._onPrevMouseOver = function(event)
{
    utils.changeElementState(this.children.newest, 'visible');
};

/**
 * @private
 *
 * Handler invoked when the 'prev' div is moused out.
 *
 * @param  {Object} event
 */
PaginatorController.prototype._onPrevMouseOut = function(event)
{
    utils.changeElementState(this.children.newest, 'hidden');
};

/**
 * @private
 *
 * Handler invoked when the 'next' div is moused over.
 *
 * @param  {Object} event
 */
PaginatorController.prototype._onNextMouseOver = function(event)
{
    utils.changeElementState(this.children.oldest, 'visible');
};

/**
 * @private
 *
 * Handler invoked when the 'next' div is moused out.
 *
 * @param  {Object} event
 */
PaginatorController.prototype._onNextMouseOut = function(event)
{
    utils.changeElementState(this.children.oldest, 'hidden');
};

return PaginatorController; }());

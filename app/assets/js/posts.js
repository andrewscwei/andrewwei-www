/**
 *  andrewwei mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

// Imports.
var vars = require('vars');

// Instantiate NavController instance.
vars.module(require('./controllers/NavController'));
vars.module(require('./controllers/PaginatorController'));

// Define current module.
vars.module((function() {

var utils = require('./utils/utils');

/**
 * Creates a new Posts instance.
 */
function Posts()
{
    vars.Element.call(this, document.querySelectorAll('section.posts')[0]);
} var parent = vars.inherit(Posts, vars.Element);

/**
 * @property
 *
 * Dictionary of child elements.
 *
 * @type {Object}
 */
Object.defineProperty(Posts.prototype, 'children', { value: {} });

/**
 * @inheritDoc
 */
Posts.prototype.init = function()
{
    this.updateDelegate.responsive = true;
    this.updateDelegate.refreshRate = 10.0;

    this.children.posts = this.element.querySelectorAll('.post');

    parent.prototype.init.call(this);
};

/**
 * @inheritDoc
 */
Posts.prototype.update = function(dirtyTypes)
{
    if (this.updateDelegate.isDirty(vars.DirtyType.POSITION))
    {
        var n = this.children.posts.length;
        var r = vars.getViewportRect();

        for (var i = 0; i < n; i++)
        {
            var post = this.children.posts[i];
            var rect = vars.getRect(post);
            var intersect = vars.getIntersectRect(post);

            if (intersect.height > rect.height*0.2)
            {
                utils.changeElementState(post, 'visible');
            }
            else
            {
                // utils.changeElementState(post, 'hidden');
            }
        }
    }

    parent.prototype.update.call(this, dirtyTypes);
};

return Posts; }()));
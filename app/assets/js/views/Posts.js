/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

module.exports = (function()
{
    class Posts extends vars.Element
    {
        init()
        {
            this.updateDelegate.responsive = true;
            this.updateDelegate.refreshRate = 10.0;

            super.init();
        }

        update()
        {
            if (this.updateDelegate.isDirty(vars.DirtyType.POSITION))
            {
                var n = this.getChild('posts').length;
                var r = vars.getViewportRect();

                for (var i = 0; i < n; i++)
                {
                    var post = this.getChild('posts')[i];
                    var rect = vars.getRect(post);
                    var intersect = vars.getIntersectRect(post);

                    if ((intersect.height > rect.height*0.2) || (intersect.height > r.height *0.2))
                    {
                        vars.changeElementState(post, 'visible');
                    }
                    else
                    {
                        // vars.changeElementState(post, 'hidden');
                    }
                }
            }

            super.update();
        }
    }

    return Posts;
}());

/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let vars = require('vars');

class Posts extends vars.Element {
  /**
   * @see module:vars.Element#init
   */
  init() {
    this.updateDelegate.responsive = true;
    this.updateDelegate.refreshRate = 10.0;

    super.init();
  }

  /**
   * @see module:vars.Element#update
   */
  update() {
    if (this.updateDelegate.isDirty(vars.DirtyType.POSITION)) {
      let n = this.getChild('posts').length;
      let r = vars.getViewportRect();

      for (let i = 0; i < n; i++) {
        let post = this.getChild('posts')[i];
        let rect = vars.getRect(post);
        let intersect = vars.getIntersectRect(post);

        if ((intersect.height > rect.height * 0.2) || (intersect.height > r.height * 0.2)) {
          vars.changeElementState(post, 'visible');
        } else {
          // vars.changeElementState(post, 'hidden');
        }
      }
    }

    super.update();
  }
}

module.exports = Posts;

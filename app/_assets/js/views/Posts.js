/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let r = require('requiem');
let Element = r.Element;
let DirtyType = r.DirtyType;
let EventType = r.EventType;

class Posts extends Element {
  /**
   * @see module:requiem.Element#init
   */
  init() {
    this.respondsTo(10.0, EventType.OBJECT.SCROLL);
    super.init();
  }

  /**
   * @see module:requiem.Element#update
   */
  update() {
    if (this.updateDelegate.isDirty(DirtyType.POSITION)) {
      let n = this.getChild('posts').length;
      let viewportRect = r.getViewportRect();

      for (let i = 0; i < n; i++) {
        let post = this.getChild('posts')[i];
        let rect = r.getRect(post);
        let intersect = r.getIntersectRect(post);

        if ((intersect.height > rect.height * 0.2) || (intersect.height > viewportRect.height * 0.2)) {
          r.changeElementState(post, 'visible');
        } else {
          // r.changeElementState(post, 'hidden');
        }
      }
    }

    super.update();
  }
}

module.exports = Posts;

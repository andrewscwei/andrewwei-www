// (c) Andrew Wei

'use strict';

import { utils, Element, DirtyType, EventType } from 'requiem';

class Posts extends Element {
  /** @inheritdoc */
  init() {
    this.respondsTo(10.0, EventType.OBJECT.SCROLL);
    super.init();
  }

  /** @inheritdoc */
  update() {
    if (this.updateDelegate.isDirty(DirtyType.POSITION)) {
      let posts = this.getChild('posts');

      if (posts) {
        let n = posts.length;
        let viewportRect = utils.getViewportRect();

        for (let i = 0; i < n; i++) {
          let post = this.getChild('posts')[i];
          let rect = post.rect;
          let intersect = utils.getIntersectRect(post);

          if ((intersect.height > rect.height * 0.2) || (intersect.height > viewportRect.height * 0.2)) {
            post.state = 'visible';
          }
        }
      }
    }

    super.update();
  }
}

module.exports = Posts;

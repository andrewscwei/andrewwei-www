/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

import { Element, DirtyType, EventType } from 'requiem';

let touchEnabled = require('../utils/touchEnabled');

class Paginator extends Element {
  /**
   * @inheritdoc
   */
  init() {
    this.respondsTo(20.0, EventType.OBJECT.SCROLL);

    let prev = this.getChild('prev');
    let next = this.getChild('next');

    if (!touchEnabled()) {
      if (prev) {
        prev.addEventListener(EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
        prev.addEventListener(EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
      }

      if (next) {
        next.addEventListener(EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
        next.addEventListener(EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
      }
    }

    super.init();
  }

  /**
   * @inheritdoc
   */
  destroy() {
    let prev = this.getChild('prev');
    let next = this.getChild('next');

    if (!touchEnabled()) {
      if (prev) {
        prev.removeEventListener(EventType.MOUSE.MOUSE_OVER, this._onPrevMouseOver.bind(this));
        prev.removeEventListener(EventType.MOUSE.MOUSE_OUT, this._onPrevMouseOut.bind(this));
      }

      if (next) {
        next.removeEventListener(EventType.MOUSE.MOUSE_OVER, this._onNextMouseOver.bind(this));
        next.removeEventListener(EventType.MOUSE.MOUSE_OUT, this._onNextMouseOut.bind(this));
      }
    }

    super.destroy();
  }

  /**
   * @inheritdoc
   */
  update() {
    if (this.updateDelegate.isDirty(DirtyType.POSITION)) {
      let rect = utils.getViewportRect();

      if (rect.top >= 0) {
        if ((rect.bottom > rect.height) || (rect.bottom >= document.height)) {
          utils.changeElementState(this.getChild('prev.newer'), 'visible');
          utils.changeElementState(this.getChild('next.older'), 'visible');
        } else {
          utils.changeElementState(this.getChild('prev.newer'), 'hidden');
          utils.changeElementState(this.getChild('next.older'), 'hidden');
        }
      }
    }

    super.update();
  }

  /**
   * Handler invoked when the 'prev' div is moused over.
   * @param  {Object} event
   * @private
   */
  _onPrevMouseOver(event) {
    utils.changeElementState(this.getChild('prev.newest'), 'visible');
  }

  /**
   * Handler invoked when the 'prev' div is moused out.
   * @param  {Object} event
   * @private
   */
  _onPrevMouseOut(event) {
    utils.changeElementState(this.getChild('prev.newest'), 'hidden');
  }

  /**
   * Handler invoked when the 'next' div is moused over.
   * @param  {Object} event
   * @private
   */
  _onNextMouseOver(event) {
    utils.changeElementState(this.getChild('next.oldest'), 'visible');
  }

  /**
   * Handler invoked when the 'next' div is moused out.
   * @param  {Object} event
   * @private
   */
  _onNextMouseOut(event) {
    utils.changeElementState(this.getChild('next.oldest'), 'hidden');
  }
}

module.exports = Paginator;

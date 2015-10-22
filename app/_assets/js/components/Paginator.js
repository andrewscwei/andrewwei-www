/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let r = require('requiem');
let DirtyType = r.DirtyType;
let Element = r.Element;
let EventType = r.EventType;
let utils = require('../utils/utils');

class Paginator extends Element {
  /**
   * @see module:requiem.Element#init
   */
  init() {
    this.respondsTo(20.0, EventType.OBJECT.SCROLL);

    let prev = this.getChild('prev');
    let next = this.getChild('next');

    if (!utils.touchEnabled()) {
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
   * @see module:requiem.Element#destroy
   */
  destroy() {
    let prev = this.getChild('prev');
    let next = this.getChild('next');

    if (!utils.touchEnabled()) {
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
   * @see module:requiem.Element#update
   */
  update() {
    if (this.updateDelegate.isDirty(DirtyType.POSITION)) {
      let rect = r.getViewportRect();

      if (rect.top >= 0) {
        if ((rect.bottom > rect.height) || (rect.bottom >= document.height)) {
          r.changeElementState(this.getChild('prev.newer'), 'visible');
          r.changeElementState(this.getChild('next.older'), 'visible');
        } else {
          r.changeElementState(this.getChild('prev.newer'), 'hidden');
          r.changeElementState(this.getChild('next.older'), 'hidden');
        }
      }
    }

    super.update();
  }

  /**
   * @private
   * Handler invoked when the 'prev' div is moused over.
   * @param  {Object} event
   */
  _onPrevMouseOver(event) {
    r.changeElementState(this.getChild('prev.newest'), 'visible');
  }

  /**
   * @private
   * Handler invoked when the 'prev' div is moused out.
   * @param  {Object} event
   */
  _onPrevMouseOut(event) {
    r.changeElementState(this.getChild('prev.newest'), 'hidden');
  }

  /**
   * @private
   * Handler invoked when the 'next' div is moused over.
   * @param  {Object} event
   */
  _onNextMouseOver(event) {
    r.changeElementState(this.getChild('next.oldest'), 'visible');
  }

  /**
   * @private
   * Handler invoked when the 'next' div is moused out.
   * @param  {Object} event
   */
  _onNextMouseOut(event) {
    r.changeElementState(this.getChild('next.oldest'), 'hidden');
  }
}

module.exports = Paginator;

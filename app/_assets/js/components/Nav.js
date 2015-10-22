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

const State = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded'
};

class Nav extends Element {
  /**
   * @see module:requiem.Element#init
   */
  init() {
    if (utils.touchEnabled()) {
      this.getChild('controls.switch').addEventListener(EventType.TOUCH.TOUCH_END, this._onSwitchActivate.bind(this));
    }
    else {
      this.getChild('controls.switch').addEventListener(EventType.MOUSE.CLICK, this._onSwitchActivate.bind(this));
      this.addEventListener(EventType.MOUSE.CLICK_OUTSIDE, this._onSwitchDeactivate.bind(this));
    }

    this.state = State.COLLAPSED;

    if (this.getChild('controls.return')) {
      r.changeElementState(this.getChild('controls'), 'returnable');
    }

    super.init();
  }

  /**
   * @see module:requiem.Element#destroy
   */
  destroy() {
    if (utils.touchEnabled()) {
      this.getChild('controls.switch').removeEventListener(EventType.TOUCH.TOUCH_END, this._onSwitchActivate);
    }
    else {
      this.getChild('controls.switch').removeEventListener(EventType.MOUSE.CLICK, this._onSwitchActivate);
      this.removeEventListener(EventType.MOUSE.CLICK_OUTSIDE);
    }

    super.destroy();
  }

  /**
   * @see module:requiem.Element#update
   */
  update() {
    if (this.updateDelegate.isDirty(DirtyType.STATE)) {
      let body = document.getElementById('body');

      switch (this.state) {
        case State.EXPANDED: {
          r.changeElementState(this.element, 'expanded');
          r.changeElementState(this.getChild('controls.switch'), 'active');
          r.changeElementState(body, 'shifted');
          break;
        }

        default: {
          r.changeElementState(this.element, 'collapsed');
          r.changeElementState(this.getChild('controls.switch'), 'inactive');
          r.changeElementState(body, 'unshifted');
          break;
        }
      }
    }

    super.update();
  }

  /**
   * @private
   * Handler invoked whenever the menu button is activated.
   * @param  {Object} event
   */
  _onSwitchActivate(event) {
    if (!utils.touchEnabled() && this.state === State.EXPANDED) return;

    if (this.state === State.EXPANDED) {
      this.state = State.COLLAPSED;
    }
    else {
      this.state = State.EXPANDED;
    }
  }

  /**
   * @private
   * Handler invoked whenever the menu button is deactivated.
   * @param  {Object} event
   */
  _onSwitchDeactivate(event) {
    if (this.state === State.COLLAPSED) return;

    this.state = State.COLLAPSED;
  }
}

module.exports = Nav;

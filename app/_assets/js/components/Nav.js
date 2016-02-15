/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

import { utils, Element, DirtyType, EventType } from 'requiem';

let touchEnabled = require('../utils/touchEnabled');

const State = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded'
};

class Nav extends Element {
  /**
   * @inheritdoc
   */
  init() {
    if (touchEnabled()) {
      this.getChild('controls.switch').addEventListener(EventType.TOUCH.TOUCH_END, this._onSwitchActivate.bind(this));
    }
    else {
      this.getChild('controls.switch').addEventListener(EventType.MOUSE.CLICK, this._onSwitchActivate.bind(this));
      this.addEventListener(EventType.MOUSE.CLICK_OUTSIDE, this._onSwitchDeactivate.bind(this));
    }

    this.state = State.COLLAPSED;

    if (this.getChild('controls.return')) {
      this.getChild('controls').state = 'returnable';
    }

    super.init();
  }

  /**
   * @inheritdoc
   */
  destroy() {
    if (touchEnabled()) {
      this.getChild('controls.switch').removeEventListener(EventType.TOUCH.TOUCH_END, this._onSwitchActivate);
    }
    else {
      this.getChild('controls.switch').removeEventListener(EventType.MOUSE.CLICK, this._onSwitchActivate);
      this.removeEventListener(EventType.MOUSE.CLICK_OUTSIDE);
    }

    super.destroy();
  }

  /**
   * @inheritdoc
   */
  update() {
    if (this.updateDelegate.isDirty(DirtyType.STATE)) {
      let body = document.getElementById('body');

      switch (this.state) {
        case State.EXPANDED: {
          utils.changeElementState(this.element, 'expanded');
          utils.changeElementState(this.getChild('controls.switch'), 'active');
          utils.changeElementState(body, 'shifted');
          break;
        }

        default: {
          utils.changeElementState(this.element, 'collapsed');
          utils.changeElementState(this.getChild('controls.switch'), 'inactive');
          utils.changeElementState(body, 'unshifted');
          break;
        }
      }
    }

    super.update();
  }

  /**
   * Handler invoked whenever the menu button is activated.
   * @param  {Object} event
   * @private
   */
  _onSwitchActivate(event) {
    if (!touchEnabled() && this.state === State.EXPANDED) return;

    if (this.state === State.EXPANDED) {
      this.state = State.COLLAPSED;
    }
    else {
      this.state = State.EXPANDED;
    }
  }

  /**
   * Handler invoked whenever the menu button is deactivated.
   * @param  {Object} event
   * @private
   */
  _onSwitchDeactivate(event) {
    if (this.state === State.COLLAPSED) return;

    this.state = State.COLLAPSED;
  }
}

module.exports = Nav;

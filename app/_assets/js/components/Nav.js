/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let vars = require('vars');
let utils = require('../utils/utils');

const State = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded'
};

class Nav extends vars.Element {
  /**
   * @see module:vars.Element#init
   */
  init() {
    if (utils.touchEnabled()) {
      this.getChild('controls.switch').addEventListener(vars.EventType.TOUCH.TOUCH_END, this._onSwitchActivate.bind(this));
    } else {
      this.getChild('controls.switch').addEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchActivate.bind(this));
      document.addEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchDeactivate.bind(this));
    }

    this.state = State.COLLAPSED;

    if (this.getChild('controls.return')) {
      vars.changeElementState(this.getChild('controls'), 'returnable');
    }

    super.init();
  }

  /**
   * @see module:vars.Element#destroy
   */
  destroy() {
    if (utils.touchEnabled()) {
      this.getChild('controls.switch').removeEventListener(vars.EventType.TOUCH.TOUCH_END, this._onSwitchActivate);
    } else {
      this.getChild('controls.switch').removeEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchActivate);
      document.removeEventListener(vars.EventType.MOUSE.CLICK, this._onSwitchDeactivate.bind(this));
    }

    super.destroy();
  }

  /**
   * @see module:vars.Element#update
   */
  update() {
    if (this.updateDelegate.isDirty(vars.DirtyType.STATE)) {
      let body = document.getElementById('body');

      switch (this.state) {
        case State.EXPANDED:
          {
            vars.changeElementState(this.element, 'expanded');
            vars.changeElementState(this.getChild('controls.switch'), 'active');
            vars.changeElementState(body, 'shifted');
            break;
          }

        default:
          {
            vars.changeElementState(this.element, 'collapsed');
            vars.changeElementState(this.getChild('controls.switch'), 'inactive');
            vars.changeElementState(body, 'unshifted');
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
    } else {
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

    let mouseX = event.clientX;
    let panelRect = vars.getRect(this.element.getElementsByClassName('panel')[0]);

    if (mouseX > panelRect.width) {
      this.state = State.COLLAPSED;
    }
  }
}

module.exports = Nav;

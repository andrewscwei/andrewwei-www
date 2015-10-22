/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let r = require('requiem');
let Element = r.Element;

class Playground extends Element {
  /**
   * @see module:requiem.Element#init
   */
  init() {
    r.changeElementState(this.getChild('bio'), 'active');
    super.init();
  }
}

module.exports = Playground;

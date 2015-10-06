/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let vars = require('vars');

class Playground extends vars.Element {
  /**
   * @see module:vars.Element#init
   */
  init() {
    vars.changeElementState(this.getChild('bio'), 'active');
    super.init();
  }
}

module.exports = Playground;

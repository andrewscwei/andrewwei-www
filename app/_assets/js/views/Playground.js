/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

import { utils, Element } from 'requiem';

class Playground extends Element {
  /**
   * @inheritdoc
   */
  init() {
    utils.changeElementState(this.getChild('bio'), 'active');
    super.init();
  }
}

module.exports = Playground;

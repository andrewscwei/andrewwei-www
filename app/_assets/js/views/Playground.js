/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

import { Element } from 'requiem';

class Playground extends Element {
  /** @inheritdoc */
  init() {
    this.getChild('bio').state = 'active';
    super.init();
  }
}

module.exports = Playground;

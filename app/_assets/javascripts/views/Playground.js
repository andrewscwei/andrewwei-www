// (c) Andrew Wei

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

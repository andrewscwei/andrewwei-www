/**
 * (c) Andrew Wei
 */

'use strict';

import { utils } from 'requiem';

function touchEnabled() {
  let touch = utils.hasClass(document.documentElement, 'touch');
  return touch;
}

module.exports = touchEnabled;

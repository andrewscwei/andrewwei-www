/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

import { dom } from 'requiem';

dom.ready(() => {
  dom.namespace('views').Playground = require('./views/Playground');
  dom.namespace('views').Posts = require('./views/Posts');
  dom.namespace('components').Nav = require('./components/Nav');
  dom.namespace('components').Paginator = require('./components/Paginator');
  dom.sightread();
});

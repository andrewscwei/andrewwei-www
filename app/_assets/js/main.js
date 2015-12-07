/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

import Requiem, { dom } from 'requiem';

dom.ready(() => {
  Requiem.register(require('./views/Playground'));
  Requiem.register(require('./views/Posts'));
  Requiem.register(require('./components/Nav'));
  Requiem.register(require('./components/Paginator'));
  Requiem.sightread();
});

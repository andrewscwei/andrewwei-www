/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

let r = require('requiem');

r.sightread({
  views: {
    Playground: require('./views/Playground'),
    Posts: require('./views/Posts')
  },
  components: {
    Nav: require('./components/Nav'),
    Paginator: require('./components/Paginator')
  }
});

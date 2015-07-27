/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

vars.namespace('mu.andrewwei.views').Playground = require('./views/Playground');
vars.namespace('mu.andrewwei.views').Posts = require('./views/Posts');
vars.namespace('mu.andrewwei.components').Nav = require('./components/Nav');
vars.namespace('mu.andrewwei.components').Paginator = require('./components/Paginator');

vars.initDOM(vars.namespace('mu.andrewwei'));

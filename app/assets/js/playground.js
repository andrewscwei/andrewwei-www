/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

vars.module(require('./controllers/NavController'));

vars.module((function() {

var utils = require('./utils/utils');

/**
 * Creates a Playground instance.
 */
function Playground()
{
    vars.Element.call(this, document.getElementById('body'));
} var parent = vars.inherit(Playground, vars.Element);

/**
 * @property
 *
 * Dictionary of child elements.
 *
 * @type {Object}
 */
Object.defineProperty(Playground.prototype, 'children', { value: {} });

/**
 * @inherit
 */
Playground.prototype.init = function()
{
    this.children.bio = this.element.getElementsByClassName('bio')[0];

    utils.changeElementState(this.children.bio, 'active');

    parent.prototype.init.call(this);
};

return Playground; }()));

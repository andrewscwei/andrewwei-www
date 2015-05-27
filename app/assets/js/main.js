/**
 *  andrewwei mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

window.debug = true; if (window.debug) console.clear();

var vars = require('vars');

vars.module((function() {

var NavController = require('./controllers/NavController');

function Main()
{
    vars.Element.call(this);
} var parent = vars.inherit(Main, vars.Element);

Main.prototype.init = function()
{
    this.addVirtualChild(new NavController(document.getElementById('nav')), 'nav');
    parent.prototype.init.call(this);
};

return Main; }()));

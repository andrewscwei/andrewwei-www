/**
 *  andrewwei mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 */

'use strict';

var vars = require('vars');

vars.module(require('./controllers/NavController'), document.getElementById('nav'));

vars.module((function() {

function Main()
{
    vars.Element.call(this);
} var parent = vars.inherit(Main, vars.Element);

Main.prototype.init = function()
{
    parent.prototype.init.call(this);
};

return Main; }()));

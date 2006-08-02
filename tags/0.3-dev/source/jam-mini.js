/*
 *  JAM: a Javascript extension library for web designers
 *
 *  Copyright (c) 2006 Michal Tatarynowicz <tatarynowicz@gmail.com>
 *  Licenced under the Public Domain licence:
 *    http://creativecommons.org/licenses/publicdomain/
 *
 *  Contains excerpts from other Javascript libraries and sources, including
 *  Prototype, Scriptaculous, Dojo Toolkit, MochiKit, jQuery and Yahoo UI.
 *  Please see licence.txt for details.
 *
 *  $Id$
 */

var JAM = {
	NAME:    "JAM-Mini",
	VERSION: "0.1",
	BUILD:   "<?=substr('$Revision$', 11, -2)?>",

	TASKS: { ready: [], load: [] },

	on: function (type, handler, context) { 
		JAM.TASKS[type].push(function(){ 
			return handler.apply(context||document); 
		});
		return true;
	},

	run: function(name) {
		var T = $A(JAM.TASKS[name]);
		T.each(function(f){ f(); });
		JAM.TASKS[name] = [];
		return true;
	},

	onReady:  function (f,c) { return JAM.on('ready', f, c); },
	runReady: function ()    { return JAM.run('ready'); },
	onLoad:   function (f,c) { return JAM.on('load',  f, c); },
	runLoad:  function ()    { return JAM.run('ready') && JAM.run('load'); }
};

//////    <?=insert('lang/base', 'lang/funct')?>

// >> aliases
var onLoad  = JAM.onLoad.bind(JAM);
var onReady = JAM.onReady.bind(JAM);
// <<

//////    <?=insert('browser', 'compat')?>
//////    <?=insert('lang/debug')?>
//////    <?=insert('lang/events')?>

JAM.Compat.init();

//////    <?=insert('lang/string', 'lang/array')?>
//////    <?=insert('dom/array', 'dom/element')?>

//////    <?=insert('dom/selector')?>
// >> aliases
var $   = JAM.Dom.selector.get;
var $$  = JAM.Dom.selector.getMany;
var $$F = JAM.Dom.selector.filter;
// <<

//////    <?=insert('dom/creator')?>

/* for Mozilla */
connect(document, 'DOMContentLoaded', JAM.runReady.bind(JAM));

/* for everyone */
connect(window, 'load', JAM.runLoad.bind(JAM));

/*
 * need to decide when to extend base classes, which depends 
 * on how will the structure work :TODO:
 * must be run only once and after defining all of element's extensions
 */ 

// >> extensions to Element
if (!document.all) JAM.onReady(function(){ 
	extend(Element.prototype, JAM.Dom.Element);
});
// <<

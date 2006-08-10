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
	NAME:      "<?=NAME?>",
	VERSION:   "<?=VERSION?>",
	BUILD:     "<?=BUILD?>",
	REVISION:  "<?=substr('$Revision$', 11, -2)?>",

	E_NOTICE:  1,
	E_WARNING: 2,
	E_ERROR:   3,

	INCLUDES:  "<?=INCLUDE_PATH?>",
	LOADED:    [],

	provides: function (lib) {
		if (!this.LOADED.has(lib)) {
			this.LOADED.push(lib);
		}
	},

	requires:  function(lib) {
		if (this.LOADED.has(lib)) return;
		
		var path = this.INCLUDES+lib.toLowerCase().replace('.', '/');
		debug(path);
		try {
			document.write("<scr"+"ipt type='text/javascript' src='"+path+"'></scr"+"ipt>");
		} catch (e) {
			var script = document.createElement("script");
			script.src = path;
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	}
};

// >> aliases
var provides = function(lib) { JAM.provides(lib) };
var requires = function(lib) { JAM.requires(lib) };
// <<


<?=insert('lang/base', false)?>
<?=insert('lang/funct', false)?>
<?=insert('lang/array', false)?>


<?=insert('ready')?>
<?=insert('lang/events')?>
<?=insert('browser')?>
<?=insert('compat')?>
<?=insert('lang/debug')?>

JAM.Compat.init();

<?=insert('lang/string')?>
<?=insert('dom/array')?>
<?=insert('lang/shape')?>
<?=insert('dom/element')?>
<?=insert('dom/selector')?>

// >> aliases
var $   = JAM.Dom.selector.get;
var $$  = JAM.Dom.selector.getMany;
var $$F = JAM.Dom.selector.filter;
// <<

<?=insert('dom/creator')?>
<?=insert('dom/dynamic/draggable')?>
<?=insert('dom/dynamic/resizable')?>

<?=insert('io/ajax')?>

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


if (!JAM.Dom) JAM.Dom = {};

JAM.Dom.selector = {

	// Returns a SINGLE ELEMENT
	get: function(D, C) {

		if (isNull(D)) {
			return D;
		}
		else if (isElement(D)) {
			return extend(D, JAM.Dom.Element);
		}

		var nodes = $$(D, C);
		return nodes.length? nodes[0]: null;
	},

	// Returns an ARRAY OF ELEMENTS
	getMany: function(Descr, Contexts, limit_to) {
        var dd = Descr;
		var O = extend([], JAM.Dom.array);

		switch (getType(Descr)) {
			case 'string':  Descr = Descr.split(' ') || '*'; break;
			case 'element': O.push(Descr); return O;
			case 'null': 
			case 'undefined': return O;
		}

		switch (getType(Contexts)) {
			case 'string':  Contexts = this.getMany(Contexts); break;
			case 'element': Contexts = [Contexts]; break;
			case 'array':   break;
			default:        Contexts = [document];
		}

		Descr    = $A(Descr).compact();
		Contexts = $A(Contexts).compact().unique();
		var D = Descr.shift();

		Contexts.each(function(context){

			if (isUndef(D)) {
				var T = [];
			}
			else if (!isString(D)) {
				var T = [D];
			}
			else if (D.indexOf('#') == 0) {
				var T = [context.getElementById(D.substr(1,D.length))];
			}
			else if (D.indexOf('.') == 0) {
				var T = JAM.Dom.selector.withClass(D.substr(1,D.length), context);
			}
			else {
				var N = null;
				if (D.indexOf('.') > 0) {
					var N = D.substr(D.indexOf('.')+1,D.length);
					D = D.replace('.'+N, '');
				}

				var T = $A(context.getElementsByTagName(D));

				// IF NO TAGS WITH THAT NAME, TRY '#'+NAME (FOR PROTOTYPE COMPATIBILITY)
				if (!T.length) {
					var E = $$('#'+D).shift();
					if (E) T = [E];
				}
				else if (N) {
					T = T.collect(function(E){
						if (E.className && JAM.Dom.selector.hasClass(E, N)) return E;
					});
				}
			}

			T = T.compact().unique();
			T = Descr.length? JAM.Dom.selector.getMany(Descr, T): T;

			O = O.concat(T);
		});
		$A(O).each(function(elem){ 
			if (!elem._extended) {
				extend(elem, JAM.Dom.Element); 
				elem._extended = 1;
			}
		});
		return extend(O, JAM.Dom.array);
	},

	filter: function (elements, descr) {
		var passing = $$(descr||'*');
		return elements.filter(function(elem){
			return passing.has(elem, descr);
		});
	},

	passes: function (elem, descr) {
		return $$(descr, elem.parentNode).has(elem);
	},

	hasClass: function(E, N){
		return (E.className || '').match(new RegExp("(\\b)"+N+"(\\b)"));
	},

	// Finds all elements with specified content
	// >> from Prototype
	withClass: function(Name, Context) {
		var children = [].from(  (this.get(Context) || document.body).getElementsByTagName('*')  ) || [];
		var elements = [];
		var self = this;
		return children.collect(function(child){
			if (self.hasClass(child, Name)) return child;
		});
	}
	// <<
};

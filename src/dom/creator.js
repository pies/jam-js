if (!JAM.Dom) JAM.Dom = {};

JAM.Dom.creator = {

	tags: ['A', 'BR', 'BUTTON', 'CANVAS', 'DIV', 'FIELDSET', 'FORM',
	 'H1', 'H2', 'H3', 'HR', 'IMG', 'INPUT', 'LABEL', 'LEGEND',
	 'LI', 'OL', 'OPTGROUP', 'OPTION', 'P', 'PRE', 'SELECT',
	 'SPAN', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TEXTAREA',
	 'TFOOT', 'TH', 'THEAD', 'TR', 'TT', 'UL', 'IFRAME' ],

	initialize: function(){
		window.HTML = {};
		this.tags.each(this.define);
	},

	define: function (N) {
		window.HTML[N.toUpperCase()] = function() {
			return JAM.Dom.creator.createNode(N, arguments);
		};
	},

	createNode: function(N, Args) {
		N = document.createElement(N);

		// IE that doesn't use Element.prototype
		// was: if (document.all) { extend(N, JAM.Dom.Element) };
		extend(N, JAM.Dom.Element);

		// Apply parameters (including CSS)
		Args = $A(Args);
		if (Args.length && !isElement(Args[0])) {
			if (Args[0].css) {
				var CSS = Args[0].css;
				Args[0].css = undefined;
				for(S in CSS){
					N.style[S] = CSS[S];
				}
			}
			extend(N, Args.shift() || {});
		}

		// Append child elements
		Args.flatten().compact().each(function(A){
			if (isString(A) || isNumber(A)) A = document.createTextNode(''+A);
			N.appendChild(A);
		});

		return N;
	}

};

JAM.Dom.creator.initialize();

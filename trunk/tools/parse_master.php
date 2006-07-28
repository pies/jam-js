<?

class ParseMaster {

	// constants
    var $EXPRESSION = 0, $REPLACEMENT = 1, $LENGTH = 2;

    // used to determine nesting levels
    var $GROUPS = '/\(/g';
    var $SUB_REPLACE = '/\$\d/';
    var $INDEXED = '/^\$\d+$/';
    var $TRIM = '/([\'"])\1\+(.*)\+\1\1$/';
    var $ESCAPE = '/\\./g';
    var $QUOTE = '/\'/';
    var $DELETED = '/\x01[^\x01]*\x01/g';

    function add ($expression, $replacement='') {
        // count the number of sub-expressions
        //  - add one because each pattern is itself a sub-expression
        $length = preg_match_all($this->GROUPS, $this->_internalEscape(''.$expression), $matched);
        // does the pattern deal with sub-expressions?
        if (preg_match($this->SUB_REPLACE, $replacement)) {
            // a simple lookup? (e.g. "$2")
            if (preg_match($this->INDEXED, $replacement)) {
                // store the index (used for fast retrieval of matched strings)
                $replacement = (array_slice($replacement, 1)*1)-1;
            } else { // a complicated lookup (e.g. "Hello $2 $1")
                // build a function to do the lookup
                $i = $length;
                $quote = preg_match($this->QUOTE, $this->_internalEscape($replacement)) ? '"' : "'";
                while ($i) {
                	$replacement = join($quote.'$a+[$o+'.$i.']+'.$quote, explode('$'.$i--, $replacement));
                }
                $replacement = create_function("a,o", "return " . $quote . preg_replace($this->TRIM, '$1', $replacement) . $quote);
            }
        }
        // pass the modified arguments
        $this->_add($expression? $expression: '/^$/', $replacement, $length);
    }

    function _internalEscape($string) {
        return str_replace($this->ESCAPE, '');
    }

    // encode escaped characters
    function _escape($string, $escapeChar) {
        return $escapeChar ? preg_replace("/\\" . $escapeChar . "(.)/g", $this->_escaped[]), function($match, $char) {
            _escaped[_escaped.length] = $char;
            return $escapeChar;
        }) : $string;
    }
    // decode escaped characters
    function _unescape($string, $escapeChar) {
        var i = 0;
        return $escapeChar ? $string.replace(new RegExp("\\" + $escapeChar, "g"), function() {
            return $escapeChar + (_escaped[i++] || "");
        }) : $string;
    }



    // execute the global replacement
    function exec($string) {
        $this->_escaped = array();
        return _unescape(_escape($string, this.escapeChar).replace(
            new RegExp(_patterns, this.ignoreCase ? "gi" : "g"), _replacement), this.escapeChar).replace($$DELETED, "");
    }

    // clear the patterns collection so that this object may be re-used
     function reset() {
        $this->_patterns = array();
    }

    // private
    var $_escaped = array();  // escaped characters
    var $_patterns = array(); // patterns stored by index

    var $_toString = create_function('', 'return "(" + String(this[$EXPRESSION]).slice(1, -1) + ")"');
    $this->_patterns.toString = function(){return this.join("|")};
    // create and add a new pattern to the patterns collection
    function _add() {
        arguments.toString = _toString;
        // store the pattern - as an arguments object (i think this is quicker..?)
        _patterns[_patterns.length] = arguments;
    }
    // this is the global replace function (it's quite complicated)
    function _replacement() {
        if (!arguments[0]) return "";
        var i = 1, j = 0, $pattern;
        // loop through the patterns
        while ($pattern = _patterns[j++]) {
            // do we have a result?
            if (arguments[i]) {
                var $replacement = $pattern[$REPLACEMENT];
                switch (typeof $replacement) {
                    case "function": return $replacement(arguments, i);
                    case "number": return arguments[$replacement + i];
                }
                var $delete = (arguments[i].indexOf(self.escapeChar) == -1) ? "" :
                    "\x01" + arguments[i] + "\x01";
                return $delete + $replacement;
            // skip over references to sub-expressions
            } else i += $pattern[$LENGTH];
        }
    };
    // encode escaped characters
    function _escape($string, $escapeChar) {
        return $escapeChar ? $string.replace(new RegExp("\\" + $escapeChar + "(.)", "g"), function($match, $char) {
            _escaped[_escaped.length] = $char;
            return $escapeChar;
        }) : $string;
    };
    // decode escaped characters
    function _unescape($string, $escapeChar) {
        var i = 0;
        return $escapeChar ? $string.replace(new RegExp("\\" + $escapeChar, "g"), function() {
            return $escapeChar + (_escaped[i++] || "");
        }) : $string;
    };

}


?>
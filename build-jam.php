<?

/* Configuration
   -------------------------------------------------------------------------- */

define('APP_NAME', 'JAM');
define('APP_REVISION', substr('$Revision$', 11, -2));
define('APP_VERSION', '0.1.0 DEV ('.APP_REVISION.')');

define('DEBUG', true);


/* Directory layout
   -------------------------------------------------------------------------- */

define('_ROOT', dirname(__FILE__));
define('_LOGS', _ROOT);


/* Define time and calendar
   -------------------------------------------------------------------------- */

define ('SECOND',    1);
define ('MINUTE',   60*SECOND);
define ('HOUR',     60*MINUTE);
define ('DAY',      24*HOUR);
define ('WEEK',      7*DAY);
define ('YEAR',    365*DAY);

define ('MONDAY',    1);
define ('TUESDAY',   2);
define ('WEDNESDAY', 3);
define ('THURSDAY',  4);
define ('FRIDAY',    5);
define ('SATURDAY',  6);
define ('SUNDAY',    0);


/* Main framework functions
   -------------------------------------------------------------------------- */

/* Loads a library or libraries (provided as parameters) */
function load ($name /*, ... */) {
	foreach(func_get_args() as $name) {
		if (is_readable_file(_LIBS."/$name.php"))
			require_once(_LIBS."/$name.php");
		elseif (is_readable_file(_APP."/$name.php"))
			require_once(_APP."/$name.php");
		else
			require_once(_ROOT."/$name.php");
	}
	return true;
}

/* Relatively renders and inserts files inside current template (a "smarter" include() ) */
function insert () {
	$args = func_get_args();
	$args = array_flatten($args);

	$caller = caller_file();
	$relative_to = dirname($caller);
	$format = substr($caller, strrpos($caller, '.')+1);

	$output = '';
	foreach ($args as $file) {
		$path = ($file[0] == '/')? _APP: $relative_to;
		$output .= render("$path/$file.$format");
	}
	return "\n\n".$output."\n\n";
}

/* Renders a PHP template */
function render ($__name, $__data=array()) {

	if (!is_readable_file($__name)) {
		$caller = caller_file();
		$relative_to = dirname($caller);
		$format = substr($caller, strrpos($caller, '.')+1);
		$__name = $relative_to.$__name.'.'.$format;
	}
	
	if (!is_readable_file($__name)) {
		error("Can't open file $__name");
	}

	extract($__data, EXTR_SKIP);
	ob_start();
	include($__name);
	return ob_get_clean();
}

/* Sends a Content-type header depending on file type code */
function send_content_header ($type) {
	$content_types = array(
		'html' => 'text/html',
		'txt'  => 'text/plain',
		'css'  => 'text/css',
		'js'   => 'text/javascript',
		'xml'  => 'application/xml'
	);

	if (empty($content_types[$type])) $type = 'html';
	header('Content-type: '.$content_types[$type]);

	return true;
}

/* Dispatches a request */
function run ($url) {
	$parts = explode('/', $url);
	while ('' === @$parts[0] && count($parts)) array_shift($parts);

	$name = array_shift($parts);

	if (!$name) $name = FASE_DEFAULT_APP;

	$class = $name.'_App';
	$filename = strtolower($class);

	if (is_readable_file(_APP."/$filename.php")) {
		load($filename);

		$app = new $class();
		$app->name = $name;
		$app->data = $parts;

		if (preg_match('@\.([a-z0-9]+)$@', $url, $match)) {
			$app->output_format = $match[1];
			$last = sizeof($parts)-1;
			$parts[$last] = str_replace('.'.$app->output_format, '', $parts[$last]);
		}
		else {
			//$app->output_format = 'html';
		}

		if (strlen(@$parts[0]) && ($parts[0][0] != '_') && method_exists($app, $parts[0])) {
			$action = array_shift($parts);
		}
		elseif (method_exists($app, 'index')) {
			$action = 'index';
		}
		else {
			if (DEBUG)
				error("Neither method {$parts[0]}() nor index() was not found in class $class.");
			else
				return run('/common/error_404');
		}

		if (method_exists($app, '_before')) {
			call_user_func_array(array($app, '_before'), $parts);
		}

		$content = call_user_func_array(array($app, $action), $parts);
		send_content_header($app->output_format);

		return $content;
	}
	elseif (is_readable_file(_APP.$url) && false) {
		// read file directly? what type?
		// should this be an option?
	}
	else {
		if (DEBUG)
			error('Neither '._APP.'/'.$name.'.php nor '._APP.$url.' was found.');
		elseif ($wrap_in_layout)
			return run('/common/error_404');
		else
			return run('/common/error_500');
	}
}


/* Data aquisition
   -------------------------------------------------------------------------- */

function G ($name, $default=false) {
	return isset($_GET[$name])? urldecode($_GET[$name]): $default;
}

function P ($name, $default=false) {
	return isset($_POST[$name])? urldecode($_POST[$name]): $default;
}

function D ($name, $default=false) {
	if ($v = G($name)) return $v;
	if ($v = P($name)) return $v;
	return $default;
}



/* Introspection
   -------------------------------------------------------------------------- */

/* Returns nicely formatted call stack */
function caller_backtrace ($skip=1) {
	$trace = debug_backtrace();
	$output = array();
	$backtrace = array_slice($trace, max($skip+1,0));

	foreach ($backtrace as $step){
		if (empty($step['file'])) continue;

		$class = str_replace(' ', '_', ucwords(str_replace('_', ' ', @$step['class'])));
		$type  = @$step['type'];
		$funct = @$step['function'];

		$output[] = array(
			'name'  => $class? $class.$type.$funct.'()': $funct.'()',
			'place' => str_replace(_ROOT, '', $step['file']).':'.$step['line'],
			'file'  => $step['file'],
			'class' => $class,
			'type'  => $type,
			'funct' => $funct
		);
	}
	return $output;
}

/* Returns caller function's full stack trace */
function caller_path ($skip=1){
	$parsed = caller_backtrace($skip);
	$is_bare = defined('BARE') && BARE;
	$template = $is_bare? '': '<span title="%s">%s</span>';

	$output = array();
	foreach ($parsed as $step){
		list($name, $place) = array_values($step);
		$output[] = sprintf($template, $name, $place);
	}

	return join( $is_bare? ' > ': ' &gt; ', $output );
}

/* Returns calling method or function name */
function caller_name ($skip=1) {
	$step = caller_backtrace($skip);
	return $step['name'];
}

/* Retuns caller function's filename and line number */
function caller_place ($skip=1) {
	$step = caller_backtrace($skip);
	return $step['place'];
}

/* Debug calling file path */
function caller_file ($skip=1) {
	$trace = caller_backtrace($skip);
	foreach ($trace as $step) {
		if (@$step['file']) return $step['file'];
	}
	return false;
}



/* Debugging
   -------------------------------------------------------------------------- */

/* Returns a string representation of a variable */
function inspect ($var) {
	return stripslashes(var_export($var, true));
}

/* Build a debug window */
function debug_window ($name, $trace, $content) {
	$insp = '';
	if (is_array($content)) {
		if (is_string($content[0])) $insp .= array_shift($content);
		foreach ($content as $k=>$item) {
			$insp .= ' '.inspect($item).' ';
		}
	}
	else {
		$insp = $content;
	}

	return '<pre class="'.$name.'"><em><b>'.$name.'</b> &nbsp; '.$trace."</em>\n".$insp.'</pre>';
}

/* Display contents of a variable, disabled with DEBUG = false */
function debug ($var=false){
	if (!DEBUG) return false;
	print debug_window('Debug', caller_path(), inspect($var));
}

/* Debug + run stack, disabled with DEBUG = false */
function trace () {
	if (!DEBUG) return false;
	$args = func_get_args();
	print debug_window('Trace', caller_path(), $args);
}

/* Trace + write to the warnings logfile */
function warning () {
	$args = func_get_args();
	print debug_window('Warning', caller_path(), $args);
	return write_log(caller_path().' >> '.$message, 'warnings');
}

/* Trace + writes to the errors logfile + aborts processing */
function error ($message) {
	write_log(caller_path().' >> '.$message, 'errors');
	die($message);
}



/* Logging
   -------------------------------------------------------------------------- */

/* Writes a message to the archive logfile */
function archive ($message) {
	return write_log(caller_place().' >> '.$message, 'archive');
}

/* Writes a timestamped (unless specified otherwise) string to chosen logfile */
function write_log ($message, $type='', $timestamp=true) {
	$filename = _LOGS.'/'.($type? $type.'_': '').date('y-m-d').'.log';
	$content  = ($timestamp? date('H:i:s '): '').str_replace(array("\n", "\r", "\t"), array(' \ ', '', ' '), $message)."\n";

	if (!($handle = fopen($filename, 'a+'))){
		print debug_window('Error writing log', caller_place(0), "Could not open logfile ({$filename}).\nPlease make sure that this directory exists and that access rights are properly set-up.");
		return false;
	}

	if (!fwrite($handle, $content))
		debug ("Could not write to logfile ({$filename})");
		return false;

	if (!fclose($handle))
		debug ("Could not close logfile ({$filename})");
		return false;

	return true;
}



/* Additional array functions
   -------------------------------------------------------------------------- */

/* Returns all array elements with $find_field value equal to $value
   (or non-empty if unspecified) */
function array_find_by_key ($array, $find_field, $value=true, $strict=false) {
	$new_array = array();
	foreach ($array as $key => $item) {
		if (@$item[$find_field] == $value)
			return $key;
	}
	return false;
}

/* From a named array, extract an array of values specified by a key */
function array_extract ($array, $key) {
	$out = array();
	foreach ($array as $item) {
		if (empty($item[$key])) continue;
		$out[] = $item[$key];
	}
	return $out;
}

/* Returns the largest strlen */
function array_max_strlen ($this) {
	$max = false;
	foreach ($this as $item) {
		$len = strlen($item);
		if ($len > $max) $max = $len;
	}
	return $max;
}

/* Iterates over array $aa with callback $f */
function array_each ($aa,$f) {
	foreach($aa as $k=>$v) {
		call_user_func_array($f, array($v, $k));
	}
	return true;
}

/* Maps an array recursively with a function */
function array_map_deep ($a, $f) {
	if (!is_array($a)) return $a;
	$o = array();
	foreach ($a as $k=>$v) {
		$o[$k] = is_array($v)? array_map_deep($v, $f): $f($v);
	}
	return $o;
}

/* Returns a flat array of values from nested array $var (recursive) */
function array_flatten ($var) {
	if (is_array($var)) {
		$out = array();
		foreach ($var as $key=>$value) {
			$out = array_merge($out, array_flatten($value));
		}
		return $out;
	}
	else {
		return array($var);
	}
}



/* Misc functions
   -------------------------------------------------------------------------- */

/* An alias for call_user_func_array() with simplified syntax */
function call ($obj, $fn=false, $params=-1) {
	if (is_string($fn)) {
		$C = array($obj, $fn);
		$P = is_array($params)? $params: array();
	}
	else {
		$C = $obj;
		$P = is_array($fn)? $fn: array();
	}
	return call_user_func_array($C, $P);
}

/* Checks if a path is a readable file */
function is_readable_file ($path) {
	return is_readable($path) && is_file($path);
}

/* Removes magic quotes from request data */
function handle_magic_quotes () {
	if (get_magic_quotes_gpc()) {
		$_POST   = array_map_deep($_POST, 'stripslashes');
		$_GET    = array_map_deep($_GET, 'stripslashes');
		$_COOKIE = array_map_deep($_COOKIE, 'stripslashes');
	}
}

/* Returns precise current time as a floating point number */
function micro () {
	list($usec, $sec) = explode(" ", microtime());
	return ((float)$usec + (float)$sec);
}

/* Recursively create a path of directories */
function force_mkdir ($path) {
	return is_dir($path) || (force_mkdir(dirname($path)) && mkdir($path));
}

/* Returns name of the browser the user is using */
function browser_name () {
	// :FIX: make it better (port Dojo's or my own JS function)
	$browser='other';
	if (isset($_SERVER['HTTP_USER_AGENT'])) {
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if (eregi('opera', $agent))
			$browser='opera';
		elseif (eregi('msie', $agent))
			$browser='msie';
	}
	return $browser;
}

/* Removes all strings that beging with $b and ends with $e (inclusive) */
function strip_between ($input, $b='/*', $e='*/') {
	$s = '  '.$input.'  ';
	$bp = strpos($s, $b);
	$ep = strpos($s, $e);

	while ($bp && $ep && ($bp < $ep)) {
		$s = '  '.trim(substr($s, 0, $bp).substr($s, $ep+2)).'  ';
		$bp = strpos($s, $b);
		$ep = strpos($s, $e);
	}

	return $s;
}


header('Content-type: text/javascript');
$file = _ROOT."/src/jam.js";

$content = render($file);
if (empty($content)) error('Render error: '.$file);
print $content;

?>
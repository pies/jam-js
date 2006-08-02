<?
require(dirname(__FILE__).'/tools/parser.php');
require(dirname(__FILE__).'/tools/config.php');
header('Content-type: text/javascript');

define('OM_STATIC', 1);
define('OM_DYNAMIC', 2);

define('BUILD_NAME',  GET($_GET, 'name', 'full_build'));
define('OUTPUT_MODE', GET($_GET, 'mode', 'static')=='dynamic'? OM_DYNAMIC: OM_STATIC);

define('SOURCE_PATH', dirname(_ROOT.ENTRY_POINT));

print render( $lib? SOURCE_PATH."/{$lib}_build.js": _ROOT.ENTRY_POINT );
?>

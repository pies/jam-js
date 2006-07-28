<?
require(dirname(__FILE__).'/tools/parser.php');
require(dirname(__FILE__).'/tools/config.php');
header('Content-type: text/javascript');

$lib = array_shift(array_keys($_GET));
print render( $lib? _ROOT."/source/{$lib}.js": _ROOT.ENTRY_POINT );
?>
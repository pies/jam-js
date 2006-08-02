<?
ini_set('error_reporting', 0);
ini_set('expose_php', false);

require(dirname(__FILE__).'/config.php');
require(dirname(__FILE__).'/parser.php');

print "\nParsing: "._ROOT.ENTRY_POINT."\n";

$content = render(_ROOT.ENTRY_POINT);

if (defined('OUTPUT_FILE')) {
	print ("Output:  "._ROOT.OUTPUT_FILE."\n");
	$f = fopen(_ROOT.OUTPUT_FILE, 'w');
	if ($f && fwrite($f, $content) && fclose($f)) {
		printf("Wrote:   ".strlen($content)." bytes\n");
		exit("Result:  OK\n");
	}
	else {
		die("Compilation error.\nCould not write output to file "._ROOT.OUTPUT_FILE."\n");
	}
}
else {
	print $content;
}
?>
<?php require(dirname(dirname(__FILE__)).'/init.php'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<script src="unittest.js" language="javascript" type="text/javascript"></script>
<script src="../?/js/__package__" language="javascript" type="text/javascript"></script>
<style type="text/css">
BODY { font-family:sans-serif; }
H1 { font-size:1.5em; margin:0 0 .5em 0; }
.TestOutput P { color:#000; margin:0 0 .5em 0; }
.TestOutput STRONG { color:#B00; }
.TestOutput EM { font-style:normal; font-weight:bold; color:#333; }
</style>
<title>JAM unit tests</title>
</head>
<body>

<h1>JAM unit tests</h1>

<div id="info"></div>

<script type="text/javascript" language="javascript" charset="utf-8">
// <![CDATA[

var TEST = new UnTest('JAM');

<?=render(dirname(__FILE__).'/cases/meta.js');?>
<?=render(dirname(__FILE__).'/cases/lang/base.js');?>
<?=render(dirname(__FILE__).'/cases/lang/array.js');?>
<?=render(dirname(__FILE__).'/cases/dom/element.js');?>
<?=render(dirname(__FILE__).'/cases/dom/creator.js');?>
<?=render(dirname(__FILE__).'/cases/dom/selector.js');?>
<?=render(dirname(__FILE__).'/cases/io/ajax.js');?>

TEST.run();

// ]]>
</script>

</body>
</html>

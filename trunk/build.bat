@C:\PROGRA~1\PHP4\php.exe -q tools\build.php
@java -jar tools\custom_rhino.jar -c dist\jam-0.4-dev.js > dist\jam-0.4-rhino.js 2>&1
@tools\jsmin.exe < dist\jam-0.4-dev.js > dist\jam-0.4-jsmin.js

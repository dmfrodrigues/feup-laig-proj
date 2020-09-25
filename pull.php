<!DOCTYPE html>
<html>
    <body>
        <?php
        $output = shell_exec('bash -c "git pull"');
        echo "<pre>$output</pre>";
        ?>
    </body>
</html>

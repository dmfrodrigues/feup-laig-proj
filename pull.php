<!DOCTYPE html>
<html>
    <body>
        <?php
        $output = shell_exec(git pull);
        echo "$output";
        ?>
    </body>
</html>

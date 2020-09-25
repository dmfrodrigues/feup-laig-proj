<!DOCTYPE html>
<html>
    <body>
        <?php
        $stdout = shell_exec('ssh -F ~/ssh-config-laig gnomo.fe.up.pt');
        echo "<pre>$stdout</pre>";
        ?>
    </body>
</html>

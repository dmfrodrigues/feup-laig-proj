<!DOCTYPE html>
<html>
    <body>
        <?php
        $cwd = getcwd();
        $pos = strpos($cwd, "/public_html/");
        $user_path = substr($cwd, 0, $pos);
        $config_file_path = $user_path.'/ssh-config-laig';

        $stdout = shell_exec('ssh -F '.$config_file_path.' gnomo.fe.up.pt');
        echo "<pre>$stdout</pre>";
        ?>
    </body>
</html>

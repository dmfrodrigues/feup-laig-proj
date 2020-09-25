<!DOCTYPE html>
<html>
    <body>
        <?php
        $stdout = shell_exec('ssh -tt -o "StrictHostKeyChecking=no" -i /usr/users2/2018/up201806429/public_html/ssh-private-keys/laig_t02_g04_pull -l up201806429 gnomo.fe.up.pt');
        echo "<pre>$stdout</pre>";
        ?>
    </body>
</html>

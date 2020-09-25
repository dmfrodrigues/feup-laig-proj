<!DOCTYPE html>
<html>
    <body>
        <?php
	    $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("pipe", "w"),
            2 => array("pipe", "w")
        );
        $process = proc_open('ssh -tt -o "StrictHostKeyChecking=no" -i /usr/users2/2018/up201806429/public_html/ssh-private-keys/laig_t02_g04_pull -l up201806429 gnomo.fe.up.pt', $descriptorspec, $pipes, dirname(__FILE__), null);
        $stdout = stream_get_contents($pipes[1]);
        fclose($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[2]);
        echo "stdout: \n";
        echo "<pre>$stdout</pre>";
        echo "stderr: \n";
        echo "<pre>$stderr</pre>";
        ?>
    </body>
</html>

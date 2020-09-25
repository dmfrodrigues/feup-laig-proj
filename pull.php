<!DOCTYPE html>
<html>
    <body>
        <?php
        $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("pipe", "w"),
            2 => array("pipe", "w")
        );
        $process = proc_open('bash -c "git pull"', $descriptorspec, $pipes, dirname(__FILE__), null);
        $stdout = stream_get_contents($pipes[1]);
        fclose($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[2]);
        echo "stdout: \n";
        var_dump($stdout);
        echo "stderr: \n";
        var_dump($stderr);
        ?>
    </body>
</html>

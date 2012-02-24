<?php 
    // if there is any pagination display it.
    if (isset($pagination) && !empty($pagination)) 
    {   
        echo '<div id="pagination">' . $pagination . '</div>';
    }
    ?>
    <div id="content">
        <?php echo (isset($content)) ? $content : ''; ?>
    </div>
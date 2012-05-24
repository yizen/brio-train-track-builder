<?php 
	//messages
	if (isset($messages) && !empty($messages)) 
	{
		foreach($messages as $type=>$messages)
            foreach($messages as $message)
            	echo "<div class='alert alert-info'><a class='close' data-dismiss='alert'>×</a>".$message."</div>";
	
	}

    // if there is any pagination display it.
    if (isset($pagination) && !empty($pagination)) 
    {   
        echo '<div id="pagination">' . $pagination . '</div>';
    }
    ?>
    <div id="content">
        <?php echo (isset($content)) ? $content : ''; ?>
    </div>
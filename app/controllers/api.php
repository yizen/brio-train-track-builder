<?php
class Api extends CI_Controller {
	function __construct() {
        parent::__construct();
        
        // Load the URL helper so redirects work.
        $this->load->helper('url');

        // this is used for the CRUD
		$this->load->model('template_model');
    }
    
    public function index() {
    	redirect(site_url());
    }
    
    public function templates() {
		
		$output = array("version" => "1");
		$tracks = array();
		
		$result = $this->template_model->list_all();

		foreach($result as $entry) {
			log_message('error', $entry["name"]);

			$tracks[]= $entry;
		}
					
		log_message('error', "--".sizeof($tracks));

		
		$output["tracks"] = $tracks;
				
		$this->output
    			->set_content_type('application/json')
    			->set_output(json_encode($output));
    }

}
?>
<?php
class Api extends CI_Controller {
	function __construct() {
        parent::__construct();
        
        // Load the URL helper so redirects work.
        $this->load->helper('url');

        // this is used for the CRUD
		$this->load->model('template_model');
		$this->load->model('railway_model');
    }
    
    public function index() {
    	redirect(site_url());
    }
    
    public function templates() {
		
		$output = array("version" => "1");
		$tracks = array();
		
		$result = $this->template_model->list_all();

		foreach($result as $entry) {
			$tracks[]= $entry;
		}
					
		$output["tracks"] = $tracks;
				
		$this->output
    			->set_content_type('application/json')
    			->set_output(json_encode($output));
    }

	public function railwaysave() {
	    $name = $this->input->post('name');
	   	$tracksArray = $this->input->post('tracksArray');
	   	
	   	$data = Array();
	   	$data['name'] = $name;
	   	$data['tracksArray'] = $tracksArray;
	   	
	   	//Check if this record already exist
	   	$query = $this->railway_model->get_by_name($name);
			
		// process the query like a normal CI Query.
        if (count($query) > 0) {
        	//We're updating;
        	$row = $query[0];
        	$id = $row["_id"];
        	$this->railway_model->update($id, $data); 
        } else {
        	//We're creating        	
        	$this->railway_model->create($data); 
        }
	}
	
	public function railwayload() {
		$id = $this->input->post('id');
		
		$output = array("version" => "1");
		$tracks = array();
		
		$result = $this->railway_model->get_by_id($id);
		
		/*foreach($result as $key => $value) {
			if ($key == "tracksArray") $tracks[]= $value;
		}*/
					
		$output["railway"] = $result[0];
				
		$this->output
    			->set_content_type('application/json')
    			->set_output(json_encode($output));
	}
}
?>
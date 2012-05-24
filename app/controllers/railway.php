<?php
class Railway extends CI_Controller {
	function __construct() {
        parent::__construct();
        
        // Load the URL helper so redirects work.
        $this->load->helper('url');

        // this is used for the CRUD
		$this->load->model('template_model');
		$this->load->model('railway_model');
    }
    
    public function open($loadedRailwayId = 0) {
        log_message('error', base_url());

    	$layout_data['canvas'] = $this->load->view('templates/canvas', "", true);
    	$layout_data['content']= $this->load->view('templates/modal-name', "", true);
    	
    	//List all available tracks
    	$result = $this->railway_model->list_all();
    	
    	$navigation_data['railways'] = "";
    	
    	foreach($result as $entry) {
        
        	$id = $entry['_id']->{'$id'};
        	
        	$navigation_data['railways'] .= '<li><a href="'.base_url().'railway/'.$id.'">'.$entry['name'].'</a></li>';
        }
		
		$navigation_data['activeTab'] = "home";
		
		$layout_data['pageTitle'] = "Tracks";
		$layout_data['loadedRailwayId'] = $loadedRailwayId;
		$layout_data['pageDescription'] = "";
		$layout_data['nav_bar'] = $this->load->view('common/navigation', $navigation_data, true);

		$this->load->view('layouts/main', $layout_data);
    }
}
?>
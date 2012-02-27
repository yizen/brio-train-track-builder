<?php
class Home extends CI_Controller {
	function __construct() {
        parent::__construct();
        
        // Load the URL helper so redirects work.
        $this->load->helper('url');

        // this is used for the CRUD
		$this->load->model('template_model');
    }
    
    public function index() {
    	$layout_data['content'] = $this->load->view('templates/canvas', "", true);
		
		$navigation_data['activeTab'] = "home";
		
		$layout_data['pageTitle'] = "Tracks";
		$layout_data['pageDescription'] = "";
		$layout_data['nav_bar'] = $this->load->view('common/navigation', $navigation_data, true);

		$this->load->view('layouts/main', $layout_data);
    }

}
?>
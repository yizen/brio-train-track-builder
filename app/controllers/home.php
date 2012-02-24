<?php
class Home extends CI_Controller {
	function index() {
		$this->load->helper('url'); 
		
		$navigation_data['activeTab'] = "home";
		
		$layout_data['pageTitle'] = "Tracks";
		$layout_data['pageDescription'] = "";
		
		$layout_data['nav_bar'] = $this->load->view('back/navigation', $navigation_data, true);

		$this->load->view('back/layouts/main', $layout_data);
	}
}
?>
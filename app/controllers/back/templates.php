<?php
class Templates extends CI_Controller {
	function __construct() {
        parent::__construct();
        
        // Load the URL helper so redirects work.
        $this->load->helper('url');

        // this is used for the CRUD
		$this->load->model('template_model');
    }
    
    private function parse_illustrator($raw) {
		$this->load->helper('JTokenizer');
		
		$tokens = j_token_get_all( $raw );

		$context = "";
		foreach($tokens as $token) {
			if ($token[0] == J_COMMENT) {
				//Which context ?
				if( preg_match("/graphics/",$token[1])) {
					$context = "graphics";
					log_message('error', 'GRAPHICS.');
				}
				
				if( preg_match("/connectors/",$token[1])) {
					$context = "connectors";
					log_message('error', 'CONNECTORS.');
				}
				
				if( preg_match("/segments/",$token[1])) {
					$context = "segments";
					log_message('error', 'SEGMENTS.');
				}	
			}
		}
	}
    
	public function index($page = 0) {

		$this->load->library('pagination');
        $config['base_url']   = site_url('back/templates/index/') ;
        $config['total_rows'] = $this->template_model->count_all();
        $config['per_page']   = 10;    // if you change this you must also change the crud call below.

        $this->pagination->initialize($config);
        $table_data['pagination'] = $this->pagination->create_links();

   		$result = $this->template_model->list_paginated($config['per_page'], $page);
        
        $this->load->library('table');
		$tmpl = array ( 'table_open'  => '<table class="table table-bordered table-striped">' );

        $this->table->set_template($tmpl);
        $this->table->set_heading('ID','Name','Edit','Delete','View'); 	

        
        foreach($result as $entry) {
        
        	$id = $entry['_id']->{'$id'};
        
        	$this->table->add_row(
                        $id, 
                        $entry['name'], 
                        anchor('back/templates/edit/'.$id,'Edit'),
                        anchor('back/templates/delete/'.$id,'Delete'),
                        anchor('back/templates/display/'.$id, 'View'));
        }
        
        $table_data['content'] = $this->table->generate();
        $table_data['content'].= '<a class="btn btn-small btn-info" href="'.site_url('back/templates/add/').'"><i class="icon-plus icon-white"></i> Add new template</a>';
        
        $layout_data['content'] = $this->load->view('back/templates/list', $table_data, true);
		
		$navigation_data['activeTab'] = "templates";
		
		$layout_data['pageTitle'] = "Tracks";
		$layout_data['pageDescription'] = "";
		$layout_data['nav_bar'] = $this->load->view('back/navigation', $navigation_data, true);

		$this->load->view('back/layouts/main', $layout_data);

	}
	
	public function add() {
        // Load Helpers as needed.
        $this->load->helper(array('form', 'url'));
        // Load Libraries as needed.
        $this->load->library('form_validation');
        
        // Rules Here
        $this->form_validation->set_rules('name', 'Name', 'required');
        
        // Check to see if form passed validation rules
        if ($this->form_validation->run() == FALSE)
        {
            // Load the form as a var 
            $display['content'] = $this->load->view('back/templates/add', '', TRUE);

            // Display the final output.
        	$layout_data['content'] = $display['content'];
            		
		 	$navigation_data['activeTab'] = "templates";
		
	     	$layout_data['pageTitle'] = "Tracks";
	     	$layout_data['pageDescription'] = "";
	     	$layout_data['nav_bar'] = $this->load->view('back/navigation', $navigation_data, true);

	     	$this->load->view('back/layouts/main', $layout_data);
        } 
        else
        {
            // If the form passed validation
            $data = array( "name" => $this->input->post('name'),
            			   "vendor" => $this->input->post('vendor'),
            			   "reference" => $this->input->post('reference'),
            			   "regX" => $this->input->post('regX'),
            			   "regY" => $this->input->post('regY'),
            			   "influence" => $this->input->post('influence'));

            
            $this->template_model->create($data);	
            
            if ($this->input->post('illustrator')) {
            	$this->parse_illustrator($this->input->post('illustrator'));
            }
            
            // Return to the index.
            redirect(site_url('back/templates/'));
        }
	}
	
	public function edit($id = 0) {
		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		
		//Have we been submitted ?
		
		if ($this->input->post('update') !== FALSE) {
			// Rules Here
            $this->form_validation->set_rules('id', 'ID', 'required');
            $this->form_validation->set_rules('name', 'Name', 'required|max_length[255]');
			
			// Check to see if form passed validation rules
            if ($this->form_validation->run() == FALSE)
            {
                // Load the form
                $form['id'] = $id;
                $form['name'] = $this->input->post('name');
                $display['content'] = $this->load->view('back/templates/edit', $form, TRUE);
            } else    {
            	$data = array( "name" => $this->input->post('name'),
            				   "vendor" => $this->input->post('vendor'),
            				   "reference" => $this->input->post('reference'),
            				   "regX" => $this->input->post('regX'),
            				   "regY" => $this->input->post('regY'),
            				   "influence" => $this->input->post('influence'),
            				   "connectors" => $this->input->post('connectors'));
            	
            	
            	$this->template_model->update( $id, $data);	
            	
                // We are done updating, return to the index.
                redirect(site_url('back/templates/'));
            }            
		
		} else {
			// Not submitted yet
			$query = $this->template_model->get_by_id($id);
			
			// process the query like a normal CI Query.
            if (count($query) > 0) {
                $row             = $query[0];
                $form['id']      = $row["_id"];
                $form['name'] 	 = $row["name"];
                $form['vendor']  	= isset($row["vendor"]) ? $row["vendor"] : "";
                $form['reference']  = isset($row["reference"]) ? $row["reference"] : "";
                $form['regX']  		= isset($row["regX"]) ? $row["regX"] : "";
                $form['regY']  		= isset($row["regY"]) ? $row["regY"] : "";
                $form['influence']  = isset($row["influence"]) ? $row["influence"] : "";
                $form['connectors'] = isset($row["connectors"]) ? $row["connectors"] : "";

                
                // Save the form as "content"
                $display['content'] = $this->load->view('back/templates/edit', $form, TRUE);
            } 
            else 
            {
                // if we couldn't find the id... tell them there was a problem.
                $display['content'] = 'This track does not exist.';
            }

  		}
  		
  		 // Display the final output.
         $layout_data['content'] = $display['content'];
            		
		 $navigation_data['activeTab'] = "templates";
		
	     $layout_data['pageTitle'] = "Tracks";
	     $layout_data['pageDescription'] = "";
	     $layout_data['nav_bar'] = $this->load->view('back/navigation', $navigation_data, true);

	     $this->load->view('back/layouts/main', $layout_data);
	}
	
	public function delete($id = 0) {
		$this->template_model->delete_by_id($id);
		redirect(site_url('back/templates/'));
	}
}
?>
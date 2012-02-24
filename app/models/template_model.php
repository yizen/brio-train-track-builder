<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Template_model extends CI_Model {

	private $collection;

	function __construct() {
		parent::__construct();
		
		$this->collection = "trackstemplates";
	}
	
	function count_all() {
		//log_message('info',$this->collection );
		return $this->mongo_db->count($this->collection);
	}
	
	function list_all() {
		return $this->mongo_db->order_by(array('name' => 'asc'))->get($this->collection);
	}
	
	function list_paginated($limit, $offset) {
		return $this->mongo_db->order_by(array('name' => 'asc'))->limit($limit)->offset($offset)->get($this->collection);
	}
	
	function get_by_id($id) {
		return $this->mongo_db->where('_id', $id)->get($this->collection);
	}
	
	function update($id, $data) {
		$this->mongo_db->where('_id', $id)->update($this->collection, $data);
	}
	
	function create($data) {
		$this->mongo_db->insert($this->collection, $data);
	}

	function delete_by_id($id) {
		$this->mongo_db->where('_id', $id)->delete($this->collection);
	}
}
?>
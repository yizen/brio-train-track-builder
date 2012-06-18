<?php

/*
 *
 */
 
function text_input($name, $value, $label = NULL, $is_text_area = false) {

	if (!isset($label)) $label = $name;

	// Form input settings
	$data = array(
    	'name'        => $name,
    	'id'          => $name,
    	'value'       => set_value($name, $value),
    	'style'       => 'input-xlarge',
    	'rows'		  => '5'
    );
    
	echo '<div class="control-group">';
	echo '<label class="control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="controls">';
	
	if ($is_text_area) {
		echo form_textarea($data);
	} else {
		echo form_input($data);
	}
	echo '</div>';
	echo '</div>';
}

/*
 *
 */
function select_input($name, $options, $value, $label = NULL) {
	
	if (!isset($label)) $label = $name;

	echo '<div class="control-group">';
    echo '<label class="control-label" for="'.$name.'">'.$label.'</label>';
    echo '<div class="controls">';
    echo form_dropdown($name, $options, $value);
    echo '</div>';
	echo '</div>'; 
}

/* ---------------------------------------------------------------------------*/
echo validation_errors('<div class="alert"><a class="close" data-dismiss="alert">×</a>','</div>'); 

$attributes = array('class' => 'form-horizontal');
echo form_open_multipart('/admin/templates/add/', $attributes);

echo form_fieldset('Track Infos');

if (!isset($name)) $name = "";
if (!isset($vendor)) $vendor = "BRIO";
if (!isset($reference)) $reference = "0";


text_input("name", $name);
text_input("vendor", $vendor);
text_input("reference", $reference);

echo form_fieldset_close(); 

if (!isset($influence)) $influence = "0";

echo form_fieldset('Geometry Infos');
text_input("influence", $influence);
echo form_fieldset_close();

echo form_fieldset('Geometry from Illustrator');
if (!isset($illustrator)) $illustrator = "";
text_input("illustrator", $illustrator, "Illustrator file", true);

echo '<div class="control-group">';
echo '<label class="control-label" for="userfile">File input</label>';
echo '<div class="controls">';
echo '<input class="input-file" id="userfile" name="userfile" type="file">';
echo '</div>';
echo '</div>';

echo form_fieldset_close(); 

echo '<div class="form-actions">';
// Render submit button to form

$data = array(
    'class'	=> 'btn btn-primary ',
    'name'	=> 'Create'
    );
    
echo form_submit($data, 'Create');

// Close the Form
echo form_close();

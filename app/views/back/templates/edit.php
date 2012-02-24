<?php

/*
 *
 */
 
function text_input($name, $value, $label = NULL) {

	if (!isset($label)) $label = $name;

	// Form input settings
	$data = array(
    	'name'        => $name,
    	'id'          => $name,
    	'value'       => set_value($name, $value),
    	'style'       => 'input-xlarge'
    );
    
	echo '<div class="control-group">';
	echo '<label class="control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="controls">';
	echo form_input($data);
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
echo form_open('/back/templates/edit/' . $id, $attributes);

$data = array(
    'id'  => $id
);
echo form_hidden($data);

echo form_fieldset('Track Infos');

text_input("name", $name);
text_input("vendor", $vendor);
text_input("reference", $reference);

echo form_fieldset_close(); 
echo form_fieldset('General Geometry');

text_input("regX", $regX);
text_input("regY", $regY);
text_input("influence", $influence);

echo form_fieldset_close(); 

if (!isset($connectors)) {
	echo form_fieldset('Connectors');

	$connectors_type_options = array(
		'MALE' => 'MALE',
		'FEMALE' => 'FEMALE');
	
	$connectors_isAxisForFlip_options = array(
		'true' => 'true',
		'false' => 'false');
	
	$i = 0;
	
	foreach ($connectors as $connector) {
		text_input("connectors[".$i."][name]", $connector['name'], "Name");
		
		if (!isset($connector['type']))  $connector['type'] = "MALE";
		select_input("connectors[".$i."][type]", $connectors_type_options , $connector['type'], "Type");
		
		if (!isset($connector['isAxisForFlip']))  $connector['isAxisForFlip'] = "false";
		select_input("connectors[".$i."][isAxisForFlip]", $connectors_isAxisForFlip_options , $connector['isAxisForFlip'], "Is axis for flip");
	
		text_input("connectors[".$i."][p1][x]", $connector['p1']['x'], "p1 x");
		text_input("connectors[".$i."][p1][y]", $connector['p1']['y'], "p1 y");
	
		text_input("connectors[".$i."][p2][x]", $connector['p2']['x'], "p2 x");
		text_input("connectors[".$i."][p2][y]", $connector['p2']['y'], "p2 y");
		$i++;
	}
	
	echo form_fieldset_close(); 
}
echo '<div class="form-actions">';
// Render submit button to form

$data = array(
    'class'	=> 'btn btn-primary ',
    'name'	=> 'update'
    );
echo form_submit($data, 'Update');

// Close the Form
echo form_close();

<?php
$login = array(
	'name'	=> 'login',
	'id'	=> 'login',
	'value' => set_value('login'),
	'maxlength'	=> 80,
	'size'	=> 30
);

if ($login_by_username AND $login_by_email) {
	$login_label = 'Email or login';
} else if ($login_by_username) {
	$login_label = 'Login';
} else {
	$login_label = 'Email';
}

$password = array(
	'name'	=> 'password',
	'id'	=> 'password',
	'size'	=> 30
);

$remember = array(
	'name'	=> 'remember',
	'id'	=> 'remember',
	'value'	=> 1,
	'checked'	=> set_value('remember')
);

$captcha = array(
	'name'	=> 'captcha',
	'id'	=> 'captcha',
	'maxlength'	=> 8
);


$attributes = array('class' => 'form-horizontal');
echo form_open($this->uri->uri_string(), $attributes); 

echo '<div class="control-group';
echo isset($errors[$login['name']])?' error">':'">';
$attributes = array('class' => 'control-label');
echo form_label($login_label, $login['id'], $attributes); 
echo '<div class="controls">';
echo form_input($login);
echo isset($errors[$login['name']])?'<p class="help-block">'.$errors[$login['name']].'</p>':'';
echo '</div>';
echo '</div>';	
 
echo '<div class="control-group';
echo isset($errors[$password['name']])?' error">':'">';
$attributes = array('class' => 'control-label');
echo form_label('Password', $password['id'], $attributes); 
echo '<div class="controls">';
echo form_password($password); 
echo isset($errors[$password['name']])?'<p class="help-block">'.$errors[$password['name']].'</p>':'';

echo '</div>';
echo '</div>';
	
		
if ($show_captcha) {
		if ($use_recaptcha) { 
		?>			
			<div id="recaptcha_image"></div>
			<a href="javascript:Recaptcha.reload()">Get another CAPTCHA</a>
			<div class="recaptcha_only_if_image"><a href="javascript:Recaptcha.switch_type('audio')">Get an audio CAPTCHA</a></div>
			<div class="recaptcha_only_if_audio"><a href="javascript:Recaptcha.switch_type('image')">Get an image CAPTCHA</a></div>
		
			<div class="recaptcha_only_if_image">Enter the words above</div>
			<div class="recaptcha_only_if_audio">Enter the numbers you hear</div>
		
			<input type="text" id="recaptcha_response_field" name="recaptcha_response_field" />
			<span style="color: red;"><?php echo form_error('recaptcha_response_field'); ?></span>
			<?php echo $recaptcha_html; ?>
	
			<?php } else { ?>
			
			<div class="control-group">

				<label class="control-label">Enter the code exactly as it appears:</label>
				<div class="controls">
					<?php echo $captcha_html; ?>
				</div>
			</div>
					
			<div class="control-group">
			<?php echo form_label('Confirmation Code', $captcha['id'], array('class' => 'control-label')); ?>
			<div class="controls">
			<?php echo form_input($captcha); ?>
			<p class="help-block"><?php echo form_error($captcha['name']); ?></p>
			</div>
			</div>
			<?php }
	} 
	
echo '<div class="control-group">';
$attributes = array('class' => 'control-label');
echo form_label('Remember me', $remember['id'], $attributes); 
echo '<div class="controls">';
echo '<label class="checkbox">';
echo form_checkbox($remember, array('class' => 'checkbox'));
echo 'Please log me in next time.';
echo '</label>';
echo '</div>';
echo '</div>';

echo '<div class="form-actions">';
	
$attributes = array('class' => 'btn');	
echo anchor('/auth/forgot_password/', 'Forgot password', $attributes); 
echo "&nbsp;";
if ($this->config->item('allow_registration', 'tank_auth')) echo anchor('/auth/register/', 'Register', $attributes);
echo "&nbsp;";
$attributes = array('class' => 'btn btn-primary');		
echo form_submit($attributes, 'Let me in'); 

echo '</div>';

echo form_close(); 
?>
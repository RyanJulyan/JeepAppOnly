<?php

// Include Database Connection file
require("connect_to_mysql.php");

$select_inputs_checkboxes_arr =  explode( ',', $_REQUEST['select_inputs_checkboxes_arr']);

for($i=0; $i < count($select_inputs_checkboxes_arr); $i++){
	
	$insert_project_sql = "
	INSERT INTO `proj_input`(`id`, `input_info_id`, `project_id`) 
	VALUES (NULL,
	".$select_inputs_checkboxes_arr[$i].", 
	".$_REQUEST['project_select']."); ";
	
	
	// Create SQL Insert panel statement quey
	mysql_query($insert_project_sql)or die(mysql_error());
}
?>
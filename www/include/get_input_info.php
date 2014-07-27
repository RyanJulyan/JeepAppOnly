<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create input_info SQL select statement
$select_input_info_sql = "
SELECT * 
FROM `input_info`";

// Create SQL select statement query
$select_input_info_sql_query = mysql_query($select_input_info_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($input_info_row = mysql_fetch_array($select_input_info_sql_query)){
	$row_array['id'] = $input_info_row["id"];
	$row_array['data_type_id'] = $input_info_row["data_type_id"];
	$row_array['label'] = $input_info_row["label"];
	$row_array['required'] = $input_info_row["required"];
	$row_array['input_name'] = $input_info_row["input_name"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
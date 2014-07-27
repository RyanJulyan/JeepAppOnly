<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create project_data_capture SQL select statement
$select_project_data_capture_sql = "
SELECT * 
FROM `project_data_capture`";

// Create SQL select statement query
$select_project_data_capture_sql_query = mysql_query($select_project_data_capture_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($project_data_capture_row = mysql_fetch_array($select_project_data_capture_sql_query)){
	$row_array['id'] = $project_data_capture_row["id"];
	$row_array['proj_input_id'] = $project_data_capture_row["proj_input_id"];
	$row_array['user_id'] = $project_data_capture_row["user_id"];
	$row_array['user_submission_num'] = $project_data_capture_row["user_submission_num"];
	$row_array['project_id'] = $project_data_capture_row["project_id"];
	$row_array['value'] = $project_data_capture_row["value"];
	$row_array['cur_lat'] = $project_data_capture_row["cur_lat"];
	$row_array['cur_long'] = $project_data_capture_row["cur_long"];
	$row_array['date_time_created'] = $project_data_capture_row["date_time_created"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
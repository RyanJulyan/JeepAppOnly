<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create project SQL select statement
$select_project_sql = "
SELECT * 
FROM `project`";

// Create SQL select statement query
$select_project_sql_query = mysql_query($select_project_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($project_row = mysql_fetch_array($select_project_sql_query)){
	$row_array['id'] = $project_row["id"];
	$row_array['admin_id'] = $project_row["admin_id"];
	$row_array['name'] = $project_row["name"];
	$row_array['big_logo'] = $project_row["big_logo"];
	$row_array['small_logo'] = $project_row["small_logo"];
	$row_array['project_logo'] = $project_row["project_logo"];
	$row_array['background'] = $project_row["background"];
	$row_array['start_date'] = $project_row["start_date"];
	$row_array['end_date'] = $project_row["end_date"];
	$row_array['date_time_created'] = $project_row["date_time_created"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
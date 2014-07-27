<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create user SQL select statement
$select_user_sql = "
SELECT * 
FROM `user`";

// Create SQL select statement query
$select_user_sql_query = mysql_query($select_user_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($user_row = mysql_fetch_array($select_user_sql_query)){
	$row_array['id'] = $user_row["id"];
	$row_array['name'] = $user_row["name"];
	$row_array['date_time_in'] = $user_row["date_time_in"];
	$row_array['cur_lat'] = $user_row["cur_lat"];
	$row_array['cur_long'] = $user_row["cur_long"];
	$row_array['date_time_out'] = $user_row["date_time_out"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
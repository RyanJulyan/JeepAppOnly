<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create data_type SQL select statement
$select_data_type_sql = "
SELECT * 
FROM `data_type`";

// Create SQL select statement query
$select_data_type_sql_query = mysql_query($select_data_type_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($data_type_row = mysql_fetch_array($select_data_type_sql_query)){
	$row_array['id'] = $data_type_row["id"];
	$row_array['data_type'] = $data_type_row["data_type"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create super_user SQL select statement
$select_super_user_sql = "
SELECT * 
FROM `super_user`";

// Create SQL select statement query
$select_super_user_sql_query = mysql_query($select_super_user_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($super_user_row = mysql_fetch_array($select_super_user_sql_query)){
	$row_array['id'] = $super_user_row["id"];
	$row_array['username'] = $super_user_row["username"];
	$row_array['password'] = $super_user_row["password"];
	$row_array['email'] = $super_user_row["email"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
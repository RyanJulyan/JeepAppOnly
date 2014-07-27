<?php
header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

// Create admin SQL select statement
$select_admin_sql = "
SELECT * 
FROM `admin`";
// Create SQL select statement query
$select_admin_sql_query = mysql_query($select_admin_sql)or die(mysql_error());

//Create an array
$json_response = array();

// Assign the user information to Variables
while($admin_row = mysql_fetch_array($select_admin_sql_query)){
	$row_array['id'] = $admin_row["id"];
	$row_array['super_user_id'] = $admin_row["super_user_id"];
	$row_array['user_name'] = $admin_row["user_name"];
	$row_array['password'] = $admin_row["password"];
	$row_array['active'] = $admin_row["active"];
	$row_array['email'] = $admin_row["email"];
	
	//push the values in the array
	array_push($json_response,$row_array);
}
//Parse header as JASON
header('Content-Type: application/json');
//Print the Information in JASON Formatting by encoding it.
echo json_encode($json_response);

?>
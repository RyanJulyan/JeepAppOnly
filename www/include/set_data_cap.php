<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

$AllUsers = array();
$AllUsersExploded = explode( ',',$_REQUEST['AllUsersDataCap']);
$noInArray = count($AllUsersExploded);
$noOfEntries = $noInArray/10;

$currentIndex = 0;
$counter = 0;
$itemArray=array();
for($j = 0; $j < $noInArray; $j++){
	array_push($itemArray, $AllUsersExploded[$j]);
	$counter++;
	if($counter == 10){
		array_push($AllUsers,$itemArray);
		$counter = 0;
		$itemArray=array();
	}
	
	
}

$last_user_id;
$lastUserName;

for($i=0; $i < count($AllUsers); $i++){
	$proj_input_id = $AllUsers[$i][1];
	$user_id = $AllUsers[$i][2];
	$user_submission_num = $AllUsers[$i][3];
	$project_id = $AllUsers[$i][4];
	$value = $AllUsers[$i][5];
	$cur_lat = $AllUsers[$i][6];
	$cur_long = $AllUsers[$i][7];
	$date_time_created = $AllUsers[$i][8];
	$username = $AllUsers[$i][9];
	
	// echo $username;
	
	if($proj_input_id ==""){
		$proj_input_id = 0;
	}
	
	if($user_submission_num ==""){
		$user_submission_num = 0;
	}
	
	if($project_id ==""){
		$project_id = 0;
	}
	
	if($value ==""){
		$value = "UNKNOWN";
	}
	
	if($cur_lat ==""){
		$cur_lat = "LAT Not Avalible";
	}
	
	if($cur_long ==""){
		$cur_long = "LONG Not Avalible";
	}
	
	if($date_time_created ==""){
		$date_time_created = "NULL";
	}
	
	//echo $AllUsers[$i][1];

	$insert_project_sql = "INSERT INTO project_data_capture(`id`, `proj_input_id`, `user_id`, `user_submission_num`, `project_id`, `value`, `cur_lat`, `cur_long`, `date_time_created`) 
	VALUES (NULL,
	".$proj_input_id.",
		(SELECT id FROM user
		WHERE name = '".$username."'
		ORDER BY id DESC
		LIMIT 1),
	".$user_submission_num.",
	".$project_id.",
	'".$value."',
	'".$cur_lat."',
	'".$cur_long."',
	'".$date_time_created."');";
	
	//echo $insert_project_sql."\n\n";
	
	// Create SQL Insert panel statement quey
	mysql_query($insert_project_sql)or die(mysql_error());
	
	$last_user_id = $user_id;
	$lastUserName = $username;
}

?>
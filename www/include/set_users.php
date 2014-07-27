<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

$AllUsers =  $_REQUEST['AllUsers'];

$AllUsers = array();
$AllUsersExploded = explode( ',',$_REQUEST['AllUsers']);
$noInArray = count($AllUsersExploded);
$noOfEntries = $noInArray/6;

$currentIndex = 0;
$counter = 0;
$itemArray=array();
for($j = 0; $j < $noInArray; $j++){
	array_push($itemArray, $AllUsersExploded[$j]);
	$counter++;
	if($counter == 6){
		array_push($AllUsers,$itemArray);
		$counter = 0;
		$itemArray=array();
	}
	
	
}

for($i=0; $i < count($AllUsers); $i++){
	$name = $AllUsers[$i][1];
	$date_time_in = $AllUsers[$i][2];
	$cur_lat = $AllUsers[$i][3];
	$cur_long = $AllUsers[$i][4];
	$date_time_out = $AllUsers[$i][5];
	
	if($name ==""){
		$name = "UNKNOWN";
	}
	
	if($date_time_in ==""){
		$date_time_in = "NULL";
	}
	
	if($cur_lat ==""){
		$cur_lat = "LAT Not Avalible";
	}
	
	if($cur_long ==""){
		$cur_long = "LONG Not Avalible";
	}
	
	if($date_time_out ==""){
		$date_time_out = "NULL";
	}
	
	//echo $AllUsers[$i][1];

	$insert_project_sql = "INSERT INTO user(`id`, `name`, `date_time_in`, `cur_lat`, `cur_long`, `date_time_out`) 
	VALUES (NULL,
	'".$name."',
	'".$date_time_in."',
	'".$cur_lat."',
	'".$cur_long."',
	'".$date_time_out."');";
	
	//echo $insert_project_sql."\n\n";
	
	// Create SQL Insert panel statement quey
	mysql_query($insert_project_sql)or die(mysql_error());
}

?>
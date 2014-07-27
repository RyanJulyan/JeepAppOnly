<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

$insert_project_sql = "
INSERT INTO `project` (`id`, `admin_id`, `name`, `big_logo`, `small_logo`, `project_logo`, `background`, `start_date`, `end_date`, `date_time_created`) 
VALUES (NULL, 
".$_REQUEST['admin_id'].", 
'".$_REQUEST['name']."',
'Jeep',
'Jeep',
'Jeep',
'Jeep',
NOW(),
NOW(),
NOW());";

// Create SQL Insert panel statement quey
mysql_query($insert_project_sql)or die(mysql_error());

$select_project_sql = "
SELECT id FROM `project` WHERE name = '".$_REQUEST['name']."';";

// Create SQL select statement query
$select_project_sql_query = mysql_query($select_project_sql)or die(mysql_error());

//Create an array
$uploaded_project_id;

// Assign the user information to Variables
while($project_row = mysql_fetch_array($select_project_sql_query)){
	$uploaded_project_id = $project_row["id"];
}

// big_logo IMAGE UPLOAD:
$big_logo_fileName = $_FILES["big_logo"]["name"]; // The file name 
$big_logo_fileTmpLoc = $_FILES["big_logo"]["tmp_name"]; // File in the PHP tmp folder 
$big_logo_fileType = $_FILES["big_logo"]["type"]; // The type of file it is 
$big_logo_fileSize = $_FILES["big_logo"]["size"]; // File size in bytes 
$big_logo_fileErrorMsg = $_FILES["big_logo"]["error"]; // 0 for false... and 1 for true 
if(!(is_dir("../projects/".$uploaded_project_id))){
	mkdir("../projects/".$uploaded_project_id);
}
move_uploaded_file($big_logo_fileTmpLoc, "../projects/$uploaded_project_id/$big_logo_fileName");

// small_logo IMAGE UPLOAD:
$small_logo_fileName = $_FILES["small_logo"]["name"]; // The file name 
$small_logo_fileTmpLoc = $_FILES["small_logo"]["tmp_name"]; // File in the PHP tmp folder 
$small_logo_fileType = $_FILES["small_logo"]["type"]; // The type of file it is 
$small_logo_fileSize = $_FILES["small_logo"]["size"]; // File size in bytes 
$small_logo_fileErrorMsg = $_FILES["small_logo"]["error"]; // 0 for false... and 1 for true
if(!(is_dir("../projects/".$uploaded_project_id))){
	mkdir("../projects/".$uploaded_project_id);
}
move_uploaded_file($small_logo_fileTmpLoc, "../projects/$uploaded_project_id/$small_logo_fileName");

// project_logo IMAGE UPLOAD:
$project_logo_fileName = $_FILES["project_logo"]["name"]; // The file name 
$project_logo_fileTmpLoc = $_FILES["project_logo"]["tmp_name"]; // File in the PHP tmp folder 
$project_logo_fileType = $_FILES["project_logo"]["type"]; // The type of file it is 
$project_logo_fileSize = $_FILES["project_logo"]["size"]; // File size in bytes 
$project_logo_fileErrorMsg = $_FILES["project_logo"]["error"]; // 0 for false... and 1 for true
if(!(is_dir("../projects/".$uploaded_project_id))){
	mkdir("../projects/".$uploaded_project_id);
}
move_uploaded_file($project_logo_fileTmpLoc, "../projects/$uploaded_project_id/$project_logo_fileName");

$update_project_sql = "
UPDATE `project` 
SET `big_logo` = 'http://jeep.mi-project.info/include/projects/$uploaded_project_id/$project_logo_fileName',
`small_logo` = 'http://jeep.mi-project.info/include/projects/$uploaded_project_id/$small_logo_fileName',
`project_logo` = 'http://jeep.mi-project.info/include/projects/$uploaded_project_id/$project_logo_fileName',
`background` = 'http://jeep.mi-project.info/include/projects/$uploaded_project_id/".$_REQUEST['background']."',
`start_date` = '".$_REQUEST['start_date']."',
`end_date` = '".$_REQUEST['start_date']."',
`date_time_created` = NOW()
WHERE `id` = ".$uploaded_project_id.";";
// Create SQL update title statement query
mysql_query($update_project_sql)or die(mysql_error());


?>
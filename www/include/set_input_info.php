<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

$insert_project_sql = "
INSERT INTO `input_info`(`id`, `data_type_id`, `label`, `required`, `input_name`) 
VALUES (NULL,
".$_REQUEST['data_type_select'].", 
'".$_REQUEST['input_label']."', 
".$_REQUEST['rec_feild'].", 
'".$_REQUEST['input_group_name']."');";

// Create SQL Insert panel statement quey
mysql_query($insert_project_sql)or die(mysql_error());

?>
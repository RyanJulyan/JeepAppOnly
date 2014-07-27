<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

$insert_project_sql = "
INSERT INTO `data_type`(`id`, `data_type`) 
VALUES (NULL,
'".$_REQUEST['data_type']."');";

// Create SQL Insert panel statement quey
mysql_query($insert_project_sql)or die(mysql_error());

?>
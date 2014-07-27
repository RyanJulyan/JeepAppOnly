<?php
	// IMAGE UPLOAD:
	$project_id = $_GET['project_id'];
	$image_name = $_GET['image_name'];
	
	$allowedExts = array("jpg", "jpeg", "gif", "png", "JPEG", "svg");
	$extension = end(explode(".", $_FILES["file"]["name"]));
	
	$img_path = "projects/".$project_id."/".($image_name.".".$extension);
	
	if ((($_FILES["file"]["type"] == "image/gif")
	|| ($_FILES["file"]["type"] == "image/jpeg")
	|| ($_FILES["file"]["type"] == "image/png")
	|| ($_FILES["file"]["type"] == "image/svg")
	|| ($_FILES["file"]["type"] == "image/pjpeg"))
	&& in_array($extension, $allowedExts))
	  {
	  if ($_FILES["file"]["error"] > 0)
		{
			echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
		}
	  else{
						  
			if(!(is_dir("projects/".$project_id))){
					mkdir("projects/".$project_id);
			}
			
			if((file_exists("projects/".$project_id."/".($image_name.".jpg")))){
				unlink("projects/".$project_id."/".($image_name.".jpg"));
			}
			elseif( (file_exists("projects/".$project_id."/".($image_name.".jpeg")))){
				unlink("projects/".$project_id."/".($image_name.".jpeg"));
			}
			elseif( (file_exists("projects/".$project_id."/".($image_name.".gif")))){
				unlink("projects/".$project_id."/".($image_name.".gif"));
			}
			elseif( (file_exists("projects/".$project_id."/".($image_name.".png")))){
				unlink("projects/".$project_id."/".($image_name.".png"));
			}
			elseif( (file_exists("projects/".$project_id."/".($image_name.".svg")))){
				unlink("projects/".$project_id."/".($image_name.".svg"));
			}
			
			move_uploaded_file($_FILES["file"]["tmp_name"],$img_path);
		}
			
			// Create SQL update panel Content statement
			$DB_image_path = htmlspecialchars(htmlentities($img_path, ENT_QUOTES, "UTF-8", TRUE), ENT_QUOTES, "UTF-8", TRUE);
			
			// Create SQL update panel Content statement
			$update_project_image_sql = "
			UPDATE `project` 
			SET  
			`".$image_name."` =  '".$DB_image_path."'
			WHERE  `project`.`id` = ".$project_id.";";
			// Create SQL update panel Content statement quey
			mysql_query($update_project_image_sql)or die(mysql_error());
			
			echo $img_path;
			
		}
	else
	  {
	  	echo 'Invalid file Type';
	  }
	
?>
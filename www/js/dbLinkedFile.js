	  
      var jeep = {};
      jeep.webdb = {};
      jeep.webdb.db = null;
	  var latitude = null;
	  var longitude = null;
	  var user_submission_num = 1;
	  var AdminLogInfoArr = [];
	  var fieldset_id = 1;
	  
	  // Local Location
      // var url_extention = "include/";
	  
	  // Server Live AppOnly Location
	  // var url_extention = "http://jeep.mi-project.info/apponly/include/";
	  
	  // Jeep Server Live App Location
	  // var url_extention = "http://jeep.mi-project.info/include/";
	   
	  // Alfa Server Live App Location
	  // var url_extention = "http://alfaremeo.mi-project.info/include/";
	  
	  // New IX Server Live App Location
	  var url_extention = "http://chryslermobileapp.com/include/";
	  
      jeep.webdb.open = function() {
		var shortname = "myDB";
		var version =  "1.0";
		var description =  "myDB";
        var dbSize = 5 * 1024 * 1024; // 5MB
        jeep.webdb.db = openDatabase(shortname, version, description, dbSize);
      }
      // Create All Tables
      jeep.webdb.createTables = function() {
        var db = jeep.webdb.db;
        // Create data_type Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS data_type('id' INTEGER PRIMARY KEY ASC, 'data_type' VARCHAR(255))", []);
		});
		
		// Create input_info Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS input_info('id' INTEGER PRIMARY KEY ASC, 'data_type_id' INTEGER, 'label' VARCHAR(255), 'required' INTEGER, 'input_name' VARCHAR(255))", []);
		});
		
		// Create proj_input Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS proj_input('id' INTEGER PRIMARY KEY ASC, 'input_info_id' INTEGER, 'project_id' INTEGER, 'viewpos' INTEGER)", []);
		});
		
		// Create user Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS user('id' INTEGER PRIMARY KEY ASC, 'name' VARCHAR(255), 'date_time_in' DATETIME, 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_out' DATETIME)", []);
		});
		
		// Create super_user Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS super_user('id' INTEGER PRIMARY KEY ASC, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'email' VARCHAR(255))", []);
		});
		
		// Create admin Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS admin('id' INTEGER PRIMARY KEY ASC, 'super_user_id' INTEGER, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'active' INTEGER, 'email' VARCHAR(255))", []);
		});
		
		// Create project Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS project('id' INTEGER PRIMARY KEY ASC, 'admin_id' INTEGER, 'name' VARCHAR(255), 'big_logo' VARCHAR(255), 'small_logo' VARCHAR(255), 'project_logo' VARCHAR(255), 'background' VARCHAR(255), 'start_date' DATETIME, 'end_date' DATETIME, 'date_time_created' DATETIME)", []);
		});
		
		// Create project_data_capture Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS project_data_capture('id' INTEGER PRIMARY KEY ASC, 'proj_input_id' INTEGER, 'user_id' INTEGER, 'user_submission_num' INTEGER, 'project_id' INTEGER, 'value' VARCHAR(255), 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_created' DATETIME)", []);
		});
		
      }
	
	  // Lat and Long Function
	  function latLong(){
		  if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(function(position){
				  document.getElementById('lat').value = position.coords.latitude;
				  document.getElementById('long').value = position.coords.longitude;
			  });
		  } else {
			  if(navigator.notification){
					navigator.notification.alert("Geolocation is not supported by this Device", alertDismissed, "Geolocation Error", "OK");
				}
				else{
			  		alert("Geolocation is not supported by this Device.");
				}
		  }
		  latitude = document.getElementById('lat').value;
		  longitude = document.getElementById('long').value;		  
	  }
      
	  jeep.webdb.addUser = function(userText, latitude, longitude) {
		
        var db = jeep.webdb.db;
        db.transaction(function(tx){
			
			//var date_time_in = new Date(year, month, day,  s, minutes, seconds);
			
			var date_time_in = new Date();
			var year = date_time_in.getFullYear();
			var month = date_time_in.getMonth() + 1;
			var day = date_time_in.getDate();
			var hours = date_time_in.getHours();
			var minutes = date_time_in.getMinutes();
			var seconds = date_time_in.getSeconds();
			date_time_in = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
			
			console.log(date_time_in);
			// 2014-08-04 05:21:37
			
			tx.executeSql("INSERT INTO user(name, date_time_in, cur_lat, cur_long) VALUES (?,?,?,?)",
				[userText, date_time_in, latitude, longitude],
				jeep.webdb.onChangeSuccess,
				jeep.webdb.onError
			);
         });
      }
	  
	  jeep.webdb.setUserLogOut = function() {
		
        var db = jeep.webdb.db;
        db.transaction(function(tx){
			
			var user_id = $('#user_id').val();
			
			//var date_time_in = new Date(year, month, day,  s, minutes, seconds);
			
			var date_time_out = new Date();
			var year = date_time_out.getFullYear();
			var month = date_time_out.getMonth() + 1;
			var day = date_time_out.getDate();
			var hours = date_time_out.getHours();
			var minutes = date_time_out.getMinutes();
			var seconds = date_time_out.getSeconds();
			date_time_out = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
			
			console.log(date_time_out);
			// 2014-08-04 05:21:37
			
			tx.executeSql("UPDATE  user SET  date_time_out = ? WHERE  id =?;",
				[date_time_out, user_id],
				jeep.webdb.onChangeSuccess,
				jeep.webdb.onError
			);
         });
      }
	  
	  jeep.webdb.addDataType = function(dataType) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO data_type(data_type) VALUES (?)",
				[dataType],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 if(navigator.notification){
			navigator.notification.alert("New Input Type: " + dataType + " Added", alertDismissed, "New Input Type", "Great");
		 }
		 else{
		 	alert("New Input Type: " + dataType + " Added");
		 }
      }
	  
	  jeep.webdb.addInputInfo = function(dataTypeID,inputLabel,inputRequired,inputName) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO input_info(data_type_id, label, required, input_name) VALUES (? , ?, ?, ?)",
				[dataTypeID,inputLabel,inputRequired,inputName],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 if(navigator.notification){
			navigator.notification.alert("New Input: " + inputLabel + " Created", alertDismissed, "New Input Information", "Great");
		 }
		 else{
		 	alert("New Input: " + inputLabel + " Created");
		 }
      }
	  
	  jeep.webdb.addProjectInput = function(inputInfoID,projectID, viewpos) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO proj_input(input_info_id, project_id, viewpos) VALUES (?, ?, ?)",
				[inputInfoID,projectID],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addProject = function(admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		  
			var date_time_created = new Date();
			
			var date_time_in = new Date();
			var year = date_time_in.getFullYear();
			var month = date_time_in.getMonth() + 1;
			var day = date_time_in.getDate();
			var hours = date_time_in.getHours();
			var minutes = date_time_in.getMinutes();
			var seconds = date_time_in.getSeconds();
			date_time_created = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
		
			tx.executeSql("INSERT INTO project(admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date, date_time_created],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 if(navigator.notification){
			navigator.notification.alert("Project " + name + " Added, Starting On: " + start_date, alertDismissed, "New Project Created", "Continue");
		 }
		 else{
		 	alert("Project " + name + " Added, Starting On: " + start_date);
		 }
      }
	  
	  jeep.webdb.addProjectDataCapture = function(proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		  
			var date_time_created = new Date();
			var date_time_in = new Date();
			var year = date_time_in.getFullYear();
			var month = date_time_in.getMonth() + 1;
			var day = date_time_in.getDate();
			var hours = date_time_in.getHours();
			var minutes = date_time_in.getMinutes();
			var seconds = date_time_in.getSeconds();
			date_time_created = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
		
			tx.executeSql("INSERT INTO project_data_capture(proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created],
				jeep.webdb.onChangeSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addSuperUser = function(user_name, paswrd, email) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
			tx.executeSql("INSERT INTO super_user(user_name, password, email) VALUES (?, ?, ?)",
				[user_name, paswrd, email],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addAdmin = function(super_user_id, user_name, paswrd, email) {
		
		var active = 1;
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
			tx.executeSql("INSERT INTO admin(super_user_id, user_name, password, active, email) VALUES (?, ?, ?, ?, ?)",
				[super_user_id,user_name, paswrd, active, email],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  // Init Mock data
	  jeep.webdb.initTables = function() {
		
        var db = jeep.webdb.db;
		// Init data_type data
        db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO data_type(data_type) VALUES ('text')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		// Init input_info data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO input_info(data_type_id, label, required, input_name) VALUES (1 , 'Name', 1, 'text_name')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		// Init proj_input data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO proj_input(input_info_id, project_id, viewpos) VALUES (1, 1, 1)",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init user data
		 db.transaction(function(tx){
			
			var date_time_in = new Date();
			var year = date_time_in.getFullYear();
			var month = date_time_in.getMonth() + 1;
			var day = date_time_in.getDate();
			var hours = date_time_in.getHours();
			var minutes = date_time_in.getMinutes();
			var seconds = date_time_in.getSeconds();
			date_time_in = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
			
			tx.executeSql("INSERT INTO user(name, date_time_in, cur_lat, cur_long) VALUES ('Promoter Name',?,?,?)",
				[date_time_in, latitude, longitude],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init super_user data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO super_user(user_name, password, email) VALUES ('admin', 'admin', 'admin@admin.com')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init admin data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO admin(super_user_id, user_name, password, active, email) VALUES (1, 'jeep_admin', 'jeep_admin', 1, 'admin@admin.com')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			 
         });
		 
		 // Init project data
		 db.transaction(function(tx){
			
			var date_time_in = new Date();
			var year = date_time_in.getFullYear();
			var month = date_time_in.getMonth() + 1;
			var day = date_time_in.getDate();
			var hours = date_time_in.getHours();
			var minutes = date_time_in.getMinutes();
			var seconds = date_time_in.getSeconds();
			date_time_in = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
			
			tx.executeSql("INSERT INTO project(admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date,date_time_created) VALUES (1, 'My Project', 'projects/1/warrior5.png', 'projects/1/warrior5.png', 'projects/1/warrior5.png', 'projects/1/warrior5.png', ?, ?, ?)",
				[date_time_in,date_time_in,date_time_in],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init project_data_capture data
		 db.transaction(function(tx){
			
			var date_time_in = new Date();
			var year = date_time_in.getFullYear();
			var month = date_time_in.getMonth() + 1;
			var day = date_time_in.getDate();
			var hours = date_time_in.getHours();
			var minutes = date_time_in.getMinutes();
			var seconds = date_time_in.getSeconds();
			date_time_in = year+"-"+addLeadingZeros(month, 2)+"-"+addLeadingZeros(day, 2)+" "+addLeadingZeros(hours, 2)+":"+addLeadingZeros(minutes, 2)+":"+addLeadingZeros(seconds, 2);
			
			tx.executeSql("INSERT INTO project_data_capture(proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created) VALUES (1, 1, 1, 1, 'My Name', ?, ?, ?)",
				[latitude,longitude,date_time_in],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
      }
      
      jeep.webdb.onError = function(tx, e) {
		  
		  if (e == 0){
				// UNKNOWN_ERR
				if(navigator.notification){
					navigator.notification.alert("The transaction failed for reasons unrelated to the database. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				 }
				 else{
					alert("The transaction failed for reasons unrelated to the database. \nTry Closing the App and Downloading the projects again");
				 }
				
			}
			else if(e == 1){
				// DATABASE_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed for database reasons. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				 }
				 else{
					alert("The statement failed for database reasons. \nTry Closing the App and Downloading the projects again");
				 }
			}
			else if (e == 2) {
				// Version number mismatch.
				if(navigator.notification){
					navigator.notification.alert("Invalid database version. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("Invalid database version. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed because the data returned from the database was too large. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("The statement failed because the data returned from the database was too large. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 4){
				// QUOTA_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 5){
				// SYNTAX_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				if(navigator.notification){
					navigator.notification.alert("Statement failed due to a constraint failure. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("Statement failed due to a constraint failure. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 7){
				// TIMEOUT_ERR
				if(navigator.notification){
					navigator.notification.alert("A lock for the transaction could not be obtained in a reasonable time. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("A lock for the transaction could not be obtained in a reasonable time. \nTry Closing the App and Downloading the projects again");
				}
			}
			else {
				if(navigator.notification){
					navigator.notification.alert("Unknown error "+e+". \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("Unknown error "+e+". \nTry Closing the App and Downloading the projects again");
				}
			}
      }
      
      jeep.webdb.onSuccess = function(tx, r) {
        // re-render the data.
		// alert("Transaction Successful");
		jeep.webdb.getAllProjects(loadAllProjectsForUser);
        jeep.webdb.getAllprojectItems(loadprojectItems);
		jeep.webdb.getAllDataTypes(loadAllDataTypes);
		jeep.webdb.getAllProjects(loadAllProjects);
		jeep.webdb.getAllProjects(loadAllProjectsForData);
		jeep.webdb.getAllInputInfo(loadAllInputInfo);
		
      }
	  
	  jeep.webdb.onChangeSuccess = function(tx, r) {
        // re-render the data.
      }
	  
	  jeep.webdb.getAllUsers = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {  
          tx.executeSql("SELECT * FROM `user`", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllUserDataCap = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {  
          tx.executeSql("SELECT * FROM `project_data_capture` INNER JOIN `user` ON user.id = project_data_capture.user_id ", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllInputInfo = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM input_info ORDER BY input_name", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllProjects = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT id, name, project_logo, start_date FROM project ORDER BY start_date ASC", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getProjectLogo = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
			
		  var project_id = document.getElementById('project_id').value;
		  
          tx.executeSql("SELECT project_logo FROM project WHERE id = ?", [project_id], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
      jeep.webdb.getAllDataTypes = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM data_type", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllprojectItems = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		  
		  var project_id = document.getElementById('project_id').value;
		  
          tx.executeSql("SELECT proj_input.id AS id, label, required, input_name, data_type FROM `proj_input` INNER JOIN `input_info` ON proj_input.input_info_id = input_info.id INNER JOIN `data_type` ON input_info.data_type_id = data_type.id WHERE project_id=? ORDER BY proj_input.viewpos, input_info.id;", [project_id], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getCurrentUserId = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		  
		  var userName = document.getElementById('user_name').value;
		  
          tx.executeSql("SELECT id FROM user WHERE name=? ORDER BY id DESC LIMIT 1;", [userName], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAdminLogInfo = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		  
          tx.executeSql("SELECT * FROM admin ;", [], renderFunc,
              jeep.webdb.onError);
        });
      }
      
      jeep.webdb.deleteTodo = function(id) {
        var db = jeep.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("DELETE FROM user WHERE ID=?", [id],
              jeep.webdb.onSuccess,
              jeep.webdb.onError);
          });
      }
      
      function loadprojectItems(tx, rs) {
	  
		var lasttitle = '';
        var rowOutput = '<fieldset data-role="controlgroup">';
		
		for (var i=0; i < rs.rows.length; i++) {
		  if(lasttitle == rs.rows.item(i).input_name){
			  rowOutput += renderTodo(rs.rows.item(i));
			  lasttitle = rs.rows.item(i).input_name;
		  }
		  else{
			  if(rowOutput != '<fieldset data-role="controlgroup">' && (rs.rows.item(i).data_type == 'radio' || rs.rows.item(i).data_type == 'checkbox')){
				rowOutput += '</fieldset><fieldset data-role="controlgroup" data-type="horizontal">'+renderTodo(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
			  }
			  else if(rowOutput != '<fieldset data-role="controlgroup">' && (rs.rows.item(i).data_type != 'radio' || rs.rows.item(i).data_type != 'checkbox')){
				rowOutput += '</fieldset><fieldset data-role="controlgroup">'+renderTodo(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
			  }
			  else{
				if(rs.rows.item(i).data_type == 'radio' || rs.rows.item(i).data_type == 'checkbox'){
					rowOutput = '<fieldset data-role="controlgroup" data-type="horizontal">';
					rowOutput += renderTodo(rs.rows.item(i));
					lasttitle = rs.rows.item(i).input_name;
				}
				else{
					rowOutput += renderTodo(rs.rows.item(i));
					lasttitle = rs.rows.item(i).input_name;
				}
			  }
		  }

        }
		rowOutput += '</fieldset><br/>';
		$("#projectItems").html('').append(rowOutput + '<input type="hidden" id="userSubnum" value="1"/><button data-role="button" data-theme="d" data-mini="true" data-icon="check" data-iconpos="right" onclick="updateUserSubMission();">Save</button>').trigger('create'); 
        $('#Data_Sync').html('').append('User Not Synced').trigger('create');
		$('#User_Sync').html('').append('Submissions Not Synced').trigger('create');
		
	  }
	  
	   function loadAllDataTypes(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderDataTypeSelec(rs.rows.item(i));
        }
		$("#data_type_select").html('').html('').append(rowOutput).trigger('create');
      }
	  
	  function loadAdminLogInfo(tx, rs) {
		
		for (var i=0; i < rs.rows.length; i++) {
          
		  	AdminLogInfoArr[i] = {'id' : rs.rows.item(i).id, 'name' : rs.rows.item(i).user_name,  'password': rs.rows.item(i).password};
        }
      }
	  
	  
	  function loadAllProjectsForData(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderProjectsForData(rs.rows.item(i));
        }
		$("#project_for_data").html('').append(rowOutput).trigger('create');
      }
	  
	  function loadAllProjectsForUser(tx, rs) {
		//alert("loadAllProjectsForUser Loaded");
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderProjectsForUser(rs.rows.item(i));
        }
		$("#project_for_user").html('').append(rowOutput).trigger('create');
		
      }
	  
	  function loadAllProjects(tx, rs) {
        var rowOutput = "";
        var project_select = document.getElementById("project_select");
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderProjectsSelec(rs.rows.item(i));
        }
      
        project_select.innerHTML = rowOutput;
      }
	  
	  function loadProjectLogo(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput = renderProjectLogo(rs.rows.item(i));
        }
		
		if(rowOutput == null || rowOutput == ""){
			$('#user_log_img').attr('src', 'img/proj_img_wht.png').trigger('create');
			$('#project_cap_img').attr('src', 'img/proj_img_wht.png').trigger('create');
		}
		else{
			document.getElementById('user_log_img').src = rowOutput;
			document.getElementById('project_cap_img').src = rowOutput;
		}
      
      }
	  
	  function loadAllInputInfo(tx, rs) {
	  	
		
		var lasttitle = '';
        var rowOutput = '<fieldset data-role="controlgroup" id="fs_0" >';
		
		for (var i=0; i < rs.rows.length; i++) {
		  if(lasttitle == rs.rows.item(i).input_name){
			  rowOutput += renderInputsSelec(rs.rows.item(i));
			  lasttitle = rs.rows.item(i).input_name;
		  }
		  else{
			  if(rowOutput != '<fieldset data-role="controlgroup" id="fs_'+fieldset_id+'">'){
				rowOutput += '</fieldset><br/><hr/><br/><div class="ui-grid-c"><div class="ui-block-a"></div><div class="ui-block-b"></div><div class="ui-block-c"><label style="text-align:right; padding: 10px 20px 0 0;">Position</label></div><div class="ui-block-d"><input id="pos_'+fieldset_id+'" type="number" class="ui-corner-all ui-shadow" data-mini="true" value="'+fieldset_id+'" onChange="setCheckboxViewPos('+"'"+fieldset_id+"'"+',this.value,this)" data-linkedId="'+fieldset_id+'"></div></div><fieldset data-role="controlgroup" id="'+fieldset_id+'" >'+'<legend  style="cursor:pointer;" onClick="checkAll('+"'"+fieldset_id+"'"+')">'+rs.rows.item(i).input_name+' &#8744;</legend>'+renderInputsSelec(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
				fieldset_id++;
			  }
			  else{
				rowOutput += '<legend style="cursor:pointer;" onClick="checkAll('+"'"+'fs_'+fieldset_id+"'"+')">'+rs.rows.item(i).input_name+' &#8744; <input type="text" value="'+fieldset_id+'"></legend>'+renderInputsSelec(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
				fieldset_id++;
			  }
		  }

        }
		rowOutput += '</fieldset>';
		$("#select_inputs_area").html('').append(rowOutput).trigger('create');
		fieldset_id = 1;
		$.mobile.loading( "hide" );
      }
	  
	  function loadCurrentUserId(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput = renderCurrentUserId(rs.rows.item(i));
        }
		$("#user_id").val(rowOutput).trigger('create');
      }
	  
	  function renderCurrentUserId(row) {
        return row.id;
      }
	  
	  function renderCapDatahead(row) {
        return "<th> " + row.input_name  + "</th>";
      }
	  
	  function renderCapDataRow(row) {
        return "<td> " + row.value + "</td>";
      }
	  
      function renderInputsSelec(row) {
        return "<input type='checkbox' value='"+row.id+"' name='select_inputs' id='select_inputs_" + row.id  + "' data-viewPos='"+fieldset_id+"' /> <label for='select_inputs_" + row.id  + "'>" + row.label  + " </label>";
      }
	  
	  function renderProjectsForData(row) {
		  if(row.project_logo != "" ){
		  	return '<li class="btnBigger show-page-loading-msg-gen" data-theme="d" onclick="setTimeout(function(){chosenProject('+row.id+')},100)"><a href="#view_data" data-transition="slide"> <img src="'+row.project_logo+'"><h2>'+ row.name  +'</h2></a></li>';
		  }
		  else{
        	return '<li  class="btnBigger show-page-loading-msg-gen" data-theme="d"><a href="#view_data" data-transition="slide" onclick="setTimeout(function(){chosenProject('+row.id+')},100)"><img src="img/proj_img.png"><h2>'+ row.name  +'</h2></a></li>';
		  }
      }
	  
	  function renderProjectsForUser(row) {
		  //alert("renderProjectsForUser Fired");
		  if(row.project_logo != "" ){
		  	return '<li onclick="chosenProject('+row.id+')" class="btnBigger" data-theme="d"><a href="#user" data-transition="slide"> <img src="'+row.project_logo+'"><h2>'+ row.name  +'</h2></a></li>';
		  }
		  else{
        	return '<li onclick="chosenProject('+row.id+')" class="btnBigger" data-theme="d"><a href="#user" data-transition="slide"><img src="img/proj_img.png"><h2>'+ row.name  +'</h2></a></li>';
		  }
		  
      }
	  
	  function renderProjectsSelec(row) {
        return "<option value='"+row.id+"'>" + row.name  + " "+ row.start_date.substring(0, 15) +" </option>";
      }
	  
	  function renderProjectLogo(row) {
        return row.project_logo;
      }
	  
      function renderDataTypeSelec(row) {
        return "<option value='"+row.id+"'>" + row.data_type  + " </option>";
      }
	  
	  function renderAllUsers(row) {
        return [row.id, row.name, row.date_time_in, row.cur_lat, row.cur_long, row.date_time_out];
      }
	  
	  function renderAllUsersDataCap(row) {
        return [row.id, row.proj_input_id, row.user_id, row.user_submission_num, row.project_id, row.value, row.cur_lat, row.cur_long, row.date_time_created, row.name];
      }
	  
	  
	  function renderTodo(row) {
		   var cur_project_id = document.getElementById('project_id').value;
		   var cur_user_id = document.getElementById('user_id').value;
		// alert('Loaded');
		if(row.data_type == "radio"){
			if(row.required = 1){
				return "<label for='"+row.label+"_"+row.id+"'>"+row.label+" * </label><input onchange='addProjectDataCapture(" + row.id  + ", " + cur_user_id  + ", " + cur_project_id  + ",this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"' required='required' data-errormessage='This Is Required.'>";
			}
			else{
				return "<label for='"+row.label+"_"+row.id+"' >"+row.label+"</label><input onchange='addProjectDataCapture(" + row.id  + ", " + cur_user_id  + ", " + cur_project_id  + ",this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"'>";
			}
		}
		else if(row.data_type == "checkbox"){
			if(row.required = 1){
				return "<input onchange='addProjectDataCapture(" + row.id  + ", " + cur_user_id  + ", " + cur_project_id  + ",this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"' data-role='input' data-theme='d' required='required'  data-errormessage='This Is Required.' /><label for='"+row.label+"_"+row.id+"'>"+row.label+" * </label>";
			}
			else{
				return "<input onchange='addProjectDataCapture(" + row.id  + ", " + cur_user_id  + ", " + cur_project_id  + ",this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"' data-role='input' data-theme='d' /><label for='"+row.label+"_"+row.id+"'>"+row.label+"</label>";
			}
		}
		else{
			if(row.required = 1){
				return "<input onchange='addProjectDataCapture(" + row.id  + ", " + cur_user_id  + ", " + cur_project_id  + ",this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' placeholder='"+row.label+" * ' data-role='input' data-theme='d' required='required' data-errormessage='This Is Required.'/>";
			}
			else{
				return "<input onchange='addProjectDataCapture(" + row.id  + ", " + cur_user_id  + ", " + cur_project_id  + ",this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' placeholder='"+row.label+"' data-role='input' data-theme='d' />";
			}
		}
      }
	  
      
      function init() {
		try {
			if (!window.openDatabase) {
			 if(navigator.notification){
				navigator.notification.alert("Databases are not supported in this device", alertDismissed, "Local Database Error", "OK");
			 }
			 else{
				alert('Databases are not supported in this device.');
			 }
			} else {
				jeep.webdb.open();
				jeep.webdb.createTables();
				// jeep.webdb.initTables();
				jeep.webdb.getAllprojectItems(loadprojectItems);
				jeep.webdb.getAllDataTypes(loadAllDataTypes);
				jeep.webdb.getAllProjects(loadAllProjects);
				jeep.webdb.getAllProjects(loadAllProjectsForData);
				jeep.webdb.getAllProjects(loadAllProjectsForUser);
				jeep.webdb.getAllInputInfo(loadAllInputInfo);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				if(navigator.notification){
					navigator.notification.alert("The transaction failed for reasons unrelated to the database. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				 }
				 else{
					alert("The transaction failed for reasons unrelated to the database. \nTry Closing the App and Downloading the projects again");
				 }
				
			}
			else if(e == 1){
				// DATABASE_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed for database reasons. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				 }
				 else{
					alert("The statement failed for database reasons. \nTry Closing the App and Downloading the projects again");
				 }
			}
			else if (e == 2) {
				// Version number mismatch.
				if(navigator.notification){
					navigator.notification.alert("Invalid database version. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("Invalid database version. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed because the data returned from the database was too large. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("The statement failed because the data returned from the database was too large. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 4){
				// QUOTA_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 5){
				// SYNTAX_ERR
				if(navigator.notification){
					navigator.notification.alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				if(navigator.notification){
					navigator.notification.alert("Statement failed due to a constraint failure. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("Statement failed due to a constraint failure. \nTry Closing the App and Downloading the projects again");
				}
			}
			else if(e == 7){
				// TIMEOUT_ERR
				if(navigator.notification){
					navigator.notification.alert("A lock for the transaction could not be obtained in a reasonable time. \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("A lock for the transaction could not be obtained in a reasonable time. \nTry Closing the App and Downloading the projects again");
				}
			}
			else {
				if(navigator.notification){
					navigator.notification.alert("Unknown error "+e+". \nTry Closing the App and Downloading the projects again", alertDismissed, "Local Database Error", "OK");
				}
				else{
					alert("Unknown error "+e+". \nTry Closing the App and Downloading the projects again");
				}
			}
			return;
		}
      }
      
      function addUser() {
        var user = document.getElementById("user_cap_val");
		latitude = document.getElementById('lat');
		longitude = document.getElementById('long');
		document.getElementById('user_name').value = user.value;
        jeep.webdb.addUser(user.value, latitude.value, longitude.value);
        user.value = "";
      }
	  
	  function addDataType() {
        var data_type = document.getElementById("data_type");
        jeep.webdb.addDataType(data_type.value);
        data_type.value = "";
      }
	  
	  function addInputInfo() {
        var data_type_select = document.getElementById("data_type_select");
		var input_label = document.getElementById("input_label");
		var input_group_name = document.getElementById("input_group_name");
		var rec_feild = document.getElementById("rec_feild");
		jeep.webdb.addInputInfo(data_type_select.value,input_label.value,rec_feild.value,input_group_name.value );
        data_type_select.value ='';
		input_label.value = '';
		rec_feild.value = '';
		input_group_name.value = '';
      }
	  
	  function addProjectInput() {
		
		var project_select = document.getElementById("project_select");
		var inputsSelected = '';
		var select_inputs_checkboxes = document.getElementsByName('select_inputs');
		
		for (var i=0;i<select_inputs_checkboxes.length;i++) {
		  if (select_inputs_checkboxes[i].checked){
			jeep.webdb.addProjectInput(select_inputs_checkboxes[i].value,project_select.value);
			inputsSelected += select_inputs_checkboxes[i].value + '\n';
		  }
		}
		if(navigator.notification){
			navigator.notification.alert("The Following Inputs have been added to "+ $("#project_select option:selected").html()+" \n " + inputsSelected, alertDismissed, "Input Added", "Continue");
		}
		else{
			alert("The Following Inputs have been added to "+ $("#project_select option:selected").html()+" \n " + inputsSelected);
		}
      }
	  
	  function addProject() {
	  
		var admin_id = $("#admin_id").val();
		
		var project_name = document.getElementById("project_name").value;
		var big_logo = document.getElementById("big_logo").value;
		var small_logo = document.getElementById("small_logo").value;
		var project_logo = document.getElementById("project_logo").value;
		var background = document.getElementById("background").value;
		var start_date = document.getElementById("start_date").value;
		var end_date = document.getElementById("end_date").value;
		
		jeep.webdb.addProject(admin_id, project_name, big_logo, small_logo, project_logo, background, start_date, end_date);
      }
	  
	  function addSuperUser() {
		var user_name = document.getElementById("user_name").value;
		var paswrd = document.getElementById("password").value;
		var conf_password = document.getElementById("conf_password").value;
		var email = document.getElementById("email").value;
		
		if(paswrd == conf_password){
			jeep.webdb.addSuperUser(user_name, paswrd, email);
			user_name = '';
			paswrd = '';
			conf_password = '';
			email = '';
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("Passwords do not match", alertDismissed, "Passwords Error", "OK");
			}
			else{
				alert("Passwords do not match");
			}
		}
      }
	  
	  function addAdmin() {
		var super_user_id = 1;
		var user_name = document.getElementById("admin_user_name").value;
		var paswrd = document.getElementById("admin_password").value;
		var conf_password = document.getElementById("admin_conf_password").value;
		var email = document.getElementById("admin_email").value;
		
		if(paswrd == conf_password){
			jeep.webdb.addAdmin(super_user_id, user_name, paswrd, email);
			user_name = '';
			paswrd = '';
			conf_password = '';
			email = '';
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("Passwords do not match", alertDismissed, "Passwords Error", "OK");
			}
			else{
				alert("Passwords do not match");
			}
		}
      }
	  
	  function addProjectDataCapture(proj_input_id, user_id, project_id,val) {
		
		cur_lat = document.getElementById('lat').value;
		cur_long = document.getElementById('long').value;
		
		userSubnum = document.getElementById('userSubnum').value;
		
		jeep.webdb.addProjectDataCapture(proj_input_id, user_id, userSubnum, project_id, val, cur_lat, cur_long);
      }
	  
	  function getAllUsers(){
		  jeep.webdb.open();
		  jeep.webdb.getAllUsers(loadAllUsers);
	  }
	  
	  function getAllUserDataCap(){
		  jeep.webdb.open();
		  jeep.webdb.getAllUserDataCap(loadAllUsersDataCap);
	  }
	  
	  function updateUserSubMission(){
		
		var correct = true;
		
		var elements = document.getElementById('projectItems').getElementsByTagName('input');

		for (var i = 0; i < elements.length; i++) {
			if(elements[i].value == '' || elements[i].value == null){
				correct = false;
			}
		}
		if(correct == true){
			$("#cur_subs").html('').append(user_submission_num).trigger('create');
			user_submission_num++;
			
			if(navigator.notification){
				navigator.notification.alert("Submission Saved", alertDismissed, "Information Captured", "Great");
			}
			else{
				alert("Submission Saved");
			}
			
			document.getElementById('userSubnum').value = user_submission_num;
			var elements = document.getElementById('projectItems').getElementsByTagName('input');

			for (var i = 0; i < elements.length; i++) {
				if(elements[i].getAttribute("type") == "radio" || elements[i].getAttribute("type") == "checkbox"){
					//elements[i].checked = false;
					
					$( "#"+elements[i].id ).prop( "checked", false ).checkboxradio("refresh");
				}
				else if(elements[i].getAttribute("type") == "text"
				|| elements[i].getAttribute("type") == "date"
				|| elements[i].getAttribute("type") == "datetime"
				|| elements[i].getAttribute("type") == "datetime-local"
				|| elements[i].getAttribute("type") == "email"
				|| elements[i].getAttribute("type") == "month"
				|| elements[i].getAttribute("type") == "number"
				|| elements[i].getAttribute("type") == "range"
				|| elements[i].getAttribute("type") == "tel"
				|| elements[i].getAttribute("type") == "time"
				|| elements[i].getAttribute("type") == "url"
				|| elements[i].getAttribute("type") == "week"){
					elements[i].value = '';
				}
			}
		}
	  }
	  
	  function chosenProject(project_id){
		
		document.getElementById('project_id').value = project_id;
		
	  }
	  
	  function addLeadingZeros (n, length){ // For date formatiing
		 var str = (n > 0 ? n : -n) + "";
		 var zeros = "";
		 for (var i = length - str.length; i > 0; i--)
			 zeros += "0";
		 zeros += str;
		 return n >= 0 ? zeros : "-" + zeros;
	  }

	  
	  function setServProject(){
		
		if(navigator.onLine){
		
			var admin_id = document.getElementById("admin_id").value;
			
			var name = document.getElementById("project_name").value;
			var big_logo = document.getElementById("big_logo").files[0];
			var small_logo = document.getElementById("small_logo").files[0];
			var project_logo = document.getElementById("project_logo").files[0];
			var background = document.getElementById("background").files[0];
			var start_date = document.getElementById("start_date").value;
			var end_date = document.getElementById("end_date").value;
			
			var formdata = new FormData();
			
			formdata.append("admin_id", admin_id);
			
			formdata.append("name", name);
			formdata.append("big_logo", big_logo);
			formdata.append("small_logo", small_logo);
			formdata.append("project_logo", project_logo);
			formdata.append("background", background);
			formdata.append("start_date", start_date);
			formdata.append("end_date", end_date);
			
			console.log(formdata);
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"set_project.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					//console.log(data, textStatus, jqXHR);
					loadServProject();
					document.getElementById("project_name").value = "";
					document.getElementById("big_logo").files[0] = "";
					document.getElementById("small_logo").files[0] = "";
					document.getElementById("project_logo").files[0] = "";
					document.getElementById("background").files[0] = "";
					document.getElementById("start_date").value = "";
					document.getElementById("end_date").value = "";
					
					$.mobile.loading( "hide" );
					if(navigator.notification){
						navigator.notification.alert("Uploaded to Server", alertDismissed, "Saved", "Great");
					}
					else{
						alert("Uploaded to Server");
					}
					//Original App Change to next page
					//$.mobile.changePage( "#link_input_to_proj", { transition: "flow", changeHash: false });
					
					// Simplify Change
					// $.mobile.changePage( "#start", { transition: "flow", changeHash: false });
				},
				error:function(xhr){
					$.mobile.loading( "hide" );
					
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot update information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot update information");
			}
		}
		
		
	  }
	  
	  function setServDataType(){
		
		if(navigator.onLine){
			var data_type = document.getElementById("data_type").value;
			
			var formdata = new FormData();
			
			formdata.append("data_type", data_type);
			
			console.log(formdata);
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"set_data_type.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					loadServDataType();
					jeep.webdb.getAllDataTypes(loadAllDataTypes);
					data_type = '';
					if(navigator.notification){
						navigator.notification.alert("Uploaded to Server", alertDismissed, "Saved", "Great");
					}
					else{
						alert("Uploaded to Server");
					}
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot update information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot update information");
			}
		}
		
	  }
	  
	  function setServNewInput(){
		
		if(navigator.onLine){
			var data_type_select = document.getElementById("data_type_select").value;
			var input_label = document.getElementById("input_label").value;
			var input_group_name = document.getElementById("input_group_name").value;
			var rec_feild = document.getElementById("rec_feild").value;
			
			var formdata = new FormData();
			
			formdata.append("data_type_select", data_type_select);
			formdata.append("input_label", input_label);
			formdata.append("input_group_name", input_group_name);
			formdata.append("rec_feild", rec_feild);
			
			console.log(formdata);
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"set_input_info.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					//console.log(data, textStatus, jqXHR);
					loadServInputInfo();
					jeep.webdb.getAllInputInfo(loadAllInputInfo);
					input_label = '';
					input_group_name = '';
					if(navigator.notification){
						navigator.notification.alert("Uploaded to Server", alertDismissed, "Saved", "Great");
					}
					else{
						alert("Uploaded to Server");
					}
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		
	  	}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot update information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot update information");
			}
		}
		
	  }
	  
	  function setServProjInput(){
		
		if(navigator.onLine){
		
			var project_select = document.getElementById("project_select").value;
			
			var select_inputs_checkboxes = document.getElementsByName('select_inputs');
			
			var select_inputs_checkboxes_arr = [];
			
			
			for (var i=0;i<select_inputs_checkboxes.length;i++) {
			  if (select_inputs_checkboxes[i].checked){
				select_inputs_checkboxes_arr.push(select_inputs_checkboxes[i].value);
				select_inputs_checkboxes_arr.push(select_inputs_checkboxes[i].getAttribute('data-viewpos'));
			  }
			}
			
			var json_arr = JSON.stringify(select_inputs_checkboxes_arr);
			
			var formdata = new FormData();
			
			formdata.append("project_select", project_select);
			formdata.append("select_inputs_checkboxes_arr", select_inputs_checkboxes_arr);
			
			console.log(formdata);
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"set_proj_input.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					console.log(data);
					if(navigator.notification){
						navigator.notification.alert("Uploaded to Server", alertDismissed, "Saved", "Great");
					}
					else{
						alert("Uploaded to Server");
					}
					loadServProjInput();
					setTimeout(function(){
						$.mobile.changePage( "#start", { transition: "flow", changeHash: false });
					}, 100);
					
					//addProjectInput
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}		
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot update information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot update information");
			}
		}
					
		
	  }
	  
	  
	function loadServProject(){
		
		if(navigator.onLine){
			// alert("loadServProject Fired");
			
			var project;
			$.ajax({
				async: false,
				dataType:"json",
				type: "GET",
				crossDomain: true,
				cache: false,
				url: url_extention+"get_project.php",
				contentType: "application/json; charset=utf-8",
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data){
					console.log(data);
					project = data;
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE project", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS project('id' INTEGER PRIMARY KEY ASC, 'admin_id' INTEGER, 'name' VARCHAR(255), 'big_logo' VARCHAR(255), 'small_logo' VARCHAR(255), 'project_logo' VARCHAR(255), 'background' VARCHAR(255), 'start_date' DATETIME, 'end_date' DATETIME, 'date_time_created' DATETIME)", []);
					});
					
					
					$.each(project, function(idx, obj) {
						
						jeep.webdb.db.transaction(function(tx){
						tx.executeSql("INSERT INTO project(id, admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
							[obj.id, obj.admin_id, obj.name, obj.big_logo, obj.small_logo, obj.project_logo, obj.background, obj.start_date, obj.end_date, obj.date_time_created],
							console.log("Synced Project"),
							console.log("Project Sync Failed")
						);
						
						});
						
					});
					
					jeep.webdb.getAllprojectItems(loadprojectItems);
					jeep.webdb.getAllProjects(loadAllProjectsForUser);
					jeep.webdb.getAllDataTypes(loadAllDataTypes);
					jeep.webdb.getAllProjects(loadAllProjects);
					jeep.webdb.getAllInputInfo(loadAllInputInfo);
					
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
					
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the latest information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the latest information");
			}
		}
		
		
	}
	
	function loadServAdmin(){
		if(navigator.onLine){
			var admin;
			$.ajax({
				async: false,
				dataType:"json",
				type: "GET",
				crossDomain: true,
				cache: false,
				url: url_extention+"get_admin.php",
				contentType: "application/json; charset=utf-8",
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data){
					console.log(data);
					admin = data;
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE admin", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS admin('id' INTEGER PRIMARY KEY ASC, 'super_user_id' INTEGER, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'active' INTEGER, 'email' VARCHAR(255))", []);
					});
					
					
					$.each(admin, function(idx, obj) {
						jeep.webdb.db.transaction(function(tx){
						tx.executeSql("INSERT INTO admin(id, super_user_id, user_name, password, active, email) VALUES (?, ?, ?, ?, ?, ?)",
							[obj.id, obj.super_user_id, obj.user_name, obj.password , obj.active , obj.email],
							console.log("Synced Admin"),
							console.log("Admin Sync Failed")
						);
						
						});
						
					});
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the latest information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the latest information");
			}
		}
	  }
	  
	  function loadServDataType(){
		  
		  if(navigator.onLine){
			var data_type;
			$.ajax({
				async: false,
				dataType:"json",
				type: "GET",
				crossDomain: true,
				cache: false,
				url: url_extention+"get_data_type.php",
				contentType: "application/json; charset=utf-8",
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data){
					console.log(data);
					data_type = data;
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE data_type", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS data_type('id' INTEGER PRIMARY KEY ASC, 'data_type' VARCHAR(255))", []);
					});
					
					
					$.each(data_type, function(idx, obj) {
						
						jeep.webdb.db.transaction(function(tx){
						tx.executeSql("INSERT INTO data_type(id, data_type) VALUES (?, ?)",
							[obj.id, obj.data_type],
							console.log("Synced Data Type"),
							console.log("Data Type Sync Failed")
						);
						
						});
						
					});
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the latest information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the latest information");
			}
		}
	  }
	  
	  function loadServInputInfo(){
		if(navigator.onLine){
			var input_info;
			$.ajax({
				async: false,
				dataType:"json",
				type: "GET",
				crossDomain: true,
				cache: false,
				url: url_extention+"get_input_info.php",
				contentType: "application/json; charset=utf-8",
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data){
					console.log(data);
					input_info = data;
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE input_info", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS input_info('id' INTEGER PRIMARY KEY ASC, 'data_type_id' INTEGER, 'label' VARCHAR(255), 'required' INTEGER, 'input_name' VARCHAR(255))", []);
					});
					
					
					$.each(input_info, function(idx, obj) {
						
						jeep.webdb.db.transaction(function(tx){
						tx.executeSql("INSERT INTO input_info(id, data_type_id, label, required, input_name) VALUES (?, ? , ?, ?, ?)",
							[obj.id, obj.data_type_id, obj.label, obj.required, obj.input_name],
							console.log("Synced Input Info"),
							console.log("Input Info Sync Failed")
						);
						
						});
						
					});
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the latest information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the latest information");
			}
		}
		
	  }
	  
	  function loadServProjInput(){
		if(navigator.onLine){
			var proj_input;
			$.ajax({
				async: false,
				dataType:"json",
				type: "GET",
				crossDomain: true,
				cache: false,
				url: url_extention+"get_proj_input.php",
				contentType: "application/json; charset=utf-8",
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data){
					console.log(data);
					proj_input = data;
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE proj_input", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS proj_input('id' INTEGER PRIMARY KEY ASC, 'input_info_id' INTEGER, 'project_id' INTEGER, 'viewpos' INTEGER)", []);
					});
					
					
					$.each(proj_input, function(idx, obj) {
						
						jeep.webdb.db.transaction(function(tx){
						tx.executeSql("INSERT INTO proj_input(id, input_info_id, project_id, viewpos) VALUES (?, ?, ?, ?)",
							[obj.id, obj.input_info_id, obj.project_id, obj.viewpos],
							console.log("Synced Proj Input"),
							console.log("Proj Input Sync Failed")
						);
						
						});
						
					});
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the latest information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the latest information");
			}
		}
	  }
	  
	  function loadServSuperUser(){
		if(navigator.onLine){
			var super_user;
			$.ajax({
				async: false,
				dataType:"json",
				type: "GET",
				crossDomain: true,
				cache: false,
				url: url_extention+"get_super_user.php",
				contentType: "application/json; charset=utf-8",
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data){
					console.log(data);
					super_user = data;
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE super_user", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS super_user('id' INTEGER PRIMARY KEY ASC, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'email' VARCHAR(255))", []);
					});
					
					
					$.each(super_user, function(idx, obj) {
						
						jeep.webdb.db.transaction(function(tx){
						tx.executeSql("INSERT INTO super_user(id, user_name, password, email) VALUES (?, ?, ?, ?)",
							[obj.id, obj.username, obj.password, obj.email],
							console.log("Synced Super User"),
							console.log("Super User Sync Failed")
						);
						
						});
						
					});
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the latest information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the latest information");
			}
		}		
		
	  }
	  
	  function loadAllUsers(tx, rs) {
        if(navigator.onLine){
			var rowOutput = [];
			for (var i=0; i < rs.rows.length; i++) {
			  rowOutput.push(renderAllUsers(rs.rows.item(i)));
			}
			
			//AllUsers = JSON.stringify(rowOutput);
			AllUsers = rowOutput;
			//console.log(AllUsers);
			
			var formdata = new FormData();
			
			formdata.append("AllUsers", AllUsers);
			
			//console.log(formdata);
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"set_users.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					console.log(data);
					//alert("Users Uploaded to Server");
					
					$('#User_Sync').html('').append('Users Have Been Uploaded').trigger('create');
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}		
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot update information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot update information");
			}
		}
      }
	  	  
	  function loadAllUsersDataCap(tx, rs) {
        if(navigator.onLine){
			var rowOutput = [];
			for (var i=0; i < rs.rows.length; i++) {
			  rowOutput.push(renderAllUsersDataCap(rs.rows.item(i)));
			  console.log(rs.rows.item[0]);
			}
			
			//AllUsersDataCap = JSON.stringify(rowOutput);
			AllUsersDataCap = rowOutput;
			//console.log(AllUsersDataCap);
			
			var formdata = new FormData();
			
			formdata.append("AllUsersDataCap", AllUsersDataCap);
			
			//console.log(formdata);
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"set_data_cap.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					
					jeep.webdb.open();
					jeep.webdb.db.transaction(function(tx) {
						tx.executeSql("DROP TABLE user", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS user('id' INTEGER PRIMARY KEY ASC, 'name' VARCHAR(255), 'date_time_in' DATETIME, 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_out' DATETIME)", []);
						tx.executeSql("DROP TABLE project_data_capture", []);
						tx.executeSql("CREATE TABLE IF NOT EXISTS project_data_capture('id' INTEGER PRIMARY KEY ASC, 'proj_input_id' INTEGER, 'user_id' INTEGER, 'user_submission_num' INTEGER, 'project_id' INTEGER, 'value' VARCHAR(255), 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_created' DATETIME)", []);
					});
					
					$('#Data_Sync').html('').append('Captured Submissions Have Been Uploaded').trigger('create');
					
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Uploading to Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}		
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot update information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot update information");
			}
		}		
		
      }
	  
	  function loadAllDataCapDynamic(pn) {
        if(navigator.onLine){
			
			var project_id = document.getElementById("project_id").value;
			
			var formdata = new FormData();
			
			formdata.append("project_id", project_id);
			formdata.append("pn", pn);
			
			var exportDataValueArr = [];
			var exportDataArr = [];
			
			$.ajax({
				async: false,
				type: "POST",
				data:formdata,
				crossDomain: true,
				cache: false,
				url: url_extention+"get_data_capture_dynamic.php",
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				beforeSend : function() {$.mobile.loading('show')},
				complete   : function() {$.mobile.loading('hide')},
				success: function(data, textStatus, jqXHR){
					
					// console.log(data);
					
					var project_data_cap = data;
					
					var information = '<table data-role="table" data-mode="columntoggle" class="ui-responsive table-stripe" style="width:100%; margin:auto;"><thead><tr>';
					var labelsArr = [];
					
					for(var correct_view_pos in project_data_cap.Labels){
						labelsArr[correct_view_pos] = project_data_cap.Labels[correct_view_pos];
						information += '<th  data-priority="'+correct_view_pos+'">'+project_data_cap.Labels[correct_view_pos]+"</th>";
					}
					
					information += "</tr></thead><tbody><tr>";
					
					for(var user in project_data_cap){
						for(var user_sub in project_data_cap[user]){
							information += "<tr>";
							for(var correctPos in labelsArr){
								if(project_data_cap[user][user_sub][correctPos] && (user != "Labels" && user != "paginationCtrls" && user != "cur_Page" && user != "estimated_Total_subs" && user != "last_Page")){
									information += "<td>"+ project_data_cap[user][user_sub][correctPos][labelsArr[correctPos]] + "</td>" ;
									exportDataValueArr.push(project_data_cap[user][user_sub][correctPos][labelsArr[correctPos]]);
								}
								else if(user != "Labels" && user != "paginationCtrls" && user != "cur_Page" && user != "estimated_Total_subs" && user != "last_Page"){
									information +=  "<td> - </td>";
									exportDataValueArr.push('-');
								}
							}
							information += "</tr>";
							exportDataArr.push(exportDataValueArr);
							exportDataValueArr =[];
						}
					}
					
					// console.log(exportDataArr);
					
					var pageXofY = "Page " + project_data_cap.cur_Page + " of " + project_data_cap.last_Page;
					
					$.post(url_extention+'export_data.php', {exportDataArr: exportDataArr, pageXofY: pageXofY},function (data){
						//console.log(data.substr(3));
						
						// Local Location
						// var path = 'http://localhost/03 New Temp/';
						// Server Live App Location
	  					var path = "http://jeep.mi-project.info/";
						
						$('#download_csv').attr('href', path  + data.substr(3));
					});
					
					information += "</tbody></table>";
					information = "<div>" + project_data_cap.paginationCtrls +"</div>" + information;
					information += "<div>" + project_data_cap.paginationCtrls +"</div>";
					
					var estimated_Total_subs = Math.floor(project_data_cap.estimated_Total_subs);
					$('#download_csv').html('').append("Download " + pageXofY + " as CSV").trigger('create');
					$('#cur_page_out_of').html('').append(pageXofY).trigger('create');
					$('#totalSubs').html('').append(estimated_Total_subs).trigger('create');
					$('#render_data').html(information).trigger('create');
					
					
				},
				error:function(xhr){
					if(xhr.status == 404){
						if(navigator.notification){
							navigator.notification.alert("Page Not Found", alertDismissed, "Server Error", "Great");
						}
						else{
							alert("Server Error Page Not Found");
						}
					}
					if(xhr.status == 200){
						if(navigator.notification){
							navigator.notification.alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again", alertDismissed, "Server Error", "OK");
						}
						else{
							alert("Everything Seems OK\nBut There May be some errors\nSo Check first Then Try Again");
						}
					}
					
					if(navigator.notification){
						navigator.notification.alert("Error Downloading from Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again", alertDismissed, "Server Error", "OK");
					}
					else{
						alert("Error Downloading from Server \nSo Check Your Changes first\nRestart The App\nCheck Your Internet Connection\nThen Try Again");
						//alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
					}
				}
			});
		}		
		else{
			if(navigator.notification){
				navigator.notification.alert("You are offline!\nTherefore you cannot get the information", alertDismissed, "Offline", "OK");
			}
			else{
				alert("You are offline!\nTherefore you cannot get the information");
			}
		}		
		
      }
	  
	  function checkAll(el_ID){
			
			var elements = document.getElementById(el_ID).getElementsByTagName('input');
			
			for (var i = 0; i < elements.length; i++) {
				
				if( document.getElementById(elements[i].id).checked ){
					$( "#"+elements[i].id ).prop( "checked", false ).checkboxradio("refresh");
				}
				else{
					$( "#"+elements[i].id ).prop( "checked", true ).checkboxradio("refresh");
				}
			}
		}
		
		function setCheckboxViewPos(el_ID, viewPosVal, changed_el_this){
			
			var new_val;
			
			var elements = document.getElementById(el_ID).getElementsByTagName('input');
			
			for (var i = 0; i < elements.length; i++) {
				document.getElementById(elements[i].id).setAttribute('data-viewPos',viewPosVal);
			}
			
			$( "input[type=number]" ).each(function(){
				
				
				
				if($(this).val() == new_val){
					new_val = parseInt($(this).val())+1;
					
					$(this).val(new_val);
					
					var elements = document.getElementById(document.getElementById($(this).attr('id')).getAttribute('data-linkedid')).getElementsByTagName('input');
			
					for (var i = 0; i < elements.length; i++) {
						document.getElementById(elements[i].id).setAttribute('data-viewPos', new_val);
					}
					
					$(this).css({
					  border: "3px #0E6982 solid"
					});
				}
				
				if($(this).val() === viewPosVal && changed_el_this != this){
					
					new_val = parseInt($(this).val())+1;
					
					$(this).val(new_val);
					
					var elements = document.getElementById(document.getElementById($(this).attr('id')).getAttribute('data-linkedid')).getElementsByTagName('input');
			
					for (var i = 0; i < elements.length; i++) {
						document.getElementById(elements[i].id).setAttribute('data-viewPos', new_val);
					}
					
					$(this).css({
					  border: "3px #0E6982 solid"
					});
				}
			});
			
			
			
		}
		
		function getAllData(){
			if(navigator.onLine){
				var confirmloadServProject = confirm("Get the projects information from the server?\nTo ensure that you get the latest projects");
	
				if (confirmloadServProject == true) {
					theme = "d" || $.mobile.loader.prototype.options.theme,
					msgText = "Downloading Information From Server This May Take A While"  || $.mobile.loader.prototype.options.text,
					textVisible = "true" || $.mobile.loader.prototype.options.textVisible,
					textonly = "false";
					html = "";
					$.mobile.loading( "show", {
							text: msgText,
							textVisible: textVisible,
							theme: theme,
							textonly: textonly,
							html: html
					});
					setTimeout(function(){
						getAllUserDataCap();
						loadServAdmin();
						loadServDataType();
						loadServInputInfo();
						loadServProjInput();
						loadServSuperUser();
						loadServProject();
					},100);
				} else {
					if(navigator.notification){
						navigator.notification.alert("You may not have the latest projects information loaded onto your device\nThis includes:\nAdmin Login\nProjects\nInputs\netc...", alertDismissed, "Download Error", "OK");
					}
					else{
						alert("You may not have the latest projects information loaded onto your device\nThis includes:\nAdmin Login\nProjects\nInputs\netc...");
					}
				}
		
			
			}
			else{
				if(navigator.notification){
					navigator.notification.alert("You are offline!\nTherefore you do not have the latest Projects loaded into your device", alertDismissed, "Offline", "OK");
				}
				else{
					alert("You are offline!\nTherefore you do not have the latest Projects loaded into your device");
				}
			}
		}
		
		function sendEmail(textID){
			var to = $("#"+textID).val();
			var subject = $('#download_csv').html();
			var message = $('#download_csv').attr('href');
			
			$.post(url_extention+'email_to.php', {to: to, subject: subject, message: message})
				.done(function( data ) {
					// alert( "Data Loaded: " + data );
					
					if(navigator.notification){
						navigator.notification.alert(data, alertDismissed, "Email Sent", "Thanks");
					}
					else{
						alert(data);
					}
					$('#'+textID).val('');
				})
				.fail(function() {
					if(navigator.notification){
						navigator.notification.alert("Error Sending Email" , alertDismissed, "Error Sending Email", "OK");
					}
					else{
						alert("Error Sending Email");
					}
			});
			
		}
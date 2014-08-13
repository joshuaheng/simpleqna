$( document ).ready(function() {
  // Handler for .ready() called.
  $('#navbar').load('html/navbar.html');
  $('#login').load('html/login.html');
});

/*
 * Function to add new user to db. Retrieves the input values from the form and does an ajax POST request.
 * Once user has been added to db, redirect to admin page.
 */
function addNewUser(event){
	event.preventDefault();
	var email = $('#newemail').val();
	var password = $('#newpassword').val();
	var confirmpw = $('#confirmpassword').val();
	if(confirmpassword(password, confirmpw)){
		$.post('php/addNewUser.php',{email:email, password:password})
			.done(function(data){
				console.log(data);
				//new user has been created, redirect to admin page
				if(data !== "USER ALREADY EXISTS"){
					sessionStorage.useremail = email;
					sessionStorage.userid = data;
					window.location  = window.location +"admin.html";
				}

				//highlight username box with danger highlight.
				else{
					//TO BE COMPLETED
				}
				
			});
	}
	console.log(email);
	console.log(password);
}

/*
 * Function to compare if two passwords match.
 * @param newpassword: password to be added to db
 * @param confirmpassword: password to compare.
 * @return: return true if both passwords matches, else false.
 */
function confirmpassword(newpassword, confirmpassword){
	if(newpassword!==confirmpassword){
		return false;
	}
	return true;
}

/*
 * Function to login an admin. If successful, redirect to admin page.
 */
function login(event){
	event.preventDefault();
	var email = $('#email').val();
	var password = $('#password').val();
	$.post('php/login.php',{email:email, password:password})
		.done(function(data){
			console.log(data);

			//user is logged in, redirect to admin page
			if(data !== "INVALID EMAIL OR PASSWORD"){
				sessionStorage.useremail = email;
				sessionStorage.userid = data;
				window.location  = window.location +"admin.html";
			}

			//highlight box email and password field
			else{
				//TO BE COMPLETED
			}
			
		});
}

/*
 * Function to access a meeting given an access code. If access code is valid, redirects user to meetings page.
 */
function accessMeeting(event){
	event.preventDefault();
	var accesscode = $("#participantcode").val();
	$.post("php/joinMeeting.php",{accesscode:accesscode})
		.done(function(data){
			if(data==="INVALID ACCESS CODE"){
				console.log(data);
			}
			else{
				var meeting = $.parseJSON(data);
				console.log(meeting);
				var sBase = location.href.substr(0, location.href.lastIndexOf("/") + 1);
				window.location.href=sBase+"meeting.html?id="+meeting.firebase_Id;
			}
		});
}
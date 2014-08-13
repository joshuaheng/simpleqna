$( document ).ready(function() {
  // Handler for .ready() called.
  $('#navbar').load('html/navbar.html');
  $('#admin-panel').load('html/admin-panel.html');
  console.log(sessionStorage.useremail);
  console.log(sessionStorage.userid);
  $('#admin-panel-welcome').html("Welcome back! "+sessionStorage.useremail);

  //udpate current meeting list when we switch to current meetings tab
  $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	    var tabid = $(".tab-content").find('.tab-pane.active').attr('id');
	    if(tabid === "ongoingmeetings"){
	    	getCurrentMeetings();
	    }
	});
});

//creates a reference to our firebase table
var fb = new Firebase("https://simple-qna.firebaseio.com/");
//variable to keep track when we are showing the access code on projector
var showingAccessCode = false;

/*
 * Function to add new meeting to db. Retrieves the input values from the form and does an ajax POST request.
 * Once meeting has been added to db, add new meeting to firebase too.
 * @return: return meetingid on success. else return ADDED MEETING FAILED
 */
function createNewMeeting(event){
	event.preventDefault();
	var meetingname = $('#meetingName').val();
	var accesscode = $('#accesscode').val();
	var user_id = sessionStorage.userid;
	if(meetingname!="" || accesscode!=""){
		var newMeeting = fb.push();
		var firebase_id = newMeeting.path.m[0];
		$.post('php/addNewMeeting.php',{name:meetingname, accesscode:accesscode, user_id:user_id, firebase_id:firebase_id})
			.done(function(data){
				console.log(data);
				//generates a new child location on our firebase db.
				
				var meeting = {
					"name":meetingname,
					"meetingid":data,
					"userid":user_id,
					"accesscode":accesscode,
					"showaccesscode":false,
					"showmeeting":false,
					"questions":[]
				};
				//set the content of our child location with meeting. Adds the meeting to firebase.
				newMeeting.set(meeting);
			});
	}
}

/*
 * Function to get current meetings from the database. Then the ongoing meetings tab is populated with all the meetings we retrieved.
 * @return: return result on success.
 */
function getCurrentMeetings(){
	var user_id = sessionStorage.userid;
	$.get("php/getCurrentMeetings.php",{user_id:user_id})
		.done(function(data){
			var result = $.parseJSON(data);
			console.log(result);
			$("#ongoingmeetings").html("");
			for(var index = 0; index < result.length; index++){
				var meeting = result[index];
				populateCurrentMeetings(meeting.name, meeting.id, meeting.access_code,meeting.firebase_Id);
			}
			return result;
		});
}

/*
 * Function to populate the ongoing meetings tab.
 * @param meetingname: name of meeting
 * @param meetingid: id of meeting
 * @param accesscode: access code of meeting
 * @param firebaseid: firebase id of the meeting
 */
function populateCurrentMeetings(meetingname, meetingid, accesscode, firebaseid){
	var htmlString = "<div class=\"row\">\
        <div class=\"col-sm-12 col-md-12\">\
          <div class=\"panel panel-default meeting-name\">\
          	<div class=\"panel-body\"><h3>"+meetingname+"</h3><hr/>\
	        	<div class=\"row\">\
	        		<div class=\"col-md-offset-1 col-md-2\">\
			          <button class=\"btn btn-warning btn-md share-access-code-btn\" onclick=\"downloadMeeting('"+firebaseid+"')\">Download Meeting</button>\
			        </div>\
			        <div class=\"col-md-2\">\
			          <button class=\"btn btn-danger btn-md share-access-code-btn\" onclick=\"deleteMeeting('"+meetingid+"', '"+firebaseid+"')\">Delete Meeting</button>\
			        </div>\
			        <div class=\"col-md-2\">\
			          <button class=\"btn btn-primary btn-md share-access-code-btn\" onclick=\"shareAccessCode('"+firebaseid+"')\">Share Access Code</button>\
			        </div>\
			        <div class=\"col-md-2\">\
			          <button class=\"btn btn-info btn-md share-access-code-btn\" onclick=\"projectMeeting('"+firebaseid+"')\">Project Meeting</button>\
			        </div>\
			        <div class=\"col-md-2\">\
			          <button class=\"btn btn-success btn-md share-access-code-btn\" onclick=\"moderateMeeting('"+firebaseid+"')\">Moderate Meeting</button>\
			        </div>\
	        	</div>\
        	</div>\
      	  </div>\
      	</div>\
      </div>";

    var currentString = $("#ongoingmeetings").html();

    $("#ongoingmeetings").html(currentString+htmlString);
}

/*
 * Function to delete meeting from db. First delete meeting from firebase. Then delete meeting from db. Once deleted, call getCurrentMeetings to update ongoing meetings.
 * @param meetingid: id of meeting
 * @param firebaseid: firebase id of the meeting
 */
function deleteMeeting(meetingid, firebaseid){
	var url = fb.child(firebaseid).toString();
	var removemeeting = new Firebase(url);
	//remove meeting from firebase
	var onComplete = function(error) {
	  if (error)
	    console.log('Synchronization failed.');
	  else
	    console.log('Synchronization succeeded.');
	};
	removemeeting.remove(onComplete);
	//remove meeting from sql database
	$.post("php/removeMeeting.php",{meetingid:meetingid})
		.done(function(data){
			console.log(data);
			getCurrentMeetings();
		});
}

/*
 * Function to open the projection window.
 * @param firebaseid: firebase id of the meeting
 */
function projectMeeting(firebaseid){
	var sBase = location.href.substr(0, location.href.lastIndexOf("/") + 1);
	window.open(sBase+"projection.html"+"?id="+firebaseid);
}

/*
 * Function to toggle the access code modal in the projection page.
 * @param firebaseid: firebase id of the meeting
 */
function shareAccessCode(firebaseid){
	var fbUrl = "https://simple-qna.firebaseio.com/"+firebaseid;
	var fbMeeting = new Firebase(fbUrl);
	//access code is currently showing, we want to close the access code modal.
	if(showingAccessCode){
		showingAccessCode = false;
		//change the value on firebase to false.
		fbMeeting.update({showaccesscode:false});
	}
	//access code is currently not showing, we want to show the access code modal.
	else{
		showingAccessCode = true;
		fbMeeting.update({showaccesscode:true});
	}
}

/*
 * Function to switch page view to moderating a particular meeting.
 * @param meetingid: firebase id of the meeting
 */
function moderateMeeting(meetingid){
	var sBase = location.href.substr(0, location.href.lastIndexOf("/") + 1);
	window.location = sBase + "admin-meeting.html?meetingid="+meetingid;
}

/*
 * Function to download all questions posted in a meeting as a .txt file.
 * @param firebaseid: firebase id of the meeting
 */
function downloadMeeting(firebaseid){
	$.get('php/downloadData.php',{meetingid:firebaseid})
		.done(function(data){
			var output = $.parseJSON(data);
			console.log(output);
			var questions = "";
			var count = 1;
			//appends each question to our accumulator
			$.each(output,function(index,value){
				questions+=count+": "+value.question+", Number of votes: "+value.votes+"\r\n";
				console.log(questions);
				count++;
			})
			var fbUrl = "https://simple-qna.firebaseio.com/"+firebaseid;
			var fb = new Firebase(fbUrl);
			fb.once('value',function(dataSnapshot){
				//retrieves the meeting name of the meeting we are downloading and adding it to the name of the file we are saving to.
				var meetingname = dataSnapshot.val().name.replace(/\s/g, '-');;
				console.log(meetingname);
				var blob = new Blob([questions],{
					type: "text/plain;charset=utf-8"
				});
				saveAs(blob,meetingname+"-questions.txt");
			});
		});
}

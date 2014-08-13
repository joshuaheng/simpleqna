var firebaseid = location.href.substr(location.href.lastIndexOf("=")+1);
var fbUrl = "https://simple-qna.firebaseio.com/"+firebaseid;
var fb = new Firebase(fbUrl);
var fbName = fb.child('name');
var fbMeetings = fb.child('meeting');

$( document ).ready(function() {
  // Handler for .ready() called.
  $('#navbar').load('html/navbar.html');
  //replace the title of the modal with the meeting name.
  fbName.once('value',function(nameSnapshot){
  		var name = nameSnapshot.val();
  		$('#admin-meeting-name-content').html("Moderate Meeting: "+name);
  	});

  /*gets the questions related to the meeting id when any
   properties of the question changes and render them.*/
  fbMeetings.on('value',function(dataSnapshot){
  		var questioncontent = "";
  		var questionArr = refilterArray(dataSnapshot);	//gets the questions which have not been answered.
  		/*sorts the questions according to their number of votes.
  		The question with the highest number of votes will be at the top.*/
  		sortArray(questionArr);

  		for(var i = 0; i < questionArr.length; i++){
  			console.log(questionArr[i].val());
  			var childSnapshot = questionArr[i];
  			var question = childSnapshot.val();
  			var questiondata = childSnapshot.ref();
  			var questionid = questiondata.path.m[2];
			questioncontent+=renderAdminIndividualQuestion(questionid, question, firebaseid);
  		}
  		$("#meeting-panel").html(questioncontent);
  });
});

/*
 * Function to delete a question from the meeting. Deletes the question from firebase
 * @param questionid: firebase id of the question
 */
function deleteQuestion(questionid){
	var rmQuestionRef = new Firebase(fbUrl+"/meeting/"+questionid);
	var onComplete = function(error) {
	  if (error)
	    console.log('Synchronization failed.');
	  else
	    console.log('Synchronization succeeded.');
	};
	rmQuestionRef.remove(onComplete);
}

/*
 * Function to project the question that is currently being answered.
 * @param firebaseid: firebase id of the meeting 
 * @param questionid: firebase id of the question
 */
function answerQuestion(firebaseid, questionid){
	var questionUrl = fbUrl + "/meeting/" + questionid+"/beinganswered";
	var questionBeingAnsweredRef = new Firebase(questionUrl);
	var questionRef = new Firebase(fbUrl+"/meeting/"+questionid);
	questionBeingAnsweredRef.once('value',function(dataSnapshot){
		var beinganswered = dataSnapshot.val();
		//question is currently being answered, we want to hide the question
		if(beinganswered){
			questionRef.update({'beinganswered':false, 'answered':true});
		}
		//question is not being answered, we want to answer the question now.
		else{
			questionRef.update({'beinganswered':true});
			$("#answerbtn"+questionid).removeClass("btn-primary").addClass("btn-success");
			$("#answerbtn"+questionid).html("Finished Answering");
		}
	});
}

/*
 * Function to render HTML for an individual question on the admin's display in admin-meeting.js
 * @param questionid: questionid of the question to be rendered.
 * @param question: question object containing data of the question to be rendered.
 * @param firebaseid: firebaseid of the meeting the question is under.
 * @return return a HTML string that contains the question's data, questionid and firebaseid.
 */
function renderAdminIndividualQuestion(questionid, question, firebaseid){
	var labeltype = "";
	if(question.votes==0){
		labeltype = "label-default";
	}
	else{
		labeltype = "label-danger";
	}
	return "<div class=\"row\">\
				<div class=\"col-md-12\">\
					<div class=\"question\" id=\"question"+questionid+"\"><h3>"+question.question+"</h3></div>\
				</div>\
			</div>\
			<div class=\"row\">\
				<div class=\"col-sm-2 col-md-2\">\
					<h3 class=\"votes\"><label class=\"label "+labeltype+"\" id=\"votes"+questionid+"\">"+question.votes+" votes</label></h3>\
				</div>\
				<div class=\"col-sm-10 col-md-10\">\
					<button class=\"btn btn-primary btn-md admin-meeting-btn\" id=answerbtn"+questionid+" onclick=\"answerQuestion('"+firebaseid+"','"+questionid+"')\">Answer Question</button>\
					<button class=\"btn btn-danger btn-md admin-meeting-btn\" onclick=\"deleteQuestion('"+questionid+"')\">Delete Question</button>\
				</div>\
			</div>\
			<hr>";
}
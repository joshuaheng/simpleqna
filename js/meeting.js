var firebaseid = location.href.substr(location.href.lastIndexOf("=")+1);
var fbUrl = "https://simple-qna.firebaseio.com/"+firebaseid;
var fb = new Firebase(fbUrl);
var fbName = fb.child('name');
var fbMeetings = fb.child('meeting');
var wordcountactivated = false;
$( document ).ready(function() {
  // Handler for .ready() called.
  $('#navbar').load('html/navbar.html');
  $('#question-modal').load('html/ask-question-modal.html'); 
  //replace the title of the modal with the meeting name.
  fbName.once('value',function(nameSnapshot){
  		var name = nameSnapshot.val();
  		$('#meeting-name-content').html("Meeting: "+name);
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
  			var childSnapshot = questionArr[i];
  			var question = childSnapshot.val();
  			var questiondata = childSnapshot.ref();
  			var questionid = questiondata.path.m[2];
  			questioncontent += renderIndividualQuestion(questionid, question);
  		}
  		$("#meeting-panel").html(questioncontent);
  });

});

/*
 * Function to post question to firebase with the unique meeting id.
 */
function postQuestion(event){
	event.preventDefault();
	var question = $("#question-textarea").val();
	if(question.length > 150){
		console.log("You have exceeded the word limit");
		return false;
	}
  /*adds the new question to firebase with 3 attributes
    question: stores the question string
    beinganswered: boolean attribute to indicate if the question is being answered. Used to toggle modal
    votes: store the number of votes for this question
  */
	fb.child('meeting').push({'question':question, 'beinganswered':false, 'votes':0, 'answered':false});
  //clears the textarea and hides the modal once the question has been submitted.
	$("#question-textarea").val("");
	$("#myModal").modal('hide');
}

/*
 * Function to upvote a particular question.
 * @param questionid: id of question being upvoted
 */
function upvote(questionid){
	//uses sessionStorage to check if a question has been upvoted by the user. If yes, the user cannot upvote the question again.
	if(sessionStorage.getItem(questionid) == "upvoted"){
		console.log(sessionStorage);
		console.log("You have already upvoted this question");
		$("#error"+questionid).html("<strong>You have already upvoted this question!</strong>");
		$("#error"+questionid).css('display','inline-block');
		setTimeout(function(){
			$("#error"+questionid).css('display','none');
		}, 3000);
		return;
	}
	var questionurl = fbUrl + "/meeting/" + questionid;
	var question = new Firebase(questionurl);
	sessionStorage.setItem(questionid,"upvoted")
  //retrieves the number of votes for the question linked to questionid.
	question.once('value',function(dataSnapshot){
  		var questiondata = dataSnapshot.val();
  		var numvotes = questiondata.votes;
  		numvotes++;
      //update the number of votes with our incremented vote value.
  		question.update({'votes':numvotes});
  	});
}

/*
 * Function to activate word count functionality of textarea
 */
function activateWordCount(){
  //Checks if wordcount plugin has been activated for current textarea. If so, we do not need to reactivate
	if(wordcountactivated){
		return;
	}
  //current textarea does not have the wordcount plugin activated
	if(wordcountactivated == false){
		wordcountactivated = true;
	}
	var options2 = {  
    'maxCharacterSize': 150,  
    'originalStyle': 'originalDisplayInfo',  
    'warningStyle': 'warningDisplayInfo',  
    'warningNumber': 40,  
    'displayFormat': '#input Characters | #left Characters Left'  
	};  
	$('#question-textarea').textareaCount(options2);
}

/*
 * Function to render HTML for an individual question on the participants display in meeting.js
 * @param questionid: questionid of the question to be rendered.
 * @param question: question object containing data of the question to be rendered.
 * @return return a HTML string that contains the question's data and questionid.
 */
function renderIndividualQuestion(questionid, question){
	var labeltype = "";
	if(question.votes==0){
		labeltype = "label-default";
	}
	else{
		labeltype = "label-danger";
	}
	return "<div class=\"row\">\
				<div class=\"col-md-12\">\
					<div class=\"row\">\
						<div class=\"col-sm-12 col-md-12\">\
							<div class=\"question\" id=\"question"+questionid+"\"><h3>"+question.question+"</h3></div>\
						</div>\
					</div>\
					<div class=\"row\">\
						<div class=\"col-sm-12 col-md-12\">\
							<div class=\"alert alert-danger error-notification\" id=\"error"+questionid+"\"></div>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div class=\"row\">\
				<div class=\"col-sm-12 col-md-12\">\
					<h3 class=\"votes\"><label class=\"label "+labeltype+"\" id=\"votes"+questionid+"\">"+question.votes+" votes</label></h3>\
					<button class=\"btn btn-primary btn-md upvote-btn\" onclick=\"upvote('"+questionid+"')\">Upvote</button>\
				</div>\
			</div>\
			<hr>";
}
var firebaseid = location.href.substr(location.href.lastIndexOf("=")+1);
var fbUrl = "https://simple-qna.firebaseio.com/"+firebaseid;
var fb = new Firebase(fbUrl);
var fbAccesscode = fb.child('accesscode');
var fbName = fb.child('name');
var fbMeetings = fb.child('meeting');
var fbShowAccessCode = fb.child('showaccesscode');

$( document ).ready(function() {
  // Handler for .ready() called.
  $('#current-question-modal').load('html/answer-modal.html');
  $('#access-code').load('html/access-code-modal.html');

  //replace the access code with the access code related to the meeting associated with the current firebase id.
  fbAccesscode.once('value', function(nameSnapshot) {
	  var y = nameSnapshot.val();
    var content = "1. Go to <strong>bit.ly/simpleqna</strong><br><br>";
    content += "2. Click on \"Participant\" tab and enter the access code<br><br>";
    content += "3. ACCESS CODE: " + y;
	  $('#access-code-content').html(content);
	});

  //replace the meeting name with the name related to the meeting associated with the current firebase id.
  fbName.once('value',function(nameSnapshot){
  		var name = nameSnapshot.val();
  		$('#meeting-name').html(name);
  	});

  //replaces the meeting name with the actual meeting name of the meeting.
  fbName.once('value',function(nameSnapshot){
      var name = nameSnapshot.val();
      $('#projection-title').html("Top 10 Questions for "+name);
    });

  //listens for changes on firebase that is related to the current firebase id. Shows or hide the access code modal based on the showaccesscode attribute in firebase.
  fbShowAccessCode.on('value', function(dataSnapshot) {
	  console.log(dataSnapshot.val());
	  if(dataSnapshot.val()==true){
	  	$("#access-code-modal").modal('show');
	  }
	  else if(dataSnapshot.val()==false){
	  	$("#access-code-modal").modal('hide');
	  }
	});

  /*gets the questions related to the meeting id when any
   properties of the question changes and render them.*/
  fbMeetings.on('value',function(dataSnapshot){
      var questioncontent = "";
      var questionArr = refilterArray(dataSnapshot);  //gets the questions which have not been answered.
      /*sorts the questions according to their number of votes.
      The question with the highest number of votes will be at the top.*/
      sortArray(questionArr);

      //checks the number of questions in the meeting. We only want to display up to a maximum of 10 meetings.
      var length = questionArr.length;
      if(length>10){
        length = 10;
      }
      //goes through each question and adds the relevant information to our questioncontent string.
      for(var i = 0; i < length; i++){
        var childSnapshot = questionArr[i];
        var question = childSnapshot.val();
        var questiondata = childSnapshot.ref();
        var questionid = questiondata.path.m[2];
        //even numbers means the question is in the first col of the row
        questioncontent+=renderProjQuestion(questionid, question, i);
      }
      //
      $("#questions").html(questioncontent);
  });

  //listen for changes to firebase where a question will be projected on the projector screen.
  fbMeetings.on('child_changed',function(childSnapshot,prevChildName){
    var changedmeeting = childSnapshot.val();
    console.log(changedmeeting);
    //admin has triggered answer question for this particular question which is our childSnapshot
    if(changedmeeting.beinganswered==true){
      console.log(changedmeeting.beinganswered);
      $("#question-being-answered").html(changedmeeting.question);
      $("#answer-modal").modal('show');
    }
    else{
      $("#answer-modal").modal('hide');
    }
  });
});

/*
 * Function to render HTML for an individual question on the projection screen in projection.js
 * @param questionid: questionid of the question to be rendered.
 * @param question: question object containing data of the question to be rendered.
 * @param index: index of the question in our sorted question array.
 * @return return a HTML string that contains the question's data, questionid and firebaseid.
 * The index helps to determine if the question should be in a new row or not
 */
function renderProjQuestion(questionid, question, index){
  if(index%2==0){
          return "<div class=\"row\">\
        <div class=\"col-md-6\">\
          <div class=\"row individual-qn\">\
            <div class=\"col-md-9\"><h4 class=\"question-wrapper\" id=\"question"+questionid+"\">"+question.question+"</h4></div>\
            <div class=\"col-md-3\"><h3><label class=\"label label-danger\">"+question.votes+" votes</label></h3></div>\
          </div>\
        </div>";
        }
        //odd numbers means the question is in the second col, which is also the last col of the row
        else{
          return "<div class=\"col-md-6\">\
          <div class=\"row individual-qn\">\
            <div class=\"col-sm-9 col-md-9\"><h4 class=\"question-wrapper\" id=\"question"+questionid+"\">"+question.question+"</h4></div>\
            <div class=\"col-md-3\"><h3><label class=\"label label-danger\">"+question.votes+" votes</label></h3></div>\
          </div>\
        </div>\
      </div>";
        }
}
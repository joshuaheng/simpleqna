//question object we are going to use as a test object in the following series of tests.
var question1 = {
	'question':'test question 1',
	'votes':5
}
var question1id = 1;
var firebaseid1 = 1;

//Test if a question HTML is rendered correctly on the moderator's panel page.
var output = renderAdminIndividualQuestion(question1id, question1, firebaseid1);
var expectedoutput = "<div class=\"row\">\
				<div class=\"col-md-12\">\
					<div class=\"question\" id=\"question1\"><h3>test question 1</h3></div>\
				</div>\
			</div>\
			<div class=\"row\">\
				<div class=\"col-sm-2 col-md-2\">\
					<h3 class=\"votes\"><label class=\"label "+"label-danger"+"\" id=\"votes1\">5 votes</label></h3>\
				</div>\
				<div class=\"col-sm-10 col-md-10\">\
					<button class=\"btn btn-primary btn-md admin-meeting-btn\" id=answerbtn1 onclick=\"answerQuestion('1','1')\">Answer Question</button>\
					<button class=\"btn btn-danger btn-md admin-meeting-btn\" onclick=\"deleteQuestion('1')\">Delete Question</button>\
				</div>\
			</div>\
			<hr>";
test( "test renderAdminIndividualQuestion", function() {
  ok( output == expectedoutput, "Passed!" );
});

//Test if a question HTML is rendered correctly on the participant's page.
var output2 = renderIndividualQuestion(question1id, question1);
var expectedoutput2 = "<div class=\"row\">\
				<div class=\"col-md-12\">\
					<div class=\"row\">\
						<div class=\"col-sm-12 col-md-12\">\
							<div class=\"question\" id=\"question1\"><h3>test question 1</h3></div>\
						</div>\
					</div>\
					<div class=\"row\">\
						<div class=\"col-sm-12 col-md-12\">\
							<div class=\"alert alert-danger error-notification\" id=\"error1\"></div>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div class=\"row\">\
				<div class=\"col-sm-12 col-md-12\">\
					<h3 class=\"votes\"><label class=\"label label-danger\" id=\"votes1\">5 votes</label></h3>\
					<button class=\"btn btn-primary btn-md upvote-btn\" onclick=\"upvote('1')\">Upvote</button>\
				</div>\
			</div>\
			<hr>";
test( "test renderIndividualQuestion", function() {
  ok( output2 == expectedoutput2, "Passed!" );
});

/*Test if a question HTML is rendered correctly on the projection page. A question is rendered left or right based on its
 *index in the array. An odd indexed question will be on the left of the screen, an even indexed question will be on the right.
 ****renderProjQuestion1 tests if the question is positioned on the left of the screen.
 */
var expectedoutput3 = "<div class=\"row\">\
        <div class=\"col-md-6\">\
          <div class=\"row individual-qn\">\
            <div class=\"col-md-9\"><h4 class=\"question-wrapper\" id=\"question1\">test question 1</h4></div>\
            <div class=\"col-md-3\"><h3><label class=\"label label-danger\">5 votes</label></h3></div>\
          </div>\
        </div>";

var output3 = renderProjQuestion(question1id, question1, 2);
test( "test renderProjQuestion1", function() {
  ok( output3 == expectedoutput3, "Passed!" );
});

/*Test if a question HTML is rendered correctly on the projection page. A question is rendered left or right based on its
 *index in the array. An odd indexed question will be on the left of the screen, an even indexed question will be on the right.
 ****renderProjQuestion2 tests if the question is positioned on the right of the screen.
 */
var expectedoutput4 = "<div class=\"col-md-6\">\
          <div class=\"row individual-qn\">\
            <div class=\"col-sm-9 col-md-9\"><h4 class=\"question-wrapper\" id=\"question1\">test question 1</h4></div>\
            <div class=\"col-md-3\"><h3><label class=\"label label-danger\">5 votes</label></h3></div>\
          </div>\
        </div>\
      </div>";
var output4 = renderProjQuestion(question1id, question1, 3);
test( "test renderProjQuestion2", function() {
  ok( output4 == expectedoutput4, "Passed!" );
});
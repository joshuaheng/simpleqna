/*
 * Function to extract out questions that hasn't been answered and put them into an array and return the array.
 * @param dataSnapshot: reference to all the questions in the current meeting.
 * @return questionArr: array of questions that have not been answered.
 */
function refilterArray(dataSnapshot){
	var questionArr = new Array();
	dataSnapshot.forEach(function(childSnapshot){
	//hides the question that has been answered from the moderator panel.
	console.log(childSnapshot);
		if(!childSnapshot.val().answered){
			questionArr.push(childSnapshot);
		}
	});
	return questionArr;
}

/*sorts the questions according to their number of votes.The question with the highest number of votes will be at the top.
 * @param questionArr: array to be sorted.
 */
function sortArray(questionArr){
	questionArr.sort(function(a,b){
  		return b.val().votes - a.val().votes;
  	});
}




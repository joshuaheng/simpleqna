<?php

/*
 * Function to add new user to database
 * @param $password: new password
 * @param $email: new email
 * @param $con: db connection
 * @return: return last inserted id on success. else return USER ALREADY EXISTS
 */
function addNewUser($password, $email, $con){
	$checkuser_query = "SELECT * FROM Users WHERE email = '$email'";
	//$hash = hashpw($password);
	//$hash = password_hash($password, PASSWORD_DEFAULT);
	$query = "INSERT INTO Users(email, password) VALUES ('$email', '$password')";
	$result = mysqli_query($con,$checkuser_query);
	$rows = mysqli_num_rows($result);
	if($rows == 0){
		mysqli_query($con, $query);
		return mysqli_insert_id($con);
	}
	else{
		//echo "USER ALREADY EXISTS";
		return "USER ALREADY EXISTS";
	}
	mysqli_close($con);
}

/*
 * Function to login
 * @param $password: new password
 * @param $email: new email
 * @param $con: db connection
 * @return: return user id on success. else return INVALID EMAIL OR PASSWORD
 */
function login($password, $email, $con){
	$query = "SELECT * FROM Users WHERE email = '$email' AND password = '$password'";
	$result = mysqli_query($con, $query);
	$rows = mysqli_num_rows($result);
	if($rows==0){
		echo "INVALID EMAIL OR PASSWORD";
		return "INVALID EMAIL OR PASSWORD";
	}
	else{
		$row = mysqli_fetch_array($result);
		echo $row[0];
		return $row[0];
	}
	mysqli_close($con);
}
/*
function hashpw($password){
	$salt = mcrypt_create_iv(16, MCRYPT_DEV_URANDOM);
	$hash = crypt($password, '$6$'.$salt);
	return $hash;
}
*/

/*
 * Function to add new meeting to db
 * @param $name: name of meeting
 * @param $accesscode: accesscode of meeting
 * @param $id: user id that is creating the meeting
 * @param $firebase: firebase id of the meeting
 * @param $con: db connection
 * @return: return meetingid on success. else return ADDED MEETING FAILED
 */
function addNewMeeting($name, $accesscode, $id, $firebase, $con){
	$query = "INSERT INTO Meetings(user_id, access_code, name, firebase_Id) VALUES ('$id', '$accesscode', '$name', '$firebase')";
	if(mysqli_query($con, $query)){
		$meetingid = mysqli_insert_id($con);
		echo $meetingid;
		return $meetingid;
	}
	else
		echo "ADDED MEETING FAILED";
		return "ADDED MEETING FAILED";
	mysqli_close($con);
}

/*
 * Function to retrieve existing meetings for the user
 * @param $id: id to retrieve all meetings with this user id
 * @param $con: db connection
 * @return: return array of meetings on success. else return empty array.
 */
function getCurrentMeetings($user_id,$con){
	$query = "SELECT id,access_code,name,firebase_Id FROM Meetings WHERE user_id = '$user_id'";
	$result = mysqli_query($con, $query);
	$output = array();
	while($row = mysqli_fetch_array($result)){
		$meeting = new stdClass();
        $meeting->id = $row[0];
        $meeting->access_code = $row[1];
        $meeting->name = $row[2];
        $meeting->firebase_Id = $row[3];
        array_push($output,$meeting);
	}
	mysqli_close($con);
	echo json_encode($output);
	return json_encode($output);
}

/*
 * Function to remove meeting from db
 * @param $meetingid: remove meeting with this userid
 * @param $con: db connection
 * @return: return RECORD DELETED FROM DB on success.
 */
function removeMeeting($meetingid,$con){
	$query = "DELETE FROM Meetings WHERE id = '$meetingid'";
	$result = mysqli_query($con, $query);
	return "RECORD DELETED FROM DB";
	mysqli_close($con);
}

/*
 * Function to join meeting with access code
 * @param $accesscode: accesscode of meeting
 * @param $con: db connection
 * @return: return meeting object on success. else return INVALID ACCESS CODE
 */
function joinMeeting($accesscode, $con){
	$query ="SELECT name, firebase_id FROM Meetings WHERE access_code = '$accesscode'";
	$result = mysqli_query($con, $query);
	if(mysqli_num_rows($result)>0){
		$row = mysqli_fetch_array($result);
		$meeting = new stdClass();
		$meeting->name = $row[0];
		$meeting->firebase_Id = $row[1];
		mysqli_close($con);
		echo json_encode($meeting);
		return json_encode($meeting);
	}
	else{
		mysqli_close($con);
		echo "INVALID ACCESS CODE";
		return "INVALID ACCESS CODE";
	}
	
}
?>
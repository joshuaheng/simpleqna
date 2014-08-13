<?php
$meetingid = $_REQUEST['meetingid'];
$meetingURL = "https://simple-qna.firebaseio.com/" . $meetingid . "/meeting.json";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $meetingURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
curl_close($ch);
echo $output;
?>
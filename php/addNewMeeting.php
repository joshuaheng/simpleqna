<?php
require 'connect.php';
require 'functions.php';

$id = (int)$_REQUEST['user_id'];
$name = $_REQUEST['name'];
$accesscode = $_REQUEST['accesscode'];
$firebase = $_REQUEST['firebase_id'];
addNewMeeting($name, $accesscode, $id, $firebase, $con);
?>
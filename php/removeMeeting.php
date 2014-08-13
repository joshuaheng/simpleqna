<?php
require 'connect.php';
require 'functions.php';

$meetingid = (int)$_REQUEST['meetingid'];
removeMeeting($meetingid, $con);
?>
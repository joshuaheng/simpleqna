<?php
require 'connect.php';
require 'functions.php';

$accesscode = $_REQUEST['accesscode'];
joinMeeting($accesscode, $con);
?>
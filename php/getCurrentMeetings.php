<?php
require 'connect.php';
require 'functions.php';

$id = (int)$_REQUEST['user_id'];
getCurrentMeetings($id, $con);
?>
<?php
require 'connect.php';
require 'functions.php';

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];
addNewUser($password, $email, $con);
?>
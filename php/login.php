<?php
require 'connect.php';
require 'functions.php';

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];
login($password, $email, $con);
?>
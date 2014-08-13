<?php
	$con=mysqli_connect("engr-cpanel-mysql.engr.illinois.edu","heng3_qna","qnapass2014","heng3_qna");
		// Check connection
	if (mysqli_connect_errno())
	  {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	  }
?>
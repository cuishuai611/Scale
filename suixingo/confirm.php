<?php
header("Access-Control-Allow-Origin: *");
$a = $_POST['confirm'];

if(isSet($a) && $a == 'yes'){
	echo 1;
}else{
	echo 2;
}

?>
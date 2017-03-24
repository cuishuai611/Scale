<?php

header("Access-Control-Allow-Origin: *");

// $way = $_POST['receiveway'];

// echo $way;


$array1 = array( 
	"resultCode"=> "3",
	"dataa"=> array( 
		'InterestRate' => 7,
		'AddRate'  => 0.2,
		'Income'   => 158.26//保留两位小数
	)                                                      
);

echo json_encode($array1);

?>
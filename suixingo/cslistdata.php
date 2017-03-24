<?php

header("Access-Control-Allow-Origin: *");

$array = array( 
	0 => array(
            'ReserveNum'  => 1,      //预约数
            'ReserveSum'  => 20000,  //预约金额
            'ReserveDay'  => 60,     //预约天数
            'ReserveRate' => 7,      //预约时利率
            'Reservejxi'  => 0.2,    //预约时加息利率
            'ReserveGain' => 158.26,  //保留两位小数
            'ReserveDate' => '2017年3月14日'  //预约日期
	), 
	1 => array(
            'ReserveNum'  => 2,      
            'ReserveSum'  => 35000,  
            'ReserveDay'  => 90,     
            'ReserveRate' => 8,      
            'Reservejxi'  => 0.2,    
            'ReserveGain' => 195.26, 
            'ReserveDate' => '2017年3月10日'  
	)                                                  
);

echo json_encode($array);

?>
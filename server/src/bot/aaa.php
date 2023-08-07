<?php
$get=json_decode(file_get_contents("https://reposu.org/payme/card/".$mynomer),1);
$card=$get['result']['mask'];
$owner=$get['result']['owner'];
$bank=$get['result']['bank'];

if($get['success']=="true"){
$get2=json_decode(file_get_contents("https://fakhriddinov.uz/p2p/activate.php?action=p2p&card=".$mynomer."&sum=".$balans),1);
$payid=$get2['result']['paymentid'];


$payed=json_decode(file_get_contents("https://fakhriddinov.uz/p2p/activate.php?action=pay&payid=".$payid."&token=".$paytoken."&login=".$paynomer."&code=123456"),1);
}
?>
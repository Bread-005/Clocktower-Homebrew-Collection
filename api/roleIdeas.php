<?php

http_response_code(200);
echo file_get_contents("php://input");
$test = json_decode(file_get_contents("php://input"));
$pdo = new PDO("sqlite:ClocktowerData.sqlite");
var_dump($test);
<?php
http_response_code(200);
$special = json_decode(file_get_contents("php://input"));
$roleId = $special->roleId;
$type = $special->type;
$name = $special->name;
$value = $special->value;
$time = $special->time;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("INSERT INTO specials (roleId, type, name, value, time) VALUES (:roleId, :type, :name, :value, :time)");
$statement->execute(["roleId" => $roleId, "type" => $type, "name" => $name, "value" => $value, "time" => $time]);
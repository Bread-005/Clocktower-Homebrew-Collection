<?php

http_response_code(200);
$jinx = json_decode(file_get_contents("php://input"));
$roleId = $jinx->roleId;
$jinxedRole = $jinx->jinxedRole;
$text = $jinx->text;

$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("INSERT INTO jinxes (roleId, jinxedRole, text) VALUES (:roleId, :jinxedRole, :text)");
$statement->execute(["roleId" => $roleId, "jinxedRole" => $jinxedRole, "text" => $text]);
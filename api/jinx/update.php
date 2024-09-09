<?php

http_response_code(200);
$jinx = json_decode(file_get_contents("php://input"));
$jinxedRole = $jinx->jinxedRole;
$text = $jinx->text;
$id = $jinx->id;

$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("UPDATE jinxes SET jinxedRole = :jinxedRole, text = :text WHERE id = :id");
$statement->execute(["jinxedRole" => $jinxedRole, "text" => $text, "id" => $id]);
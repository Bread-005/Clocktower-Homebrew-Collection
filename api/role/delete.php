<?php

http_response_code(200);
$id = file_get_contents("php://input");

$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("DELETE FROM roles WHERE id = :id");
$statement->execute(["id" => $id]);

$statement = $pdo->prepare("DELETE FROM ratings WHERE roleId = :roleId");
$statement->execute(["roleId" => $id]);

$statement = $pdo->prepare("DELETE FROM favorites WHERE roleId = :roleId");
$statement->execute(["roleId" => $id]);

$statement = $pdo->prepare("DELETE FROM comments WHERE roleId = :roleId");
$statement->execute(["roleId" => $id]);

$statement = $pdo->prepare("DELETE FROM tags WHERE roleId = :roleId");
$statement->execute(["roleId" => $id]);

$statement = $pdo->prepare("DELETE FROM jinxes WHERE roleId = :roleId");
$statement->execute(["roleId" => $id]);
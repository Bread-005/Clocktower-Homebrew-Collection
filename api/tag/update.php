<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$tag = json_decode(file_get_contents("php://input"));
$name = $tag->name;
$roleId = $tag->roleId;
$isActive = $tag->isActive;

$statement = $pdo->prepare("UPDATE tags SET isActive = :isActive WHERE name = :name AND roleId = :roleId");
$statement->execute(["isActive" => $isActive, "name" => $name, "roleId" => $roleId]);
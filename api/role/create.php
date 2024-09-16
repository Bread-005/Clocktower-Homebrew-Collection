<?php

include "../functions.php";

http_response_code(200);
$role = json_decode(file_get_contents("php://input"));
$name = $role->name;
$characterType = $role->characterType;
$abilityText = $role->abilityText;
$createdAt = createDateString();
$ownerId = $role->ownerId;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("INSERT INTO roles (name, characterType, abilityText, createdAt, ownerId) VALUES (:name, :characterType, :abilityText, :createdAt, :ownerId)");
$statement->execute(["name" => $name, "characterType" => $characterType, "abilityText" => $abilityText, "createdAt" => $createdAt, "ownerId" => $ownerId]);
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

$statement2 = $pdo->prepare("SELECT id FROM roles WHERE ownerId = :ownerId AND createdAt = :createdAt");
$statement2->execute(["ownerId" => $ownerId, "createdAt" => $createdAt]);
$currentRoleId = $statement2->fetchColumn();

$tagArray = ["Misinformation", "Extra Death", "Protection", "Wincondition", "Character Changing", "Charactertype Modification"];

foreach ($tagArray as $tagName) {
    $statement1 = $pdo->prepare("INSERT INTO tags (name, roleId) VALUES (:name, :roleId)");
    $statement1->execute(["name" => $tagName, "roleId" => $currentRoleId]);
}

//$statement3 = $pdo->prepare("SELECT id FROM roles");
//$statement3->execute();
//$roleIds = $statement3->fetchAll(PDO::FETCH_COLUMN);
//
//foreach ($roleIds as $roleId) {
//    $statement1 = $pdo->prepare("INSERT INTO tags (name, roleId) VALUES (:name, :roleId)");
//    $statement1->execute(["name" => $tagName, "roleId" => $roleId]);
//}
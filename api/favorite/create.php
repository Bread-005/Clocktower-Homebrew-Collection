<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$favorite = json_decode(file_get_contents("php://input"));
$ownerId = $favorite->ownerId;
$roleId = $favorite->roleId;
$isFavorite = $favorite->isFavorite;

$statement2 = $pdo->prepare("SELECT COUNT(*) FROM favorites WHERE ownerId = :ownerId AND roleId = :roleId");
$statement2->execute(["ownerId" => $ownerId, "roleId" => $roleId]);
$count = $statement2->fetchColumn();

if ($count === 0) {
    $statement = $pdo->prepare("INSERT INTO favorites (ownerId, roleId) VALUES (:ownerId, :roleId)");
    $statement->execute([":ownerId" => $ownerId, ":roleId" => $roleId]);
    $isFavorite = 1;
}
if ($count === 1) {
    $isFavorite = $isFavorite === 0 ? 1 : 0;
    $statement1 = $pdo->prepare("UPDATE favorites SET isFavorite = :isFavorite WHERE ownerId = :ownerId AND roleId = :roleId");
    $statement1->execute(["ownerId" => $ownerId, "roleId" => $roleId, "isFavorite" => $isFavorite]);
}

echo $isFavorite;
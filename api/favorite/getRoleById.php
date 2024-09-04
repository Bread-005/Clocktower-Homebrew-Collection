<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$values = json_decode(file_get_contents("php://input"));
$roleId = $values->roleId;
$ownerId = $values->ownerId;

$statement = $pdo->prepare("SELECT * FROM favorites WHERE roleId = :roleId AND ownerId = :ownerId");
$statement->execute(['roleId' => $roleId, 'ownerId' => $ownerId]);
$favorite = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($favorite);
<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$role = json_decode(file_get_contents("php://input"));
$roleId = $role->id;

$statement = $pdo->prepare("SELECT * FROM ratings WHERE roleId = :roleId");
$statement->execute(['roleId' => $roleId]);
$ratings = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($ratings);
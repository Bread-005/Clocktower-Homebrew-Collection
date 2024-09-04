<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$role = json_decode(file_get_contents("php://input"));

$roleId = $role->id;
$statement = $pdo->prepare("SELECT AVG(number) FROM ratings WHERE roleId = :roleId");
$statement->execute(array('roleId' => $roleId));
$role->averageRating = $statement->fetchColumn();

echo json_encode($role);
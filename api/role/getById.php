<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$roleId = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT * FROM roles WHERE id = :id");
$statement->execute(['id' => $roleId]);
$role = $statement->fetch(PDO::FETCH_ASSOC);
echo json_encode($role);
<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$name = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT * FROM users WHERE name = :name");
$statement->execute(['name' => $name]);
$currentUser = $statement->fetch(PDO::FETCH_ASSOC);
echo json_encode($currentUser);
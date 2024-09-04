<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$name = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT id FROM users WHERE name = :name");
$statement->execute(['name' => $name]);
$id = $statement->fetchColumn();
echo $id;
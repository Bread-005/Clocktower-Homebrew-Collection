<?php
http_response_code(200);
$reminderToken = json_decode(file_get_contents("php://input"));
$name = $reminderToken->name;
$roleId = $reminderToken->roleId;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("INSERT INTO reminderToken (name, roleId) VALUES (:name, :roleId)");
$statement->execute(["name" => $name, "roleId" => $roleId]);
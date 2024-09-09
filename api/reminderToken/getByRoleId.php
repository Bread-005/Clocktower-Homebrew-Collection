<?php
http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$roleId = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT * FROM reminderToken WHERE roleId = :roleId");
$statement->execute(["roleId" => $roleId]);
$reminderTokens = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($reminderTokens);
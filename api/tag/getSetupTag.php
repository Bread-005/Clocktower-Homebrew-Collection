<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$roleId = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT COUNT(*) FROM tags WHERE roleId = :roleId AND name = 'Setup' AND isActive = 1");
$statement->execute(['roleId' => $roleId]);
$count = $statement->fetchColumn();
echo $count;
<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$roleId = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT * FROM comments WHERE roleId = :roleId");
$statement->execute(array(":roleId" => $roleId));
$comments = $statement->fetchAll();
echo json_encode($comments);
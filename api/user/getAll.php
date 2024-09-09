<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("SELECT * FROM users");
$statement->execute();
$users = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);
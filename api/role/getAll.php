<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("SELECT * FROM roles");
$statement->execute();
$roles = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($roles);
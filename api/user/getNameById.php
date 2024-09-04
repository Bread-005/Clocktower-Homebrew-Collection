<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$id = json_decode(file_get_contents("php://input"));

$statement = $pdo->prepare("SELECT name FROM users WHERE id = :id");
$statement->execute(array(":id" => $id));
echo $statement->fetchColumn();
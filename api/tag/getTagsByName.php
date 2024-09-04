<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$name = file_get_contents("php://input");
$nameString = implode(",", $name);

$statement = $pdo->prepare("SELECT * FROM tags WHERE name IN :name AND isActive = 1");
$statement->execute(['name' => $nameString]);
$tags = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($tags);
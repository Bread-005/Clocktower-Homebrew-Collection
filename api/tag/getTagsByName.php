<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$name = file_get_contents("php://input");

$statement = $pdo->prepare("SELECT * FROM tags WHERE name IN :name AND isActive = 1");
$statement->execute(['name' => $name]);
$tags = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($tags);

//$statement = $pdo->prepare("SELECT * FROM tags WHERE name IN :name AND isActive = 1");
//$statement->execute(['name' => "(" . $name . ")"]);
//$tags = $statement->fetchAll(PDO::FETCH_ASSOC);
//echo json_encode($tags);
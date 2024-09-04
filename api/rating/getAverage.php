<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$roles = json_decode(file_get_contents("php://input"));

$statement1 = $pdo->prepare("SELECT roleId, AVG(number) AS averageRating FROM ratings GROUP BY roleId");
$statement1->execute();
$test = $statement1->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($test);
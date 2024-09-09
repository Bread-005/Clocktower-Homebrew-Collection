<?php

http_response_code(200);
$roleId = json_decode(file_get_contents("php://input"));
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement1 = $pdo->prepare("SELECT * FROM jinxes WHERE roleId = :roleId");
$statement1->execute(["roleId" => $roleId]);
$jinxes = $statement1->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($jinxes);
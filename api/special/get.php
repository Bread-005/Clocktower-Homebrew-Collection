<?php
http_response_code(200);
$roleId = file_get_contents("php://input");
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("SELECT * FROM specials WHERE roleId = :roleId");
$statement->execute(["roleId" => $roleId]);
$specials = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($specials);
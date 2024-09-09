<?php

http_response_code(200);
$rating = json_decode(file_get_contents("php://input"));
$number = $rating->number;
$ownerId = $rating->ownerId;
$roleId = $rating->roleId;

$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement2 = $pdo->prepare("SELECT * FROM ratings WHERE ownerId = :ownerId AND roleId = :roleId");
$statement2->execute(array('ownerId' => $ownerId, 'roleId' => $roleId));
$alreadyRatings = $statement2->fetchAll();
foreach ($alreadyRatings as $alreadyRating) {
    if ($alreadyRating['roleId'] == $roleId && $alreadyRating['ownerId'] == $ownerId) {
        $updateStatement = $pdo->prepare("UPDATE ratings SET number = :number WHERE roleId = :roleId AND ownerId = :ownerId");
        $updateStatement->execute(array("roleId" => $roleId, "number" => $number, "ownerId" => $ownerId));
        exit();
    }
}

$statement = $pdo->prepare("INSERT INTO ratings (number, ownerId, roleId) VALUES (:number, :ownerId, :roleId)");
$statement->execute(["number" => $number, "ownerId" => $ownerId, "roleId" => $roleId]);

$statement1 = $pdo->prepare("SELECT * FROM ratings WHERE ownerId = :ownerId AND roleId = :roleId");
$statement1->execute(["ownerId" => $ownerId, "roleId" => $roleId]);
$ratings = $statement1->fetchAll();
echo json_encode($ratings);
<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$data = json_decode(file_get_contents("php://input"));
$onlyMyFavorites = $data->onlyMyFavorites;
$onlyMyIdeas = $data->onlyMyIdeas;
$ownerId = $data->ownerId;

$queryString = "SELECT * FROM favorites WHERE ownerId = :ownerId";

if ($onlyMyFavorites) {
    $queryString .= " AND isFavorite = 1";
}

$statement2 = $pdo->prepare($queryString);
$statement2->execute(["ownerId" => $ownerId]);
$favorites = $statement2->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($favorites);
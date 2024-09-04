<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$data = json_decode(file_get_contents("php://input"));
$onlyMyFavorites = $data->onlyMyFavorites;
$onlyMyIdeas = $data->onlyMyIdeas;
$ownerId = $data->ownerId;
$author = $data->author;

$queryString = "SELECT * FROM favorites WHERE ownerId = :ownerId";

//if ($author !== "") {
//    $statement1 = $pdo->prepare("SELECT id FROM users WHERE name LIKE :authorName");
//    $statement1->execute(array('authorName' => "%" . $author . "%"));
//    $userIds = $statement1->fetchAll(PDO::FETCH_ASSOC);
//    $userIdsString = implode(",", $userIds);
//
//    $statement3 = $pdo->prepare("SELECT * FROM roles WHERE IN ($userIdsString)");
//    $statement3->execute();
//    $authors = $statement3->fetchAll(PDO::FETCH_ASSOC);
//    echo "Author: " . json_encode($authors);
//}

if ($onlyMyFavorites) {
    $queryString .= " AND isFavorite = 1";
}

$statement2 = $pdo->prepare($queryString);
$statement2->execute(["ownerId" => $ownerId]);
$favorites = $statement2->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($favorites);
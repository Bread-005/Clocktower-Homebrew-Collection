<?php

http_response_code(200);
$role = json_decode(file_get_contents("php://input"));
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$id = $role->id;
$name = $role->name;
$characterType = $role->characterType;
$abilityText = $role->abilityText;
$imageUrl = $role->imageUrl;
$howToRun = $role->howToRun;
$firstNight = $role->firstNight;
$firstNightReminder = $role->firstNightReminder;
$otherNight = $role->otherNight;
$otherNightReminder = $role->otherNightReminder;
$onlyPrivateComments = $role->onlyPrivateComments;

$newRole = [
    "id" => $id,
    "name" => $name,
    "characterType" => $characterType,
    "abilityText" => $abilityText,
    "imageUrl" => $imageUrl,
    "howToRun" => $howToRun,
    "firstNight" => $firstNight,
    "firstNightReminder" => $firstNightReminder,
    "otherNight" => $otherNight,
    "otherNightReminder" => $otherNightReminder,
    "onlyPrivateComments" => $onlyPrivateComments
];

$statement1 = $pdo->prepare("UPDATE roles SET
    name = :name,
    characterType = :characterType,
    abilityText = :abilityText,
    imageUrl = :imageUrl,
    howToRun = :howToRun,
    firstNight = :firstNight,
    firstNightReminder = :firstNightReminder,
    otherNight = :otherNight,
    otherNightReminder = :otherNightReminder,
    onlyPrivateComments = :onlyPrivateComments
             WHERE id = :id");

$statement1->execute([
    "id" => $id,
    "name" => $name,
    "characterType" => $characterType,
    "abilityText" => $abilityText,
    "imageUrl" => $imageUrl,
    "howToRun" => $howToRun,
    "firstNight" => $firstNight,
    "firstNightReminder" => $firstNightReminder,
    "otherNight" => $otherNight,
    "otherNightReminder" => $otherNightReminder,
    "onlyPrivateComments" => $onlyPrivateComments
]);

echo json_encode($newRole);
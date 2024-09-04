<?php

http_response_code(200);
$role = json_decode(file_get_contents("php://input"));
$id = $role->id;
$howToRun = $role->howToRun;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("UPDATE roles SET howToRun = :howToRun WHERE id = :id");
$statement->execute(["id" => $id, "howToRun" => $howToRun]);
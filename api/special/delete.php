<?php
http_response_code(200);
$id = file_get_contents("php://input");
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("DELETE FROM specials WHERE id = :id");
$statement->execute(["id" => $id]);
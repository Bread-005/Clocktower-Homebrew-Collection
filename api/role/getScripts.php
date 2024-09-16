<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("SELECT DISTINCT(script) FROM roles");
$statement->execute();
$scripts = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($scripts);
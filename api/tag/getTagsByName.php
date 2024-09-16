<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("SELECT * FROM tags WHERE isActive = 1");
$statement->execute();
$tags = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($tags);
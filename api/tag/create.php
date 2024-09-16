<?php
http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$tag = json_decode(file_get_contents("php://input"));
$roleId = $tag->roleId;
$name = $tag->name;
$isActive = $tag->isActive;

$statement = $pdo->prepare("SELECT COUNT(*) FROM tags WHERE roleId = :roleId AND name = :name");
$statement->execute(['roleId' => $roleId, 'name' => $name]);
$count = $statement->fetchColumn();

if ($count === 0) {
    $statement = $pdo->prepare("INSERT INTO tags (roleId, name) VALUES (:roleId, :name)");
    $statement->execute(['roleId' => $roleId, 'name' => $name]);
}

if ($count === 1) {
    $statement = $pdo->prepare("UPDATE tags SET isActive = :isActive WHERE roleId = :roleId AND name = :name");
    $statement->execute(['isActive' => $isActive, 'roleId' => $roleId, 'name' => $name]);
}


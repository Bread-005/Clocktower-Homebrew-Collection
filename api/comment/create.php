<?php

http_response_code(200);
$comment = json_decode(file_get_contents("php://input"));
$text = $comment->text;
$ownerId = $comment->ownerId;
$isPrivate = $comment->isPrivate;
$roleId = $comment->roleId;

$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("INSERT INTO comments (text, ownerId, isPrivate, roleId) VALUES (:text, :ownerId, :isPrivate, :roleId)");
$statement->execute(["text" => $text, "ownerId" => $ownerId, "isPrivate" => $isPrivate, "roleId" => $roleId]);
<?php
http_response_code(200);
$user = json_decode(file_get_contents("php://input"));
$name = $user->name;
$password = password_hash($user->password, PASSWORD_BCRYPT);
$email = $user->email;
$blocked = $user->blocked;
$created_at = $user->createdAt;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$getNames = $pdo->prepare("SELECT * FROM users WHERE name = :name");
$getNames->execute(["name" => $name]);
$names = $getNames->fetchAll(PDO::FETCH_ASSOC);

foreach ($names as $userName) {
    if ($name === $userName['name'] || $email === $userName['email']) {
        http_response_code(409);
    }
}

$statement = $pdo->prepare("INSERT INTO users (name, password, email, blocked, created_at) VALUES (:name, :password, :email, :blocked, :created_at)");
$statement->execute(["name" => $name, "password" => $password, "email" => $email, "blocked" => $blocked, "created_at" => $created_at]);
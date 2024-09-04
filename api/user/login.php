<?php

http_response_code(200);
$user = json_decode(file_get_contents("php://input"));
$name = $user->name;
$password = $user->password;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$statement = $pdo->prepare("SELECT * FROM users WHERE name = :name");
$statement->execute(["name" => $name]);
$getUsers = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach ($getUsers as $user1) {
    if (password_verify($password, $user1["password"])) {
        http_response_code(200);
        exit();
    }
}

http_response_code(409);

function helloWorld()
{
    echo "Hello World";
}
<?php

http_response_code(200);
$cookie = json_decode(file_get_contents("php://input"));
$name = $cookie->name;
$password = $cookie->password;
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");

$statement = $pdo->prepare("SELECT * FROM users WHERE name = :name AND password = :password");
$statement->execute(array(":name" => $name, ":password" => $password));
$users = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach ($users as $user) {
    if ($user["name"] == $name && $user["password"] == $password) {
        http_response_code(200);
        exit();
    }
}
http_response_code(409);
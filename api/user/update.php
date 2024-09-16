<?php

http_response_code(200);
$pdo = new PDO("sqlite:../ClocktowerData.sqlite");
$user = json_decode(file_get_contents("php://input"));

$id = $user->id;
$name = $user->name;
$email = $user->email;
$roleSearch = $user->roleSearch;
$characterTypeSelection = $user->characterTypeSelection;
$sortingDropDownMenu = $user->sortingDropDownMenu;
$authorSearch = $user->authorSearch;
$tagFilterSelection = $user->tagFilterSelection;
$onlyMyIdeasCheckBox = $user->onlyMyIdeasCheckBox;
$onlyMyFavorites = $user->onlyMyFavorites;
$page = $user->page;
$scriptSelection = $user->scriptSelection;

$statement = $pdo->prepare("UPDATE users SET
            name = :name,
            email = :email,
            roleSearch = :roleSearch,
            characterTypeSelection = :characterTypeSelection,
            sortingDropDownMenu = :sortingDropDownMenu,
            authorSearch = :authorSearch,
            tagFilterSelection = :tagFilterSelection,
            onlyMyIdeasCheckBox = :onlyMyIdeasCheckBox,
            onlyMyFavorites = :onlyMyFavorites,
            page = :page,
            scriptSelection = :scriptSelection
            WHERE id = :id");

$statement->execute([
    'id' => $id,
    'name' => $name,
    'email' => $email,
    'roleSearch' => $roleSearch,
    'characterTypeSelection' => $characterTypeSelection,
    'sortingDropDownMenu' => $sortingDropDownMenu,
    'authorSearch' => $authorSearch,
    'tagFilterSelection' => $tagFilterSelection,
    'onlyMyIdeasCheckBox' => $onlyMyIdeasCheckBox,
    'onlyMyFavorites' => $onlyMyFavorites,
    'page' => $page,
    'scriptSelection' => $scriptSelection
]);
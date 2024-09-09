import {sendXMLHttpRequest} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    let page = 1;

    const currentUser = document.cookie.split(":")[0];
    let currentUserId = 1;
    sendXMLHttpRequest("POST", "/api/user/getIdByName.php", "", currentUser, function (userId) {
        currentUserId = Number.parseInt(userId);

        const allUsers = [];

        const tagCheckbox = document.getElementById("tag-checkbox");
        const tagCheckboxes = document.getElementById("tag-checkboxes");
        const authorSearch = document.getElementById("author-search");
        const onlyMyIdeasCheckBox = document.getElementById("only-my-ideas");
        const onlyMyFavoritesCheckBox = document.getElementById("only-my-favorites");

        //reminder command shift r -> zum reloaden + cache leeren

        addRole();

        const roleSearch = document.getElementById("role-search");
        const characterTypSelection = document.getElementById("character-typ-selection");
        const sortingDropDownMenu = document.getElementById("sorting");
        sortingDropDownMenu.value = "Newest first";

        displayRoles();
        getAllUsers();

        document.getElementById("username-display-main-page").append(currentUser);

        function displayRoles() {
            getRoles(function (roles) {
                filterRoles(roles, function (roles) {
                    sortRoles(roles, sortingDropDownMenu.value, function (roles) {
                        const roleIdeaArray = roles.slice((page - 1) * 10, page * 10);

                        document.getElementById("homebrewroles").innerHTML = "";

                        const table = document.createElement("table");
                        table.setAttribute("class", "border-spacing-10");

                        const tableBody = document.createElement("tbody");

                        for (const role of roleIdeaArray) {

                            const key = role["id"].toString();

                            const columnRoleIdea = document.createElement("td");
                            columnRoleIdea.setAttribute("class", "column-role-idea");
                            const columnButtons = document.createElement("td");
                            columnButtons.setAttribute("class", "column-delete-and-rate");
                            const tableRow = document.createElement("tr");

                            const list = document.createElement("li");
                            list.setAttribute("id", key);
                            list.setAttribute("class", "role-idea-list");

                            const image = document.createElement("img");
                            image.setAttribute("class", "clocktower-icon clocktower-icon-role-idea");
                            image.setAttribute("src", "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
                            if (role["imageUrl"]) {
                                image.setAttribute("src", role["imageUrl"]);
                            }
                            list.textContent = role["name"] + " (" + role["characterType"] + "): " + role["abilityText"];

                            const input = document.createElement("input");
                            input.setAttribute("id", key + "-rate-field");
                            input.setAttribute("class", "rate-field");
                            input.setAttribute("type", "number");
                            input.setAttribute("name", "rating" + key);
                            input.setAttribute("min", "0");
                            input.setAttribute("max", "10");

                            const rateButton = document.createElement("button");
                            rateButton.setAttribute("id", key + "-rate-field");
                            rateButton.setAttribute("data-key", key);

                            const rateButtonIcon = document.createElement("i");
                            rateButtonIcon.setAttribute("class", "fa-sharp fa-regular fa-star");
                            rateButtonIcon.setAttribute("data-key", key);
                            sendXMLHttpRequest("POST", "/api/rating/get.php", "", JSON.stringify(role), function (data) {

                                const rating = JSON.parse(data);

                                for (const ratingElement of rating) {
                                    if (ratingElement.ownerId === currentUserId) {
                                        if (ratingElement.number) {
                                            input.value = ratingElement.number;
                                            rateButtonIcon.setAttribute("class", "fa-solid fa-star");
                                            rateButtonIcon.setAttribute("style", "color: #FFD43B;");
                                        }
                                    }
                                }
                            });

                            const wikiButton = document.createElement("button");

                            const wikiButtonIcon = document.createElement("i");
                            wikiButtonIcon.setAttribute("class", "fa-solid fa-book");

                            const anchor = document.createElement("a");
                            anchor.setAttribute("href", "wiki.php?r=" + key);

                            const favoriteButton = document.createElement("button");
                            const favoriteIcon = document.createElement("i");
                            favoriteIcon.setAttribute("class", "fa-light fa-heart");
                            const values = {
                                ownerId: currentUserId,
                                roleId: role.id
                            }
                            sendXMLHttpRequest("POST", "/api/favorite/getRoleById.php", "", JSON.stringify(values), function (data) {
                                const favorite = JSON.parse(data);
                                if (favorite[0]) {
                                    if (favorite[0].isFavorite === 1) {
                                        favoriteIcon.setAttribute("class", "fa-solid fa-heart");
                                        favoriteIcon.classList.add("red");
                                    }
                                    if (favorite[0].isFavorite === 0) {
                                        favoriteIcon.classList.remove("red");
                                        favoriteIcon.setAttribute("class", "fa-light fa-heart");
                                    }
                                }
                            });

                            rateButton.append(rateButtonIcon);
                            wikiButton.append(wikiButtonIcon);
                            favoriteButton.append(favoriteIcon);
                            anchor.append(wikiButton);
                            list.prepend(image);
                            columnRoleIdea.append(list);
                            columnButtons.append(input);
                            columnButtons.append(rateButton);
                            columnButtons.append(anchor);
                            columnButtons.append(favoriteButton);
                            tableRow.append(columnRoleIdea);
                            tableRow.append(columnButtons);
                            tableBody.append(tableRow);
                            table.append(tableBody);
                            document.getElementById("homebrewroles").append(table);

                            rateButton.addEventListener("click", function () {
                                if (input.value === "" || input.value < 0 || input.value > 10) {
                                    return;
                                }
                                const rating = {
                                    number: Number.parseFloat(input.value),
                                    ownerId: currentUserId,
                                    roleId: role.id
                                }
                                sendXMLHttpRequest("POST", "/api/rating/create.php", "", JSON.stringify(rating), function () {
                                    displayRoles();
                                });
                            });

                            favoriteButton.addEventListener("click", function () {
                                const favorite = {
                                    ownerId: currentUserId,
                                    roleId: role.id,
                                    isFavorite: favoriteIcon.classList.contains("red") ? 1 : 0
                                }
                                sendXMLHttpRequest("POST", "/api/favorite/create.php", "", JSON.stringify(favorite), function (data) {
                                    if (data === "0") {
                                        favoriteIcon.setAttribute("class", "fa-light fa-heart");
                                        favoriteIcon.classList.remove("red");
                                    }
                                    if (data === "1") {
                                        favoriteIcon.setAttribute("class", "fa-solid fa-heart");
                                        favoriteIcon.classList.add("red");
                                    }
                                });
                            });
                        }
                        showPages(roles, roleIdeaArray);
                    });
                });
            });
        }

        sortingDropDownMenu.addEventListener("change", displayRoles);
        characterTypSelection.addEventListener("change", displayRoles);
        roleSearch.addEventListener("input", displayRoles);
        tagCheckboxes.style.display = "none";
        //document.getElementById("tag-div").style.display = "none";
        authorSearch.addEventListener("input", displayRoles);
        document.getElementById("only-my-ideas").addEventListener("change", displayRoles);
        document.getElementById("only-my-favorites").addEventListener("change", displayRoles);

        function getRoles(doneCallback) {
            sendXMLHttpRequest("POST", "/api/role/getAll.php", "", "", function (data) {
                const roles = JSON.parse(data);
                doneCallback(roles);
            });
        }

        function sortRoles(array, input, doneCallBack) {
            if (!input.includes("favorite first")) {
                if (input === "Newest first") {
                    array.reverse();
                }
                if (input.includes("Alphabet")) {
                    array.sort((a, b) => sortAlphabetically(a["name"], b["name"]));
                    if (input === "Alphabet Z-A") {
                        array.reverse();
                    }
                }
                doneCallBack(array);
                return;
            }
            sendXMLHttpRequest("POST", "/api/rating/getAverage.php", "", JSON.stringify(array), function (data) {
                const averageRatings = JSON.parse(data);

                for (const averageRating of averageRatings) {
                    for (const role of array) {
                        if (averageRating.roleId === role.id) {
                            role.averageRating = averageRating.averageRating;
                        }
                    }
                }

                for (const role of array) {
                    if (!role.averageRating) {
                        role.averageRating = 0;
                    }
                }
                array.sort((a, b) => a.averageRating - b.averageRating);

                if (input === "Most favorite first") {
                    array.reverse();
                }
                doneCallBack(array);
            });
        }

        function sortAlphabetically(a, b) {
            if (a.toUpperCase() < b.toUpperCase()) {
                return -1;
            }
            if (a.toUpperCase() > b.toUpperCase()) {
                return 1;
            }
            return 0;
        }

        function showPages(array, pageArray) {
            if (pageArray.length === 0 && page > 1) {
                page -= 1;
                displayRoles();
            }
            const pages = array.length / 10;
            if (array.length === 0) {
                document.getElementById("homebrewroles").innerHTML = "There is no role, that matches your search";
            }
            document.getElementById("role-idea-page-selection").innerHTML = "";
            for (let i = 0; i < pages; i++) {
                const button = document.createElement("button");
                button.textContent = (i + 1).toString();
                button.classList.remove("blue");
                if (page === Number.parseInt(button.textContent)) {
                    button.setAttribute("class", "blue");
                }
                button.addEventListener("click", function () {
                    page = Number.parseInt(button.textContent);
                    document.querySelectorAll(".blue").forEach(element => element.classList.remove("blue"));
                    if (page === Number.parseInt(button.textContent)) {
                        button.setAttribute("class", "blue");
                    }
                    displayRoles();
                });
                document.getElementById("role-idea-page-selection").append(button);
            }
        }

        function filterRoles(roles, doneCallBack) {
            const filter = {
                onlyMyFavorites: onlyMyFavoritesCheckBox.checked,
                onlyMyIdeas: onlyMyIdeasCheckBox.checked,
                ownerId: currentUserId
            }
            sendXMLHttpRequest("POST", "/api/role/filterFavorites.php", "", JSON.stringify(filter), function (favorites) {
                let tagString = "";
                document.querySelectorAll(".tag-filter-checkbox").forEach(element => {
                    if (element.checked) {
                        tagString += element.name + " ";
                    }
                });
                sendXMLHttpRequest("POST", "/api/tag/getTagsByName.php", "", tagString, function () {
                    if (authorSearch.value !== "") {
                        const userIds = allUsers.filter(user => user.name.toUpperCase().includes(authorSearch.value.toUpperCase())).map(user => user.id);
                        roles = roles.filter(role => userIds.includes(role.ownerId));
                    }
                    if (onlyMyFavoritesCheckBox.checked) {
                        const onlyMyFavorites = JSON.parse(favorites);
                        const favoriteRoleIds = onlyMyFavorites.map(favorite => favorite.roleId);
                        roles = roles.filter(role => favoriteRoleIds.includes(role.id));
                    }
                    if (onlyMyIdeasCheckBox.checked) {
                        roles = roles.filter(role => role.ownerId === currentUserId);
                    }
                    if (characterTypSelection.value !== "All") {
                        roles = roles.filter(role => role.characterType === characterTypSelection.value);
                    }
                    if (roleSearch.value !== "") {
                        roles = roles.filter(role =>
                            role.name.toUpperCase().includes(roleSearch.value.toUpperCase()) ||
                            role.characterType.toUpperCase().includes(roleSearch.value.toUpperCase()) ||
                            role.abilityText.toUpperCase().includes(roleSearch.value.toUpperCase()));
                    }
                    doneCallBack(roles);
                });
            });
        }

        document.getElementById("logout").addEventListener("click", function (event) {
            event.preventDefault();
            document.cookie = "abdgetevqhjhbjarjaor10298ujka8954rfvjutreewqadhklknvxdrz1e";
            window.location = "index.php";
        });

        function addRole() {
            document.getElementById("js-add-role").addEventListener("click", function (event) {
                event.preventDefault();
                const roleNameInput = document.getElementById("role-name");
                const characterTypeInput = document.getElementById("character-types");
                const abilityTextInput = document.getElementById("ability-text");
                if (roleNameInput.value === "" || characterTypeInput.value === "" || abilityTextInput.value === "") {
                    return;
                }

                const role = {
                    name: roleNameInput.value,
                    characterType: characterTypeInput.value,
                    abilityText: abilityTextInput.value,
                    createdAt: Date.now().toString(),
                    ownerId: currentUserId
                }
                sendXMLHttpRequest("POST", "/api/role/create.php", "", JSON.stringify(role), function () {
                    roleNameInput.value = "";
                    abilityTextInput.value = "";
                    displayRoles();
                });
            });
        }

        tagCheckbox.addEventListener("click", function () {
            if (tagCheckbox.checked) {
                tagCheckboxes.style.display = "flex";
            }
            if (!tagCheckbox.checked) {
                tagCheckboxes.style.display = "none";
            }
        });

        document.querySelectorAll(".tag-filter-checkbox").forEach(element => element.addEventListener("click", displayRoles));

        function getAllUsers() {
            sendXMLHttpRequest("POST", "/api/user/getAll.php", "", "", function (data) {
                const users = JSON.parse(data);
                for (const user of users) {
                    allUsers.push(user);
                }
            });
        }
    });
});
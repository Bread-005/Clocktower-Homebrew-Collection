document.addEventListener("DOMContentLoaded",function () {
    const searchParameters = new URLSearchParams(window.location.search);
    const key = searchParameters.get("r");
    let role;
    const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));
    const roleIdeas = websiteStorage["roleIdeas"];
    for (let i = 0; i < roleIdeas.length; i++) {
        if (roleIdeas[i]["key"] === key) {
            role = roleIdeas[i];
        }
    }
    const websiteStorageString = "websiteStorage1";
    role["inEditMode"] = false;

    document.getElementById("edit-role-field").style.display = "none";

    if (role["image"] !== "") {
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    }

    const currentUser = document.cookie.split(":")[0];

    displayRole();
    if (currentUser !== role.owner) {
        document.getElementById("edit-button").style.display = "none";
    }
    document.getElementById("username-display-wiki-page").append(currentUser);

    const personalRoleRating = document.getElementById("personal-role-rating");
    for (let i = 0; i < role["rating"].length; i++) {
        if (role["rating"][i]["owner"] === currentUser) {
            personalRoleRating.textContent = "Your rating: ";
            if (role["rating"][i]["rating"] === undefined) {
                personalRoleRating.textContent = "You have not rated this role";
            }
            displayRating(i,personalRoleRating);
        }
    }
    const averageRoleRating = document.getElementById("average-role-rating");
    averageRoleRating.textContent = "Average Rating: ";
    let ratingSum = 0.0;
    for (let i = 0; i < role.rating.length; i++) {
        ratingSum += Number.parseFloat(role.rating[i].rating);
    }
    const averageRating = ratingSum / role.rating.length;
    let yellowStarCount = Math.round(averageRating);
    let grayStarCount = 10 - yellowStarCount;
    for (let i = 0; i < yellowStarCount; i++) {
        const yellowStarIcon = document.createElement("i");
        yellowStarIcon.setAttribute("class", "fa-solid fa-star");
        yellowStarIcon.setAttribute("style","color: #FFD43B");
        averageRoleRating.append(yellowStarIcon);
    }
    for (let i = 0; i < grayStarCount; i++) {
        const grayStarIcon = document.createElement("i");
        grayStarIcon.setAttribute("class", "fa-regular fa-star");
        averageRoleRating.append(grayStarIcon);
    }
    averageRoleRating.append(" " + averageRating.toFixed(2) + "/10");

    if (role["rating"].length === 0) {
        averageRoleRating.textContent = "Nobody rated this role so far";
    }

    const howToRunInput = document.getElementById("howtorun-input");
    howToRunInput.value = role["howtorun"] ?? '';

    const howToRunChangeButton = document.getElementById("howtorun-button");

    document.getElementById("howtorun-text").innerHTML = role["howtorun"];

    const inputComment = document.getElementById("input-comment");

    howToRunInput.style.display = "none";
    howToRunChangeButton.style.display = "none";
    const imageSubmission = document.getElementById("image-submission");
    imageSubmission.style.display = "none";

    displayComments();

    const howToRunText = document.getElementById("howtorun-text");

    const deleteRoleDiv = document.getElementById("delete-role-div");
    deleteRoleDiv.style.display = "none";

    const deleteConfirmationYesButton = document.getElementById("delete-confirmation-yes-button");
    const deleteConfirmationCancelButton = document.getElementById("delete-confirmation-cancel-button");

    const deletePopupBackground = document.getElementById("delete-popup-background");
    deletePopupBackground.style.display = "none";

    howToRunChangeButton.addEventListener("click", function (event) {
        event.preventDefault();
        const input = document.getElementById("howtorun-input");
        howToRunText.textContent = input.value;
        role["howtorun"] = howToRunText.textContent;
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
    });

    document.getElementById("upload-button").addEventListener("click", function (event) {
        event.preventDefault();
        const uploadImage = document.getElementById("image-input-file");
        const uploadImageURL = document.getElementById("image-input-url");
        let imageString = "";
        if (uploadImageURL.value !== "") {
            imageString = uploadImageURL.value;
            uploadImageURL.value = "";
        }
        if (uploadImage.value !== "") {
            imageString = uploadImage.value.replace("C:\\fakepath\\", "");
            uploadImage.value = "";
        }
        if (imageString === "") {
            return;
        }
        for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
            if (websiteStorage.roleIdeas[i].key === key) {
                websiteStorage.roleIdeas[i].image = imageString;
            }
        }
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    });

    document.getElementById("comment-button").addEventListener("click", function (event) {
        event.preventDefault();
        if (inputComment.value === "") {
            return;
        }
        const commentKey = Date.now().toString();

        const comment = {
            message: inputComment.value,
            key: commentKey,
            owner: currentUser
        }
        for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
            if (websiteStorage.roleIdeas[i].key === key) {
                websiteStorage.roleIdeas[i].comments.push(comment);
            }
        }
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        inputComment.value = "";
        displayComments();
    });

    const editRoleNameInput = document.getElementById("edit-role-name");
    const editCharacterTypeInput = document.getElementById("edit-character-type");
    const editAbilityTextInput = document.getElementById("edit-ability-text");

    document.getElementById("edit-button").addEventListener("click",function (event) {
        event.preventDefault();
        role["inEditMode"] = !role["inEditMode"];

        if (role["inEditMode"]) {
            document.getElementById("edit-role-field").style.display = "flex";
            editRoleNameInput.value = role["name"];
            editCharacterTypeInput.value = role["characterType"];
            editAbilityTextInput.value = role["abilityText"];

            howToRunInput.style.display = "block";
            howToRunChangeButton.style.display = "block";

            imageSubmission.style.display = "block";

            deleteRoleDiv.style.display = "flex";
        }
        if (!role["inEditMode"]) {
            document.getElementById("edit-role-field").style.display = "none";
            howToRunInput.style.display = "none";
            howToRunChangeButton.style.display = "none";
            imageSubmission.style.display = "none";
            deleteRoleDiv.style.display = "none";
        }
    });

    document.getElementById("submit-edit-role-button").addEventListener("click",function (event) {
        event.preventDefault();
        if (editRoleNameInput.value === "" || editCharacterTypeInput.value === "" || editAbilityTextInput.value === "") {
            return;
        }
        role["name"] = editRoleNameInput.value;
        role["characterType"] = editCharacterTypeInput.value;
        role["abilityText"] = editAbilityTextInput.value;
        localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
        displayRole();
    });

    document.getElementById("delete-role-button").addEventListener("click",function (event) {
        event.preventDefault();
        deletePopupBackground.style.display = "flex";
    });

    deleteConfirmationYesButton.addEventListener("click",function (event) {
        event.preventDefault();
        for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
            if (websiteStorage.roleIdeas[i].key === key) {
                websiteStorage.roleIdeas.splice(i,1);
            }
        }
        localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
        window.location = "index.html";
    });

    deleteConfirmationCancelButton.addEventListener("click",function () {
        deletePopupBackground.style.display = "none";
    });

    function displayComments() {
        document.getElementById("comments-list").innerHTML = "";
        for (let i = 0; i < role["comments"].length; i++) {
            const list = document.createElement("li");
            list.setAttribute("class","max-width comment");
            list.textContent = role["comments"][i]["message"];
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "icon-button");
            deleteButton.setAttribute("data-key", role["comments"][i]["key"]);

            const deleteButtonIcon = document.createElement("i");
            deleteButtonIcon.setAttribute("class", "js-delete-button fa-solid fa-trash");
            deleteButtonIcon.setAttribute("data-key", role["comments"][i]["key"]);

            if (role["comments"][i].owner === currentUser || role.owner === currentUser) {
                deleteButton.append(deleteButtonIcon);
                list.append(deleteButton);
            }
            document.getElementById("comments-list").append(list);

            deleteButton.addEventListener("click", function () {
                role["comments"].splice(i, 1);
                localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
                displayComments();
            });
        }
    }

    function displayRole() {
        document.getElementById("role-name").textContent = role["name"];
        document.getElementById("character-type").textContent = "Charactertype: " + role["characterType"];
        document.getElementById("ability-text").textContent = "Ability: " + role["abilityText"];
    }

    function displayRating(index,htmlElement) {
        let yellowStarCount = Math.round(Number.parseInt(role["rating"][index]["rating"]));
        let grayStarCount = 10 - yellowStarCount;
        for (let i = 0; i < yellowStarCount; i++) {
            const yellowStarIcon = document.createElement("i");
            yellowStarIcon.setAttribute("class", "fa-solid fa-star");
            yellowStarIcon.setAttribute("style","color: #FFD43B");
            htmlElement.append(yellowStarIcon);
        }
        for (let i = 0; i < grayStarCount; i++) {
            const grayStarIcon = document.createElement("i");
            grayStarIcon.setAttribute("class", "fa-regular fa-star");
            htmlElement.append(grayStarIcon);
        }
        if (role["rating"][index]["rating"] !== undefined) {
            htmlElement.append(" " + role["rating"][index]["rating"] + "/10");
        }
    }
})
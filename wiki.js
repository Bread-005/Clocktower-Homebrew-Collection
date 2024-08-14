document.addEventListener("DOMContentLoaded",function () {
    const searchParameters = new URLSearchParams(window.location.search);
    const key = searchParameters.get("r");
    let role;
    let roleIndex;
    const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));
    const roleIdeas = websiteStorage["roleIdeas"];
    for (let i = 0; i < roleIdeas.length; i++) {
        if (roleIdeas[i]["key"] === key) {
            role = roleIdeas[i];
            roleIndex = i;
        }
    }
    const websiteStorageString = "websiteStorage1";
    role["inEditMode"] = false;

    const uploadButton = document.getElementById("upload-button");

    if (role["image"] !== "") {
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    }

    displayRole();
    if (document.cookie.split(":")[0] !== role.owner) {
        document.getElementById("edit-button").style.display = "none";
    }
    document.getElementById("username-display-wiki-page").append(document.cookie.split(":")[0]);

    const personalRoleRating = document.getElementById("personal-role-rating");
    for (let i = 0; i < role["rating"].length; i++) {
        if (role["rating"][i]["owner"] === document.cookie.split(":")[0]) {
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

    document.getElementById("edit-role-field").style.display = "none";

    howToRunChangeButton.addEventListener("click", function (event) {
        event.preventDefault();
        const input = document.getElementById("howtorun-input");
        howToRunText.textContent = input.value;
        role["howtorun"] = howToRunText.textContent;
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
    });

    uploadButton.addEventListener("click", function (event) {
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
        websiteStorage["roleIdeas"][roleIndex]["image"] = imageString;
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    });

    document.getElementById("comment-button").addEventListener("click", function (event) {
        event.preventDefault();
        if (inputComment.value === "") {
            return;
        }
        if (inputComment.value.includes("beleidigung")) {
            inputComment.value = "";
            return;
        }
        const commentKey = Date.now().toString();

        const comment = {
            message: inputComment.value,
            key: commentKey,
            owner: document.cookie.split(":")[0]
        }
        websiteStorage["roleIdeas"][roleIndex]["comments"].push(comment);
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
            //edit role text etc
            document.getElementById("edit-role-field").style.display = "flex";
            editRoleNameInput.value = role["name"];
            editCharacterTypeInput.value = role["characterType"];
            editAbilityTextInput.value = role["abilityText"];

            //edit How to Run
            howToRunInput.style.display = "block";
            howToRunChangeButton.style.display = "block";

            //image submission
            imageSubmission.style.display = "block";
        }
        if (!role["inEditMode"]) {
            document.getElementById("edit-role-field").style.display = "none";
            howToRunInput.style.display = "none";
            howToRunChangeButton.style.display = "none";
            imageSubmission.style.display = "none";
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

            if (role["comments"][i].owner === document.cookie.split(":")[0] || role.owner === document.cookie.split(":")[0]) {
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
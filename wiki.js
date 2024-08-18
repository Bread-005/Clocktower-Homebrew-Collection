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
    document.title = role.name;

    const websiteStorageString = "websiteStorage1";
    role["inEditMode"] = false;

    const tagDisplay = document.getElementById("tag-display");
    const editTags = document.getElementById("edit-tags");
    editTags.style.display = "none";
    showTags();
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
            displayRating(i, personalRoleRating);
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
        yellowStarIcon.setAttribute("style", "color: #FFD43B");
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

    showNightOrder();
    document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "none");

    const howToRunText = document.getElementById("howtorun-text");

    document.getElementById("private-comments-checkbox-div").style.display = "none";
    displayComments();

    const deleteRoleDiv = document.getElementById("delete-role-div");
    deleteRoleDiv.style.display = "none";

    const deleteConfirmationYesButton = document.getElementById("delete-confirmation-yes-button");
    const deleteConfirmationCancelButton = document.getElementById("delete-confirmation-cancel-button");

    const deletePopupBackground = document.getElementById("delete-popup-background");
    deletePopupBackground.style.display = "none";

    document.getElementById("edit-button").addEventListener("click", function (event) {
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

            document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "flex");
            document.getElementById("edit-night-order-text").style.display = "none";
            document.getElementById("first-night-input").value = role.firstNight;
            document.getElementById("first-night-reminder-input").value = role.firstNightReminder;
            document.getElementById("other-night-input").value = role.otherNight;
            document.getElementById("other-night-reminder-input").value = role.otherNightReminder;
            resetNightOrderTexts();

            if (role.onlyPrivateComments) {
                document.getElementById("only-private-comments-checkbox-input").checked = true;
            }
            document.getElementById("private-comments-checkbox-div").style.display = "flex";

            editTags.style.display = "flex";
            document.querySelectorAll(".tag").forEach(element => {
                if (role.tags.includes(element.name)) {
                    element.checked = true;
                }
            });
        }
        if (!role["inEditMode"]) {
            document.getElementById("edit-role-field").style.display = "none";
            howToRunInput.style.display = "none";
            howToRunChangeButton.style.display = "none";
            imageSubmission.style.display = "none";
            deleteRoleDiv.style.display = "none";
            document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "none");
            showNightOrder();
            document.getElementById("private-comments-checkbox-div").style.display = "none";
            editTags.style.display = "none";
        }
    });

    document.getElementById("upload-button").addEventListener("click", function (event) {
        event.preventDefault();
        const uploadImageURL = document.getElementById("image-input-url");
        if (uploadImageURL.value === "") {
            return;
        }
        for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
            if (websiteStorage.roleIdeas[i].key === key) {
                websiteStorage.roleIdeas[i].image = uploadImageURL.value;
            }
        }
        uploadImageURL.value = "";
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    });

    document.querySelectorAll(".tag").forEach(element => element.addEventListener("change", function () {
        role.tags = [];
        document.querySelectorAll(".tag").forEach(element => {
            if (element.checked) {
                role.tags.push(element.name);
            }
        });
        localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
        showTags();
    }));

    document.getElementById("edit-night-order-button").addEventListener("click", function (event) {
        event.preventDefault();
        const nightOrderText = document.getElementById("edit-night-order-text");
        nightOrderText.style.display = "flex";
        if (document.getElementById("first-night-input").value === "") {
            document.getElementById("first-night-input").value = 0;
        }
        if (document.getElementById("other-night-input").value === "") {
            document.getElementById("other-night-input").value = 0;
        }
        if (isNaN(document.getElementById("first-night-input").value)) {
            nightOrderText.textContent = "firstNight has to be a number e.g.: 12.6";
            return;
        }
        if (isNaN(document.getElementById("other-night-input").value)) {
            nightOrderText.textContent = "otherNight has to be a number e.g.: 16.4";
            return;
        }
        nightOrderText.style.display = "none";
        for (const role of websiteStorage.roleIdeas) {
            if (role.key === key) {
                role.firstNight = Number.parseFloat(document.getElementById("first-night-input").value);
                role.firstNightReminder = document.getElementById("first-night-reminder-input").value;
                role.otherNight = Number.parseFloat(document.getElementById("other-night-input").value);
                role.otherNightReminder = document.getElementById("other-night-reminder-input").value;
                localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
                resetNightOrderTexts();
            }
        }
    });

    howToRunChangeButton.addEventListener("click", function (event) {
        event.preventDefault();
        const input = document.getElementById("howtorun-input");
        howToRunText.textContent = input.value;
        role["howtorun"] = howToRunText.textContent;
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
    });

    document.getElementById("add-public-comment-button").addEventListener("click", function (event) {
        event.preventDefault();
        addComment(false);
    });
    document.getElementById("add-private-comment-button").addEventListener("click",function (event) {
        event.preventDefault();
        addComment(true);
    });

    const editRoleNameInput = document.getElementById("edit-role-name");
    const editCharacterTypeInput = document.getElementById("edit-character-type");
    const editAbilityTextInput = document.getElementById("edit-ability-text");

    document.getElementById("submit-edit-role-button").addEventListener("click", function (event) {
        event.preventDefault();
        if (editRoleNameInput.value === "" || editCharacterTypeInput.value === "" || editAbilityTextInput.value === "") {
            return;
        }
        role["name"] = editRoleNameInput.value;
        role["characterType"] = editCharacterTypeInput.value;
        role["abilityText"] = editAbilityTextInput.value;
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        displayRole();
    });

    const downloadJsonButton = document.getElementById("download-json-button");
    downloadJsonButton.addEventListener("click", function () {
        const jsonRole = {
            id: role.name.toLowerCase().replace(" ", "_"),
            name: role.name,
            ability: role.abilityText,
            team: role.characterType,
            image: role.image
        }
        if (role.firstNight !== 0) {
            jsonRole.firstNight = role.firstNight;
        }
        if (role.firstNightReminder !== "") {
            jsonRole.firstNightReminder = role.firstNightReminder;
        }
        if (role.otherNight !== 0) {
            jsonRole.otherNight = role.otherNight;
        }
        if (role.otherNightReminder !== "") {
            jsonRole.otherNightReminder = role.otherNightReminder;
        }
        const jsonString = JSON.stringify(jsonRole).replace("{", "{\n    ").replaceAll('",', '",\n    ').replace("}", "\n}");
        navigator.clipboard.writeText(jsonString);
    });

    document.getElementById("delete-role-button").addEventListener("click", function (event) {
        event.preventDefault();
        deletePopupBackground.style.display = "flex";
    });

    deleteConfirmationYesButton.addEventListener("click", function (event) {
        event.preventDefault();
        for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
            if (websiteStorage.roleIdeas[i].key === key) {
                websiteStorage.archive.push(websiteStorage.roleIdeas[i]);
                websiteStorage.roleIdeas.splice(i, 1);
            }
        }
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        window.location = "role_idea.html";
    });

    deleteConfirmationCancelButton.addEventListener("click", function () {
        deletePopupBackground.style.display = "none";
    });

    function displayComments() {
        document.getElementById("comments-list").innerHTML = "";
        if (role.owner !== currentUser || !role.inEditMode) {
            document.getElementById("private-comments-checkbox-div").style.display = "none";
        }
        if (role.onlyPrivateComments) {
            document.getElementById("add-public-comment-button").style.display = "none";
        }
        for (const comment of role.comments) {
            if (comment.isPrivate && currentUser !== role.owner && currentUser !== comment.owner) {
                continue;
            }
            const list = document.createElement("li");
            list.setAttribute("class", "max-width comment");
            list.textContent = comment.message;
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "icon-button");
            deleteButton.setAttribute("data-key", comment["key"]);

            const deleteButtonIcon = document.createElement("i");
            deleteButtonIcon.setAttribute("class", "js-delete-button fa-solid fa-trash");
            deleteButtonIcon.setAttribute("data-key", comment["key"]);

            if (comment.owner === currentUser || role.owner === currentUser) {
                deleteButton.append(deleteButtonIcon);
                list.append(deleteButton);
            }
            document.getElementById("comments-list").append(list);

            deleteButton.addEventListener("click", function () {
                for (let i = 0; i < role.comments.length; i++) {
                    if (role.comments[i].key === deleteButton.getAttribute("data-key")) {
                        role.comments.splice(i, 1);
                        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
                        displayComments();
                        break;
                    }
                }
            });
        }
    }

    function displayRole() {
        document.getElementById("role-name").textContent = role["name"];
        document.getElementById("character-type").textContent = "Charactertype: " + role["characterType"];
        document.getElementById("ability-text").textContent = "Ability: " + role["abilityText"];
        document.getElementById("credits-text").textContent = "Created by " + role.owner;
    }

    function displayRating(index, htmlElement) {
        let yellowStarCount = Math.round(Number.parseInt(role["rating"][index]["rating"]));
        let grayStarCount = 10 - yellowStarCount;
        for (let i = 0; i < yellowStarCount; i++) {
            const yellowStarIcon = document.createElement("i");
            yellowStarIcon.setAttribute("class", "fa-solid fa-star");
            yellowStarIcon.setAttribute("style", "color: #FFD43B");
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

    function showNightOrder() {
        document.getElementById("first-night").textContent = "firstNight: " + role.firstNight;
        document.getElementById("first-night-reminder").textContent = "firstNightReminder: " + role.firstNightReminder;
        document.getElementById("other-night").textContent = "otherNight: " + role.otherNight;
        document.getElementById("other-night-reminder").textContent = "otherNightReminder: " + role.otherNightReminder;
    }

    function resetNightOrderTexts() {
        document.getElementById("first-night").textContent = "firstNight: ";
        document.getElementById("first-night-reminder").textContent = "firstNightReminder: ";
        document.getElementById("other-night").textContent = "otherNight: ";
        document.getElementById("other-night-reminder").textContent = "otherNightReminder: ";
    }

    document.getElementById("only-private-comments-checkbox-input").addEventListener("click",function () {
       role.onlyPrivateComments = !role.onlyPrivateComments;
       localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
       document.getElementById("add-public-comment-button").style.display = "flex";
       displayComments();
    });

    function addComment(isPrivate) {
        if (inputComment.value === "") {
            return;
        }
        const commentKey = Date.now().toString();

        const comment = {
            message: inputComment.value,
            key: commentKey,
            owner: currentUser,
            isPrivate: isPrivate
        }
        for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
            if (websiteStorage.roleIdeas[i].key === key) {
                websiteStorage.roleIdeas[i].comments.push(comment);
            }
        }
        localStorage.setItem(websiteStorageString, JSON.stringify(websiteStorage));
        inputComment.value = "";
        displayComments();
    }

    function showTags() {
        tagDisplay.textContent = "Tags: ";
        for (let i = 0; i < role.tags.length; i++) {
            tagDisplay.textContent = tagDisplay.textContent.concat(role.tags[i]);
            if (i < role.tags.length - 1) {
                tagDisplay.textContent = tagDisplay.textContent.concat(", ");
            }
        }
    }
});
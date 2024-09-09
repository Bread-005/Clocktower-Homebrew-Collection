import {sendXMLHttpRequest} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    const searchParameters = new URLSearchParams(window.location.search);
    const id = searchParameters.get("r");

    sendXMLHttpRequest("POST", "/api/role/getById.php", "", id, function (data) {

        const currentUser = document.cookie.split(":")[0];
        let currentUserId = 1;
        sendXMLHttpRequest("POST", "/api/user/getIdByName.php", "", currentUser, function (userId) {

            const imageSubmission = document.getElementById("image-submission");
            const editRoleNameInput = document.getElementById("edit-role-name");
            const editCharacterTypeInput = document.getElementById("edit-character-type");
            const editAbilityTextInput = document.getElementById("edit-ability-text");
            const tagDisplay = document.getElementById("tag-display");
            const editTags = document.getElementById("edit-tags");
            const firstNightInput = document.getElementById("first-night-input");
            const firstNightInfoButton = document.getElementById("first-night-info-button");
            const firstNightInfoText = document.getElementById("first-night-info-text");
            const firstNightReminderInput = document.getElementById("first-night-reminder-input");
            const otherNightInput = document.getElementById("other-night-input");
            const otherNightInfoButton = document.getElementById("other-night-info-button");
            const otherNightInfoText = document.getElementById("other-night-info-text");
            const otherNightReminderInput = document.getElementById("other-night-reminder-input");
            const nightOrderText = document.getElementById("edit-night-order-text");
            const howToRunText = document.getElementById("howtorun-text");
            const howToRunInput = document.getElementById("howtorun-input");
            const howToRunChangeButton = document.getElementById("howtorun-button");
            const jinxRoleInput = document.getElementById("jinx-role-input");
            const jinxTextInput = document.getElementById("jinx-text-input");
            const jinxAddButton = document.getElementById("jinx-add-button");
            const jinxEditDiv = document.getElementById("jinx-edit-div");
            const jinxList = document.getElementById("jinx-display");
            const reminderTokenAddButton = document.getElementById("reminder-token-add-button");
            const reminderTokenInput = document.getElementById("reminder-token-input");
            const editReminderTokenDiv = document.getElementById("edit-reminder-token-div");
            const reminderTokenList = document.getElementById("reminder-token-list");
            const personalRoleRating = document.getElementById("personal-role-rating");
            const averageRoleRating = document.getElementById("average-role-rating");
            const inputComment = document.getElementById("input-comment");
            const addPublicCommentButton = document.getElementById("add-public-comment-button");
            const addPrivateCommentButton = document.getElementById("add-private-comment-button");
            const onlyPrivateCommentsCheckBox = document.getElementById("only-private-comments-checkbox-input");
            const downloadJsonButton = document.getElementById("download-json-button");
            const deleteRoleDiv = document.getElementById("delete-role-div");
            const deleteConfirmationYesButton = document.getElementById("delete-confirmation-yes-button");
            const deleteConfirmationCancelButton = document.getElementById("delete-confirmation-cancel-button");
            const deletePopupBackground = document.getElementById("delete-popup-background");

            currentUserId = Number.parseInt(userId);
            const role = JSON.parse(data);
            document.title = role.name;
            let inEditMode = false;

            if (role.imageUrl !== "") {
                document.getElementById("wiki-role-image").setAttribute("src", role.imageUrl);
            }

            if (currentUserId !== role.ownerId) {
                document.getElementById("edit-button").style.display = "none";
            }
            document.getElementById("username-display-wiki-page").append(currentUser);

            hideEditStuff();
            toggleEditMode();
            changeImage();
            displayRole();
            editMainRole();
            showTags();
            showNightOrder();
            changeTags();
            editNightOrder();
            editHowToRun();
            howToRunInput.value = role.howToRun;
            document.getElementById("howtorun-text").innerHTML = role.howToRun;
            showJinxes();
            editJinxes();
            showReminderTokens();
            editReminderTokens();
            showPersonalRating();
            showAverageRating();
            displayComments();
            addComments();
            copyJsonString();
            deleteRoleListener();

            function displayComments() {
                sendXMLHttpRequest("POST", "/api/comment/get.php", "", role.id, function (data) {

                    document.getElementById("comments-list").innerHTML = "";
                    if (role.ownerId !== currentUserId || !inEditMode) {
                        document.getElementById("private-comments-checkbox-div").style.display = "none";
                    }
                    if (role.onlyPrivateComments === 1) {
                        addPublicCommentButton.style.display = "none";
                    }
                    if (role.onlyPrivateComments === 0) {
                        addPublicCommentButton.style.display = "flex";
                    }

                    const comments = JSON.parse(data);
                    for (const comment of comments) {
                        if (comment.isPrivate === 1 && role.ownerId !== currentUserId && comment.ownerId !== currentUserId) {
                            continue;
                        }
                        const list = document.createElement("li");
                        list.setAttribute("class", "max-width comment");
                        list.textContent = comment.text + (comment.isPrivate === 1 ? " (private)" : "");
                        const deleteButton = document.createElement("button");
                        deleteButton.setAttribute("class", "icon-button");
                        deleteButton.setAttribute("data-key", comment.id);

                        const deleteButtonIcon = document.createElement("i");
                        deleteButtonIcon.setAttribute("class", "js-delete-button fa-solid fa-trash");
                        deleteButtonIcon.setAttribute("data-key", comment.id);

                        if (comment.ownerId === currentUserId || role.ownerId === currentUserId) {
                            deleteButton.append(deleteButtonIcon);
                            list.append(deleteButton);
                        }
                        document.getElementById("comments-list").append(list);

                        deleteButton.addEventListener("click", function () {
                            sendXMLHttpRequest("POST", "/api/comment/delete.php", "", comment.id, function () {
                                displayComments();
                            });
                        });
                    }
                });
            }

            function displayRole() {
                sendXMLHttpRequest("POST", "/api/user/getNameById.php", "", role.ownerId, function (name) {
                    document.getElementById("role-name").textContent = role.name;
                    document.getElementById("character-type").textContent = "Charactertype: " + role.characterType;
                    document.getElementById("ability-text").textContent = "Ability: " + role.abilityText;
                    document.getElementById("credits-text").textContent = "Created by " + name;
                });
            }

            function showNightOrder() {
                document.getElementById("first-night").textContent = "firstNight: " + role.firstNight;
                document.getElementById("first-night-reminder").textContent = "firstNightReminder: " + role.firstNightReminder;
                document.getElementById("other-night").textContent = "otherNight: " + role.otherNight;
                document.getElementById("other-night-reminder").textContent = "otherNightReminder: " + role.otherNightReminder;
            }

            onlyPrivateCommentsCheckBox.addEventListener("click", function () {
                role.onlyPrivateComments = role.onlyPrivateComments === 0 ? 1 : 0;
                sendXMLHttpRequest("POST", "/api/role/update.php", "", JSON.stringify(role), function () {
                    displayComments();
                });
            });

            function showTags() {
                sendXMLHttpRequest("POST", "/api/tag/getTagsByRoleId.php", "", role.id, function (data) {
                    const tags = JSON.parse(data);
                    if (tags.length === 0) {
                        return;
                    }
                    tagDisplay.textContent = "Tags: ";
                    const activeTags = [];
                    for (const tag of tags) {
                        if (tag.isActive) {
                            activeTags.push(tag);
                        }
                    }
                    for (let i = 0; i < activeTags.length; i++) {
                        tagDisplay.textContent += activeTags[i].name;
                        document.getElementById(activeTags[i].name.replace(" ", "-").toLowerCase() + "-tag").checked = true;
                        if (i < activeTags.length - 1) {
                            tagDisplay.textContent += ", ";
                        }
                    }
                });
            }

            firstNightInfoButton.addEventListener("click", function () {

                if (firstNightInfoText.style.display === "flex") {
                    firstNightInfoText.style.display = "none";
                } else {
                    firstNightInfoText.style.display = "flex";
                }
            });

            otherNightInfoButton.addEventListener("click", function () {
                if (otherNightInfoText.style.display === "flex") {
                    otherNightInfoText.style.display = "none";
                } else {
                    otherNightInfoText.style.display = "flex";
                }
            });

            function showPersonalRating() {
                sendXMLHttpRequest("POST", "/api/rating/get.php", "", JSON.stringify(role), function (data) {
                    const ratings = JSON.parse(data);
                    personalRoleRating.textContent = "You have not rated this role";
                    for (const rating of ratings) {
                        if (rating.ownerId === currentUserId) {
                            personalRoleRating.textContent = "Your rating: " + rating.number;
                        }
                    }
                });
            }

            function showAverageRating() {
                sendXMLHttpRequest("POST", "/api/rating/getAverageByRole.php", "", JSON.stringify(role), function (data) {
                    const role1 = JSON.parse(data);
                    averageRoleRating.textContent = "Nobody rated this role so far";
                    if (role1.averageRating) {
                        averageRoleRating.textContent = "Average Rating: ";
                        const yellowStarCount = Math.round(role1.averageRating);
                        const grayStarCount = 10 - yellowStarCount;
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
                        averageRoleRating.append(" " + role1.averageRating.toFixed(2) + "/10");
                    }
                });
            }

            function toggleEditMode() {
                document.getElementById("edit-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    inEditMode = !inEditMode;

                    if (inEditMode) {
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
                        showNightOrder();

                        if (role.onlyPrivateComments === 1) {
                            onlyPrivateCommentsCheckBox.checked = true;
                        }
                        document.getElementById("private-comments-checkbox-div").style.display = "flex";

                        editTags.style.display = "flex";
                        showTags();
                        firstNightInfoButton.style.display = "flex";
                        otherNightInfoButton.style.display = "flex";
                        jinxEditDiv.style.display = "flex";
                        showJinxes();
                        editReminderTokenDiv.style.display = "flex";
                    }
                    if (!inEditMode) {
                        hideEditStuff();
                        showNightOrder();
                        showJinxes();
                    }
                });
            }

            function changeImage() {
                document.getElementById("upload-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    const uploadImageURL = document.getElementById("image-input-url");
                    if (uploadImageURL.value === "") {
                        return;
                    }
                    role.imageUrl = uploadImageURL.value;
                    document.getElementById("wiki-role-image").setAttribute("src", uploadImageURL.value);
                    uploadImageURL.value = "";
                    sendXMLHttpRequest("POST", "/api/role/update.php", "", JSON.stringify(role));
                });
            }

            function editNightOrder() {
                document.getElementById("edit-night-order-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    nightOrderText.style.display = "flex";
                    if (firstNightInput.value === "") {
                        firstNightInput.value = 0;
                    }
                    if (otherNightInput.value === "") {
                        otherNightInput.value = 0;
                    }
                    if (isNaN(firstNightInput.value)) {
                        nightOrderText.textContent = "firstNight has to be a number e.g.: 12.6";
                        return;
                    }
                    if (isNaN(otherNightInput.value)) {
                        nightOrderText.textContent = "otherNight has to be a number e.g.: 16.4";
                        return;
                    }
                    nightOrderText.style.display = "none";
                    role.firstNight = Number.parseFloat(firstNightInput.value);
                    role.firstNightReminder = firstNightReminderInput.value;
                    role.otherNight = Number.parseFloat(otherNightInput.value);
                    role.otherNightReminder = otherNightReminderInput.value;
                    sendXMLHttpRequest("POST", "/api/role/update.php", "", JSON.stringify(role), function () {
                        showNightOrder();
                    });
                });
            }

            function addComments() {
                addPublicCommentButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    if (inputComment.value === "" || inputComment.value.includes("(private)")) {
                        return;
                    }
                    const comment = {
                        text: inputComment.value,
                        ownerId: currentUserId,
                        isPrivate: 0,
                        roleId: role.id
                    }
                    inputComment.value = "";
                    sendXMLHttpRequest("POST", "/api/comment/create.php", "", JSON.stringify(comment), function () {
                        displayComments();
                    });
                });
                addPrivateCommentButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    if (inputComment.value === "") {
                        return;
                    }
                    const comment = {
                        text: inputComment.value,
                        ownerId: currentUserId,
                        isPrivate: 1,
                        roleId: role.id
                    }
                    inputComment.value = "";
                    sendXMLHttpRequest("POST", "/api/comment/create.php", "", JSON.stringify(comment), function () {
                        displayComments();
                    });
                });
            }

            function copyJsonString() {
                downloadJsonButton.addEventListener("click", function () {
                    sendXMLHttpRequest("POST", "/api/jinx/get.php", "", role.id, function (jinxData) {
                        sendXMLHttpRequest("POST", "/api/reminderToken/getByRoleId.php", "", role.id, function (reminderTokenData) {
                            const jsonRole = {
                                id: role.name.toLowerCase().replace(" ", "_"),
                                name: role.name,
                                ability: role.abilityText,
                                team: role.characterType.toLowerCase(),
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
                            if (reminderTokenData.includes("id")) {
                                const reminderTokens = JSON.parse(reminderTokenData);
                                jsonRole.reminders = [];
                                for (const reminderToken of reminderTokens) {
                                    jsonRole.reminders.push(reminderToken.name);
                                }
                                jsonRole.reminders = "xyRemovexy[" + '"' + jsonRole.reminders.toString().replaceAll(",", "xyReminderTokenxy") + '"' + "]xyRemove1xy";
                            }
                            if (role.abilityText.includes("[") && role.abilityText.includes("]")) {
                                jsonRole.setup = true;
                            }
                            if (jinxData.includes("id")) {
                                const jinxes = JSON.parse(jinxData);
                                jsonRole.jinxes = [];
                                for (const jinx of jinxes) {
                                    const tempJinx = {
                                        id: jinx.jinxedRole.toLowerCase().replace(" ", "_"),
                                        reason: jinx.text
                                    }
                                    jsonRole.jinxes.push(tempJinx);
                                }
                            }
                            const preString = JSON.stringify(jsonRole) + "xyEndxy";
                            const jsonString = preString.replaceAll("},{", "},\n              {")
                                .replaceAll(',"reason"', "xyReasonxy").replace("{", "{\n    ")
                                .replaceAll(',"', ',\n    "').replace("}xyEndxy", "\n}")
                                .replaceAll("xyReasonxy", ',"reason"').replaceAll("xyCommaxy", ",")
                                .replaceAll("xyReminderTokenxy", '","').replace('"xyRemovexy', "")
                                .replace('xyRemove1xy"', "").replaceAll("\\", "");
                            navigator.clipboard.writeText(jsonString);
                        });
                    });
                });
            }

            function deleteRoleListener() {
                document.getElementById("delete-role-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    deletePopupBackground.style.display = "flex";
                });

                deleteConfirmationYesButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    sendXMLHttpRequest("POST", "/api/role/delete.php", "", role.id, function () {
                        window.location = "role_idea.php";
                    });
                });

                deleteConfirmationCancelButton.addEventListener("click", function () {
                    deletePopupBackground.style.display = "none";
                });
            }

            function editHowToRun() {
                howToRunChangeButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    const input = document.getElementById("howtorun-input");
                    role.howToRun = input.value;
                    howToRunText.textContent = role.howToRun;
                    sendXMLHttpRequest("POST", "/api/role/update.php", "", JSON.stringify(role));
                });
            }

            function editMainRole() {
                document.getElementById("submit-edit-role-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    if (editRoleNameInput.value === "" || editCharacterTypeInput.value === "" || editAbilityTextInput.value === "") {
                        return;
                    }
                    role.name = editRoleNameInput.value;
                    role.characterType = editCharacterTypeInput.value;
                    role.abilityText = editAbilityTextInput.value;
                    sendXMLHttpRequest("POST", "/api/role/update.php", "", JSON.stringify(role), function () {
                        displayRole();
                    });
                });
            }

            function changeTags() {
                document.querySelectorAll(".tag").forEach(element => element.addEventListener("change", function () {
                    const tag = {
                        roleId: role.id,
                        name: element.name,
                        isActive: element.checked ? 1 : 0
                    }
                    sendXMLHttpRequest("POST", "/api/tag/update.php", "", JSON.stringify(tag), function () {
                        showTags();
                    });
                }));
            }

            function editJinxes() {
                jinxAddButton.addEventListener("click", function () {
                    if (jinxRoleInput.value === "" || jinxTextInput.value === "") {
                        return;
                    }
                    const jinx = {
                        roleId: role.id,
                        jinxedRole: jinxRoleInput.value,
                        text: jinxTextInput.value,
                        id: role.jinxId
                    }
                    if (jinxAddButton.textContent === "add Jinx") {
                        sendXMLHttpRequest("POST", "/api/jinx/create.php", "", JSON.stringify(jinx), function () {
                            jinxRoleInput.value = "";
                            jinxTextInput.value = "";
                            showJinxes();
                        });
                    }
                    if (jinxAddButton.textContent === "save changes") {
                        sendXMLHttpRequest("POST", "/api/jinx/update.php", "", JSON.stringify(jinx), function () {
                            jinxRoleInput.value = "";
                            jinxTextInput.value = "";
                            showJinxes();
                        });
                    }
                });
            }

            function showJinxes() {
                jinxAddButton.textContent = "add Jinx";
                sendXMLHttpRequest("POST", "/api/jinx/get.php", "", role.id, function (data) {
                    const jinxes = JSON.parse(data);
                    jinxList.textContent = "";
                    for (const jinx1 of jinxes) {
                        const list = document.createElement("li");
                        list.textContent = jinx1.jinxedRole + ": " + jinx1.text;
                        if (role.ownerId === currentUserId && inEditMode) {
                            const editButton = document.createElement("button");
                            const editIcon = document.createElement("i");
                            const deleteButton = document.createElement("button");
                            const deleteIcon = document.createElement("i");
                            editIcon.setAttribute("class", "fa-solid fa-pen fa-pen-to-square");
                            editButton.append(editIcon);
                            deleteIcon.setAttribute("class", "fa-solid fa-trash");
                            deleteButton.append(deleteIcon);
                            list.append(editButton);
                            list.append(deleteButton);

                            editButton.addEventListener("click", function () {
                                jinxRoleInput.value = jinx1.jinxedRole;
                                jinxTextInput.value = jinx1.text;
                                role.jinxId = jinx1.id;
                                jinxAddButton.textContent = "save changes";
                            });

                            deleteButton.addEventListener("click", function () {
                                sendXMLHttpRequest("POST", "/api/jinx/delete.php", "", jinx1.id, function () {
                                    showJinxes();
                                });
                            });
                        }
                        jinxList.append(list);
                    }
                });
            }

            function editReminderTokens() {
                reminderTokenAddButton.addEventListener("click", function () {
                    if (reminderTokenInput.value === "") {
                        return;
                    }
                    const reminderToken = {
                        name: reminderTokenInput.value,
                        roleId: role.id
                    }
                    sendXMLHttpRequest("POST", "/api/reminderToken/create.php", "", JSON.stringify(reminderToken), function () {
                        reminderTokenInput.value = "";
                        showReminderTokens();
                    });
                });
            }

            function showReminderTokens() {
                sendXMLHttpRequest("POST", "/api/reminderToken/getByRoleId.php", "", role.id, function (data) {
                    reminderTokenList.textContent = "";
                    const reminderTokens = JSON.parse(data);
                    for (const reminderToken of reminderTokens) {
                        const list = document.createElement("li");
                        list.textContent = reminderToken.name;
                        if (role.ownerId === currentUserId) {
                            const deleteButton = document.createElement("button");
                            const deleteIcon = document.createElement("i");
                            deleteIcon.setAttribute("class", "fa-solid fa-trash");
                            deleteButton.append(deleteIcon);
                            list.append(deleteButton);
                            deleteButton.addEventListener("click", function () {
                                sendXMLHttpRequest("POST", "/api/reminderToken/delete.php", "", reminderToken.id, function () {
                                    showReminderTokens();
                                });
                            });
                        }
                        reminderTokenList.append(list);
                    }
                });
            }

            function hideEditStuff() {
                imageSubmission.style.display = "none";
                document.getElementById("edit-role-field").style.display = "none";
                editTags.style.display = "none";
                firstNightInfoButton.style.display = "none";
                firstNightInfoText.style.display = "none";
                otherNightInfoButton.style.display = "none";
                otherNightInfoText.style.display = "none";
                document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "none");
                howToRunInput.style.display = "none";
                howToRunChangeButton.style.display = "none";
                jinxEditDiv.style.display = "none";
                editReminderTokenDiv.style.display = "none";
                document.getElementById("private-comments-checkbox-div").style.display = "none";
                deleteRoleDiv.style.display = "none";
                deletePopupBackground.style.display = "none";
            }
        });
    });
});
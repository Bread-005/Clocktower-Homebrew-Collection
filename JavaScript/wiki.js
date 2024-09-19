import {sendXMLHttpRequest} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    const searchParameters = new URLSearchParams(window.location.search);
    const id = searchParameters.get("r");

    sendXMLHttpRequest("POST", "/api/role/getById.php", "", id, function (data) {

        const currentUserName = document.cookie.split(":")[0];
        let currentUserId = 1;
        sendXMLHttpRequest("POST", "/api/user/getByName.php", "", currentUserName, function (userData) {
            const currentUser = JSON.parse(userData);
            currentUserId = currentUser.id;

            const mainRoleDisplay = document.getElementById("main-role-display");
            const editRoleFieldDiv = document.getElementById("edit-role-field");
            const editRoleNameInput = document.getElementById("edit-role-name");
            const editCharacterTypeInput = document.getElementById("edit-character-type");
            const editAbilityTextInput = document.getElementById("edit-ability-text");
            const imageSubmission = document.getElementById("image-submission");
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
            const specialDisplay = document.getElementById("special-display");
            const specialEditDiv = document.getElementById("special-edit-div");
            const specialTypeSelection = document.getElementById("special-type-selection");
            const specialNameSelection = document.getElementById("special-name-selection");
            const specialValueInput = document.getElementById("special-value-input");
            const specialTimeSelection = document.getElementById("special-time-selection");
            const specialAddButton = document.getElementById("special-add-button");
            const scriptText = document.getElementById("script-text");
            const scriptEditButton = document.getElementById("script-edit-button");
            const scriptEditInput = document.getElementById("script-edit-input");
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

            const role = JSON.parse(data);
            document.title = role.name;
            let inEditMode = false;

            if (role.imageUrl !== "") {
                document.getElementById("wiki-role-image").setAttribute("src", role.imageUrl);
            }

            if (currentUserId !== role.ownerId) {
                document.getElementById("edit-button").style.display = "none";
            }
            document.getElementById("username-display-wiki-page").append(currentUserName);

            hideEditStuff();
            toggleEditMode();
            changeImage();
            displayRole();
            editMainRole();
            showTags();
            changeTags();
            showNightOrder();
            editNightOrder();
            fillFirstNightInfoTextArea();
            fillOtherNightInfoTextArea();
            editHowToRun();
            howToRunInput.value = role.howToRun;
            document.getElementById("howtorun-text").innerHTML = role.howToRun;
            showJinxes();
            editJinxes();
            showReminderTokens();
            editReminderTokens();
            showSpecial();
            addSpecial();
            showScript();
            editScript();
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

            function changeTags() {
                document.querySelectorAll(".tag").forEach(element => element.addEventListener("click", function () {
                    const tempTag = {
                        roleId: role.id,
                        name: element.name,
                        isActive: element.checked ? 1 : 0
                    }
                    sendXMLHttpRequest("POST", "/api/tag/create.php", "", JSON.stringify(tempTag), function () {
                        showTags();
                    });
                }));
            }

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
                        document.getElementById(activeTags[i].name.replaceAll(" ", "-").toLowerCase() + "-tag").checked = true;
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
                        editRoleFieldDiv.style.display = "flex";
                        mainRoleDisplay.style.display = "none";
                        editRoleNameInput.value = role["name"];
                        editCharacterTypeInput.value = role["characterType"];
                        editAbilityTextInput.value = role["abilityText"];

                        howToRunInput.style.display = "block";
                        howToRunChangeButton.style.display = "block";

                        imageSubmission.style.display = "block";

                        deleteRoleDiv.style.display = "flex";

                        document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "flex");
                        document.getElementById("edit-night-order-text").style.display = "none";
                        firstNightInput.value = role.firstNight;
                        firstNightReminderInput.value = role.firstNightReminder;
                        otherNightInput.value = role.otherNight;
                        otherNightReminderInput.value = role.otherNightReminder;
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
                        specialEditDiv.style.display = "flex";
                        scriptEditInput.style.display = "flex";
                        scriptEditButton.style.display = "flex";
                        showScript();
                    }
                    if (!inEditMode) {
                        hideEditStuff();
                        showNightOrder();
                        showJinxes();
                        showScript();
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
                            sendXMLHttpRequest("POST", "/api/special/get.php", "", role.id, function (specialData) {
                                sendXMLHttpRequest("POST", "/api/tag/getSetupTag.php", "", role.id, function (tagData) {
                                    const jsonRole = {
                                        id: role.name.toLowerCase().replace(" ", "_"),
                                        name: role.name,
                                        ability: role.abilityText,
                                        team: role.characterType.toLowerCase(),
                                        image: role.imageUrl
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
                                    if (role.abilityText.includes("[") && role.abilityText.includes("]") || tagData === "1") {
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
                                    if (specialData.includes("type")) {
                                        const specials = JSON.parse(specialData);
                                        jsonRole.special = [];
                                        for (const special of specials) {
                                            const tempSpecial = {
                                                name: special.name,
                                                type: special.type,
                                            }
                                            if (special.value !== "") {
                                                tempSpecial.value = special.value;
                                            }
                                            if (special.time !== "") {
                                                tempSpecial.time = special.time;
                                            }
                                            jsonRole.special.push(tempSpecial);
                                        }
                                    }
                                    const preString = JSON.stringify(jsonRole) + "xyEndxy";
                                    const jsonString = preString.replaceAll("},{", "},\n              {")
                                        .replaceAll(',"reason"', "xyReasonxy")
                                        .replaceAll(',"type"', "xyTypexy")
                                        .replaceAll(',"value"', "xyValuexy")
                                        .replaceAll(',"time"', "xyTimexy")
                                        .replace("{", "{\n    ")
                                        .replaceAll(',"', ',\n    "')
                                        .replace("}xyEndxy", "\n}")
                                        .replaceAll("xyReasonxy", ',"reason"')
                                        .replaceAll("xyTypexy", ',"type"')
                                        .replaceAll("xyValuexy", ',"value"')
                                        .replaceAll("xyTimexy", ',"time"')
                                        .replaceAll("xyCommaxy", ",")
                                        .replaceAll("xyReminderTokenxy", '","')
                                        .replace('"xyRemovexy', "")
                                        .replace('xyRemove1xy"', "")
                                        .replaceAll("\\", "");
                                    navigator.clipboard.writeText(jsonString);
                                });
                            });
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
                mainRoleDisplay.style.display = "flex";
                editRoleFieldDiv.style.display = "none";
                imageSubmission.style.display = "none";
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
                specialEditDiv.style.display = "none";
                scriptEditButton.style.display = "none";
                scriptEditInput.style.display = "none";
                document.getElementById("private-comments-checkbox-div").style.display = "none";
                deleteRoleDiv.style.display = "none";
                deletePopupBackground.style.display = "none";
            }

            function showSpecial() {
                sendXMLHttpRequest("POST", "/api/special/get.php", "", role.id, function (data) {
                    const specials = JSON.parse(data);
                    specialDisplay.textContent = "";
                    for (const special of specials) {
                        const list = document.createElement("li");
                        list.textContent = special.type + " " + special.name + " " + special.value + " " + special.time;
                        const deleteButton = document.createElement("button");
                        const deleteIcon = document.createElement("i");
                        deleteIcon.setAttribute("class", "fa-solid fa-trash");
                        deleteButton.append(deleteIcon);
                        list.append(deleteButton);
                        specialDisplay.append(list);

                        deleteButton.addEventListener("click", function () {
                            sendXMLHttpRequest("POST", "/api/special/delete.php", "", special.id, function () {
                                showSpecial();
                            });
                        });
                    }
                });
            }

            function addSpecial() {
                specialAddButton.addEventListener("click", function () {
                    if (specialTypeSelection.value === "" || specialNameSelection.value === "") {
                        return;
                    }
                    const special = {
                        roleId: role.id,
                        type: specialTypeSelection.value,
                        name: specialNameSelection.value,
                        value: specialValueInput.value,
                        time: specialTimeSelection.value === "none" ? "" : specialTimeSelection.value
                    }
                    sendXMLHttpRequest("POST", "/api/special/create.php", "", JSON.stringify(special), function () {
                        specialTypeSelection.value = "selection";
                        specialNameSelection.value = "grimoire";
                        specialValueInput.value = "";
                        specialTimeSelection.value = "none";
                        showSpecial();
                    });
                });
            }

            function fillFirstNightInfoTextArea() {
                const firstNightList = ["Lord of Typhon", "Minion info", "Philosopher", "Demon info", "Kazali",
                    "Alchemist", "Poppy Grower", "Yaggababble", "Magician", "Snitch", "Lunatic", "Summoner", "King", "Sailor",
                    "Marionette", "Engineer", "Preacher", "Lil Monsta", "Lleech", "Poisoner", "Widow", "Courtier", "Snake Charmer",
                    "Godfather", "Devil´s Advocate", "Evil Twin", "Witch", "Cerenovus", "Fearmonger", "Harpy", "Mezepheles", "Pukka",
                    "Pixie", "Huntsman", "Damsel", "Amnesiac", "Washerwoman", "Librarian", "Investigator", "Chef", "Empath",
                    "Fortune Teller", "Butler", "Grandmother", "Clockmaker", "Dreamer", "Seamstress", "Steward", "Knight",
                    "Noble", "Balloonist", "Shugenja", "Village Idiot", "Bounty Hunter", "Nightwatchman", "Cult Leader",
                    "Spy", "Ogre", "High Priestess", "Chambermaid", "Mathematician", "Leviathan", "Vizier"];
                for (let i = 0; i < firstNightList.length; i++) {
                    firstNightInfoText.innerHTML += (i + 5) + " " + firstNightList[i] + "<br>";
                }
            }

            function fillOtherNightInfoTextArea() {
                const otherNightList = ["Philosopher", "Poppy Grower", "Sailor", "Engineer", "Preacher", "Poisoner",
                    "Courtier", "Innkeeper", "Gambler", "Snake Charmer", "Monk", "Devil´s Advocate", "Witch", "Cerenovus",
                    "Pit-Hag", "Fearmonger", "Harpy", "Mezepheles", "Scarlet Woman", "Summoner", "Lunatic", "Exorcist",
                    "Lycanthrope", "Legion", "Imp", "Zombuul", "Pukka", "Shabaloth", "Po", "Fang Gu", "No Dashii", "Vortox",
                    "Lord of Typhon", "Vigormortis", "Ojo", "Al-Hadikhia", "Lleech", "Lil Monsta", "Yaggababble", "Kazali",
                    "Assassin", "Godfather", "Gossip", "Acrobat", "Hatter", "Barber", "Sweetheart", "Sage", "Banshee", "Professor",
                    "Choirboy", "Huntsman", "Damsel", "Amnesiac", "Farmer", "Tinker", "Moonchild", "Grandmother", "Ravenkeeper",
                    "Empath", "Fortune Teller", "Undertaker", "Dreamer", "Flowergirl", "Town Crier", "Oracle", "Seamstress",
                    "Juggler", "Balloonist", "Village Idiot", "King", "Bounty Hunter", "Nightwatchman", "Cult Leader", "Butler",
                    "Spy", "High Priestess", "Chambermaid", "Mathematician", "Leviathan"];
                for (let i = 0; i < otherNightList.length; i++) {
                    otherNightInfoText.innerHTML += (i + 6) + " " + otherNightList[i] + "<br>";
                }
            }

            function showScript() {
                scriptText.style.display = "flex";
                scriptText.textContent = "Script: " + role.script;
                if (role.script === "" && !inEditMode) {
                    scriptText.style.display = "none";
                }
            }

            function editScript() {
                scriptEditButton.addEventListener("click", function () {
                    role.script = scriptEditInput.value;
                    scriptEditInput.value = "";
                    sendXMLHttpRequest("POST", "/api/role/update.php", "", JSON.stringify(role), function () {
                        showScript();
                    });
                });
            }
        });
    });
});
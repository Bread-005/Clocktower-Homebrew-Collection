import {copyJsonString, showCopyPopup, firstNightList, otherNightList, allTags, updateRole} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    const storageString = "websiteStorage1";
    const websiteStorage = JSON.parse(localStorage.getItem(storageString));
    const searchParameters = new URLSearchParams(window.location.search);
    const id = searchParameters.get("r");
    const wikiHeader = document.getElementById("wiki-header");
    const wikiRoleImage = document.getElementById("wiki-role-image");
    const editButton = document.getElementById("edit-button");
    const mainRoleDisplay = document.querySelector(".main-role-display");
    const editRoleFieldDiv = document.querySelector(".edit-role-field");
    const editRoleNameInput = document.getElementById("edit-role-name");
    const editCharacterTypeInput = document.getElementById("edit-character-type");
    const editAbilityTextInput = document.getElementById("edit-ability-text");
    const uploadImageURL = document.getElementById("image-input-url");
    const uploadOtherImageURL = document.getElementById("other-image-input-url");
    const imageSubmission = document.querySelector(".image-submission");
    const tagDisplay = document.getElementById("tag-display");
    const editTags = document.querySelector(".edit-tags");
    const firstNightInput = document.getElementById("first-night-input");
    const firstNightInfoButton = document.getElementById("first-night-info-button");
    const firstNightInfoText = document.getElementById("first-night-info-text");
    const firstNightReminderInput = document.getElementById("first-night-reminder-input");
    const otherNightInput = document.getElementById("other-night-input");
    const otherNightInfoButton = document.getElementById("other-night-info-button");
    const otherNightInfoText = document.getElementById("other-night-info-text");
    const otherNightReminderInput = document.getElementById("other-night-reminder-input");
    const editReminderTokenDiv = document.querySelector(".edit-reminder-token");
    const editGlobalReminderTokenDiv = document.querySelector(".edit-global-reminder-token");
    const reminderTokenAddButton = document.getElementById("reminder-token-add-button");
    const globalReminderTokenAddButton = document.getElementById("global-reminder-token-add-button");
    const reminderTokenList = document.querySelector(".reminder-token-list");
    const globalReminderTokenList = document.querySelector(".global-reminder-token-list");
    const jinxRoleInput = document.getElementById("jinx-role-input");
    const jinxTextInput = document.getElementById("jinx-text-input");
    const jinxAddButton = document.getElementById("jinx-add-button");
    const jinxEditDiv = document.querySelector(".jinx-edit-div");
    const jinxList = document.getElementById("jinx-display");
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
    const howToRunText = document.querySelector(".how-to-run-text");
    const howToRunInput = document.getElementById("how-to-run-input");
    const howToRunChangeButton = document.getElementById("how-to-run-button");
    const personalRoleRating = document.getElementById("personal-role-rating");
    const inputComment = document.getElementById("input-comment");
    const addCommentButton = document.getElementById("add-comment-button");
    const commentsList = document.getElementById("comments-list");
    const downloadJsonButton = document.querySelector(".download-json-button");
    const deleteRoleDiv = document.querySelector(".delete-role");
    const deleteConfirmationText = document.getElementById("delete-confirmation-text");
    const deleteConfirmationYesButton = document.getElementById("delete-confirmation-yes-button");
    const deleteConfirmationCancelButton = document.getElementById("delete-confirmation-cancel-button");
    const deletePopupBackground = document.querySelector(".delete-popup-background");

    for (const role of getRoleIdeas()) {
        if (role.createdAt !== id) {
            continue;
        }
        document.title = role.name;
        let inEditMode = false;

        if (role.image !== "") {
            wikiRoleImage.setAttribute("src", role.image);
        }

        hideEditStuff();
        toggleEditMode();
        changeImage();
        displayRole();
        editMainRole();
        showTags();
        showNightOrder();
        editNightOrder();
        fillFirstNightInfoTextArea();
        fillOtherNightInfoTextArea();
        displayReminders();
        editReminderTokens(reminderTokenAddButton, document.getElementById("reminder-token-input"), role.reminders);
        editReminderTokens(globalReminderTokenAddButton, document.getElementById("global-reminder-token-input"), role.remindersGlobal);
        showJinxes();
        editJinxes();
        showSpecial();
        addSpecial();
        showScript();
        editScript();
        editHowToRun();
        howToRunInput.value = role.howToRun;
        howToRunText.innerHTML = role.howToRun;
        showPersonalRating();
        displayComments();
        addComments();
        downloadJsonButton.addEventListener("click", function () {
            copyJsonString(role);
            showCopyPopup(downloadJsonButton);
        });
        deleteRoleListener();

        function displayComments() {
            commentsList.innerHTML = "";
            for (const comment of role.comments) {
                const list = document.createElement("li");
                list.setAttribute("class", "comment");
                list.textContent = comment.text;
                const deleteButton = document.createElement("button");
                deleteButton.style.marginLeft = "10px";

                const deleteButtonIcon = document.createElement("i");
                deleteButtonIcon.setAttribute("class", "js-delete-button fa-solid fa-trash");

                deleteButton.append(deleteButtonIcon);
                list.append(deleteButton);
                document.getElementById("comments-list").append(list);

                deleteButton.addEventListener("click", function () {
                    role.comments = role.comments.filter(comment1 => comment1.createdAt !== comment.createdAt);
                    saveLocalStorage();
                    displayComments();
                });
            }
        }

        function displayRole() {
            document.getElementById("role-name").textContent = role.name;
            document.getElementById("character-type").textContent = "Charactertype: " + role.characterType;
            document.getElementById("ability-text").textContent = "Ability: " + role.ability;
            if (window.innerWidth <= 600) {
                document.getElementById("role-name").append(wikiRoleImage);
                wikiHeader.append(editButton);
            }
        }

        function showNightOrder() {
            document.getElementById("first-night").textContent = "firstNight: " + role.firstNight;
            document.getElementById("other-night").textContent = "otherNight: " + role.otherNight;
            document.getElementById("other-night-reminder").textContent = "otherNightReminder: " + role.otherNightReminder;

            const firstNightReminder = document.getElementById("first-night-reminder");
            firstNightReminder.textContent = "firstNightReminder: ";
            firstNightReminder.append(document.createElement("br"));
            firstNightReminder.append(role.firstNightReminder);

            const otherNightReminder = document.getElementById("other-night-reminder");
            otherNightReminder.textContent = "otherNightReminder: ";
            otherNightReminder.append(document.createElement("br"));
            otherNightReminder.append(role.otherNightReminder);
        }

        function nightOrderInfoButtonListener(button, text) {
            button.addEventListener("click", function () {
                if (text.style.display === "flex") {
                    text.style.display = "none";
                } else {
                    text.style.display = "flex";
                }
            });
        }

        nightOrderInfoButtonListener(firstNightInfoButton, firstNightInfoText);
        nightOrderInfoButtonListener(otherNightInfoButton, otherNightInfoText);

        function showPersonalRating() {
            personalRoleRating.textContent = "You have not rated this role";
            if (role.rating > 0) {
                personalRoleRating.textContent = "Your rating: ";
                const yellowStarCount = Math.round(role.rating);
                const grayStarCount = 10 - yellowStarCount;
                for (let i = 0; i < yellowStarCount; i++) {
                    const yellowStarIcon = document.createElement("i");
                    yellowStarIcon.setAttribute("class", "fa-solid fa-star");
                    yellowStarIcon.setAttribute("style", "color: #FFD43B");
                    personalRoleRating.append(yellowStarIcon);
                }
                for (let i = 0; i < grayStarCount; i++) {
                    const grayStarIcon = document.createElement("i");
                    grayStarIcon.setAttribute("class", "fa-regular fa-star");
                    personalRoleRating.append(grayStarIcon);
                }
                personalRoleRating.append(" " + role.rating + "/10");
            }
        }

        function toggleEditMode() {
            document.getElementById("edit-button").addEventListener("click", function () {
                inEditMode = !inEditMode;

                if (inEditMode) {
                    editRoleFieldDiv.style.display = "flex";
                    mainRoleDisplay.style.display = "none";
                    editRoleNameInput.value = role.name;
                    editCharacterTypeInput.value = role.characterType;
                    editAbilityTextInput.value = role.ability;
                    howToRunInput.style.display = "block";
                    howToRunChangeButton.style.display = "block";
                    setupTagsDisplay();
                    imageSubmission.style.display = "block";
                    deleteRoleDiv.style.display = "flex";
                    document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "flex");
                    firstNightInput.value = role.firstNight;
                    firstNightReminderInput.value = role.firstNightReminder;
                    otherNightInput.value = role.otherNight;
                    otherNightReminderInput.value = role.otherNightReminder;
                    showNightOrder();
                    firstNightInfoButton.style.display = "flex";
                    otherNightInfoButton.style.display = "flex";
                    jinxEditDiv.style.display = "flex";
                    showJinxes();
                    editReminderTokenDiv.style.display = "flex";
                    editGlobalReminderTokenDiv.style.display = "flex";
                    displayReminders();
                    specialEditDiv.style.display = "flex";
                    showSpecial();
                    scriptEditInput.style.display = "flex";
                    scriptEditButton.style.display = "flex";
                    showScript();
                    if (window.innerWidth <= 600) {
                        imageSubmission.prepend(wikiRoleImage);
                    }
                }
                if (!inEditMode) {
                    hideEditStuff();
                    showNightOrder();
                    displayReminders();
                    showJinxes();
                    showSpecial();
                    showScript();
                }
            });
        }

        function changeImage() {
            uploadImageURL.value = role.image;
            uploadOtherImageURL.value = role.otherImage;
            document.getElementById("upload-button").addEventListener("click", function () {
                role.image = uploadImageURL.value.replaceAll("\\", "");
                wikiRoleImage.setAttribute("src", role.image);
                uploadImageURL.value = role.image;
                saveLocalStorage();
            });
            document.getElementById("other-upload-button").addEventListener("click", function () {
                role.otherImage = uploadOtherImageURL.value.replaceAll("\\", "");
                uploadOtherImageURL.value = role.otherImage;
                saveLocalStorage();
            });
        }

        function showTags() {
            tagDisplay.textContent = "";
            for (let i = 0; i < role.tags.length; i++) {
                tagDisplay.textContent += role.tags[i];
                if (i < role.tags.length - 1) {
                    tagDisplay.textContent += ", ";
                }
            }
        }

        function setupTagsDisplay() {

            showTags();
            editTags.style.display = "flex";
            editTags.innerText = "";

            for (const tagString of allTags) {
                const div = document.createElement("div");
                const id = tagString.replaceAll(" ", "-").toLowerCase() + "-tag";
                const label = document.createElement("label");
                label.setAttribute("for", id);
                label.innerText = tagString;
                const tag = document.createElement("input");
                tag.setAttribute("id", id);
                tag.setAttribute("class", "tag");
                tag.setAttribute("name", tagString);
                tag.setAttribute("type", "checkbox");
                tag.addEventListener("click", function () {
                    if (tag.checked) {
                        role.tags.push(tagString);
                    }
                    if (!tag.checked) {
                        role.tags = role.tags.filter(tag => tag.toString() !== tagString);
                    }
                    saveLocalStorage();
                    showTags();
                });
                div.append(label);
                div.append(tag);
                editTags.append(div);
            }
            for (const tag of role.tags) {
                document.getElementById(tag.replaceAll(" ", "-").toLowerCase() + "-tag").checked = true;
            }
        }

        function editNightOrder() {
            document.getElementById("edit-night-order-button").addEventListener("click", async function () {
                if (firstNightInput.value === "") {
                    firstNightInput.value = 0;
                }
                if (otherNightInput.value === "") {
                    otherNightInput.value = 0;
                }
                role.firstNight = Number.parseFloat(firstNightInput.value);
                role.firstNightReminder = firstNightReminderInput.value;
                role.otherNight = Number.parseFloat(otherNightInput.value);
                role.otherNightReminder = otherNightReminderInput.value;
                await updateRole(role);
                saveLocalStorage();
                showNightOrder();
            });
        }

        function addComments() {
            addCommentButton.addEventListener("click", function () {
                if (inputComment.value === "") {
                    return;
                }
                const comment = {
                    text: inputComment.value,
                    createdAt: Date.now().toString()
                }
                role.comments.push(comment);
                saveLocalStorage();
                inputComment.value = "";
                displayComments();
            });
        }

        function deleteRoleListener() {
            deleteConfirmationText.textContent += " " + role.name + "?";
            document.getElementById("delete-role-button").addEventListener("click", function () {
                deletePopupBackground.style.display = "flex";
            });

            deleteConfirmationYesButton.addEventListener("click", function () {
                if (websiteStorage.user.databaseUse === "localStorage") {
                    for (let i = 0; i < websiteStorage.localRoleIdeas.length; i++) {
                        if (websiteStorage.localRoleIdeas[i].createdAt === role.createdAt) {
                            websiteStorage.archive.push(websiteStorage.localRoleIdeas[i]);
                            websiteStorage.localRoleIdeas.splice(i, 1);
                            saveLocalStorage();
                            break;
                        }
                    }
                }
                window.location = "index.html";
            });

            deleteConfirmationCancelButton.addEventListener("click", function () {
                deletePopupBackground.style.display = "none";
            });
        }

        function editHowToRun() {
            howToRunChangeButton.addEventListener("click", function () {
                role.howToRun = howToRunInput.value;
                howToRunText.textContent = role.howToRun;
                saveLocalStorage();
            });
        }

        function editMainRole() {
            document.getElementById("submit-edit-role-button").addEventListener("click", function () {
                if (editRoleNameInput.value === "" || editCharacterTypeInput.value === "" || editAbilityTextInput.value === "") {
                    return;
                }
                role.name = editRoleNameInput.value;
                role.characterType = editCharacterTypeInput.value;
                role.ability = editAbilityTextInput.value;
                saveLocalStorage();
                displayRole();
            });
        }

        function editJinxes() {
            jinxAddButton.addEventListener("click", function () {
                if (jinxTextInput.value === "") {
                    return;
                }
                const tempJinxes = jinxTextInput.value.replace('"jinxes": ', "").replace('"jinxes":', "");

                if (tempJinxes.includes('"id"') && tempJinxes.includes('"reason"') && Array.isArray(JSON.parse(tempJinxes))) {

                    const jinxes = JSON.parse(tempJinxes);

                    for (const jinx1 of jinxes) {
                        if (jinx1.id && jinx1.reason) {
                            const jinx = {
                                jinxedRole: jinx1.id[0].toUpperCase(),
                                reason: jinx1.reason,
                                createdAt: Date.now().toString()
                            }
                            if (role.jinxes.map(jinx2 => jinx2.jinxedRole.toLowerCase()).includes(jinx1.id)) {
                                continue;
                            }
                            for (let j = 1; j < jinx1.id.length; j++) {
                                if (jinx1.id[j] === "_") {
                                    jinx.jinxedRole += " ";
                                    continue;
                                }
                                if (jinx1.id[j - 1] === "_") {
                                    jinx.jinxedRole += jinx1.id[j].toUpperCase();
                                    continue;
                                }
                                jinx.jinxedRole += jinx1.id[j];
                            }
                            role.jinxes.push(jinx);
                        }
                    }
                    jinxRoleInput.value = "";
                    jinxTextInput.value = "";
                    saveLocalStorage();
                    showJinxes();
                    return;
                }

                if (!jinxRoleInput.value) {
                    return;
                }
                const jinx = {
                    jinxedRole: jinxRoleInput.value,
                    reason: jinxTextInput.value,
                    createdAt: Date.now().toString()
                }
                if (jinxAddButton.textContent === "add Jinx") {
                    role.jinxes.push(jinx);
                    jinxRoleInput.value = "";
                    jinxTextInput.value = "";
                    saveLocalStorage();
                    showJinxes();
                }
                if (jinxAddButton.textContent === "save changes") {
                    for (const jinx1 of role.jinxes) {
                        if (jinx1.createdAt === role.tempJinxId) {
                            jinx1.jinxedRole = jinx.jinxedRole;
                            jinx1.reason = jinx.reason;
                            jinxRoleInput.value = "";
                            jinxTextInput.value = "";
                            saveLocalStorage();
                            showJinxes();
                            break;
                        }
                    }
                }
            });
        }

        function showJinxes() {
            jinxAddButton.textContent = "add Jinx";
            jinxList.textContent = "";
            for (const jinx of role.jinxes) {
                const list = document.createElement("li");
                list.textContent = jinx.jinxedRole + ": " + jinx.reason;

                if (inEditMode) {
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
                        jinxRoleInput.value = jinx.jinxedRole;
                        jinxTextInput.value = jinx.reason;
                        jinxAddButton.textContent = "save changes";
                        role.tempJinxId = jinx.createdAt;
                    });

                    deleteButton.addEventListener("click", function () {
                        role.jinxes = role.jinxes.filter(jinx1 => jinx1.jinxedRole !== jinx.jinxedRole);
                        saveLocalStorage();
                        showJinxes();
                    });
                }
                jinxList.append(list);
            }
        }

        function editReminderTokens(pReminderTokenAddButton, reminderTokenInput) {
            pReminderTokenAddButton.addEventListener("click", function () {
                if (reminderTokenInput.value === "") {
                    return;
                }
                if (pReminderTokenAddButton === reminderTokenAddButton) role.reminders.push(reminderTokenInput.value);
                if (pReminderTokenAddButton === globalReminderTokenAddButton) role.remindersGlobal.push(reminderTokenInput.value);
                saveLocalStorage();
                reminderTokenInput.value = "";
                displayReminders();
            });
        }

        function displayReminders() {
            showReminderTokens(reminderTokenList, role.reminders);
            showReminderTokens(globalReminderTokenList, role.remindersGlobal);
        }

        function showReminderTokens(pReminderTokenList, reminderArray) {
            pReminderTokenList.textContent = "";
            if (pReminderTokenList === globalReminderTokenList) {
                const header = document.createElement("h3");
                header.textContent = "Global";
                header.style.marginBottom = "3px";
                pReminderTokenList.append(header);
            }
            for (const reminderToken of reminderArray) {
                const div = document.createElement("div");
                div.textContent = reminderToken;
                if (inEditMode) {
                    const deleteButton = document.createElement("button");
                    const deleteIcon = document.createElement("i");
                    deleteIcon.setAttribute("class", "fa-solid fa-trash");
                    deleteButton.append(deleteIcon);
                    div.append(deleteButton);
                    deleteButton.addEventListener("click", function () {
                        if (pReminderTokenList === reminderTokenList) role.reminders = role.reminders.filter(reminderToken1 => reminderToken1 !== reminderToken);
                        if (pReminderTokenList === globalReminderTokenList) role.remindersGlobal = role.remindersGlobal.filter(reminderToken1 => reminderToken1 !== reminderToken);
                        saveLocalStorage();
                        displayReminders();
                    });
                }
                pReminderTokenList.append(div);
            }
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
            editGlobalReminderTokenDiv.style.display = "none";
            specialEditDiv.style.display = "none";
            scriptEditButton.style.display = "none";
            scriptEditInput.style.display = "none";
            deleteRoleDiv.style.display = "none";
            deletePopupBackground.style.display = "none";
        }

        function showSpecial() {
            specialDisplay.textContent = "";
            for (const special of role.special) {
                const list = document.createElement("li");
                list.textContent = special.type + " " + special.name + " " + special.value + " " + special.time;

                if (inEditMode) {
                    const deleteButton = document.createElement("button");
                    const deleteIcon = document.createElement("i");
                    deleteIcon.setAttribute("class", "fa-solid fa-trash");
                    deleteButton.append(deleteIcon);
                    list.append(deleteButton);

                    deleteButton.addEventListener("click", function () {
                        role.special = role.special.filter(special1 => special1.name !== special.name);
                        saveLocalStorage();
                        showSpecial();
                    });
                }
                specialDisplay.append(list);
            }
        }

        function addSpecial() {
            specialAddButton.addEventListener("click", function () {
                if (specialTypeSelection.value === "" || specialNameSelection.value === "") {
                    return;
                }
                const special = {
                    name: specialNameSelection.value,
                    type: specialTypeSelection.value,
                    value: specialValueInput.value,
                    time: specialTimeSelection.value === "none" ? "" : specialTimeSelection.value
                }
                role.special.push(special);
                saveLocalStorage();
                showSpecial();
            });
        }

        function fillFirstNightInfoTextArea() {
            for (let i = 0; i < firstNightList.length; i++) {
                firstNightInfoText.innerHTML += (i + 6) + " " + firstNightList[i] + "<br>";
            }
        }

        function fillOtherNightInfoTextArea() {
            for (let i = 0; i < otherNightList.length; i++) {
                otherNightInfoText.innerHTML += (i + 7) + " " + otherNightList[i] + "<br>";
            }
        }

        function showScript() {
            scriptText.textContent = role.script;
        }

        function editScript() {
            scriptEditButton.addEventListener("click", function () {
                role.script = scriptEditInput.value;
                scriptEditInput.value = "";
                saveLocalStorage();
                showScript();
            });
        }
    }

    function saveLocalStorage() {
        localStorage.setItem(storageString, JSON.stringify(websiteStorage));
    }

    function getRoleIdeas() {
        if (websiteStorage.user.databaseUse === "localStorage") return websiteStorage.localRoleIdeas;
        if (websiteStorage.user.databaseUse === "mongoDB") return websiteStorage.roleIdeas;
    }
});

export {firstNightList, otherNightList}
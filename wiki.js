import {
    getJsonString, allTags, updateRole, deleteRole, createPopup, getRoleIdeas, saveLocalStorage, databaseIsConnected,
    createRole, websiteStorage
} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    const wikiHeader = document.getElementById("wiki-header");
    const wikiRoleImage = document.getElementById("wiki-role-image");
    const editButton = document.getElementById("edit-button");
    const mainRoleDisplay = document.querySelector(".main-role-display");
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
    const reminderTokenAddButton = document.getElementById("reminder-token-add-button");
    const globalReminderTokenAddButton = document.getElementById("global-reminder-token-add-button");
    const reminderTokenList = document.querySelector(".reminder-token-list");
    const globalReminderTokenList = document.querySelector(".global-reminder-token-list");
    const jinxRoleInput = document.getElementById("jinx-role-input");
    const jinxTextInput = document.getElementById("jinx-text-input");
    const jinxAddButton = document.getElementById("jinx-add-button");
    const jinxList = document.getElementById("jinx-display");
    const specialDisplay = document.getElementById("special-display");
    const specialTypeSelection = document.getElementById("special-type-selection");
    const specialNameSelection = document.getElementById("special-name-selection");
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
    const deleteConfirmationText = document.getElementById("delete-confirmation-text");
    const deleteConfirmationYesButton = document.getElementById("delete-confirmation-yes-button");
    const deleteConfirmationCancelButton = document.getElementById("delete-confirmation-cancel-button");
    const deletePopupBackground = document.querySelector(".delete-popup-background");
    const ownerDisplay = document.querySelector(".owner-display");

    const role = getRoleIdeas().find(role1 => role1.createdAt === new URLSearchParams(window.location.search).get("r"));
    if (!role) {
        window.location = "index.html";
        return;
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
        getJsonString(role, true);
        createPopup(document.querySelector(".wiki"), "Role Json copied to Clipboard", 3500, "lightblue");
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
            if (!role.owner || role.owner.includes(websiteStorage.user.currentUsername) || comment.owner === websiteStorage.user.currentUsername) {
                list.append(deleteButton);
            }
            document.getElementById("comments-list").append(list);

            deleteButton.addEventListener("click", async function () {
                role.comments = role.comments.filter(comment1 => comment1.createdAt !== comment.createdAt);
                await updateRole(role, false);
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
            text.style.display = text.style.display === "flex" ? "none" : "flex";
        });
    }

    nightOrderInfoButtonListener(firstNightInfoButton, firstNightInfoText);
    nightOrderInfoButtonListener(otherNightInfoButton, otherNightInfoText);

    function showPersonalRating() {
        let totalRatings = 0;
        for (const rating of role.rating) {
            totalRatings += rating.score;
        }
        if (role.rating.length === 0) {
            personalRoleRating.textContent = "This role has not been rated yet";
        }
        if (role.rating.length > 0) {
            personalRoleRating.textContent = "Average rating: ";
            const yellowStarCount = Math.round(totalRatings / role.rating.length);
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
            personalRoleRating.append(" " + (totalRatings / role.rating.length) + "/10");
        }
    }

    function toggleEditMode() {
        document.getElementById("edit-button").addEventListener("click", async function () {
            if (websiteStorage.roleIdeas.map(role1 => role1.name).includes(role.name) && !await databaseIsConnected()) {
                createPopup(document.querySelector(".wiki"), "You cannot edit public roles,\nbecause right now there is no database connection!", 5000);
                return;
            }

            inEditMode = !inEditMode;

            if (inEditMode) {
                document.querySelectorAll(".edit").forEach(element => element.style.display = "flex");
                firstNightInfoText.style.display = "none";
                otherNightInfoText.style.display = "none";
                deletePopupBackground.style.display = "none";
                mainRoleDisplay.style.display = "none";
                editRoleNameInput.value = role.name;
                editCharacterTypeInput.value = role.characterType;
                editAbilityTextInput.value = role.ability;
                howToRunInput.style.display = "block";
                howToRunChangeButton.style.display = "block";
                setupTagsDisplay();
                imageSubmission.style.display = "block";
                firstNightInput.value = role.firstNight;
                firstNightReminderInput.value = role.firstNightReminder;
                otherNightInput.value = role.otherNight;
                otherNightReminderInput.value = role.otherNightReminder;
                showNightOrder();
                showJinxes();
                displayReminders();
                showSpecial();
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
            showOwners();
            showRolePrivacy();
        });
    }

    function changeImage() {
        uploadImageURL.value = role.image;
        uploadOtherImageURL.value = role.otherImage;
        document.getElementById("upload-button").addEventListener("click", async function () {
            role.image = uploadImageURL.value.replaceAll("\\", "");
            wikiRoleImage.setAttribute("src", role.image);
            uploadImageURL.value = role.image;
            await updateRole(role);
            saveLocalStorage();
        });
        document.getElementById("other-upload-button").addEventListener("click", async function () {
            role.otherImage = uploadOtherImageURL.value.replaceAll("\\", "");
            uploadOtherImageURL.value = role.otherImage;
            await updateRole(role);
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
            tag.addEventListener("click", async function () {
                if (tag.checked) {
                    role.tags.push(tagString);
                }
                if (!tag.checked) {
                    role.tags = role.tags.filter(tag => tag.toString() !== tagString);
                }
                await updateRole(role);
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
        addCommentButton.addEventListener("click", async function () {
            if (inputComment.value === "") {
                return;
            }
            const comment = {
                text: inputComment.value,
                createdAt: Date.now().toString(),
                owner: websiteStorage.user.currentUsername
            }
            role.comments.push(comment);
            await updateRole(role, false);
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

        deleteConfirmationYesButton.addEventListener("click", async function () {
            websiteStorage.archive.push(role);
            websiteStorage.localRoleIdeas = websiteStorage.localRoleIdeas.filter(role1 => role1.createdAt !== role.createdAt);
            await deleteRole(role);
            saveLocalStorage();
            window.location = "index.html";
        });

        deleteConfirmationCancelButton.addEventListener("click", function () {
            deletePopupBackground.style.display = "none";
        });
    }

    function editHowToRun() {
        howToRunChangeButton.addEventListener("click", async function () {
            role.howToRun = howToRunInput.value;
            howToRunText.textContent = role.howToRun;
            await updateRole(role);
            saveLocalStorage();
        });
    }

    function editMainRole() {
        document.getElementById("submit-edit-role-button").addEventListener("click", async function () {
            if (editRoleNameInput.value === "" || editCharacterTypeInput.value === "" || editAbilityTextInput.value === "") {
                return;
            }
            role.name = editRoleNameInput.value;
            role.characterType = editCharacterTypeInput.value;
            role.ability = editAbilityTextInput.value;
            await updateRole(role);
            saveLocalStorage();
            displayRole();
        });
    }

    function editJinxes() {
        jinxAddButton.addEventListener("click", async function () {
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
                await updateRole(role);
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
                await updateRole(role);
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
                        await updateRole(role);
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

                deleteButton.addEventListener("click", async function () {
                    role.jinxes = role.jinxes.filter(jinx1 => jinx1.jinxedRole !== jinx.jinxedRole);
                    await updateRole(role);
                    saveLocalStorage();
                    showJinxes();
                });
            }
            jinxList.append(list);
        }
    }

    function editReminderTokens(pReminderTokenAddButton, reminderTokenInput) {
        pReminderTokenAddButton.addEventListener("click", async function () {
            if (reminderTokenInput.value === "") {
                return;
            }
            if (pReminderTokenAddButton === reminderTokenAddButton) role.reminders.push(reminderTokenInput.value);
            if (pReminderTokenAddButton === globalReminderTokenAddButton) role.remindersGlobal.push(reminderTokenInput.value);
            await updateRole(role);
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
                deleteButton.addEventListener("click", async function () {
                    if (pReminderTokenList === reminderTokenList) role.reminders = role.reminders.filter(reminderToken1 => reminderToken1 !== reminderToken);
                    if (pReminderTokenList === globalReminderTokenList) role.remindersGlobal = role.remindersGlobal.filter(reminderToken1 => reminderToken1 !== reminderToken);
                    await updateRole(role);
                    saveLocalStorage();
                    displayReminders();
                });
            }
            pReminderTokenList.append(div);
        }
    }

    function hideEditStuff() {
        if (role.owner && !role.owner.includes(websiteStorage.user.currentUsername)) {
            editButton.style.display = "none";
        }
        mainRoleDisplay.style.display = "flex";
        document.querySelectorAll(".edit").forEach(element => element.style.display = "none");
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

                deleteButton.addEventListener("click", async function () {
                    role.special = role.special.filter(special1 => special1.name !== special.name);
                    await updateRole(role);
                    saveLocalStorage();
                    showSpecial();
                });
            }
            specialDisplay.append(list);
        }
    }

    function addSpecial() {
        document.getElementById("special-add-button").addEventListener("click", async function () {
            if (specialTypeSelection.value === "" || specialNameSelection.value === "") {
                return;
            }
            const special = {
                name: specialNameSelection.value,
                type: specialTypeSelection.value,
                value: document.getElementById("special-value-input").value,
                time: document.getElementById("special-time-selection").value,
                global: document.getElementById("special-global-selection").value
            }
            role.special.push(special);
            await updateRole(role);
            saveLocalStorage();
            showSpecial();
        });
    }

    function fillFirstNightInfoTextArea() {
        const firstNightRoles = [];
        for (const role1 of websiteStorage.officialRoles) {
            if (role1.firstNight) firstNightRoles.push(role1);
        }
        firstNightRoles.sort((a, b) => a.firstNight - b.firstNight);
        for (const role1 of firstNightRoles) {
            firstNightInfoText.innerHTML += role1.firstNight + " " + role1.name + "<br>";
        }
    }

    function fillOtherNightInfoTextArea() {
        const otherNightRoles = [];
        for (const role1 of websiteStorage.officialRoles) {
            if (role1.otherNight) otherNightRoles.push(role1);
        }
        otherNightRoles.sort((a, b) => a.otherNight - b.otherNight);
        for (const role1 of otherNightRoles) {
            otherNightInfoText.innerHTML += role1.otherNight + " " + role1.name + "<br>";
        }
    }

    function showScript() {
        scriptText.textContent = role.script;
    }

    function editScript() {
        scriptEditButton.addEventListener("click", async function () {
            role.script = scriptEditInput.value;
            scriptEditInput.value = "";
            await updateRole(role);
            saveLocalStorage();
            showScript();
        });
    }

    function showOwners() {
        ownerDisplay.style.display = inEditMode ? "flex" : "none";
        ownerDisplay.innerHTML = `<h2 style="margin: 5px">Owners</h2>`;
        for (const owner of role.owner) {
            const div = document.createElement("div");
            div.textContent = owner;
            if (websiteStorage.user.currentUsername !== owner) {
                const deleteButton = document.createElement("button");
                const deleteIcon = document.createElement("i");
                deleteIcon.setAttribute("class", "fa-solid fa-trash");
                deleteButton.append(deleteIcon);
                div.append(deleteButton);
                deleteButton.addEventListener("click", async function () {
                    role.owner = role.owner.filter(owner1 => owner1 !== owner);
                    await updateRole(role, false);
                    saveLocalStorage();
                    showOwners();
                });
            }
            ownerDisplay.append(div);
        }
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.style.maxWidth = "85px";
        input.style.height = "25px";
        const button = document.createElement("button");
        const plusIcon = document.createElement("i");
        plusIcon.setAttribute("class", "fa-solid fa-plus");
        button.append(plusIcon);
        div.append(input);
        div.append(button);
        ownerDisplay.append(div);
        button.addEventListener("click", async function () {
            if (!input.value) return;
            role.owner.push(input.value);
            await updateRole(role, false);
            saveLocalStorage();
            showOwners();
        });
    }

    function showRolePrivacy() {
        document.querySelector(".edit-privacy-display").style.display = inEditMode ? "flex" : "none";
        const privacyCheckbox = document.getElementById("privacy-checkbox");
        privacyCheckbox.checked = role.isPrivate;
        const privacyStatus = document.getElementById("privacy-status");
        loadPrivacyStatus();

        function loadPrivacyStatus() {
            const i = document.createElement("i");
            i.setAttribute("class", role.isPrivate ? "fa-solid fa-lock" : "fa-solid fa-lock-open");
            const p = document.createElement("p");
            p.textContent = role.isPrivate ? "Private (only you see this role)" : "Public (every one sees this role)";
            privacyStatus.innerHTML = "";
            privacyStatus.append(i);
            privacyStatus.append(p);
        }

        privacyCheckbox.addEventListener("click", async function () {
            if (!await databaseIsConnected()) {
                createPopup(document.querySelector(".wiki"), "There is currently no connection to the database");
                return;
            }
            role.isPrivate = privacyCheckbox.checked;
            saveLocalStorage();
            loadPrivacyStatus();

            if (role.isPrivate) {
                websiteStorage.localRoleIdeas.push(role);
                saveLocalStorage();
                await deleteRole(role);
            }
            if (!role.isPrivate) {
                websiteStorage.localRoleIdeas = websiteStorage.localRoleIdeas.filter(role1 => role1.createdAt !== role.createdAt);
                saveLocalStorage();
                await createRole(role);
            }
            createPopup(document.querySelector(".wiki"), "Successfully made role " + (role.isPrivate ? "private" : "public"), 5000, "green");
        });
    }
});
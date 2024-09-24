document.addEventListener("DOMContentLoaded", function () {

    const storageString = "websiteStorage1";
    const websiteStorage = JSON.parse(localStorage.getItem(storageString));
    const searchParameters = new URLSearchParams(window.location.search);
    const id = searchParameters.get("r");
    const wikiHeader = document.getElementById("wiki-header");
    const wikiRoleImage = document.getElementById("wiki-role-image");
    const editButton = document.getElementById("edit-button");
    const mainRoleDisplay = document.getElementById("main-role-display");
    const editRoleFieldDiv = document.getElementById("edit-role-field");
    const editRoleNameInput = document.getElementById("edit-role-name");
    const editCharacterTypeInput = document.getElementById("edit-character-type");
    const editAbilityTextInput = document.getElementById("edit-ability-text");
    const uploadImageURL = document.getElementById("image-input-url");
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
    const inputComment = document.getElementById("input-comment");
    const addCommentButton = document.getElementById("add-comment-button");
    const commentsList = document.getElementById("comments-list");
    const downloadJsonButton = document.getElementById("download-json-button");
    const deleteRoleDiv = document.getElementById("delete-role-div");
    const deleteConfirmationText = document.getElementById("delete-confirmation-text");
    const deleteConfirmationYesButton = document.getElementById("delete-confirmation-yes-button");
    const deleteConfirmationCancelButton = document.getElementById("delete-confirmation-cancel-button");
    const deletePopupBackground = document.getElementById("delete-popup-background");

    for (const role of websiteStorage.roleIdeas) {
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
        changeTags();
        showNightOrder();
        editNightOrder();
        fillFirstNightInfoTextArea();
        fillOtherNightInfoTextArea();
        editHowToRun();
        howToRunInput.value = role.howToRun;
        howToRunText.innerHTML = role.howToRun;
        showJinxes();
        editJinxes();
        showReminderTokens();
        editReminderTokens();
        showSpecial();
        addSpecial();
        showScript();
        editScript();
        showPersonalRating();
        displayComments();
        addComments();
        copyJsonString();
        deleteRoleListener();

        function displayComments() {
            commentsList.innerHTML = "";
            for (const comment of role.comments) {
                const list = document.createElement("li");
                list.setAttribute("class", "max-width comment");
                list.textContent = comment.text;
                const deleteButton = document.createElement("button");
                deleteButton.setAttribute("class", "icon-button");

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
            document.getElementById("first-night-reminder").textContent = "firstNightReminder: " + role.firstNightReminder;
            document.getElementById("other-night").textContent = "otherNight: " + role.otherNight;
            document.getElementById("other-night-reminder").textContent = "otherNightReminder: " + role.otherNightReminder;
        }

        function changeTags() {
            const tagCheckBoxes = document.querySelectorAll(".tag");
            for (const checkBox of tagCheckBoxes) {
                checkBox.addEventListener("click", function () {
                    if (checkBox.checked) {
                        role.tags.push(checkBox.name);
                    }
                    if (!checkBox.checked) {
                        role.tags = role.tags.filter(tag => tag !== checkBox.name);
                    }
                    saveLocalStorage();
                    showTags();
                });
            }
        }

        function showTags() {
            tagDisplay.textContent = "Tags: ";
            if (role.tags.length === 0) {
                return;
            }
            for (let i = 0; i < role.tags.length; i++) {
                tagDisplay.textContent += role.tags[i];
                document.getElementById(role.tags[i].replaceAll(" ", "-").toLowerCase() + "-tag").checked = true;
                if (i < role.tags.length - 1) {
                    tagDisplay.textContent += ", ";
                }
            }
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
                personalRoleRating.textContent = "Your rating: " + role.rating;
            }
        }

        function toggleEditMode() {
            document.getElementById("edit-button").addEventListener("click", function (event) {
                event.preventDefault();
                inEditMode = !inEditMode;

                if (inEditMode) {
                    editRoleFieldDiv.style.display = "flex";
                    mainRoleDisplay.style.display = "none";
                    editRoleNameInput.value = role.name;
                    editCharacterTypeInput.value = role.characterType;
                    editAbilityTextInput.value = role.ability;
                    howToRunInput.style.display = "block";
                    howToRunChangeButton.style.display = "block";
                    imageSubmission.style.display = "block";
                    deleteRoleDiv.style.display = "flex";
                    document.querySelectorAll(".edit-night-order").forEach(element => element.style.display = "flex");
                    firstNightInput.value = role.firstNight;
                    firstNightReminderInput.value = role.firstNightReminder;
                    otherNightInput.value = role.otherNight;
                    otherNightReminderInput.value = role.otherNightReminder;
                    showNightOrder();
                    editTags.style.display = "flex";
                    showTags();
                    firstNightInfoButton.style.display = "flex";
                    otherNightInfoButton.style.display = "flex";
                    jinxEditDiv.style.display = "flex";
                    showJinxes();
                    editReminderTokenDiv.style.display = "flex";
                    showReminderTokens();
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
                    showJinxes();
                    showSpecial();
                    showScript();
                }
            });
        }

        function changeImage() {
            document.getElementById("upload-button").addEventListener("click", function (event) {
                event.preventDefault();
                if (uploadImageURL.value === "") {
                    return;
                }
                role.image = uploadImageURL.value;
                wikiRoleImage.setAttribute("src", role.image);
                uploadImageURL.value = "";
                saveLocalStorage();
            });
        }

        function editNightOrder() {
            document.getElementById("edit-night-order-button").addEventListener("click", function (event) {
                event.preventDefault();
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
                saveLocalStorage();
                showNightOrder();
            });
        }

        function addComments() {
            addCommentButton.addEventListener("click", function (event) {
                event.preventDefault();
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

        function copyJsonString() {
            downloadJsonButton.addEventListener("click", function (event) {
                event.preventDefault();
                const jsonRole = {
                    id: role.name.toLowerCase().replaceAll(" ", "_"),
                    name: role.name,
                    ability: role.ability,
                    team: role.characterType.toLowerCase()
                }
                if (role.script !== "") {
                    jsonRole.id += "_" + role.script.toLowerCase().replaceAll(" ", "_");
                }
                if (role.image !== "") {
                    jsonRole.image = role.image;
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
                if (role.reminders.length > 0) {
                    jsonRole.reminders = "xyRemovexy[" + '"' + role.reminders.toString().replaceAll(",", "xyReminderTokenxy") + '"' + "]xyRemove1xy";
                }
                if (role.ability.includes("[") && role.ability.includes("]") || role.tags.includes("Setup")) {
                    jsonRole.setup = true;
                }
                if (role.jinxes.length > 0) {
                    jsonRole.jinxes = [];
                    for (const jinx of role.jinxes) {
                        const tempJinx = {
                            id: jinx.jinxedRole.toLowerCase().replace(" ", "_"),
                            reason: jinx.reason
                        }
                        jsonRole.jinxes.push(tempJinx);
                    }
                }
                if (role.special.length > 0) {
                    jsonRole.special = [];
                    for (const special of role.special) {
                        const tempSpecial = {
                            name: special.name,
                            type: special.type
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
                const emptyStrings = "        ";
                const jsonString = preString.replaceAll("},{", "},\n" + emptyStrings + emptyStrings + "  " + "{")
                    .replaceAll(',"reason"', "xyReasonxy")
                    .replaceAll(',"type"', "xyTypexy")
                    .replaceAll(',"value"', "xyValuexy")
                    .replaceAll(',"time"', "xyTimexy")
                    .replace("{", "{\n" + emptyStrings)
                    .replaceAll(',"', ',\n' + emptyStrings + '"')
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
                navigator.clipboard.writeText(jsonString).then();
            });
        }

        function deleteRoleListener() {
            deleteConfirmationText.textContent += " " + role.name + "?";
            document.getElementById("delete-role-button").addEventListener("click", function (event) {
                event.preventDefault();
                deletePopupBackground.style.display = "flex";
            });

            deleteConfirmationYesButton.addEventListener("click", function (event) {
                event.preventDefault();
                for (let i = 0; i < websiteStorage.roleIdeas.length; i++) {
                    if (websiteStorage.roleIdeas[i].createdAt === role.createdAt) {
                        websiteStorage.archive.push(websiteStorage.roleIdeas[i]);
                        websiteStorage.roleIdeas.splice(i, 1);
                        saveLocalStorage();
                        break;
                    }
                }
                window.location = "index.html";
            });

            deleteConfirmationCancelButton.addEventListener("click", function (event) {
                event.preventDefault();
                deletePopupBackground.style.display = "none";
            });
        }

        function editHowToRun() {
            howToRunChangeButton.addEventListener("click", function (event) {
                event.preventDefault();
                const input = document.getElementById("howtorun-input");
                role.howToRun = input.value;
                howToRunText.textContent = role.howToRun;
                saveLocalStorage();
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
                role.ability = editAbilityTextInput.value;
                saveLocalStorage();
                displayRole();
            });
        }

        function editJinxes() {
            jinxAddButton.addEventListener("click", function () {
                if (jinxRoleInput.value === "" || jinxTextInput.value === "") {
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

        function editReminderTokens() {
            reminderTokenAddButton.addEventListener("click", function () {
                if (reminderTokenInput.value === "") {
                    return;
                }
                role.reminders.push(reminderTokenInput.value);
                saveLocalStorage();
                reminderTokenInput.value = "";
                showReminderTokens();
            });
        }

        function showReminderTokens() {
            reminderTokenList.textContent = "";
            for (const reminderToken of role.reminders) {
                const list = document.createElement("li");
                list.textContent = reminderToken;
                if (inEditMode) {
                    const deleteButton = document.createElement("button");
                    const deleteIcon = document.createElement("i");
                    deleteIcon.setAttribute("class", "fa-solid fa-trash");
                    deleteButton.append(deleteIcon);
                    list.append(deleteButton);
                    deleteButton.addEventListener("click", function () {
                        role.reminders = role.reminders.filter(reminderToken1 => reminderToken1 !== reminderToken);
                        saveLocalStorage();
                        showReminderTokens();
                    });
                }
                reminderTokenList.append(list);
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
            const firstNightList = ["Lord of Typhon", "Philosopher", "Kazali", "Alchemist", "Poppy Grower",
                "Yaggababble", "Magician", "Minion info", "Snitch", "Lunatic", "Summoner", "Demon info", "King", "Sailor",
                "Marionette", "Engineer", "Preacher", "Lil Monsta", "Lleech", "Poisoner", "Widow", "Courtier", "Snake Charmer",
                "Godfather", "Devil´s Advocate", "Evil Twin", "Witch", "Cerenovus", "Fearmonger", "Harpy", "Mezepheles", "Pukka",
                "Pixie", "Huntsman", "Damsel", "Amnesiac", "Washerwoman", "Librarian", "Investigator", "Chef", "Empath",
                "Fortune Teller", "Butler", "Grandmother", "Clockmaker", "Dreamer", "Seamstress", "Steward", "Knight",
                "Noble", "Balloonist", "Shugenja", "Village Idiot", "Bounty Hunter", "Nightwatchman", "Cult Leader",
                "Spy", "Ogre", "High Priestess", "Chambermaid", "Mathematician", "Leviathan", "Vizier"];
            for (let i = 0; i < firstNightList.length; i++) {
                firstNightInfoText.innerHTML += (i + 6) + " " + firstNightList[i] + "<br>";
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
                otherNightInfoText.innerHTML += (i + 2) + " " + otherNightList[i] + "<br>";
            }
        }

        function showScript() {
            scriptText.textContent = "Script: " + role.script;
        }

        function editScript() {
            scriptEditButton.addEventListener("click", function (event) {
                event.preventDefault();
                role.script = scriptEditInput.value;
                scriptEditInput.value = "";
                saveLocalStorage();
                showScript();
            });
        }

        function saveLocalStorage() {
            localStorage.setItem(storageString, JSON.stringify(websiteStorage));
        }
    }
});
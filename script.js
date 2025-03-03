import {copyJsonString, roleWasEdited, showCopyPopup, allRoles, allTags, getTeamColor} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    let total = 0;
    for (const item in localStorage) {
        if (localStorage.hasOwnProperty(item)) {
            total += ((localStorage[item].length + item.length) * 2);
        }
    }
    console.log(`Total localStorage usage: ${(total / 1024).toFixed(2)} KB`);

    const storageString = "websiteStorage1";

    if (!localStorage.getItem(storageString)) {
        const storage = {
            roleIdeas: [],
            user: {
                page: 1,
                roleSearch: "",
                characterType: "All",
                sorting: "Newest first",
                onlyMyFavorites: false,
                scriptFilter: "All",
                tagFilter: "None",
                tempRole: {
                    createdAt: "0"
                }
            },
            archive: []
        }
        localStorage.setItem(storageString, JSON.stringify(storage));
    }

    const websiteStorage = JSON.parse(localStorage.getItem(storageString));

    adjustLocalStorage();

    for (const role of websiteStorage.roleIdeas) {
        if (role.createdAt === websiteStorage.user.tempRole.createdAt) {
            if (roleWasEdited(role, websiteStorage.user.tempRole)) {
                role.lastEdited = new Date();
                websiteStorage.user.tempRole.createdAt = "";
                saveLocalStorage();
                break;
            }
        }
    }

    const jsonInputTextarea = document.getElementById("json-input-textarea");
    const jsonAddRoleButton = document.getElementById("add-role-button");
    const roleFilter = document.querySelector(".role-filter");
    const roleSearch = document.getElementById("role-search");
    const characterTypeSelection = document.getElementById("character-type-selection");
    const sortingDropDownMenu = document.getElementById("sorting");
    const tagFilterSelection = document.getElementById("tag-filter-selection");
    const onlyMyFavoritesCheckBox = document.getElementById("only-my-favorites");
    const scriptFilterSelection = document.getElementById("script-filter-selection");
    const clearSearchesButton = document.getElementById("clear-searches-button");
    const homebrewRolesDisplay = document.getElementById("homebrewroles");
    const roleIdeaPageSelection = document.querySelector(".role-idea-page-selection");
    const scriptDownloadButton = document.getElementById("script-download-button");
    const localstorageDownloadButton = document.getElementById("localstorage-download-button");

    mobileSupportSetup();
    addRole();
    setupScriptSelection();
    setupTagFilterSelection();
    displayRoles();
    clearSearches();
    displayMisc();

    let roleCreationMode = 0;

    function displayRoles() {
        setFilters();
        const roles = filterRoles(websiteStorage.roleIdeas);
        sortRoles(roles);
        const roleIdeaArray = roles.slice((websiteStorage.user.page - 1) * 10, websiteStorage.user.page * 10);

        homebrewRolesDisplay.innerHTML = "";

        for (const role of roleIdeaArray) {

            const roleDiv = document.createElement("div");
            roleDiv.setAttribute("class", "role-div");

            roleDiv.style.background = getTeamColor(role.characterType);

            const roleImageAndText = document.createElement("div");
            roleImageAndText.setAttribute("class", "role-image-and-text");

            const roleImage = document.createElement("img");
            roleImage.setAttribute("class", "clocktower-icon");
            roleImage.setAttribute("src", "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
            roleImage.setAttribute("alt", role.name);
            if (role["image"]) {
                roleImage.setAttribute("src", role["image"]);
            }

            const roleText = document.createElement("div");
            roleText.textContent = role.name + " (" + role.characterType + "): " + role.ability;

            const buttons = document.createElement("div");
            buttons.setAttribute("class", "role-buttons");

            const rateInput = document.createElement("input");
            rateInput.setAttribute("class", "rate-input");
            rateInput.setAttribute("type", "number");
            rateInput.setAttribute("min", "0");
            rateInput.setAttribute("max", "10");

            const rateButton = document.createElement("button");

            const rateIcon = document.createElement("i");
            rateIcon.setAttribute("class", "fa-sharp fa-regular fa-star");

            if (role.rating > 0) {
                rateInput.value = role.rating.toString();
                rateIcon.setAttribute("class", "fa-solid fa-star");
                rateIcon.setAttribute("style", "color: #FFD43B;");
            }
            rateButton.append(rateIcon);

            const wikiButton = document.createElement("button");

            const wikiIcon = document.createElement("i");
            wikiIcon.setAttribute("class", "fa-solid fa-book");
            wikiButton.append(wikiIcon);

            const wikiAnchor = document.createElement("a");
            wikiAnchor.setAttribute("href", "wiki.html?r=" + role.createdAt);
            wikiAnchor.append(wikiButton);

            const favoriteButton = document.createElement("button");
            const favoriteIcon = document.createElement("i");
            favoriteIcon.setAttribute("class", "fa-light fa-heart");
            if (role.isFavorite) {
                favoriteIcon.setAttribute("class", "fa-solid fa-heart");
                favoriteIcon.classList.add("red");
            }
            if (!role.isFavorite) {
                favoriteIcon.classList.remove("red");
                favoriteIcon.setAttribute("class", "fa-light fa-heart");
            }
            favoriteButton.append(favoriteIcon);

            const downloadJsonButton = document.createElement("button");
            downloadJsonButton.style.position = "relative";
            const downloadIcon = document.createElement("i");
            downloadIcon.setAttribute("class", "fa-solid fa-download");
            downloadJsonButton.append(downloadIcon);

            roleImageAndText.append(roleImage);
            roleImageAndText.append(roleText);
            roleDiv.append(roleImageAndText);
            buttons.append(rateInput);
            buttons.append(rateButton);
            buttons.append(wikiAnchor);
            buttons.append(favoriteButton);
            buttons.append(downloadJsonButton);
            roleDiv.append(buttons);
            homebrewRolesDisplay.append(roleDiv);

            rateInput.addEventListener("input", function () {
                rateIcon.setAttribute("class", "fa-sharp fa-star");
                rateIcon.style.color = "black";
            });

            rateButton.addEventListener("click", function () {
                if (rateInput.value < 0) {
                    rateInput.value = "0";
                    return;
                }
                if (rateInput.value > 10) {
                    rateInput.value = "10";
                    return;
                }
                if (rateInput.value === "") {
                    return;
                }
                role.rating = Number.parseFloat(rateInput.value);
                saveLocalStorage();
                displayRoles();
            });

            wikiButton.addEventListener("click", function () {
                websiteStorage.user.tempRole = role;
                saveLocalStorage();
            });

            favoriteButton.addEventListener("click", function () {
                role.isFavorite = !role.isFavorite;
                displayRoles();
            });

            downloadJsonButton.addEventListener("click", function () {
                copyJsonString(role);
                showCopyPopup(downloadJsonButton);
            });
        }
        showPages(roles, roleIdeaArray);
    }

    for (const filter of document.querySelectorAll(".filter")) {
        filter.addEventListener(filter === roleSearch ? "input" : "change", function () {
            websiteStorage.user.roleSearch = roleSearch.value;
            websiteStorage.user.characterType = characterTypeSelection.value;
            websiteStorage.user.scriptFilter = scriptFilterSelection.value;
            if (filter === scriptFilterSelection && scriptFilterSelection.value !== "All") {
                scriptDownloadButton.textContent = "Download " + scriptFilterSelection.value;
            }
            websiteStorage.user.tagFilter = tagFilterSelection.value;
            websiteStorage.user.onlyMyFavorites = onlyMyFavoritesCheckBox.checked;
            websiteStorage.user.sorting = sortingDropDownMenu.value;
            saveLocalStorage();
            displayRoles();
            displayMisc();
        });
    }

    function sortRoles(roles) {
        const input = sortingDropDownMenu.value;
        if (input === "Newest first" || input === "Oldest first") {
            roles.sort((a, b) => a.createdAt - b.createdAt);
            if (input === "Newest first") {
                roles.reverse();
            }
        }
        if (input.includes("Alphabet")) {
            roles.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1);
            if (input === "Alphabet Z-A") {
                roles.reverse();
            }
        }
        if (input.includes("favorite first")) {
            roles.sort((a, b) => a.rating - b.rating);
            if (input === "Most favorite first") {
                roles.reverse();
            }
        }
        if (input === "Last Edited") {
            roles.sort((a, b) => Date.parse(b.lastEdited) - Date.parse(a.lastEdited));
        }
    }

    function showPages(array, pageArray) {
        if (pageArray.length === 0 && websiteStorage.user.page > 1) {
            websiteStorage.user.page -= 1;
            saveLocalStorage();
            displayRoles();
        }
        const pages = array.length / 10;
        if (array.length === 0) {
            homebrewRolesDisplay.innerHTML = "There is no role, that matches your search";
        }
        roleIdeaPageSelection.innerHTML = "";
        for (let i = 0; i < pages; i++) {
            const button = document.createElement("button");
            button.textContent = (i + 1).toString();
            button.classList.remove("blue");
            if (websiteStorage.user.page === Number.parseInt(button.textContent)) {
                button.setAttribute("class", "blue");
            }
            button.addEventListener("click", function () {
                websiteStorage.user.page = Number.parseInt(button.textContent);
                saveLocalStorage();
                document.querySelectorAll(".blue").forEach(element => element.classList.remove("blue"));
                if (websiteStorage.user.page === Number.parseInt(button.textContent)) {
                    button.setAttribute("class", "blue");
                }
                displayRoles();
            });
            roleIdeaPageSelection.append(button);
        }
    }

    function filterRoles(roles) {
        if (roleSearch.value !== "") {
            roles = roles.filter(role =>
                role.name.toUpperCase().includes(roleSearch.value.toUpperCase()) ||
                role.ability.toUpperCase().includes(roleSearch.value.toUpperCase()));
        }
        if (characterTypeSelection.value !== "All") {
            roles = roles.filter(role => role.characterType === characterTypeSelection.value);
        }
        if (tagFilterSelection.value !== "None" && tagFilterSelection.value !== "No Tags") {
            roles = roles.filter(role => role.tags.includes(tagFilterSelection.value));
        }
        if (tagFilterSelection.value === "No Tags") {
            roles = roles.filter(role => role.tags.length === 0);
        }
        if (onlyMyFavoritesCheckBox.checked) {
            roles = roles.filter(role => role.isFavorite);
        }
        if (scriptFilterSelection.value !== "All") {
            roles = roles.filter(role => role.script === scriptFilterSelection.value);
        }
        return roles;
    }

    function addRole() {
        document.getElementById("js-add-role").addEventListener("click", function () {
            const roleNameInput = document.getElementById("role-name");
            const characterTypeInput = document.getElementById("character-types");
            const abilityTextInput = document.getElementById("ability-text");
            if (roleNameInput.value === "" || characterTypeInput.value === "" || abilityTextInput.value === "") {
                return;
            }

            for (const role of websiteStorage.roleIdeas) {
                if (role.name === roleNameInput.value && role.ability === abilityTextInput.value) {
                    return;
                }
            }

            const role = {
                name: roleNameInput.value,
                characterType: characterTypeInput.value,
                ability: abilityTextInput.value,
                createdAt: Date.now().toString(),
                image: "",
                otherImage: "",
                rating: 0,
                isFavorite: false,
                tags: [],
                firstNight: 0,
                firstNightReminder: "",
                otherNight: 0,
                otherNightReminder: "",
                howToRun: "",
                jinxes: [],
                reminders: [],
                remindersGlobal: [],
                special: [],
                script: "",
                comments: [],
                lastEdited: new Date()
            }
            websiteStorage.roleIdeas.push(role);
            saveLocalStorage();
            roleNameInput.value = "";
            abilityTextInput.value = "";
            displayRoles();
        });
    }

    function clearSearches() {
        clearSearchesButton.addEventListener("click", function () {
            websiteStorage.user.roleSearch = "";
            websiteStorage.user.characterType = "All";
            websiteStorage.user.sorting = "Newest first"
            websiteStorage.user.authorSearch = "";
            websiteStorage.user.tagFilter = "None";
            websiteStorage.user.onlyMyIdeas = false;
            websiteStorage.user.onlyMyFavorites = false;
            websiteStorage.user.page = 1;
            websiteStorage.user.scriptFilter = "All";
            saveLocalStorage();
            displayRoles();
            displayMisc();
        });
    }

    function setupScriptSelection() {

        const scripts = ["All"];
        for (const role of websiteStorage.roleIdeas) {
            if (!scripts.includes(role.script) && role.script) {
                scripts.push(role.script);
            }
        }

        scriptFilterSelection.textContent = "";

        for (const script of scripts) {
            const option = document.createElement("option");
            option.setAttribute("value", script);
            option.textContent = script;
            scriptFilterSelection.append(option);
        }
    }

    function setFilters() {
        roleSearch.value = websiteStorage.user.roleSearch;
        characterTypeSelection.value = websiteStorage.user.characterType;
        sortingDropDownMenu.value = websiteStorage.user.sorting;
        onlyMyFavoritesCheckBox.checked = websiteStorage.user.onlyMyFavorites;
        scriptFilterSelection.value = websiteStorage.user.scriptFilter;
        tagFilterSelection.value = websiteStorage.user.tagFilter;
    }

    function saveLocalStorage() {
        localStorage.setItem(storageString, JSON.stringify(websiteStorage));
    }

    document.getElementById("switch-role-creation").addEventListener("click", function () {
        roleCreationMode++;
        if (roleCreationMode === 3) roleCreationMode = 0;

        document.querySelector(".create-main-role-attributes").style.display = roleCreationMode === 0 ? "flex" : "none";
        document.querySelector(".json-input-div").style.display = roleCreationMode === 1 ? "flex" : "none";
        document.querySelector(".script-upload-div").style.display = roleCreationMode === 2 ? "flex" : "none";
    });

    jsonAddRoleButton.addEventListener("click", function () {
        let text = jsonInputTextarea.value.replaceAll('""', '"');
        if (text[0] === '"') text = text.substring(1);
        if (text[text.length - 1] === '"') text = text.substring(0, text.length - 1);
        if (text[text.length - 1] === ',') text = text.substring(0, text.length - 1);
        if (!text.includes("id") || !text.includes("name") || !text.includes("team") || !text.includes("ability")) {
            return;
        }
        const role = JSON.parse(text);

        addRoleViaJson(role);
    });

    document.getElementById("script-upload").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file);

        reader.addEventListener("load", function (event) {
            const array = JSON.parse(event.target.result.toString());
            let script = "";

            for (const object of array) {
                if (object.id === "_meta") {
                    script = object.name.split(" v")[0];
                    break;
                }
            }

            for (const object of array) {
                if (!object.name || !object.ability || !object.team) continue;

                if (!object.id) {
                    object.id = object.name.toLowerCase().replaceAll(" ", "_");
                }

                let roleExists = false;

                for (const role of websiteStorage.roleIdeas) {
                    if (role.name === object.name || role.ability === object.ability) {
                        roleExists = true;
                        break;
                    }
                }
                if (roleExists) {
                    roleExistsMessage(object);
                    continue;
                }
                if (script) object.script = script;
                addRoleViaJson(object);
            }
        });
    });

    scriptDownloadButton.addEventListener("click", function () {

        if (scriptFilterSelection.value === "All") return;

        let content = [];
        const script = scriptDownloadButton.textContent.replace("Download ", "");

        const meta = {
            id: "_meta",
            name: script
        }

        content.push(meta);
        const roles = filterRoles(websiteStorage.roleIdeas);

        if (roles.length === 0) return;

        for (const role of roles) {
            content.push(copyJsonString(role));
        }

        const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 4));
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = script + ".json";
        link.click();
    });

    localstorageDownloadButton.addEventListener("click", function () {

        const content = [];

        for (const role of websiteStorage.roleIdeas) {
            let tempRole = {};

            for (let attribute in role) {
                if (!role[attribute]) {
                    continue;
                }
                if (Array.isArray(role[attribute]) && role[attribute].length === 0 && attribute !== "tags") {
                    continue;
                }
                if (attribute === "rating") {
                    continue;
                }
                if (attribute === "characterType") {
                    tempRole.team = role[attribute];
                    continue;
                }
                if (attribute === "jinxes" && Array.isArray(role.jinxes)) {
                    const jinxes = [];

                    for (const jinx of role.jinxes) {
                        jinxes.push({
                            id: jinx.jinxedRole.toLowerCase().replaceAll(" ", "_"),
                            reason: jinx.reason
                        });
                    }
                    tempRole.jinxes = jinxes;
                    continue;
                }
                tempRole[attribute] = role[attribute];
            }
            tempRole.id = tempRole.name.toLowerCase().replaceAll(" ", "_");
            if (tempRole.script) tempRole.id += "_" + tempRole.script.toLowerCase().replaceAll(" ", "_");
            content.push(tempRole);
        }

        const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
        const link = document.createElement("a");
        link.href = dataUrl;
        const today = new Date();
        const completeDate = "(" + (today.getDate() < 10 ? "0" : "") + today.getDate() + "." + (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1) + "." + today.getUTCFullYear() + " - " + today.getHours() + "." + today.getMinutes() + " Uhr)";
        link.download = "Clocktower Homebrew Collection " + completeDate + ".json";
        link.click();
    });

    function mobileSupportSetup() {

        setup();

        window.addEventListener("resize", function () {
            setup();
        });

        function setup() {
            if (window.innerWidth <= 400) {
                roleFilter.append(roleSearch);
                document.querySelector(".character-type-selection-div").style.marginTop = "10px";
                roleFilter.append(document.querySelector(".character-type-selection-div"));
                roleFilter.append(document.getElementById("script-filter-selection-div"));
                roleFilter.append(document.querySelector(".tag-div"));
                roleFilter.append(document.querySelector(".only-my-favorites-div"));
                roleFilter.append(clearSearchesButton);
                roleFilter.append(document.querySelector(".sorting-role-display"));
            }
        }
    }

    function setupTagFilterSelection() {
        tagFilterSelection.innerText = "";
        const modifiedAllTags = ["None"].concat(allTags).concat("No Tags");
        for (const tag of modifiedAllTags) {
            const option = document.createElement("option");
            option.innerHTML = tag;
            option.setAttribute("value", tag);
            tagFilterSelection.append(option);
        }
    }

    function adjustLocalStorage() {
        if (!websiteStorage.user) {
            websiteStorage.user = {
                page: 1,
                roleSearch: "",
                characterType: "All",
                sorting: "Newest first",
                onlyMyFavorites: false,
                scriptFilter: "All",
                tagFilter: "None",
                tempRole: {
                    createdAt: "0"
                }
            }
            localStorage.setItem(storageString, JSON.stringify(websiteStorage));
        }

        if (websiteStorage.page) {
            websiteStorage.page = undefined;
        }

        if (websiteStorage.users) {
            websiteStorage.users = undefined;
        }

        for (const role of websiteStorage.roleIdeas) {
            if (role.key !== undefined) {
                role.createdAt = role.key;
                role.key = undefined;
            }
            if (role.imageUrl !== undefined) {
                role.image = role.imageUrl;
                role.imageUrl = undefined;
            }
            if (role.reminderTokens !== undefined) {
                role.reminders = role.reminderTokens;
                role.reminderTokens = undefined;
            }
            if (role.abilityText !== undefined) {
                role.ability = role.abilityText;
                role.abilityText = undefined;
            }
            if (role.howtorun !== undefined) {
                role.howToRun = role.howtorun;
                role.howtorun = undefined;
            }
            if (role.owner !== undefined) role.owner = undefined;
            if (role.inEditMode !== undefined) role.inEditMode = undefined;
            if (role.onlyPrivateComments !== undefined) role.onlyPrivateComments = undefined;
            if (role.jinxes === undefined) role.jinxes = [];
            if (role.isFavorite === undefined) role.isFavorite = false;
            if (Array.isArray(role.rating)) role.rating = 0;
            if (role.special === undefined) role.special = [];
            if (role.reminders === undefined) role.reminders = [];
            if (role.remindersGlobal === undefined) role.remindersGlobal = [];
            if (!role.lastEdited) role.lastEdited = new Date(role.createdAt);
            if (role.otherImage === undefined) role.otherImage = "";
            if (role.tags === undefined) role.tags = [];

            role.tags = role.tags.filter(tag => tag.toString() !== "Does Not Wake" && tag.toString() !== "Noms Votes Exes");
            role.image = role.image.replaceAll("\\", "");
        }

        if (websiteStorage.user.tempRole === undefined) websiteStorage.user.tempRole = {createdAt: "0"}

        saveLocalStorage();
    }

    function addRoleViaJson(role) {
        for (const role1 of websiteStorage.roleIdeas) {
            if (role1.name === role.name && role1.characterType.toLowerCase() === role.team.toLowerCase()) {
                roleExistsMessage(role, true);
                return;
            }
        }

        for (const role1 of allRoles) {
            if (role1.name.toLowerCase().replaceAll("_", "").replaceAll(" ", "") ===
                role.name.toLowerCase().replaceAll("_", "").replaceAll(" ", "")) {
                return;
            }
        }

        role.createdAt = Date.now().toString();
        for (const role1 of websiteStorage.roleIdeas) {
            if (role1.createdAt === role.createdAt) {
                let number = role1.createdAt;
                number++;
                role.createdAt = number.toString();
            }
        }
        role.characterType = role.team[0].toUpperCase() + role.team.substring(1);
        role.team = undefined;
        if (role.image === undefined) role.image = "";
        if (role.otherImage === undefined) role.otherImage = "";
        if (Array.isArray(role.image)) {
            const images = role.image;
            role.image = images[0].replaceAll("\\", "");
            if (images.length > 1) {
                role.otherImage = images[1].replaceAll("\\", "");
            }
        }
        if (typeof (role.image) === "string") {
            role.image = role.image.replaceAll("\\", "");
        }
        if (role.firstNight === undefined) role.firstNight = 0;
        if (role.firstNightReminder === undefined) role.firstNightReminder = "";
        if (role.otherNight === undefined) role.otherNight = 0;
        if (role.otherNightReminder === undefined) role.otherNightReminder = "";
        if (role.jinxes === undefined) role.jinxes = [];

        for (let i = 0; i < role.jinxes.length; i++) {
            const jinx = role.jinxes[i];
            if (jinx.id === "") jinx.id = undefined;
            if (!jinx.id || !jinx.reason) continue;
            jinx.createdAt = (Date.now() + i).toString();
            jinx.jinxedRole = jinx.id[0].toUpperCase();
            for (let j = 1; j < jinx.id.length; j++) {
                if (jinx.id[j] === "_") {
                    jinx.jinxedRole += " ";
                    continue;
                }
                if (jinx.id[j - 1] === "_") {
                    jinx.jinxedRole += jinx.id[j].toUpperCase();
                    continue;
                }
                jinx.jinxedRole += jinx.id[j];
            }
            jinx.id = undefined;
        }
        if (role.reminders === undefined) role.reminders = [];
        if (role.remindersGlobal === undefined) role.remindersGlobal = [];
        if (role.special === undefined) role.special = [];
        for (const special of role.special) {
            if (special.time === undefined) {
                special.time = "";
            }
            if (special.value === undefined) {
                special.value = "";
            }
        }
        role.rating = 0;
        role.isFavorite = false;
        if (!role.tags) {
            role.tags = autoAddTags(role);
        }
        role.howToRun = "";
        if (!role.script) role.script = "";
        role.script = role.script.split(" v")[0];
        role.comments = [];
        role.lastEdited = new Date();
        websiteStorage.roleIdeas.push(role);
        saveLocalStorage();
        jsonInputTextarea.value = "";
        displayRoles();
    }

    function autoAddTags(role) {
        const tags = [];

        function has(string) {
            return role.ability.toLowerCase().includes(string.toLowerCase());
        }

        if (has("drunk") || has("poison") || has("false info") || has("register")) {
            tags.push("Misinformation");
        }
        if (has("safe") || has("cannot die") || has("can´t die")) {
            tags.push("Protection");
        }
        if (has("win") && !has("knowing") || has("lose") && !has("ability")) {
            tags.push("Wincondition");
        }
        if (has("become") && !has("alignment") && !has("evil") && !has("good") || has("swap")) {
            tags.push("Character Changing");
        }
        if (has("[") && has("]")) {
            tags.push("Setup");
        }
        if (has("mad")) {
            tags.push("Madness");
        }
        if (has("nominat") || has("vot") || has("execut") || has("nominee")) {
            tags.push("Nomination Phase");
        }
        if (has("visit") || has("Storyteller") && !has("believe") && !has("think") || has("privately")) {
            tags.push("ST Consult");
        }
        if (has("When you die") || has("If you die")) {
            tags.push("When You Die");
        }
        if (has("revive") || has("resurrect")) {
            tags.push("Resurrection");
        }
        if ((has("become") || has("turn")) && (has("alignment") || has("evil") || has("good"))) {
            tags.push("Alignment Switching");
        }
        if (has("public")) {
            tags.push("Public");
        }
        if (has("neighbour") || has("neighbor") || has("step") || has("close") || has("near")) {
            tags.push("Seating Order");
        }
        return tags;
    }

    function displayMisc() {
        scriptDownloadButton.textContent = "Download " + websiteStorage.user.scriptFilter;
        if (scriptFilterSelection.value === "All") {
            scriptDownloadButton.style.display = "none";
        } else {
            scriptDownloadButton.style.display = "flex";
        }
    }

    function roleExistsMessage(role, showAlert = false) {
        console.log("Role already exists! \n%c" + role.name + " (" + role.team[0].toUpperCase() + role.team.substring(1) + "): %c" + role.ability,
            "color: " + getTeamColor(role.team), "color: white");

        if (showAlert) {
            alert("Role already exists! \n" + role.name + " (" + role.team[0].toUpperCase() + role.team.substring(1) + "): " + role.ability + " already exists!");
        }
    }
});
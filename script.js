import {
    getJsonString, allTags, getTeamColor, updateRole, API_URL, createPopup, databaseIsConnected,
    getRoleIdeas, websiteStorage, saveLocalStorage, n, roleAlreadyExists, loginStorage
} from "./functions.js";
import {
    generateUniqueCreatedAt, normalizeRoleImage, normalizeRoleDefaults, normalizeJinxes, normalizeSpecial,
    normalizeRoleTags, migrateRoleRating, migrateRoleFavorite, migrateRoleOwnership, migrateRoleLastEdited,
    createRoleFromForm
} from "./roleData.js";

document.addEventListener("DOMContentLoaded", async function () {

    const storageString = "websiteStorage1";

    if (!localStorage.getItem(storageString)) {
        const storage = {
            localRoleIdeas: [],
            roleIdeas: [],
            user: {
                page: 1,
                roleSearch: "",
                characterType: "All",
                sorting: "Newest first",
                onlyMyFavorites: false,
                scriptFilter: "All",
                tagFilter: "None",
                ownerFilter: "All",
                databaseFilter: "All",
                roleCreationMode: 0
            },
            archive: []
        }
        localStorage.setItem(storageString, JSON.stringify(storage));
        window.location.reload();
    }

    if (!localStorage.getItem("login-page") || !loginStorage.name) {
        window.location = "https://bread-005.github.io/login-page/index.html";
        return;
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
    const clearFiltersButton = document.getElementById("clear-filters-button");
    const ownerSelection = document.getElementById("owner-selection");
    const databaseSelection = document.getElementById("database-selection");
    const homebrewRolesDisplay = document.getElementById("homebrewroles");
    const roleIdeaPageSelection = document.querySelector(".role-idea-page-selection");
    const rolesDownloadButton = document.getElementById("roles-download-button");
    const loginButton = document.querySelector(".login-button");
    const ownerFilter = document.querySelector(".owner-filter");
    const switchRoleCreationButton = document.getElementById("switch-role-creation");
    const jsAddRoleButton = document.getElementById("js-add-role");
    const scriptUploadInput = document.getElementById("script-upload");
    const characterTypeSelectionDiv = document.querySelector(".character-type-selection-div");
    const scriptFilterSelectionDiv = document.getElementById("script-filter-selection-div");
    const tagFilterDiv = document.querySelector(".tag-div");
    const onlyMyFavoritesDiv = document.querySelector(".only-my-favorites-div");
    const sortingRoleDisplay = document.querySelector(".sorting-role-display");
    const mainPage = document.querySelector(".main-page");

    const filterFieldBindings = [
        {element: roleSearch, storageKey: "roleSearch"},
        {element: characterTypeSelection, storageKey: "characterType"},
        {element: scriptFilterSelection, storageKey: "scriptFilter"},
        {element: tagFilterSelection, storageKey: "tagFilter"},
        {element: onlyMyFavoritesCheckBox, storageKey: "onlyMyFavorites", isCheckbox: true},
        {element: sortingDropDownMenu, storageKey: "sorting"},
        {element: ownerSelection, storageKey: "ownerFilter"},
        {element: databaseSelection, storageKey: "databaseFilter"}
    ];

    websiteStorage.officialRoles = await fetch("./officialCharacters.json").then(res => res.json());
    adjustLocalStorage();
    saveLocalStorage();

    if (await databaseIsConnected()) {
        websiteStorage.roleIdeas = await fetch(API_URL + '/roles').then(res => res.json());
        saveLocalStorage();
        document.getElementById("current-username-display").textContent = "Username: " + loginStorage.name;
        loginButton.textContent = "logout";

        const users = await fetch(API_URL + "/users").then(res => res.json());
        if (loginStorage.password !== users.find(user => user.name === loginStorage.name)?.password) {
            window.location = "https://bread-005.github.io/login-page/index.html";
            return;
        }

        await fetch(API_URL + '/users/update/' + loginStorage.name, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'}
        });

    } else {
        websiteStorage.user.ownerFilter = "All";
        saveLocalStorage();
    }

    mobileSupportSetup();
    addRole();
    setupScriptSelection();
    setupTagFilterSelection();
    setupOwnerFilterSelection();
    clearFilters();
    displayRoles();
    displayRoleCreation();

    function displayRoles() {
        setFilters();
        const roles = filterRoles(getRoleIdeas());
        sortRoles(roles);
        const roleIdeaArray = roles.slice((websiteStorage.user.page - 1) * 10, websiteStorage.user.page * 10);

        homebrewRolesDisplay.innerHTML = "";
        for (const role of roleIdeaArray) {
            homebrewRolesDisplay.append(createRoleCard(role));
        }
        showPages(roles, roleIdeaArray);
    }

    function createRoleCard(role) {
        const roleDiv = document.createElement("div");
        roleDiv.setAttribute("class", "role-div");
        roleDiv.style.background = getTeamColor(role.characterType);

        roleDiv.append(createRoleImageAndText(role));
        roleDiv.append(createRoleButtons(role));

        return roleDiv;
    }

    function createRoleImageAndText(role) {
        const roleImageAndText = document.createElement("div");
        roleImageAndText.setAttribute("class", "role-image-and-text");

        const roleImage = document.createElement("img");
        roleImage.setAttribute("class", "clocktower-icon");
        roleImage.setAttribute("src", role.image ? role.image : "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
        roleImage.setAttribute("alt", role.name);

        const roleText = document.createElement("div");
        roleText.setAttribute("class", "role-text");
        roleText.textContent = role.name + " (" + role.characterType + "): " + role.ability;

        roleImageAndText.append(roleImage);
        roleImageAndText.append(roleText);

        return roleImageAndText;
    }

    function createRoleButtons(role) {
        const buttons = document.createElement("div");
        buttons.setAttribute("class", "role-buttons");

        buttons.append(...createRateControl(role));
        buttons.append(createWikiAnchor(role));
        buttons.append(createFavoriteButton(role));
        buttons.append(createDownloadJsonButton(role));

        return buttons;
    }

    function createRateControl(role) {
        const rateInput = document.createElement("input");
        rateInput.setAttribute("class", "rate-input");
        rateInput.setAttribute("type", "number");
        rateInput.setAttribute("min", "0");
        rateInput.setAttribute("max", "10");

        const rateButton = document.createElement("button");

        const rateIcon = document.createElement("i");
        rateIcon.setAttribute("class", "fa-sharp fa-regular fa-star");

        if (role.rating.find(rating => rating.user === loginStorage.name && rating.score > 0)) {
            rateInput.value = role.rating.find(rating => rating.user === loginStorage.name).score;
            rateIcon.setAttribute("class", "fa-solid fa-star");
            rateIcon.setAttribute("style", "color: #FFD43B;");
        }
        rateButton.append(rateIcon);

        rateInput.addEventListener("input", function () {
            rateIcon.setAttribute("class", rateInput.value === "" ? "fa-sharp fa-regular fa-star" : "fa-sharp fa-star");
            rateIcon.style.color = "black";
        });

        rateButton.addEventListener("click", async function () {
            if (rateInput.value === "") {
                return;
            }
            rateInput.value = Math.min(Math.max(Number.parseFloat(rateInput.value), 0), 10).toString();
            if (role.rating.find(rating => rating.user === loginStorage.name)) {
                role.rating.find(rating => rating.user === loginStorage.name).score = Number.parseFloat(rateInput.value);
            } else {
                role.rating.push({
                    user: loginStorage.name,
                    score: Number.parseFloat(rateInput.value)
                });
            }
            await updateRole(role, "rating", false);
            saveLocalStorage();
            displayRoles();
        });

        return [rateInput, rateButton];
    }

    function createWikiAnchor(role) {
        const wikiButton = document.createElement("button");

        const wikiIcon = document.createElement("i");
        wikiIcon.setAttribute("class", "fa-solid fa-book");
        wikiButton.append(wikiIcon);

        const wikiAnchor = document.createElement("a");
        wikiAnchor.setAttribute("href", "wiki.html?name=" + role.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9-_]/g, "") + "&r=" + role.createdAt);
        wikiAnchor.append(wikiButton);

        return wikiAnchor;
    }

    function createFavoriteButton(role) {
        const favoriteButton = document.createElement("button");
        const favoriteIcon = document.createElement("i");
        if (role.favoriteList.includes(loginStorage.name)) {
            favoriteIcon.setAttribute("class", "fa-solid fa-heart");
            favoriteIcon.classList.add("red");
        } else {
            favoriteIcon.setAttribute("class", "fa-light fa-heart");
        }
        favoriteButton.append(favoriteIcon);

        favoriteButton.addEventListener("click", async function () {
            if (role.favoriteList.includes(loginStorage.name)) {
                role.favoriteList = role.favoriteList.filter(name => name !== loginStorage.name);
            } else {
                role.favoriteList.push(loginStorage.name);
            }
            await updateRole(role, "favoriteList", false);
            saveLocalStorage();
            displayRoles();
        });

        return favoriteButton;
    }

    function createDownloadJsonButton(role) {
        const downloadJsonButton = document.createElement("button");
        downloadJsonButton.style.position = "relative";
        const downloadIcon = document.createElement("i");
        downloadIcon.setAttribute("class", "fa-solid fa-download");
        downloadJsonButton.append(downloadIcon);

        downloadJsonButton.addEventListener("click", function () {
            getJsonString(role, true);
            createPopup(mainPage, "Role Json copied to Clipboard", 3500, "lightblue");
        });

        return downloadJsonButton;
    }

    for (const filter of document.querySelectorAll(".filter")) {
        filter.addEventListener(filter === roleSearch ? "input" : "change", function () {
            for (const binding of filterFieldBindings) {
                websiteStorage.user[binding.storageKey] = binding.isCheckbox
                    ? binding.element.checked
                    : binding.element.value;
            }
            saveLocalStorage();
            displayRoles();
        });
    }

    function averageRating(role) {
        const totalScore = role.rating.reduce((sum, rating) => sum + rating.score, 0);
        return totalScore === 0 ? 0 : totalScore / role.rating.length;
    }

    function sortRoles(roles) {
        const roleSorters = {
            "Newest first": (a, b) => Number(b.createdAt) - Number(a.createdAt),
            "Oldest first": (a, b) => Number(a.createdAt) - Number(b.createdAt),
            "Alphabet A-Z": (a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1,
            "Alphabet Z-A": (a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : -1,
            "Most favorite first": (a, b) => averageRating(b) - averageRating(a),
            "Least favorite first": (a, b) => averageRating(a) - averageRating(b),
            "Last Edited": (a, b) => Number(b.lastEdited) - Number(a.lastEdited)
        };
        const sorter = roleSorters[sortingDropDownMenu.value];
        if (sorter) {
            roles.sort(sorter);
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
            homebrewRolesDisplay.innerHTML = "There is no role, that matches your filters";
        }
        roleIdeaPageSelection.innerHTML = "";
        for (let i = 0; i < pages; i++) {
            const button = document.createElement("button");
            button.textContent = (i + 1).toString();
            if (websiteStorage.user.page === Number.parseInt(button.textContent)) {
                button.setAttribute("class", "blue");
            }
            button.addEventListener("click", function () {
                const scrollPositionBeforeRerender = window.scrollY;
                websiteStorage.user.page = Number.parseInt(button.textContent);
                saveLocalStorage();
                document.querySelectorAll(".blue").forEach(element => element.classList.remove("blue"));
                if (websiteStorage.user.page === Number.parseInt(button.textContent)) {
                    button.setAttribute("class", "blue");
                }
                displayRoles();
                window.scrollTo(0, scrollPositionBeforeRerender);
            });
            roleIdeaPageSelection.append(button);
        }
    }

    function roleMatchesSearch(role) {
        return roleSearch.value === "" ||
            role.name.toUpperCase().includes(roleSearch.value.toUpperCase()) ||
            role.ability.toUpperCase().includes(roleSearch.value.toUpperCase());
    }

    function roleMatchesCharacterType(role) {
        return characterTypeSelection.value === "All" || role.characterType === characterTypeSelection.value;
    }

    function roleMatchesTagFilter(role) {
        if (tagFilterSelection.value === "No Tags") return role.tags.length === 0;
        if (tagFilterSelection.value === "None") return true;
        return role.tags.includes(tagFilterSelection.value);
    }

    function roleMatchesFavoriteFilter(role) {
        return !onlyMyFavoritesCheckBox.checked || role.favoriteList.includes(loginStorage.name);
    }

    function roleMatchesScriptFilter(role) {
        return scriptFilterSelection.value === "All" || role.script === scriptFilterSelection.value;
    }

    function roleMatchesOwnerFilter(role) {
        return websiteStorage.user.ownerFilter === "All" || role.owner.includes(websiteStorage.user.ownerFilter);
    }

    function roleMatchesDatabaseFilter(role) {
        if (websiteStorage.user.databaseFilter === "Only Private") return role.isPrivate;
        if (websiteStorage.user.databaseFilter === "Only Public") return !role.isPrivate;
        return true;
    }

    function filterRoles(roles) {
        const roleFilterPredicates = [
            roleMatchesSearch, roleMatchesCharacterType, roleMatchesTagFilter, roleMatchesFavoriteFilter,
            roleMatchesScriptFilter, roleMatchesOwnerFilter, roleMatchesDatabaseFilter
        ];
        return roles.filter(role => roleFilterPredicates.every(matches => matches(role)));
    }

    function addRole() {
        jsAddRoleButton.addEventListener("click", handleAddRoleClick);
    }

    function saveNewRole(role, inputsToClear) {
        websiteStorage.localRoleIdeas.push(role);
        saveLocalStorage();
        for (const input of inputsToClear) {
            input.value = "";
        }
        window.location.reload();
    }

    function handleAddRoleClick() {
        const roleNameInput = document.getElementById("role-name");
        const characterTypeInput = document.getElementById("character-types");
        const abilityTextInput = document.getElementById("ability-text");
        if (roleNameInput.value === "" || characterTypeInput.value === "" || abilityTextInput.value === "") {
            return;
        }

        const role = createRoleFromForm(roleNameInput.value, characterTypeInput.value, abilityTextInput.value, loginStorage.name);
        if (roleAlreadyExists(role)) return;

        saveNewRole(role, [roleNameInput, abilityTextInput]);
    }

    function clearFilters() {
        if (!getRoleIdeas().find(role => role.script === websiteStorage.user.scriptFilter)) {
            websiteStorage.user.scriptFilter = "All";
            saveLocalStorage();
        }
        clearFiltersButton.addEventListener("click", function () {
            websiteStorage.user.roleSearch = "";
            websiteStorage.user.characterType = "All";
            websiteStorage.user.sorting = "Newest first"
            websiteStorage.user.tagFilter = "None";
            websiteStorage.user.onlyMyFavorites = false;
            websiteStorage.user.page = 1;
            websiteStorage.user.scriptFilter = "All";
            websiteStorage.user.ownerFilter = "All";
            websiteStorage.user.databaseFilter = "All";
            saveLocalStorage();
            displayRoles();
        });
    }

    function populateSelectOptions(selectElement, values) {
        selectElement.innerText = "";
        for (const value of values) {
            const option = document.createElement("option");
            option.setAttribute("value", value);
            option.textContent = value;
            selectElement.append(option);
        }
    }

    function setupScriptSelection() {
        const scripts = ["All"];
        for (const role of getRoleIdeas()) {
            if (!scripts.includes(role.script) && role.script) {
                scripts.push(role.script);
            }
        }
        populateSelectOptions(scriptFilterSelection, scripts);
    }

    function setFilters() {
        for (const binding of filterFieldBindings) {
            if (binding.isCheckbox) {
                binding.element.checked = websiteStorage.user[binding.storageKey];
            } else {
                binding.element.value = websiteStorage.user[binding.storageKey];
            }
        }
    }

    switchRoleCreationButton.addEventListener("click", function () {
        websiteStorage.user.roleCreationMode += 1;
        if (websiteStorage.user.roleCreationMode === 3) websiteStorage.user.roleCreationMode = 0;
        saveLocalStorage();
        displayRoleCreation();
    });

    jsonAddRoleButton.addEventListener("click", function () {
        let text = jsonInputTextarea.value.replaceAll('""', '"');
        if (text[0] === '"') text = text.substring(1);
        if (text[text.length - 1] === '"') text = text.substring(0, text.length - 1);
        if (text[text.length - 1] === ',') text = text.substring(0, text.length - 1);
        try {
            const role = JSON.parse(text);

            if (!role.id || !role.name || !role.ability || !role.team) {
                createPopup(mainPage, "every role has to have these attributes: id, name, ability, team");
                return;
            }
            addRoleViaJson(role);
        } catch (err) {
            createPopup(mainPage, "Your role has to be valid JSON!");
        }
    });

    scriptUploadInput.addEventListener("change", function (event) {
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
                if (script) object.script = script;
                addRoleViaJson(object);
            }
        });
    });

    rolesDownloadButton.addEventListener("click", () => {
        let content = "[";

        const meta = {
            id: "_meta",
            name: "CHC " + new Date().toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }) + " - " + (scriptFilterSelection.value === "All" ? "All Roles" : scriptFilterSelection.value + " Roles")
        }
        content += JSON.stringify(meta) + "," + n;

        const roles = filterRoles(getRoleIdeas());

        for (const role of roles) {
            const tempRole = {};
            for (const attribute in role) {
                if (!role[attribute] || role[attribute].length === 0) continue;
                tempRole[attribute] = role[attribute];
            }
            content += JSON.stringify(tempRole, null, 4) + "," + n;
        }
        content = content.replace(/,\s*$/, n + "]");
        const link = document.createElement("a");
        link.href = "data:application/json;charset=utf-8," + content;
        link.download = meta.name + ".json";
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
                characterTypeSelectionDiv.style.marginTop = "10px";
                roleFilter.append(characterTypeSelectionDiv);
                roleFilter.append(scriptFilterSelectionDiv);
                roleFilter.append(tagFilterDiv);
                roleFilter.append(onlyMyFavoritesDiv);
                roleFilter.append(clearFiltersButton);
                roleFilter.append(sortingRoleDisplay);
            }
        }
    }

    function setupTagFilterSelection() {
        const modifiedAllTags = ["None"].concat(allTags).concat("No Tags");
        populateSelectOptions(tagFilterSelection, modifiedAllTags);
    }

    function addRoleViaJson(role) {
        role.characterType = role.team[0].toUpperCase() + role.team.substring(1);
        if (roleAlreadyExists(role)) return;
        role.team = undefined;

        role.createdAt = generateUniqueCreatedAt(Date.now().toString());
        normalizeRoleImage(role);
        normalizeRoleDefaults(role);
        normalizeJinxes(role.jinxes);
        normalizeSpecial(role.special);
        normalizeRoleTags(role);

        role.rating = [];
        role.favoriteList = [];
        role.howToRun = "";
        role.comments = [];
        role.lastEdited = Date.now().toString();
        role.isPrivate = true;
        role.owner = [loginStorage.name];

        saveNewRole(role, [jsonInputTextarea]);
    }

    loginButton.addEventListener("click", () => window.location = "https://bread-005.github.io/login-page/index.html");

    function adjustLocalStorage() {
        ensureUserDefaults();
        removeObsoleteFields();
        migrateLegacyRoles();
        saveLocalStorage();
    }

    function ensureUserDefaults() {
        if (!websiteStorage.user) {
            websiteStorage.user = {
                page: 1,
                roleSearch: "",
                characterType: "All",
                sorting: "Newest first",
                onlyMyFavorites: false,
                scriptFilter: "All",
                tagFilter: "None",
                ownerFilter: "All",
                databaseFilter: "All",
                roleCreationMode: 0
            }
        }
        if (!websiteStorage.localRoleIdeas) {
            websiteStorage.localRoleIdeas = [];
        }
        if (!websiteStorage.user.databaseFilter) {
            websiteStorage.user.databaseFilter = "All";
        }
        if (!websiteStorage.user.roleCreationMode) {
            websiteStorage.user.roleCreationMode = 0;
        }
    }

    // Removes fields from earlier storage schema versions that are no longer read anywhere.
    function removeObsoleteFields() {
        delete websiteStorage.scriptToolRoles;
        delete websiteStorage.user.databaseUse;
        delete websiteStorage.user.tempRole;
        delete websiteStorage.user.currentUsername;
        delete websiteStorage.user.password;
        delete websiteStorage.user.tempMessage;
    }

    function migrateLegacyRoles() {
        for (const role of websiteStorage.localRoleIdeas) {
            migrateRoleRating(role);
            migrateRoleFavorite(role);
            migrateRoleOwnership(role);
            migrateRoleLastEdited(role);
        }
    }

    function setupOwnerFilterSelection() {
        ownerFilter.style.display = "flex";
        const allOwners = ["All"];
        for (const role of getRoleIdeas()) {
            for (const owner of role.owner) {
                if (!allOwners.includes(owner)) {
                    allOwners.push(owner);
                }
            }
        }
        populateSelectOptions(ownerSelection, allOwners);
    }

    function displayRoleCreation() {
        document.querySelector(".create-main-role-attributes").style.display = websiteStorage.user.roleCreationMode === 0 ? "flex" : "none";
        document.querySelector(".json-input-div").style.display = websiteStorage.user.roleCreationMode === 1 ? "flex" : "none";
        document.querySelector(".script-upload-div").style.display = websiteStorage.user.roleCreationMode === 2 ? "flex" : "none";
    }
});

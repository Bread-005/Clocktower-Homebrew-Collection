document.addEventListener("DOMContentLoaded", function () {

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
                tagFilter: "None"
            },
            archive: []
        }
        localStorage.setItem(storageString, JSON.stringify(storage));
    }

    const websiteStorage = JSON.parse(localStorage.getItem(storageString));

    if (!websiteStorage.user) {
        websiteStorage.user = {
            page: 1,
            roleSearch: "",
            characterType: "All",
            sorting: "Newest first",
            onlyMyFavorites: false,
            scriptFilter: "All",
            tagFilter: "None"
        }
        localStorage.setItem(storageString, JSON.stringify(websiteStorage));
    }

    if (websiteStorage.page) {
        websiteStorage.page = undefined;
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
    }

    if (websiteStorage.users !== undefined) {
        websiteStorage.users = undefined;
    }

    saveLocalStorage();

    const createMainRoleAttributesForm = document.getElementById("create-main-role-attributes");
    const changeRoleCreationButton = document.getElementById("change-role-creation");
    const jsonInputDiv = document.getElementById("json-input-div");
    const jsonInputTextarea = document.getElementById("json-input-textarea");
    const jsonAddRoleButton = document.getElementById("add-role-button");
    const roleSearch = document.getElementById("role-search");
    roleSearch.value = websiteStorage.user.roleSearch;
    const characterTypeSelection = document.getElementById("character-typ-selection");
    characterTypeSelection.value = websiteStorage.user.characterType;
    const sortingDropDownMenu = document.getElementById("sorting");
    sortingDropDownMenu.value = websiteStorage.user.sorting;
    const tagFilterSelection = document.getElementById("tag-filter-selection");
    tagFilterSelection.value = websiteStorage.user.tagFilter;
    const onlyMyFavoritesCheckBox = document.getElementById("only-my-favorites");
    const scriptFilterSelection = document.getElementById("script-filter-selection");
    onlyMyFavoritesCheckBox.checked = websiteStorage.user.onlyMyFavorites;
    const clearSearchesButton = document.getElementById("clear-searches-button");
    const homebrewRolesDisplay = document.getElementById("homebrewroles");

    addRole();
    setupScriptSelection();
    displayRoles();
    clearSearches();

    let normalRoleCreation = true;

    function displayRoles() {
        setFilters();
        const roles = filterRoles(websiteStorage.roleIdeas);
        sortRoles(roles);
        const roleIdeaArray = roles.slice((websiteStorage.user.page - 1) * 10, websiteStorage.user.page * 10);

        homebrewRolesDisplay.innerHTML = "";

        for (const role of roleIdeaArray) {

            const roleDiv = document.createElement("div");
            roleDiv.setAttribute("class", "space-between role-div");
            const roleImageAndText = document.createElement("div");
            roleImageAndText.setAttribute("class", "next-to-each-other margin-right-10");

            const roleImage = document.createElement("img");
            roleImage.setAttribute("class", "clocktower-icon clocktower-icon-role-idea");
            roleImage.setAttribute("src", "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
            if (role["image"]) {
                roleImage.setAttribute("src", role["image"]);
            }

            const roleText = document.createElement("div");
            roleText.textContent = role["name"] + " (" + role["characterType"] + "): " + role["ability"];

            const buttons = document.createElement("div");
            buttons.setAttribute("class", "next-to-each-other");

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

            const wikiButton = document.createElement("button");

            const wikiIcon = document.createElement("i");
            wikiIcon.setAttribute("class", "fa-solid fa-book");

            const wikiAnchor = document.createElement("a");
            wikiAnchor.setAttribute("href", "wiki.html?r=" + role.createdAt);

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

            roleImageAndText.append(roleImage);
            roleImageAndText.append(roleText);
            roleDiv.append(roleImageAndText);
            rateButton.append(rateIcon);
            wikiButton.append(wikiIcon);
            wikiAnchor.append(wikiButton);
            favoriteButton.append(favoriteIcon);
            buttons.append(rateInput);
            buttons.append(rateButton);
            buttons.append(wikiAnchor);
            buttons.append(favoriteButton);
            roleDiv.append(buttons);
            homebrewRolesDisplay.append(roleDiv);

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

            favoriteButton.addEventListener("click", function () {
                role.isFavorite = !role.isFavorite;
                displayRoles();
            });
        }
        showPages(roles, roleIdeaArray);
    }

    sortingDropDownMenu.addEventListener("change", function () {
        onChangeFilter(sortingDropDownMenu, "sorting");
    });
    characterTypeSelection.addEventListener("change", function () {
        onChangeFilter(characterTypeSelection, "characterType");
    });
    roleSearch.addEventListener("input", function () {
        onChangeFilter(roleSearch, "roleSearch");
    });
    onlyMyFavoritesCheckBox.addEventListener("change", function () {
        onChangeFilter(onlyMyFavoritesCheckBox, "onlyMyFavorites");
    });
    tagFilterSelection.addEventListener("change", function () {
        onChangeFilter(tagFilterSelection, "tagFilter");
    });
    scriptFilterSelection.addEventListener("change", function () {
        onChangeFilter(scriptFilterSelection, "scriptFilter");
    });

    function sortRoles(roles) {
        const input = sortingDropDownMenu.value;
        if (input === "Newest first" || input === "Oldest first") {
            roles.sort((a, b) => a.createdAt - b.createdAt);
            if (input === "Newest first") {
                roles.reverse();
            }
        }
        if (input.includes("Alphabet")) {
            roles.sort((a, b) => sortAlphabetically(a["name"], b["name"]));
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
    }

    function sortAlphabetically(a, b) {
        if (a.toUpperCase() < b.toUpperCase()) {
            return -1;
        }
        if (a.toUpperCase() > b.toUpperCase()) {
            return 1;
        }
        return 0;
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
        document.getElementById("role-idea-page-selection").innerHTML = "";
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
            document.getElementById("role-idea-page-selection").append(button);
        }
    }

    function filterRoles(roles) {
        if (roleSearch.value !== "") {
            roles = roles.filter(role =>
                role.name.toUpperCase().includes(roleSearch.value.toUpperCase()) ||
                role.characterType.toUpperCase().includes(roleSearch.value.toUpperCase()) ||
                role.ability.toUpperCase().includes(roleSearch.value.toUpperCase()));
        }
        if (characterTypeSelection.value !== "All") {
            roles = roles.filter(role => role.characterType === characterTypeSelection.value);
        }
        if (tagFilterSelection.value !== "None") {
            roles = roles.filter(role => role.tags.includes(tagFilterSelection.value));
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
        document.getElementById("js-add-role").addEventListener("click", function (event) {
            event.preventDefault();
            const roleNameInput = document.getElementById("role-name");
            const characterTypeInput = document.getElementById("character-types");
            const abilityTextInput = document.getElementById("ability-text");
            if (roleNameInput.value === "" || characterTypeInput.value === "" || abilityTextInput.value === "") {
                return;
            }

            const role = {
                name: roleNameInput.value,
                characterType: characterTypeInput.value,
                ability: abilityTextInput.value,
                createdAt: Date.now().toString(),
                image: "",
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
                special: [],
                script: "",
                comments: []
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
        });
    }

    function setupScriptSelection() {

        const scripts = ["All"];
        for (const role of websiteStorage.roleIdeas) {
            if (!scripts.includes(role.script) && role.script !== "") {
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

    function onChangeFilter(element, storageComponent) {
        websiteStorage.user[storageComponent] = element === onlyMyFavoritesCheckBox ? element.checked : element.value;
        saveLocalStorage();
        displayRoles();
    }

    changeRoleCreationButton.addEventListener("click", function (event) {
        event.preventDefault();
        normalRoleCreation = !normalRoleCreation;

        if (!normalRoleCreation) {
            createMainRoleAttributesForm.style.display = "none";
            jsonInputDiv.style.display = "flex";
        }
        if (normalRoleCreation) {
            createMainRoleAttributesForm.style.display = "flex";
            jsonInputDiv.style.display = "none";
        }
    });

    jsonAddRoleButton.addEventListener("click", function (event) {
        event.preventDefault();

        const text = jsonInputTextarea.value;
        if (!text.includes("id") || !text.includes("name") || !text.includes("team") || !text.includes("ability")) {
            return;
        }
        const role = JSON.parse(text);
        role.createdAt = Date.now().toString();
        role.characterType = role.team[0].toUpperCase() + role.team.substring(1);
        role.team = undefined;
        if (role.image === undefined) role.image = "";
        if (role.firstNight === undefined) role.firstNight = 0;
        if (role.firstNightReminder === undefined) role.firstNightReminder = "";
        if (role.otherNight === undefined) role.otherNight = 0;
        if (role.otherNightReminder === undefined) role.otherNightReminder = "";
        if (role.jinxes === undefined) role.jinxes = [];
        for (let i = 0; i < role.jinxes.length; i++) {
            const jinx = role.jinxes[i];
            jinx.createdAt = (Date.now() + i).toString();
            jinx.jinxedRole = jinx.id[0].toUpperCase();
            for (let j = 1; j < jinx.id.length; j++) {
                if (jinx.id[j] === "_" && j + 1 < jinx.id.length) {
                    jinx.jinxedRole += " " + jinx.id[j + 1].toUpperCase();
                    j++;
                    continue;
                }
                jinx.jinxedRole += jinx.id[j];
            }
            jinx.id = undefined;
        }
        if (role.reminders === undefined) role.reminders = [];
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
        role.tags = [];
        role.howToRun = "";
        role.script = "";
        role.comments = [];
        websiteStorage.roleIdeas.push(role);
        saveLocalStorage();
        jsonInputTextarea.value = "";
        displayRoles();
    });
});
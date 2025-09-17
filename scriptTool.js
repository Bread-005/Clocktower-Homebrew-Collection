import {allRoles, characterTypes, getTeamColor, copyJsonString, StevenApprovedOrder} from "./functions.js";

document.addEventListener('DOMContentLoaded', function () {

    const storageString = "websiteStorage1";
    const websiteStorage = JSON.parse(localStorage.getItem(storageString));

    if (!websiteStorage.scriptToolRoles) {
        websiteStorage.scriptToolRoles = [];
        saveLocalStorage();
    }

    const searchByNameInput = document.getElementById("search-by-name");
    const roleSelectionSection = document.querySelector(".role-selection-section");
    const scriptNameDisplay = document.getElementById("script-name-display");
    const scriptAuthorDisplay = document.getElementById("script-author-display");
    const scriptNameInput = document.getElementById("script-name-input");
    const scriptAuthorInput = document.getElementById("script-author-input");
    const arrayOfArrays = [[], [], [], [], [], []];

    const roleNames = getRoleIdeas().map(role => role.name);
    websiteStorage.scriptToolRoles = websiteStorage.scriptToolRoles.filter(role => roleNames.includes(role.name) || allRoles.map(role1 => role1.name).includes(role.name) && role.isOfficial);

    createRoleSelection();
    displaySelectionArea();
    displayScriptRoles();

    searchByNameInput.addEventListener("input", function () {
        displaySelectionArea();
    });

    document.getElementById("script-save-namings-button").addEventListener("click", function () {
        scriptNameDisplay.textContent = scriptNameInput.value;
        scriptAuthorDisplay.textContent = scriptAuthorInput.value;
    });

    document.getElementById("script-tool-download-json-button").addEventListener("click", function () {
        const script = [];
        const scriptHead = {
            id: "_meta",
            name: scriptNameDisplay.textContent,
            author: scriptAuthorDisplay.textContent,
        }
        if (!scriptHead.name) delete scriptHead.name;
        if (!scriptHead.author) delete scriptHead.author;
        script.push(scriptHead);

        for (const team of characterTypes) {
            for (const role of websiteStorage.scriptToolRoles) {
                if (role.characterType === team) {
                    if (allRoles.map(role1 => role1.name).includes(role.name)) {
                        script.push(role.name.toLowerCase().replaceAll(" ", "_"));
                        continue;
                    }
                    script.push(copyJsonString(role));
                }
            }
        }

        console.log(script);

        const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(script, null, 4));
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = scriptNameDisplay.textContent + ".json";
        link.click();
    });

    function displayScriptRoles() {
        for (const team of characterTypes) {
            document.querySelector(".display-" + team.toLowerCase()).textContent = "";
            for (const role of websiteStorage.scriptToolRoles) {
                if (role.characterType === team) {
                    const div = document.createElement("div");
                    const imgAndNameDiv = document.createElement("div");
                    const img = document.createElement("img");
                    const name = document.createElement("div");
                    const abilityText = document.createElement("div");
                    imgAndNameDiv.append(img);
                    imgAndNameDiv.append(name);
                    div.append(imgAndNameDiv);
                    div.append(abilityText);

                    div.setAttribute("class", "role");
                    div.style.background = getTeamColor(role.characterType);
                    imgAndNameDiv.setAttribute("class", "img-and-name");
                    if (role.isOfficial) {
                        img.setAttribute("src", "./icons/Icon_" + role.name.toLowerCase().replaceAll(" ", "") + ".png");
                    } else {
                        img.setAttribute("src", role.image ? role.image : "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
                    }
                    img.setAttribute("class", "image");
                    name.textContent = role.name;
                    abilityText.textContent = role.ability;
                    abilityText.style.paddingRight = "0.5rem";
                    document.querySelector(".display-" + team.toLowerCase()).append(div);
                }
            }
        }
    }

    function createRoleSelection() {
        for (const role of allRoles) {
            for (let i = 0; i < characterTypes.length; i++) {
                if (role.characterType === characterTypes[i]) {
                    arrayOfArrays[i].push({
                        name: role.name,
                        characterType: role.characterType,
                        ability: role.ability,
                        image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.name.toLowerCase().replaceAll(" ", "") + ".png",
                        isOfficial: true
                    });
                }
            }
        }

        for (const team of characterTypes) {
            const div = document.createElement("div");
            const h2 = document.createElement("h2");
            const list = document.createElement("div");
            div.append(h2);
            div.append(list);

            div.style.background = getTeamColor(team);
            h2.textContent = team;
            list.className = "group-" + team.toLowerCase();
            roleSelectionSection.append(div);
        }

        for (const role of getRoleIdeas()) {
            for (let i = 0; i < arrayOfArrays.length; i++) {
                if (role.characterType === characterTypes[i]) {
                    arrayOfArrays[i].push(role);
                }
            }
        }

        for (const array of arrayOfArrays) {
            array.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1));
        }
    }

    function displaySelectionArea() {
        for (let i = 0; i < arrayOfArrays.length; i++) {
            document.querySelector(".group-" + characterTypes[i].toLowerCase()).textContent = "";
            const container = document.createElement("div");

            for (const role of arrayOfArrays[i]) {
                if (searchByNameInput.value && !role.name.toLowerCase().startsWith(searchByNameInput.value.toLowerCase())) {
                    continue;
                }

                const div = document.createElement("div");
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                const img = document.createElement("img");
                const abilityText = document.createElement("div");
                div.append(img);
                div.append(label);
                div.append(checkbox);
                div.append(abilityText);
                container.append(div);

                div.setAttribute("class", "role-div");
                img.setAttribute("class", "clocktower-icon");
                if (role.isOfficial) {
                    img.setAttribute("src", "./icons/Icon_" + role.name.toLowerCase().replaceAll(" ", "") + ".png");
                } else {
                    img.setAttribute("src", role.image ? role.image : "https://i.postimg.cc/qM09f8cD/placeholder-icon.png")
                }

                checkbox.type = "checkbox";
                checkbox.checked = websiteStorage.scriptToolRoles.map(role1 => role1.name).includes(role.name);
                label.textContent = role.name;
                checkbox.setAttribute("id", role.name + "-checkbox123");
                label.setAttribute("for", role.name + "-checkbox123");
                if (role.ability) abilityText.textContent = role.ability;
                abilityText.setAttribute("class", "ability-text");

                div.addEventListener("mouseover", () => abilityText.style.display = "flex");
                div.addEventListener("mouseout", () => abilityText.style.display = "none");

                checkbox.addEventListener("change", function () {

                    if (checkbox.checked) {
                        websiteStorage.scriptToolRoles.push(role);
                        websiteStorage.scriptToolRoles.sort(function (a, b) {

                            if (a.characterType === b.characterType) {
                                if (a.ability && b.ability) {
                                    for (let j = 0; j < StevenApprovedOrder.length; j++) {
                                        for (let k = 0; k < StevenApprovedOrder.length; k++) {
                                            if (a.ability.includes(StevenApprovedOrder[j]) && b.ability.includes(StevenApprovedOrder[k])) {
                                                if (j === k) {
                                                    return a.ability.length - b.ability.length;
                                                }
                                                return j - k;
                                            }
                                        }
                                    }
                                }

                                const aAbilityLength = a.ability ? a.ability.length : 0;
                                const bAbilityLength = b.ability ? b.ability.length : 0;
                                return aAbilityLength - bAbilityLength;
                            }

                            for (let j = 0; j < characterTypes.length; j++) {
                                for (let k = 0; k < characterTypes.length; k++) {
                                    if (a.characterType === characterTypes[j] && b.characterType === characterTypes[k]) {
                                        return j - k;
                                    }
                                }
                            }
                        });
                    }
                    if (!checkbox.checked) {
                        websiteStorage.scriptToolRoles = websiteStorage.scriptToolRoles.filter(role1 => role1.name !== role.name);
                    }
                    saveLocalStorage();
                    displayScriptRoles();
                });

                div.addEventListener("mouseover", function () {
                    abilityText.style.visibility = "visible";
                });
                div.addEventListener("mouseout", function () {
                    abilityText.style.visibility = "hidden";
                });
            }
            document.querySelector(".group-" + characterTypes[i].toLowerCase()).append(container);
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
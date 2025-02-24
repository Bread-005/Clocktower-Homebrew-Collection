import {
    Townsfolks,
    Outsiders,
    Minions,
    Demons,
    Travellers,
    Fabled,
    allRoles,
    characterTypes,
    getTeamColor, copyJsonString,
    StevenApprovedOrder
} from "./functions.js";

document.addEventListener('DOMContentLoaded', function () {

    const storageString = "websiteStorage1";
    const websiteStorage = JSON.parse(localStorage.getItem(storageString));

    if (!websiteStorage.scriptToolRoles) {
        websiteStorage.scriptToolRoles = [];
        saveLocalStorage();
    }

    const roleSelectionSection = document.querySelector(".role-selection-section");
    const arrayOfArrays = [[], [], [], [], [], []];

    createRoleSelection();
    displaySelectionArea();
    displayScriptRoles();

    document.getElementById("script-tool-download-json-button").addEventListener("click", function () {
        const script = [];
        script.push({id: "_meta", name: "TestName", author: "TestAuthor"});

        for (const team of characterTypes) {
            for (const role of websiteStorage.scriptToolRoles) {
                if (role.characterType === team) {
                    if (allRoles.includes(role.name)) {
                        script.push(role.name.replaceAll(" ", "_"));
                        continue;
                    }
                    script.push(copyJsonString(role));
                }
            }
        }

        console.log(script);
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
                    img.setAttribute("src", role.image);
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
            if (Townsfolks.includes(role)) {
                arrayOfArrays[0].push({
                    name: role,
                    characterType: "Townsfolk",
                    image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.toLowerCase().replaceAll(" ", "") + ".png"
                });
            }
            if (Outsiders.includes(role)) {
                arrayOfArrays[1].push({
                    name: role,
                    characterType: "Outsider",
                    image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.toLowerCase().replaceAll(" ", "") + ".png"
                });
            }
            if (Minions.includes(role)) {
                arrayOfArrays[2].push({
                    name: role,
                    characterType: "Minion",
                    image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.toLowerCase().replaceAll(" ", "") + ".png"
                });
            }
            if (Demons.includes(role)) {
                arrayOfArrays[3].push({
                    name: role,
                    characterType: "Demon",
                    image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.toLowerCase().replaceAll(" ", "") + ".png"
                });
            }
            if (Travellers.includes(role)) {
                arrayOfArrays[4].push({
                    name: role,
                    characterType: "Traveller",
                    image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.toLowerCase().replaceAll(" ", "") + ".png"
                });
            }
            if (Fabled.includes(role)) {
                arrayOfArrays[5].push({
                    name: role,
                    characterType: "Fabled",
                    image: "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.toLowerCase().replaceAll(" ", "") + ".png"
                });
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

        for (const role of websiteStorage.roleIdeas) {
            for (let i = 0; i < arrayOfArrays.length; i++) {
                if (role.characterType === characterTypes[i]) {
                    arrayOfArrays[i].push(role);
                }
            }
        }
        console.log(arrayOfArrays);

        for (const array of arrayOfArrays) {
            array.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1));
        }
    }

    function displaySelectionArea() {
        for (let i = 0; i < arrayOfArrays.length; i++) {
            const container = document.createElement("div");

            for (const role of arrayOfArrays[i]) {
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
                if (role.image) img.setAttribute("src", role.image);
                if (!role.image) img.setAttribute("src", "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");

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
                                                    const aAbilityLength = a.ability ? a.ability.length : 0;
                                                    const bAbilityLength = b.ability ? b.ability.length : 0;
                                                    return aAbilityLength - bAbilityLength;
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
                        console.log(websiteStorage.scriptToolRoles);
                    }
                    if (!checkbox.checked) {
                        for (let j = 0; j < websiteStorage.scriptToolRoles.length; j++) {
                            if (websiteStorage.scriptToolRoles[j].name === role.name) {
                                websiteStorage.scriptToolRoles.splice(j, 1);
                            }
                        }
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
});
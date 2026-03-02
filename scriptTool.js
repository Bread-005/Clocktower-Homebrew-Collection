import {
    characterTypes, getTeamColor, getJsonString, StevenApprovedOrder, n, getRoleIdeas, websiteStorage,
    saveLocalStorage, imagePath, createPopup
} from "./functions.js";

document.addEventListener('DOMContentLoaded', function () {

    if (!websiteStorage.scriptTool) {
        websiteStorage.scriptTool = [
            {name: "Script-Name", author: websiteStorage.user.currentUsername, roles: [], isSelected: true},
            {name: "Script-Name2", author: websiteStorage.user.currentUsername, roles: [], isSelected: false}
        ];
        saveLocalStorage();
    }

    const searchByNameInput = document.getElementById("search-by-name");
    const onlyOfficialCheckbox = document.getElementById("only-official-checkbox");
    const roleSelectionSection = document.querySelector(".role-selection-section");
    const scriptNameDisplay = document.getElementById("script-name-display");
    const scriptAuthorDisplay = document.getElementById("script-author-display");
    const scriptNameInput = document.getElementById("script-name-input");
    const scriptAuthorInput = document.getElementById("script-author-input");
    const scriptSelection = document.querySelector(".script-tool-script-selection");
    const arrayOfArrays = [[], [], [], [], [], [], []];

    updateScriptToolRoles();
    saveLocalStorage();
    createRoleSelection();
    displayRoleSelection();
    displayScriptRoles();
    displayScriptSelection();

    searchByNameInput.addEventListener("input", () => displayRoleSelection());
    onlyOfficialCheckbox.addEventListener("click", () => displayRoleSelection());

    document.getElementById("script-save-namings-button").addEventListener("click", function () {
        const selectedScript = websiteStorage.scriptTool.find(script1 => script1.isSelected);
        if (scriptNameInput.value) {
            selectedScript.name = scriptNameInput.value;
            scriptNameDisplay.textContent = scriptNameInput.value;
        }
        if (scriptAuthorInput.value) {
            selectedScript.author = scriptAuthorInput.value;
            scriptAuthorDisplay.textContent = scriptAuthorInput.value;
        }
        scriptNameInput.value = "";
        scriptAuthorInput.value = "";
        saveLocalStorage();
        displayScriptSelection();
    });

    document.getElementById("script-tool-copy-json-button").addEventListener("click", () => {
        navigator.clipboard.writeText(getScriptAsJSON()).then();
        createPopup(document.getElementById("script-tool-copy-json-button"), "Copied Script JSON to clipboard", 3500, "lightblue");
    });

    document.getElementById("script-tool-download-json-button").addEventListener("click", () => {
        const dataUrl = "data:application/json;charset=utf-8," + getScriptAsJSON();
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = scriptNameDisplay.textContent + ".json";
        link.click();
    });

    function displayScriptRoles() {
        const selectedScript = websiteStorage.scriptTool.find(script1 => script1.isSelected);
        scriptNameDisplay.textContent = selectedScript.name;
        scriptAuthorDisplay.textContent = selectedScript.author;

        for (const team of characterTypes) {
            document.querySelector(".display-" + team.toLowerCase()).textContent = "";
            for (const role of selectedScript.roles) {
                if (role.characterType === team) {
                    const roleDiv = document.createElement("div");
                    const div = document.createElement("div");
                    const imgAndNameDiv = document.createElement("div");
                    const removeButton = document.createElement("button");
                    const i = document.createElement("i");
                    const img = document.createElement("img");
                    const name = document.createElement("div");
                    const abilityText = document.createElement("div");
                    const jinxDiv = document.createElement("div");
                    removeButton.append(i);
                    imgAndNameDiv.append(removeButton);
                    imgAndNameDiv.append(img);
                    imgAndNameDiv.append(name);
                    div.append(imgAndNameDiv);
                    div.append(abilityText);
                    roleDiv.append(div);
                    roleDiv.append(jinxDiv);

                    roleDiv.setAttribute("class", "complete-role");
                    div.setAttribute("class", "role");
                    div.style.background = getTeamColor(role.characterType);
                    imgAndNameDiv.setAttribute("class", "img-and-name");
                    removeButton.addEventListener("click", function () {
                        selectedScript.roles = selectedScript.roles.filter(role1 => role1.name !== role.name || role1.characterType !== role.characterType);
                        if (role.name.includes(searchByNameInput.value) &&
                            (websiteStorage.officialRoles.find(role1 => role1.name === role.name) || getRoleIdeas().find(role1 => role1.createdAt === role.createdAt))) {
                            document.getElementById(role.name + role.createdAt + "-checkbox").checked = selectedScript.roles.find(role1 => role1.name === role.name && role1.ability === role.ability);
                        }
                        if (selectedScript.roles.length === 0 && websiteStorage.scriptTool.length > 1) {
                            deleteScript();
                        }
                        saveLocalStorage();
                        displayScriptRoles();
                    });
                    i.setAttribute("class", "fa-solid fa-x");
                    if (role.isOfficial) {
                        img.setAttribute("src", imagePath(role));
                    } else {
                        img.setAttribute("src", role.image ? role.image : "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
                    }
                    img.setAttribute("class", "image");
                    name.textContent = role.name;
                    abilityText.textContent = role.ability;
                    abilityText.style.paddingRight = "0.5rem";
                    jinxDiv.setAttribute("class", "jinx");

                    if (role.jinxes) {
                        for (const jinx of role.jinxes) {
                            const jinxedRole = websiteStorage.officialRoles.find(role1 => role1.name === role.name) ? jinx.id : jinx.jinxedRole;
                            if (!selectedScript.roles.map(role1 => role1.name.toLowerCase().replaceAll("'", "")).includes(jinxedRole.toLowerCase())) continue;
                            const jinxImg = document.createElement("img");
                            jinxImg.setAttribute("class", "jinx-image");
                            jinxImg.src = imagePath({name: jinxedRole});
                            jinxDiv.append(jinxImg);

                            const jinxText = document.createElement("p");
                            jinxText.textContent = jinx.reason;
                            jinxText.setAttribute("class", "jinx-text");
                            jinxDiv.append(jinxText);

                            jinxImg.addEventListener("mouseover", () => {
                                jinxText.style.visibility = "visible";
                            });

                            jinxImg.addEventListener("mouseout", () => {
                                jinxText.style.visibility = "hidden";
                            });
                        }
                    }
                    if (role.name === "Bootlegger" && role.characterType === "Loric") {
                        if (!role.rules) role.rules = [];
                        saveLocalStorage();
                        for (const rule of role.rules) {
                            const div = document.createElement("div");
                            div.style.display = "flex";
                            div.style.alignItems = "center";
                            const button = document.createElement("button");
                            const minusIcon = document.createElement("i");
                            minusIcon.setAttribute("class", "fa-solid fa-x");
                            const text = document.createElement("div");
                            text.textContent = rule;
                            button.addEventListener("click", () => {
                                role.rules = role.rules.filter(rule1 => rule1 !== rule);
                                saveLocalStorage();
                                displayScriptRoles();
                            });
                            button.append(minusIcon);
                            div.append(button);
                            div.append(text);
                            roleDiv.append(div);
                        }
                        const div = document.createElement("div");
                        const button = document.createElement("button");
                        const plusIcon = document.createElement("i");
                        plusIcon.setAttribute("class", "fa-solid fa-plus");
                        const input = document.createElement("input");
                        input.style.width = "80%";
                        input.style.height = "20px";
                        button.addEventListener("click", () => {
                            if (!input.value) return;
                            role.rules.push(input.value);
                            saveLocalStorage();
                            displayScriptRoles();
                        });
                        button.append(plusIcon);
                        div.append(button);
                        div.append(input);
                        roleDiv.append(div);
                    }
                    document.querySelector(".display-" + team.toLowerCase()).append(roleDiv);
                }
            }
        }
    }

    function createRoleSelection() {
        for (const role of websiteStorage.officialRoles) {
            for (let i = 0; i < characterTypes.length; i++) {
                if (role.characterType === characterTypes[i]) {
                    arrayOfArrays[i].push({
                        name: role.name,
                        characterType: role.characterType,
                        ability: role.ability,
                        isOfficial: true,
                        jinxes: role.jinxes
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

    function displayRoleSelection() {
        for (let i = 0; i < arrayOfArrays.length; i++) {
            document.querySelector(".group-" + characterTypes[i].toLowerCase()).textContent = "";
            const container = document.createElement("div");

            for (const role of arrayOfArrays[i]) {
                if (searchByNameInput.value && !role.name.toLowerCase().startsWith(searchByNameInput.value.toLowerCase())) {
                    continue;
                }
                if (onlyOfficialCheckbox.checked && !role.isOfficial) continue;

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
                    img.setAttribute("src", imagePath(role));
                } else {
                    img.setAttribute("src", role.image ? role.image : "https://i.postimg.cc/qM09f8cD/placeholder-icon.png")
                }

                checkbox.type = "checkbox";
                checkbox.checked = websiteStorage.scriptTool.find(script1 => script1.isSelected).roles.map(role1 => role1.name).includes(role.name);
                label.textContent = role.name;
                checkbox.setAttribute("id", role.name + role.createdAt + "-checkbox");
                label.setAttribute("for", role.name + role.createdAt + "-checkbox");
                abilityText.textContent = role.ability;
                abilityText.setAttribute("class", "ability-text");

                div.addEventListener("mouseover", () => abilityText.style.display = "flex");
                div.addEventListener("mouseout", () => abilityText.style.display = "none");

                checkbox.addEventListener("change", function () {

                    const selectedScript = websiteStorage.scriptTool.find(script1 => script1.isSelected);

                    if (checkbox.checked) {
                        selectedScript.roles.push(role);
                        selectedScript.roles.sort(function (a, b) {

                            if (a.characterType === b.characterType) {
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

                            return characterTypes.indexOf(a.characterType) - characterTypes.indexOf(b.characterType);
                        });
                    }
                    if (!checkbox.checked) {
                        selectedScript.roles = selectedScript.roles.filter(role1 => role1.name !== role.name || role1.characterType !== role.characterType);
                        if (selectedScript.roles.length === 0 && websiteStorage.scriptTool.length > 1) {
                            deleteScript();
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

    function displayScriptSelection() {
        scriptSelection.innerHTML = "";
        for (const script of websiteStorage.scriptTool) {
            const div = document.createElement("div");
            div.textContent = script.name;
            div.setAttribute("class", "script");
            if (script.isSelected) div.classList.add("selected");
            scriptSelection.append(div);

            div.addEventListener("click", () => {
                for (const script2 of websiteStorage.scriptTool) script2.isSelected = false;
                script.isSelected = true;
                saveLocalStorage();
                displayRoleSelection();
                displayScriptRoles();
                displayScriptSelection();
            });
        }
        const button = document.createElement("button");
        const i = document.createElement("i");
        i.setAttribute("class", "fa-solid fa-plus");
        button.append(i);
        scriptSelection.append(button);

        button.addEventListener("click", () => {
            websiteStorage.scriptTool.push({
                name: "Script-Name",
                author: websiteStorage.user.currentUsername,
                roles: [],
                isSelected: false
            });
            saveLocalStorage();
            displayScriptSelection();
        });
    }

    function updateScriptToolRoles() {
        const allHomebrewRoles = getRoleIdeas();
        for (let i = 0; i < websiteStorage.scriptTool.length; i++) {
            websiteStorage.scriptTool[i].roles = websiteStorage.scriptTool[i].roles.filter(role => role);
            for (let j = 0; j < websiteStorage.scriptTool[i].roles.length; j++) {
                if (websiteStorage.officialRoles.map(role => role.name).includes(websiteStorage.scriptTool[i].roles[j].name)) continue;
                websiteStorage.scriptTool[i].roles[j] = allHomebrewRoles.find(role => role.createdAt === websiteStorage.scriptTool[i].roles[j].createdAt);
            }
        }
        saveLocalStorage();
    }

    function getScriptAsJSON() {
        const selectedScript = websiteStorage.scriptTool.find(script1 => script1.isSelected);
        let script = "[";
        const scriptHead = {id: "_meta"}
        if (selectedScript.name) scriptHead.name = selectedScript.name;
        if (selectedScript.author) scriptHead.author = selectedScript.author;
        if (selectedScript.roles.find(role => role.name === "Bootlegger")) {
            scriptHead.bootlegger = [];
            for (const rule of selectedScript.roles.find(role => role.name === "Bootlegger").rules) {
                scriptHead.bootlegger.push(rule);
            }
        }
        script += (scriptHead.bootlegger ? JSON.stringify(scriptHead, null, 4) : JSON.stringify(scriptHead)) + "," + n;

        for (const team of characterTypes) {
            for (const role of selectedScript.roles) {
                if (role.characterType === team) {
                    if (websiteStorage.officialRoles.map(role1 => role1.name).includes(role.name)) {
                        script += '"' + role.name.toLowerCase().replaceAll(" ", "_") + '",' + n;
                        continue;
                    }
                    script += JSON.stringify(getJsonString(role), null, 4) + ',' + n;
                }
            }
        }
        script += "]";
        script = script.replace("," + n + "]", n + "]");
        return script;
    }

    function deleteScript() {
        websiteStorage.scriptTool = websiteStorage.scriptTool.filter(script1 => !script1.isSelected);
        websiteStorage.scriptTool[0].isSelected = true;
        displayRoleSelection();
        displayScriptSelection();
    }
});
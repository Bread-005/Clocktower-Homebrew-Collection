function getJsonString(role, copyJsonToClipboard = false) {
    const jsonRole = {
        id: role.name.toLowerCase().replaceAll(" ", "_"),
        name: role.name,
        ability: role.ability,
        team: role.characterType.toLowerCase()
    }
    if (role.script) {
        jsonRole.id += "_" + role.script.toLowerCase().replaceAll(" ", "_");
    }
    if (role.image && role.otherImage) {
        jsonRole.image = [
            role.image,
            role.otherImage
        ];
    } else if (role.image) {
        jsonRole.image = role.image;
    } else if (role.otherImage && !role.image) {
        jsonRole.image = role.otherImage;
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
        jsonRole.reminders = role.reminders;
    }
    if (role.remindersGlobal.length > 0) {
        jsonRole.remindersGlobal = role.remindersGlobal;
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
            if (special.value) tempSpecial.value = special.value;
            if (special.time) tempSpecial.time = special.time;
            if (special.global) tempSpecial.global = special.global;

            jsonRole.special.push(tempSpecial);
        }
    }
    if (copyJsonToClipboard) {
        navigator.clipboard.writeText(JSON.stringify(jsonRole, null, 4)).then();
    }
    return jsonRole;
}

const allTags = ["Misinformation", "Extra Death", "Protection", "Wincondition", "Character Changing", "Setup",
    "Madness", "Nomination Phase", "ST Consult", "When You Die", "Resurrection", "Alignment Switching", "Public", "Seating Order"];

function getTeamColor(team) {
    if (team.toLowerCase() === "townsfolk") return "cornflowerblue";
    if (team.toLowerCase() === "outsider") return "cyan";
    if (team.toLowerCase() === "minion") return "orange";
    if (team.toLowerCase() === "demon") return "red";
    if (team.toLowerCase() === "traveller") return "purple";
    if (team.toLowerCase() === "fabled") return "gold";
    if (team.toLowerCase() === "loric") return "lime";
    return "";
}

const characterTypes = ["Townsfolk", "Outsider", "Minion", "Demon", "Traveller", "Fabled", "Loric"];

const StevenApprovedOrder = ["You start knowing", "Each night,", "Each night*,", "Each day", "Once per game", " "];

async function updateRole(role, updateLastEdited = true) {
    if (updateLastEdited) {
        role.lastEdited = Date.now().toString();
    }
    if (!await databaseIsConnected()) return;
    const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));
    await fetch(API_URL + '/roles/update', {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(role)
    });
    websiteStorage.roleIdeas = await fetch(API_URL + '/roles').then(res => res.json());
}

async function createRole(role) {
    if (!await databaseIsConnected()) return;
    const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));
    await fetch(API_URL + '/roles/create', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(role)
    });
    websiteStorage.roleIdeas = await fetch(API_URL + '/roles').then(res => res.json());
}

async function deleteRole(role) {
    if (!await databaseIsConnected()) return;
    const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));
    await fetch(API_URL + '/roles/delete', {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(role)
    });
    websiteStorage.roleIdeas = await fetch(API_URL + '/roles').then(res => res.json());
}

const API_URL = "https://clocktower-homebrew-collection-13pz.onrender.com";

function createPopup(parentElement, text, duration = 10000, backgroundColor = "red") {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.style.backgroundColor = backgroundColor;
    popupZIndex++;
    popup.style.zIndex = popupZIndex.toString();
    const p = document.createElement("p");
    p.textContent = text;
    popup.append(p);
    parentElement.append(popup);

    setTimeout(() => {
        parentElement.removeChild(popup);
        popupZIndex--;
    }, duration);
}

let popupZIndex = 1000;

const n = "\n";

async function databaseIsConnected() {
    try {
        const response = await fetch(API_URL + "/roles");
        return response.ok;
    } catch (err) {
        return false;
    }
}

function getRoleIdeas() {
    const allHomebrewRoles = [];
    for (const role of websiteStorage.roleIdeas) allHomebrewRoles.push(role);
    for (const role of websiteStorage.localRoleIdeas) allHomebrewRoles.push(role);
    return allHomebrewRoles;
}

const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));

function saveLocalStorage() {
    localStorage.setItem("websiteStorage1", JSON.stringify(websiteStorage));
}

function imagePath(role) {
    return "./icons/Icon_" + role.name.toLowerCase().replaceAll(" ", "").replaceAll("-", "").replaceAll("'", "") + ".png";
}

export {
    getJsonString, allTags, getTeamColor, characterTypes, StevenApprovedOrder, updateRole, createRole, deleteRole,
    API_URL, createPopup, n, databaseIsConnected, getRoleIdeas, websiteStorage, saveLocalStorage, imagePath
}
function copyJsonString(role) {
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
        jsonRole.reminders = role.reminders;
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
            if (special.value) {
                tempSpecial.value = special.value;
            }
            if (special.time) {
                tempSpecial.time = special.time;
            }
            jsonRole.special.push(tempSpecial);
        }
    }
    const jsonRoleObject = JSON.stringify(jsonRole, null, 4);
    navigator.clipboard.writeText(jsonRoleObject).then();
}

function showCopyPopup(element) {
    const copyPopup = document.createElement("div");
    copyPopup.setAttribute("class", "copy-popup");
    copyPopup.textContent = "Role Json copied to Clipboard";
    if (element.textContent.length < 2) {
        copyPopup.style.left = "-35px";
    }
    element.append(copyPopup);

    setTimeout(function () {
        element.removeChild(copyPopup);
    }, 3500);
}

function roleWasEdited(originalRole, newRole) {
    for (const attribute in originalRole) {
        if (attribute === "rating" || attribute === "isFavorite" || attribute === "comments") {
            continue;
        }
        let originalRoleString = originalRole[attribute];
        let newRoleString = newRole[attribute];
        if (Array.isArray(originalRoleString)) originalRoleString = originalRoleString.join();
        if (Array.isArray(newRoleString)) newRoleString = newRoleString.join();

        if (originalRoleString !== newRoleString) {
            return true;
        }
    }
    return false;
}

export {copyJsonString, showCopyPopup, roleWasEdited}
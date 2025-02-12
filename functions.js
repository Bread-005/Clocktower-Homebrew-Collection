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

const firstNightList = ["Lord of Typhon", "Kazali", "Boffin", "Philosopher", "Alchemist", "Poppy Grower",
    "Yaggababble", "Magician", "Minion info", "Snitch", "Lunatic", "Summoner", "Demon info", "King", "Sailor",
    "Marionette", "Engineer", "Preacher", "Lil Monsta", "Lleech", "Xaan", "Poisoner", "Widow", "Courtier",
    "Wizard", "Snake Charmer", "Godfather", "Organ Grinder", "Devils Advocate", "Evil Twin", "Witch", "Cerenovus",
    "Fearmonger", "Harpy", "Mezepheles", "Pukka", "Pixie", "Huntsman", "Damsel", "Amnesiac", "Washerwoman",
    "Librarian", "Investigator", "Chef", "Empath", "Fortune Teller", "Butler", "Grandmother", "Clockmaker",
    "Dreamer", "Seamstress", "Steward", "Knight", "Noble", "Balloonist", "Shugenja", "Village Idiot",
    "Bounty Hunter", "Nightwatchman", "Cult Leader", "Spy", "Ogre", "High Priestess", "General", "Chambermaid",
    "Mathematician", "Leviathan", "Vizier"];

const otherNightList = ["Cannibal", "Philosopher", "Poppy Grower", "Sailor", "Engineer", "Preacher", "Xaan", "Poisoner",
    "Courtier", "Innkeeper", "Wizard", "Gambler", "Acrobat", "Snake Charmer", "Monk", "Organ Grinder", "Devils Advocate",
    "Witch", "Cerenovus", "Pit Hag", "Fearmonger", "Harpy", "Mezepheles", "Scarlet Woman", "Summoner", "Lunatic",
    "Exorcist", "Lycanthrope", "Legion", "Imp", "Zombuul", "Pukka", "Shabaloth", "Po", "Fang Gu", "No Dashii",
    "Vortox", "Lord of Typhon", "Vigormortis", "Ojo", "Al Hadikhia", "Lleech", "Lil Monsta", "Yaggababble",
    "Kazali", "Assassin", "Godfather", "Gossip", "Hatter", "Barber", "Sweetheart", "Sage", "Banshee", "Professor",
    "Choirboy", "Huntsman", "Damsel", "Amnesiac", "Farmer", "Tinker", "Moonchild", "Grandmother", "Ravenkeeper",
    "Empath", "Fortune Teller", "Undertaker", "Dreamer", "Flowergirl", "Town Crier", "Oracle", "Seamstress",
    "Juggler", "Balloonist", "Village Idiot", "King", "Bounty Hunter", "Nightwatchman", "Cult Leader", "Butler",
    "Spy", "High Priestess", "General", "Chambermaid", "Mathematician", "Riot", "Leviathan"];

export {copyJsonString, showCopyPopup, roleWasEdited, firstNightList, otherNightList}
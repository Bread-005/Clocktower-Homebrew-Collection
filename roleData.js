import {getRoleIdeas, allTags, loginStorage} from "./functions.js";

const autoTagRules = [
    {tag: "Misinformation", matches: has => has("drunk") || has("poison") || has("false info") || has("register")},
    {tag: "Protection", matches: has => has("safe") || has("cannot die") || has("can´t die")},
    {tag: "Wincondition", matches: has => has("win") && !has("knowing") || has("lose") && !has("ability")},
    {
        tag: "Character Changing",
        matches: has => has("become") && !has("alignment") && !has("evil") && !has("good") || has("swap")
    },
    {tag: "Setup", matches: has => has("[") && has("]")},
    {tag: "Madness", matches: has => has("mad")},
    {tag: "Nomination Phase", matches: has => has("nominat") || has("vot") || has("execut") || has("nominee")},
    {
        tag: "ST Consult",
        matches: has => has("visit") || has("Storyteller") && !has("believe") && !has("think") || has("privately")
    },
    {tag: "When You Die", matches: has => has("When you die") || has("If you die")},
    {tag: "Resurrection", matches: has => has("revive") || has("resurrect")},
    {
        tag: "Alignment Switching",
        matches: has => (has("become") || has("turn")) && (has("alignment") || has("evil") || has("good"))
    },
    {tag: "Public", matches: has => has("public")},
    {
        tag: "Seating Order",
        matches: has => has("neighbour") || has("neighbor") || has("step") || has("close") || has("near")
    }
];

function autoAddTags(role) {
    function has(string) {
        return role.ability.toLowerCase().includes(string.toLowerCase());
    }

    return autoTagRules.filter(rule => rule.matches(has)).map(rule => rule.tag);
}

function generateUniqueCreatedAt(candidateCreatedAt) {
    for (const existingRole of getRoleIdeas()) {
        if (existingRole.createdAt === candidateCreatedAt) {
            candidateCreatedAt = (Number(candidateCreatedAt) + 1).toString();
        }
    }
    return candidateCreatedAt;
}

function normalizeRoleImage(role) {
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
}

function normalizeRoleDefaults(role) {
    if (role.firstNight === undefined) role.firstNight = 0;
    if (role.firstNightReminder === undefined) role.firstNightReminder = "";
    if (role.otherNight === undefined) role.otherNight = 0;
    if (role.otherNightReminder === undefined) role.otherNightReminder = "";
    if (role.jinxes === undefined) role.jinxes = [];
    if (role.reminders === undefined) role.reminders = [];
    if (role.remindersGlobal === undefined) role.remindersGlobal = [];
    if (role.special === undefined) role.special = [];
    if (!role.script) role.script = "";
    role.script = role.script.split(" v")[0];
}

function snakeCaseIdToRoleName(id) {
    return id.split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
}

function normalizeJinxes(jinxes) {
    for (let i = 0; i < jinxes.length; i++) {
        const jinx = jinxes[i];
        if (jinx.id === "") jinx.id = undefined;
        if (!jinx.id || !jinx.reason) continue;
        jinx.createdAt = (Date.now() + i).toString();
        jinx.jinxedRole = snakeCaseIdToRoleName(jinx.id);
        jinx.id = undefined;
    }
}

function normalizeSpecial(specialList) {
    for (const special of specialList) {
        if (special.time === undefined) {
            special.time = "";
        }
        if (special.value === undefined) {
            special.value = "";
        }
    }
}

function normalizeRoleTags(role) {
    role.tags = role.tags ? role.tags.filter(tag => allTags.includes(tag)) : autoAddTags(role);
}

// Ratings used to be a single number per role instead of one entry per user.
function migrateRoleRating(role) {
    if (typeof role.rating === "number") {
        const ratingNumber = role.rating;
        role.rating = [];
        if (ratingNumber > 0) {
            role.rating.push({
                user: loginStorage.name,
                score: ratingNumber
            });
        }
    }
    if (Array.isArray(role.rating) && role.rating.length === 1 && role.rating[0].user === "") {
        role.rating[0].user = loginStorage.name;
    }
}

function migrateRoleFavorite(role) {
    if (!role.favoriteList) {
        role.favoriteList = [];
        if (role.isFavorite) role.favoriteList.push(loginStorage.name);
    }
}

// "User12345" was a placeholder owner used before per-account ownership existed.
function migrateRoleOwnership(role) {
    if (role.isPrivate === undefined) {
        role.isPrivate = true;
    }
    if (!role.owner) {
        role.owner = [loginStorage.name];
    }
    if (role.owner.includes("User12345")) {
        role.owner = role.owner.filter(owner => owner !== "User12345");
        role.owner.push(loginStorage.name);
    }
}

function migrateRoleLastEdited(role) {
    if (!role.lastEdited) {
        role.lastEdited = role.createdAt;
    }
    if (role.lastEdited.toString().includes("-")) {
        role.lastEdited = new Date(role.lastEdited).getTime().toString();
    }
}

function createRoleFromForm(name, characterType, ability, owner) {
    const now = Date.now().toString();
    return {
        name: name,
        characterType: characterType,
        ability: ability,
        createdAt: now,
        image: "",
        otherImage: "",
        rating: [],
        favoriteList: [],
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
        lastEdited: now,
        isPrivate: true,
        owner: [owner]
    }
}

export {
    autoAddTags, generateUniqueCreatedAt, normalizeRoleImage, normalizeRoleDefaults, snakeCaseIdToRoleName,
    normalizeJinxes, normalizeSpecial, normalizeRoleTags, migrateRoleRating, migrateRoleFavorite,
    migrateRoleOwnership, migrateRoleLastEdited, createRoleFromForm
}

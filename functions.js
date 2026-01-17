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
            if (special.value) {
                tempSpecial.value = special.value;
            }
            if (special.time) {
                tempSpecial.time = special.time;
            }
            jsonRole.special.push(tempSpecial);
        }
    }
    if (copyJsonToClipboard) {
        navigator.clipboard.writeText(JSON.stringify(jsonRole, null, 4)).then();
    }
    return jsonRole;
}

const firstNightList = ["Wraith", "Lord of Typhon", "Kazali", "Boffin", "Philosopher", "Alchemist", "Poppy Grower",
    "Yaggababble", "Magician", "Minion info", "Snitch", "Lunatic", "Summoner", "Demon info", "King", "Sailor",
    "Marionette", "Engineer", "Preacher", "Lil Monsta", "Lleech", "Xaan", "Poisoner", "Widow", "Courtier",
    "Wizard", "Snake Charmer", "Godfather", "Organ Grinder", "Devils Advocate", "Evil Twin", "Witch", "Cerenovus",
    "Fearmonger", "Harpy", "Mezepheles", "Pukka", "Pixie", "Huntsman", "Damsel", "Amnesiac", "Washerwoman",
    "Librarian", "Investigator", "Chef", "Empath", "Fortune Teller", "Butler", "Grandmother", "Clockmaker",
    "Dreamer", "Seamstress", "Steward", "Knight", "Noble", "Balloonist", "Shugenja", "Village Idiot",
    "Bounty Hunter", "Nightwatchman", "Cult Leader", "Spy", "Ogre", "High Priestess", "General", "Chambermaid",
    "Mathematician", "Leviathan", "Vizier"];

const otherNightList = ["Wraith", "Philosopher", "Poppy Grower", "Sailor", "Engineer", "Preacher", "Xaan", "Poisoner",
    "Courtier", "Innkeeper", "Wizard", "Gambler", "Acrobat", "Snake Charmer", "Monk", "Organ Grinder", "Devils Advocate",
    "Witch", "Cerenovus", "Pit Hag", "Fearmonger", "Harpy", "Mezepheles", "Scarlet Woman", "Summoner", "Lunatic",
    "Exorcist", "Lycanthrope", "Princess", "Legion", "Imp", "Zombuul", "Pukka", "Shabaloth", "Po", "Fang Gu", "No Dashii",
    "Vortox", "Lord of Typhon", "Vigormortis", "Ojo", "Al Hadikhia", "Lleech", "Lil Monsta", "Yaggababble",
    "Kazali", "Assassin", "Godfather", "Gossip", "Hatter", "Barber", "Sweetheart", "Plague Doctor", "Sage", "Banshee", "Professor",
    "Choirboy", "Huntsman", "Damsel", "Amnesiac", "Farmer", "Tinker", "Moonchild", "Grandmother", "Ravenkeeper",
    "Empath", "Fortune Teller", "Undertaker", "Dreamer", "Flowergirl", "Town Crier", "Oracle", "Seamstress",
    "Juggler", "Balloonist", "Village Idiot", "King", "Bounty Hunter", "Nightwatchman", "Cult Leader", "Butler",
    "Spy", "High Priestess", "General", "Chambermaid", "Mathematician", "Riot", "Leviathan"];

const allRoles = [
    {
        name: "Steward",
        characterType: "Townsfolk",
        ability: "You start knowing 1 good player"
    },
    {
        name: "Knight",
        characterType: "Townsfolk",
        ability: "You start knowing 2 players that are not the Demon."
    },
    {
        name: "Chef",
        characterType: "Townsfolk",
        ability: "You start knowing how many pairs of evil players there are."
    },
    {
        name: "Noble",
        characterType: "Townsfolk",
        ability: "You start knowing 3 players: 1 and only 1 of which is evil."
    },
    {
        name: "Investigator",
        characterType: "Townsfolk",
        ability: "You start knowing that 1 of 2 players is a particular Minion."
    },
    {
        name: "Washerwoman",
        characterType: "Townsfolk",
        ability: "You start knowing that 1 of 2 players is a particular Townsfolk."
    },
    {
        name: "Clockmaker",
        characterType: "Townsfolk",
        ability: "You start knowing how many steps from the Demon to its nearest Minion."
    },
    {
        name: "Grandmother",
        characterType: "Townsfolk",
        ability: "You start knowing a good player & their character. If the Demon kills them, you die too"
    },
    {
        name: "Librarian",
        characterType: "Townsfolk",
        ability: "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)"
    },
    {
        name: "Shugenja",
        characterType: "Townsfolk",
        ability: "You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary."
    },
    {
        name: "Bounty Hunter",
        characterType: "Townsfolk",
        ability: "You start knowing 1 evil player: if the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]"
    },
    {
        name: "Pixie",
        characterType: "Townsfolk",
        ability: "You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die."
    },
    {
        name: "Empath",
        characterType: "Townsfolk",
        ability: "Each night, you learn how many of your 2 alive neighbors are evil."
    },
    {
        name: "High Priestess",
        characterType: "Townsfolk",
        ability: "Each night, you learn which player the Storyteller believes you should talk to most."
    },
    {
        name: "Sailor",
        characterType: "Townsfolk",
        ability: "Each night, choose an alive player: either you or they are drunk until dusk. You can't die."
    },
    {
        name: "Balloonist",
        characterType: "Townsfolk",
        ability: "Each night, you learn a player of a different character type than last night. [+0 or +1 Outsider]"
    },
    {
        name: "General",
        characterType: "Townsfolk",
        ability: "Each night, you learn which alignment the Storyteller believes is winning good, evil or neither."
    },
    {
        name: "Preacher",
        characterType: "Townsfolk",
        ability: "Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability."
    },
    {
        name: "Chambermaid",
        characterType: "Townsfolk",
        ability: "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability."
    },
    {
        name: "Village Idiot",
        characterType: "Townsfolk",
        ability: "Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots, 1 of the extras is drunk]"
    },
    {
        name: "Snake Charmer",
        characterType: "Townsfolk",
        ability: "Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned."
    },
    {
        name: "Mathematician",
        characterType: "Townsfolk",
        ability: "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability."
    },
    {
        name: "King",
        characterType: "Townsfolk",
        ability: "Each night, if the dead equal or outnumber the living, learn an alive character. The Demon knows you are the King."
    },
    {
        name: "Fortune Teller",
        characterType: "Townsfolk",
        ability: "Each night, choose 2 players: you learn if either is a Demon. There is a good player, that registers as a Demon to you."
    },
    {
        name: "Dreamer",
        characterType: "Townsfolk",
        ability: "Each night, choose a player (not yourself or Travellers): you learn 1 good & 1 evil character, 1 of which is correct."
    },
    {
        name: "Cult Leader",
        characterType: "Townsfolk",
        ability: "Each night, you become the alignment of an alive neighbor. If all good players choose to join your cult, your team wins."
    },
    {
        name: "Flowergirl",
        characterType: "Townsfolk",
        ability: "Each night*, you learn if a Demon voted today."
    },
    {
        name: "Town Crier",
        characterType: "Townsfolk",
        ability: "Each night*, you learn if a Minion nominated today."
    },
    {
        name: "Oracle",
        characterType: "Townsfolk",
        ability: "Each night*, you learn how many dead players are evil."
    },
    {
        name: "Undertaker",
        characterType: "Townsfolk",
        ability: "Each night*, you learn which character died by execution today."
    },
    {
        name: "Innkeeper",
        characterType: "Townsfolk",
        ability: "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk."
    },
    {
        name: "Monk",
        characterType: "Townsfolk",
        ability: "Each night*, choose a player (not yourself): they are safe from the Demon tonight."
    },
    {
        name: "Gambler",
        characterType: "Townsfolk",
        ability: "Each night*, choose a player & guess their character: if you guess wrong, you die."
    },
    {
        name: "Acrobat",
        characterType: "Townsfolk",
        ability: "Each night*, choose a player: if they are or become drunk or poisoned tonight, you die."
    },
    {
        name: "Lycanthrope",
        characterType: "Townsfolk",
        ability: "Each night*, choose an alive player. If good, they die & the Demon doesn’t kill tonight. One good player registers as evil."
    },
    {
        name: "Exorcist",
        characterType: "Townsfolk",
        ability: "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight."
    },
    {
        name: "Gossip",
        characterType: "Townsfolk",
        ability: "Each day, you may make a public statement. Tonight, if it was true, a player dies."
    },
    {
        name: "Savant",
        characterType: "Townsfolk",
        ability: "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false."
    },
    {
        name: "Alsaahir",
        characterType: "Townsfolk",
        ability: "Each day, if you publicly guess which players are Minion(s) and which are Demon(s), good wins."
    },
    {
        name: "Engineer",
        characterType: "Townsfolk",
        ability: "Once per game, at night, choose which Minions or which Demon is in play."
    },
    {
        name: "Nightwatchman",
        characterType: "Townsfolk",
        ability: "Once per game, at night, choose a player: they learn you are the Nightwatchman."
    },
    {
        name: "Courtier",
        characterType: "Townsfolk",
        ability: "Once per game, at night, choose a character: they are drunk for 3 nights & 3 days."
    },
    {
        name: "Seamstress",
        characterType: "Townsfolk",
        ability: "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment."
    },
    {
        name: "Philosopher",
        characterType: "Townsfolk",
        ability: "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk."
    },
    {
        name: "Huntsman",
        characterType: "Townsfolk",
        ability: "Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]"
    },
    {
        name: "Professor",
        characterType: "Townsfolk",
        ability: "Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected."
    },
    {
        name: "Artist",
        characterType: "Townsfolk",
        ability: "Once per game, during the day, privately ask the Storyteller any yes/no question."
    },
    {
        name: "Slayer",
        characterType: "Townsfolk",
        ability: "Once per game, during the day, publicly choose a player: if they are the Demon, they die."
    },
    {
        name: "Fisherman",
        characterType: "Townsfolk",
        ability: "Once per game, during the day, visit the Storyteller for some advice to help your team win."
    },
    {
        name: "Princess",
        characterType: "Townsfolk",
        ability: "On your 1st day, if you nominated & executed a player, the Demon doesn't kill tonight."
    },
    {
        name: "Juggler",
        characterType: "Townsfolk",
        ability: "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct."
    },
    {
        name: "Soldier",
        characterType: "Townsfolk",
        ability: "You are safe from the Demon."
    },
    {
        name: "Alchemist",
        characterType: "Townsfolk",
        ability: "You have a Minion ability. When using this, the Storyteller may prompt you to choose differently."
    },
    {
        name: "Cannibal",
        characterType: "Townsfolk",
        ability: "You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution."
    },
    {
        name: "Amnesiac",
        characterType: "Townsfolk",
        ability: "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are."
    },
    {
        name: "Farmer",
        characterType: "Townsfolk",
        ability: "When you die at night, an alive good player becomes a Farmer."
    },
    {
        name: "Minstrel",
        characterType: "Townsfolk",
        ability: "When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow."
    },
    {
        name: "Ravenkeeper",
        characterType: "Townsfolk",
        ability: "If you die at night, you are woken to choose a player: you learn their character."
    },
    {
        name: "Sage",
        characterType: "Townsfolk",
        ability: "If the Demon kills you, you learn that it is 1 of 2 players."
    },
    {
        name: "Choirboy",
        characterType: "Townsfolk",
        ability: "If the Demon kills the King, you learn which player is the Demon. [+the King]"
    },
    {
        name: "Banshee",
        characterType: "Townsfolk",
        ability: "If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination."
    },
    {
        name: "Tea Lady",
        characterType: "Townsfolk",
        ability: "If both your alive neighbors are good, they can't die."
    },
    {
        name: "Mayor",
        characterType: "Townsfolk",
        ability: "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead."
    },
    {
        name: "Fool",
        characterType: "Townsfolk",
        ability: "The 1st time you die, you don't."
    },
    {
        name: "Virgin",
        characterType: "Townsfolk",
        ability: "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately."
    },
    {
        name: "Magician",
        characterType: "Townsfolk",
        ability: "The Demon thinks you are a Minion. Minions think you are a Demon."
    },
    {
        name: "Poppy Grower",
        characterType: "Townsfolk",
        ability: "Minions & Demons do not know each other. If you die, they learn who each other are that night."
    },
    {
        name: "Pacifist",
        characterType: "Townsfolk",
        ability: "Executed good players might not die."
    },
    {
        name: "Atheist",
        characterType: "Townsfolk",
        ability: "The Storyteller can break the game rules, and if executed, good wins, even if you are dead. [No evil character]"
    },

    {
        name: "Hermit",
        characterType: "Outsider",
        ability: "You have all Outsider abilities. [-0 or -1 Outsiders]",
    },
    {
        name: "Butler",
        characterType: "Outsider",
        ability: "Each night, choose a player: tomorrow, you may only vote if they are voting too."
    },
    {
        name: "Goon",
        characterType: "Outsider",
        ability: "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment."
    },
    {
        name: "Ogre",
        characterType: "Outsider",
        ability: "On your 1st night, choose a player (not yourself): you become their alignment (you don´t know which) even if drunk or poisoned."
    },
    {
        name: "Lunatic",
        characterType: "Outsider",
        ability: "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night."
    },
    {
        name: "Drunk",
        characterType: "Outsider",
        ability: "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not."
    },
    {
        name: "Tinker",
        characterType: "Outsider",
        ability: "You might die at any time."
    },
    {
        name: "Recluse",
        characterType: "Outsider",
        ability: "You might register as evil & as a Minion or Demon, even if dead."
    },
    {
        name: "Golem",
        characterType: "Outsider",
        ability: "You may only nominate once per game. When you do, if the nominee is not the Demon, they die."
    },
    {
        name: "Sweetheart",
        characterType: "Outsider",
        ability: "When you die, 1 player is drunk from now on."
    },
    {
        name: "Plague Doctor",
        characterType: "Outsider",
        ability: "When you die, the Storyteller gains a Minion ability."
    },
    {
        name: "Klutz",
        characterType: "Outsider",
        ability: "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses."
    },
    {
        name: "Moonchild",
        characterType: "Outsider",
        ability: "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die."
    },
    {
        name: "Saint",
        characterType: "Outsider",
        ability: "If you die by execution, your team loses."
    },
    {
        name: "Barber",
        characterType: "Outsider",
        ability: "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters."
    },
    {
        name: "Hatter",
        characterType: "Outsider",
        ability: "If you died today or tonight, the Minion & Demon players may choose new Minion & Demon characters to be."
    },
    {
        name: "Mutant",
        characterType: "Outsider",
        ability: "If you are “mad” about being an Outsider, you might be executed."
    },
    {
        name: "Politician",
        characterType: "Outsider",
        ability: "If your were the player most responsible for your team losing, you change alignment & win, even if dead."
    },
    {
        name: "Zealot",
        characterType: "Outsider",
        ability: "If there are 5 or more players alive, you must vote for every nomination."
    },
    {
        name: "Damsel",
        characterType: "Outsider",
        ability: "All Minions know a Damsel is in play. If a Minion publicly guesses you (once), your team loses."
    },
    {
        name: "Snitch",
        characterType: "Outsider",
        ability: "Each Minion gets 3 bluffs."
    },
    {
        name: "Heretic",
        characterType: "Outsider",
        ability: "Whoever wins, loses & whoever loses, wins, even if you are dead."
    },
    {
        name: "Puzzlemaster",
        characterType: "Outsider",
        ability: "1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info."
    },


    {
        name: "Mezepheles",
        characterType: "Minion",
        ability: "You start knowing a secret word. The 1st good player to say this word becomes evil that night."
    },
    {
        name: "Godfather",
        characterType: "Minion",
        ability: "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]"
    },
    {
        name: "Poisoner",
        characterType: "Minion",
        ability: "Each night, choose a player: they are poisoned tonight and tomorrow day."
    },
    {
        name: "Devils Advocate",
        characterType: "Minion",
        ability: "Each night, choose a living player (different to last night): if executed tomorrow, they don’t die."
    },
    {
        name: "Spy",
        characterType: "Minion",
        ability: "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead."
    },
    {
        name: "Harpy",
        characterType: "Minion",
        ability: "Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or one or both might die."
    },
    {
        name: "Witch",
        characterType: "Minion",
        ability: "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability."
    },
    {
        name: "Cerenovus",
        characterType: "Minion",
        ability: "Each night, choose a player & a good character: they are 'mad' they are this character tomorrow, or might be executed."
    },
    {
        name: "Fearmonger",
        characterType: "Minion",
        ability: "Each night, choose a player: if you nominate & execute them, their team loses. All players know if you choose a new player."
    },
    {
        name: "Pit Hag",
        characterType: "Minion",
        ability: "Each night*, choose a player & a character they become (if not in play). If a Demon is made, deaths tonight are arbitrary."
    },
    {
        name: "Psychopath",
        characterType: "Minion",
        ability: "Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo."
    },
    {
        name: "Assassin",
        characterType: "Minion",
        ability: "Once per game, at night*, choose a player: they die, even if for some reason they could not."
    },
    {
        name: "Wizard",
        characterType: "Minion",
        ability: "Once per game, choose to make a wish. If granted, it might have a price and leave a clue as to its nature."
    },
    {
        name: "Widow",
        characterType: "Minion",
        ability: "On your 1st night, look at the Grimoire & choose a player: they are poisoned. 1 good player knows a Widow is in play."
    },
    {
        name: "Xaan",
        characterType: "Minion",
        ability: "On night X, all Townsfolk are poisoned until dusk. [X Outsiders]"
    },
    {
        name: "Marionette",
        characterType: "Minion",
        ability: "You think you are a good character, but you are not. The Demon knows who you are. [You neighbor the Demon]"
    },
    {
        name: "Wraith",
        characterType: "Minion",
        ability: "You may choose to open your eyes at night. You wake when other evil players do."
    },
    {
        name: "Evil Twin",
        characterType: "Minion",
        ability: "You & an opposing player know each other. If the good player is executed, evil wins. Good can’t win if you both live."
    },
    {
        name: "Summoner",
        characterType: "Minion",
        ability: "You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]"
    },
    {
        name: "Goblin",
        characterType: "Minion",
        ability: "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins."
    },
    {
        name: "Boomdandy",
        characterType: "Minion",
        ability: "If you are executed, all but 3 players die. After a 10 to 1 countdown, the player with the most players pointing at them, dies."
    },
    {
        name: "Mastermind",
        characterType: "Minion",
        ability: "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses."
    },
    {
        name: "Scarlet Woman",
        characterType: "Minion",
        ability: "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don’t count.)"
    },
    {
        name: "Vizier",
        characterType: "Minion",
        ability: "All players know you are the Vizier. You cannot die during the day. If good voted, you may choose to execute immediately."
    },
    {
        name: "Organ Grinder",
        characterType: "Minion",
        ability: "All players keep their eyes closed when voting and the vote tally is secret. Each night, choose if you are drunk until dusk."
    },
    {
        name: "Boffin",
        characterType: "Minion",
        ability: "The Demon (even if drunk or poisoned) has a not-in-play good character’s ability. You both know which."
    },
    {
        name: "Baron",
        characterType: "Minion",
        ability: "There are extra Outsiders in play. [+2 Outsiders]"
    },
    {
        name: "Yaggababble",
        characterType: "Demon",
        ability: "You start knowing a secret phrase. For each time you said it publicly today, a player might die."
    },
    {
        name: "Pukka",
        characterType: "Demon",
        ability: "Each night*, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy."
    },
    {
        name: "Lil Monsta",
        characterType: "Demon",
        ability: "Each night, Minions choose who babysits Lil' Monsta & 'is the Demon.' Each night*, a player might die. [+1 Minion]"
    },
    {
        name: "No Dashii",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned."
    },
    {
        name: "Imp",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp."
    },
    {
        name: "Kazali",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. [You choose which players are which Minions. -? to +? Outsiders]"
    },
    {
        name: "Shabaloth",
        characterType: "Demon",
        ability: "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated."
    },
    {
        name: "Ojo",
        characterType: "Demon",
        ability: "Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies."
    },
    {
        name: "Po",
        characterType: "Demon",
        ability: "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight."
    },
    {
        name: "Zombuul",
        characterType: "Demon",
        ability: "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead."
    },
    {
        name: "Al Hadikhia",
        characterType: "Demon",
        ability: "Each night*, you may choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die."
    },
    {
        name: "Vigormortis",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor. [-1 Outsider]"
    },
    {
        name: "Vortox",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins."
    },
    {
        name: "Fang Gu",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]"
    },
    {
        name: "Legion",
        characterType: "Demon",
        ability: "Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]"
    },
    {
        name: "Lord of Typhon",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. -? to +? Outsiders]"
    },
    {
        name: "Lleech",
        characterType: "Demon",
        ability: "Each night*, choose a player: they die. You start by choosing a player: they are poisoned. You die if & only if they are dead."
    },
    {
        name: "Leviathan",
        characterType: "Demon",
        ability: "If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins."
    },
    {
        name: "Riot",
        characterType: "Demon",
        ability: "On day 3, Minions become Riot & nominees die but nominate an alive player immediately. This must happen."
    },
    {
        name: "Apprentice",
        characterType: "Traveller",
        ability: "On your 1st night, you gain a Townsfolk ability (if good) or a Minion ability (if evil)."
    },
    {
        name: "Barista",
        characterType: "Traveller",
        ability: "Each night, until dusk, 1) a player becomes sober, healthy & gets true info, or 2) their ability works twice. They learn which."
    },
    {
        name: "Beggar",
        characterType: "Traveller",
        ability: "You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober and healthy."
    },
    {
        name: "Bishop",
        characterType: "Traveller",
        ability: "Only the Storyteller can nominate. At least 1 opposing player must be nominated each day."
    },
    {
        name: "Bone Collector",
        characterType: "Traveller",
        ability: "Once per game, at night*, choose a dead player: they regain their ability until dusk."
    },
    {
        name: "Bureaucrat",
        characterType: "Traveller",
        ability: "Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow."
    },
    {
        name: "Butcher",
        characterType: "Traveller",
        ability: "Each day, after the 1st execution, you may nominate again."
    },
    {
        name: "Deviant",
        characterType: "Traveller",
        ability: "If you were funny today, you cannot die by exile."
    },
    {
        name: "Gangster",
        characterType: "Traveller",
        ability: "Once per day, you may choose to kill an alive neighbor, if your other alive neighbor agrees."
    },
    {
        name: "Gnome",
        characterType: "Traveller",
        ability: "All players start knowing a player of your alignment. You may choose to kill anyone who nominates them."
    },
    {
        name: "Gunslinger",
        characterType: "Traveller",
        ability: "Each day, after the 1st vote has been tallied, you may choose a player that voted: they die."
    },
    {
        name: "Harlot",
        characterType: "Traveller",
        ability: "Each night*, choose a living player: if they agree, you learn their character, but you both might die."
    },
    {
        name: "Judge",
        characterType: "Traveller",
        ability: "Once per game, if another player nominated, you may choose to force the current execution to pass or fail."
    },
    {
        name: "Matron",
        characterType: "Traveller",
        ability: "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private."
    },
    {
        name: "Scapegoat",
        characterType: "Traveller",
        ability: "If a player of your alignment is executed, you might be executed instead."
    },
    {
        name: "Thief",
        characterType: "Traveller",
        ability: "Each night, choose a player (not yourself): their vote counts negatively tomorrow."
    },
    {
        name: "Voudon",
        characterType: "Traveller",
        ability: "Only you & the dead can vote. They don't need a vote token to do so. A 50% majority isn't required."
    },


    {
        name: "Angel",
        characterType: "Fabled",
        ability: "Something bad might happen to whoever is most responsible for the death of a new player."
    },
    {
        name: "Bootlegger",
        characterType: "Fabled",
        ability: "This script has homebrew characters or rules."
    },
    {
        name: "Buddhist",
        characterType: "Fabled",
        ability: "For the first 2 minutes of each day, veteran players may not talk."
    },
    {
        name: "Djinn",
        characterType: "Fabled",
        ability: "Use the Djinn's special rule. All players know what it is."
    },
    {
        name: "Doomsayer",
        characterType: "Fabled",
        ability: "If 4 or more players live, each living player may publicly choose (once per game) that a player of their own alignment dies."
    },
    {
        name: "Duchess",
        characterType: "Fabled",
        ability: "Each day, 3 players may choose to visit you. At night*, each visitor learns how many visitors are evil, but 1 gets false info."
    },
    {
        name: "Ferryman",
        characterType: "Fabled",
        ability: "On the final day, all dead players regain their vote token."
    },
    {
        name: "Fibbin",
        characterType: "Fabled",
        ability: "Once per game, 1 good player might get incorrect information."
    },
    {
        name: "Fiddler",
        characterType: "Fabled",
        ability: "Once per game, the Demon secretly chooses an opposing player: all players choose which of these 2 players win."
    },
    {
        name: "Gardener",
        characterType: "Fabled",
        ability: "The Storyteller assigns 1 or more players' characters."
    },
    {
        name: "Hells Librarian",
        characterType: "Fabled",
        ability: "Something bad might happen to whoever talks when the Storyteller has asked for silence."
    },
    {
        name: "Revolutionary",
        characterType: "Fabled",
        ability: "2 neighboring players are known to be the same alignment. Once per game, 1 of them registers falsely."
    },
    {
        name: "Sentinel",
        characterType: "Fabled",
        ability: "There might be 1 extra or 1 fewer Outsider in play."
    },
    {
        name: "Spirit of Ivory",
        characterType: "Fabled",
        ability: "There can't be more than 1 extra evil player."
    },
    {
        name: "Storm Catcher",
        characterType: "Fabled",
        ability: "Name a good character. If in play, they can only die by execution, but evil players learn which player it is."
    },
    {
        name: "Toymaker",
        characterType: "Fabled",
        ability: "The Demon may choose not to attack & must do this at least once per game. Evil players get normal starting info."
    }
]

const allTags = ["Misinformation", "Extra Death", "Protection", "Wincondition", "Character Changing", "Setup",
    "Madness", "Nomination Phase", "ST Consult", "When You Die", "Resurrection", "Alignment Switching", "Public", "Seating Order"];

function getTeamColor(team) {
    if (team.toLowerCase() === "townsfolk") return "cornflowerblue";
    if (team.toLowerCase() === "outsider") return "cyan";
    if (team.toLowerCase() === "minion") return "orange";
    if (team.toLowerCase() === "demon") return "red";
    if (team.toLowerCase() === "traveller") return "purple";
    if (team.toLowerCase() === "fabled") return "gold";
    return "";
}

const characterTypes = ["Townsfolk", "Outsider", "Minion", "Demon", "Traveller", "Fabled"];

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

export {
    getJsonString, firstNightList, otherNightList, allRoles, allTags, getTeamColor, characterTypes,
    StevenApprovedOrder, updateRole, createRole, deleteRole, API_URL, createPopup, n, databaseIsConnected,
    getRoleIdeas, websiteStorage, saveLocalStorage
}
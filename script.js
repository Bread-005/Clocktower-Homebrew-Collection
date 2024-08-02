let role1 = {
    name: "Washerwoman",
    characterType: "Townsfolk",
    ability: "You start knowing that 1 of 2 players is a particular Townsfolk"
}

let homebrewCharacters = [];

document.querySelector('.js-add-role').addEventListener('click', addRole)

function addRole() {
    const input = document.querySelector('.input');

    homebrewCharacters.push(input.value);
    let characterOutput = "";
    for (let i = 0; i < homebrewCharacters.length; i++) {
        characterOutput = characterOutput.concat("<li>" + homebrewCharacters[i] + "</li>");
    }
    document.getElementById("homebrewroles").innerHTML = characterOutput;
}


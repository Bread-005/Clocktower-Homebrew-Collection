
document.querySelector('.js-add-role').addEventListener('click', addRole);
document.querySelector('.js-remove-role').addEventListener('click', removeRole);
document.addEventListener("DOMContentLoaded",function () {
    displayRoles();
});

function addRole() {
    const input = document.querySelector('.input');
    if (input.value === "") {
        return;
    }
    localStorage.setItem(Date.now().toString(), input.value);
    displayRoles();
}

function removeRole() {
    const input = document.querySelector('.input');
    if (input.value === "") {
        return;
    }
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)).startsWith(input.value)) {
            localStorage.removeItem(localStorage.key(i));
            break;
        }
    }
    displayRoles();
}

function displayRoles() {
    if (localStorage.length === 0) {
        document.getElementById("homebrewroles").innerHTML = "Die Rollenliste ist leer";
        return;
    }
    let characterOutput = "";
    for (let i = 0; i < localStorage.length; i++) {
        characterOutput = characterOutput.concat("<li data-key=" + localStorage.key(i) + ">" + localStorage.getItem(localStorage.key(i)) + "</li>");
    }
    document.getElementById("homebrewroles").innerHTML = characterOutput;
}


document.addEventListener("DOMContentLoaded",function () {

    document.querySelector('.js-add-role').addEventListener('click', addRole);

    displayRoles();

    function addRole() {
        const input = document.querySelector('.input');
        if (input.value === "") {
            return;
        }
        const key = Date.now().toString();
        localStorage.setItem(key, input.value);
        displayRoles();
    }

    function displayRoles() {
        if (emptyRoleListText()) {
            return;
        }
        let characterOutput = "";
        const roleIdeas = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            roleIdeas.push({key,value});
        }

        roleIdeas.sort((a,b) => a.key - b.key);
        for (let roleIdea of roleIdeas) {
            characterOutput = characterOutput.concat("<li id=" + roleIdea.key + "-list" + ">" + roleIdea.value +
                "<button class='js-delete-button' id=" + roleIdea.key +" + data-key=" + roleIdea.key +">Rolle entfernen</button></li>");
        }
        document.getElementById("homebrewroles").innerHTML = characterOutput;
    }

    document.addEventListener('click', function(event){
        if (event.target.classList.contains("js-delete-button")) {
            const dataKey = event.target.dataset.key;
            document.getElementById(dataKey + "-list").remove();
            localStorage.removeItem(dataKey);
            emptyRoleListText();
        }
    });

    function emptyRoleListText() {
        if (localStorage.length === 0) {
            document.getElementById("homebrewroles").innerHTML = "Die Rollenliste ist leer";
        }
        return localStorage.length === 0;
    }
});

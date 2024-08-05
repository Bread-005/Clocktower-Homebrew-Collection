document.addEventListener("DOMContentLoaded",function () {

    document.querySelector('.js-add-role').addEventListener('click', addRole);

    displayRoles();
    displayRatings();

    function addRole() {
        const input = document.querySelector('.input');
        if (input.value === "") {
            return;
        }
        const key = Date.now().toString();
        localStorage.setItem(key + "-role-idea", input.value);
        displayRoles();
    }

    function displayRoles() {
        if (isListEmpty("role-idea")) {
            return;
        }
        let characterOutput = "";
        const roleIdeas = createTempLocalStorage("role-idea");
        roleIdeas.sort((a,b) => a.key.replace("-role-idea","") - b.key.replace("-role-idea",""));
        for (let roleIdea of roleIdeas) {
            characterOutput = characterOutput.concat("<li id=" + roleIdea.key + ">" + roleIdea.value +
                "<button class='js-delete-button icon-button' id=" + roleIdea.key + " data-key=" + roleIdea.key +"> <i class='js-delete-button fa-solid fa-trash' data-key=" + roleIdea.key +"></i></button>" +
                "<label><input class='rate-field' type='number' name=rating" + roleIdea.key +" min='0' max='10' id='" + roleIdea.key + "-rate-field'/></label>" +
                "<button class ='rate-button' data-key=" + roleIdea.key +"><i class='rate fa-sharp fa-regular fa-star' data-key=" + roleIdea.key +"></i></button></li>");
            // let deleteButton = document.createElement("button");
            // let list = document.createElement("list");
            // document.body.appendChild(list);
            // list.appendChild(deleteButton);
        }
        document.getElementById("homebrewroles").innerHTML = characterOutput;
    }

    document.addEventListener('click', function(event){
        const dataKey = event.target.dataset.key;
        if (event.target.classList.contains("js-delete-button")) {
            document.getElementById(dataKey + "-role-idea").remove();
            localStorage.removeItem(dataKey);
            isListEmpty("role-idea");
        }
        if (event.target.classList.contains("rate-button") || event.target.classList.contains("rate")) {
            const input = document.getElementById(dataKey + "-rate-field");
            localStorage.setItem(dataKey + "-rate",input.value);
            displayRatings();
        }
    });

    function isListEmpty(contentType) {
        let roleIdeaCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes(contentType)) {
                roleIdeaCount++;
            }
        }
        if (roleIdeaCount === 0) {
            if (contentType.equals("role-idea")) {
                document.getElementById("homebrewroles").innerHTML = "Die Rollenliste ist leer";
            }
            if (contentType.equals("rate")) {
                document.getElementById("homebrewroles").innerHTML = "Niemand hat bisher eine Rolle bewertet";
            }
        }
        return roleIdeaCount === 0;
    }

    function createTempLocalStorage(contentType) {
        let tempLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (!localStorage.key(i).endsWith(contentType)) continue;
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            tempLocalStorage.push({key,value});
        }
        return tempLocalStorage;
    }

    function displayRatings() {
        const roleIdeaRatings = createTempLocalStorage("rate");
        let roleIdeaRatingsString = "";
        for (let roleRating of roleIdeaRatings) {
            roleIdeaRatingsString = roleIdeaRatingsString.concat(`<li id="${roleRating.key}-rate" data-key="${roleRating.key}-rate">${localStorage.getItem(roleRating.key.replace("-rate",""))} wurde mit ${roleRating.value} bewertet</li>`)
        }
        document.getElementById("rate-history").innerHTML = roleIdeaRatingsString;
    }

    function elementFromHtml(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstElementChild;
    }
});

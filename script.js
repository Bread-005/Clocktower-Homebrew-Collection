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
        const roleIdeas = createTempLocalStorage("role-idea");
        roleIdeas.sort((a,b) => a.key.replace("-role-idea","") - b.key.replace("-role-idea",""));
         for (let roleIdea of roleIdeas) {

            const list = document.createElement("li");
            list.setAttribute("id",roleIdea.key);
            list.textContent = roleIdea.value;

            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("class","js-delete-button icon-button");
            deleteButton.setAttribute("id",roleIdea.key);
            deleteButton.setAttribute("data-key",roleIdea.key);

            const deleteButtonIcon = document.createElement("i");
            deleteButtonIcon.setAttribute("class","js-delete-button fa-solid fa-trash");
            deleteButtonIcon.setAttribute("data-key",roleIdea.key);

            const input = document.createElement("input");
            input.setAttribute("id",roleIdea.key + "-rate-field");
            input.setAttribute("class","rate-field");
            input.setAttribute("type","number");
            input.setAttribute("name","rating" + roleIdea.key);
            input.setAttribute("min","0");
            input.setAttribute("max","10");

            const rateButton = document.createElement("button");
            rateButton.setAttribute("class","rate-button");
            rateButton.setAttribute("data-key",roleIdea.key);

            const rateButtonIcon = document.createElement("i");
            rateButtonIcon.setAttribute("class","rate fa-sharp fa-regular fa-star");
            rateButtonIcon.setAttribute("data-key",roleIdea.key);

            rateButton.append(rateButtonIcon);
            deleteButton.append(deleteButtonIcon);
            list.append(deleteButton);
            list.append(input);
            list.append(rateButton);
            document.getElementById("homebrewroles").append(list);

            deleteButton.addEventListener("click",function () {
                localStorage.removeItem(roleIdea.key);
                list.remove();
                isListEmpty("role-idea");
            });

            rateButton.addEventListener("click",function () {
                const input = document.getElementById(roleIdea.key + "-rate-field");
                localStorage.setItem(roleIdea.key + "-rate",input.value);
                displayRatings();
            });
        }
}

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

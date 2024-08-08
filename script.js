document.addEventListener("DOMContentLoaded",function () {

    document.querySelector('.js-add-role').addEventListener('click', addRole);

    displayRoles();
    displayRatings();

    function addRole(event) {
        event.preventDefault();
        const roleNameInput = document.getElementById("role-name");
        const characterTypeInput = document.getElementById("character-types");
        const abilityTextInput = document.getElementById("ability-text");
        if (roleNameInput.value === "" || characterTypeInput.value === "" || abilityTextInput.value === "") {
            return;
        }
        const key = Date.now().toString();
        const role = {
            name: roleNameInput.value,
            characterType: characterTypeInput.value,
            abilityText: abilityTextInput.value
        }
        localStorage.setItem(key, JSON.stringify(role));
        roleNameInput.value = "";
        abilityTextInput.value = "";
        displayRoles();
    }

    function displayRoles() {
        const roleIdeaArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            roleIdeaArray.push({key,value});
        }
        roleIdeaArray.sort((a,b) => a.key.replace("-role-idea","") - b.key.replace("-role-idea",""));
        document.getElementById("homebrewroles").innerHTML = "";

        const table = document.createElement("table");
        table.setAttribute("class","role-idea-table");

        const tableBody = document.createElement("tbody");

         for (let roleIdea of roleIdeaArray) {

             const role = JSON.parse(localStorage.getItem(roleIdea.key));

             const columnRoleIdea = document.createElement("td");
             columnRoleIdea.setAttribute("class","column-role-idea");
             const columnDeleteAndRate = document.createElement("td");
             columnDeleteAndRate.setAttribute("class","column-delete-and-rate");
             const tableRow = document.createElement("tr");
             tableRow.setAttribute("class","table-row-role-idea");

             const list = document.createElement("li");
             list.setAttribute("id",roleIdea.key);
             list.setAttribute("class","role-idea-list");

             const image = document.createElement("img");
             image.setAttribute("class","clocktower-icon clocktower-icon-role-idea");
             image.setAttribute("src","placeholder-icon.png");
             if (role["image"]) {
                 image.setAttribute("src",role["image"]);
             }
             list.textContent = role["name"] + " (" + role["characterType"] + "): " + role["abilityText"];

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
             rateButton.setAttribute("class","rate-button icon-button");
             rateButton.setAttribute("data-key",roleIdea.key);

             const rateButtonIcon = document.createElement("i");
             rateButtonIcon.setAttribute("class","rate fa-sharp fa-regular fa-star");
             rateButtonIcon.setAttribute("data-key",roleIdea.key);

             const wikiButton = document.createElement("button");
             wikiButton.setAttribute("class","wiki-button icon-button");

             const wikiButtonIcon = document.createElement("i");
             wikiButtonIcon.setAttribute("class","wiki-button-icon fa-solid fa-book");

             const anchor = document.createElement("a");
             anchor.setAttribute("href","wiki.html?r=" + roleIdea.key);

             rateButton.append(rateButtonIcon);
             deleteButton.append(deleteButtonIcon);
             wikiButton.append(wikiButtonIcon);
             anchor.append(wikiButton);
             list.prepend(image);
             columnRoleIdea.append(list);
             columnDeleteAndRate.append(input);
             columnDeleteAndRate.append(rateButton);
             columnDeleteAndRate.append(anchor);
             columnDeleteAndRate.append(deleteButton);
             tableRow.append(columnRoleIdea);
             tableRow.append(columnDeleteAndRate);
             tableBody.append(tableRow);
             table.append(tableBody);
             document.getElementById("homebrewroles").append(table);

             deleteButton.addEventListener("click",function () {
                 localStorage.removeItem(roleIdea.key);
                 tableRow.remove();
                 displayRoles();
                 displayRatings();
                 setEmptyListContent();
             });

             rateButton.addEventListener("click",function () {
                 const input = document.getElementById(roleIdea.key + "-rate-field");
                 if (input.value === "" || input.value < 0 || input.value > 10) {
                     input.value = "";
                     return;
                 }
                 role["rating"] = input.value;
                 localStorage.setItem(roleIdea.key,JSON.stringify(role));
                 displayRatings();
                 input.value = "";
             });
         }
    }

    function setEmptyListContent() {
        let roleIdeaCount = 0;
        let ratingCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const role = localStorage.getItem(localStorage.key(i));
            if (role["name"] !== null) {
                roleIdeaCount++;
            }
            if (role["rating"] !== null) {
                ratingCount++;
            }
        }
        if (roleIdeaCount === 0) {
            document.getElementById("homebrewroles").innerHTML = "Die Rollenliste ist leer";
        }
        if (ratingCount === 0) {
            document.getElementById("role-history").innerHTML = "Niemand hat bisher eine Rolle bewertet";
        }
    }

    function displayRatings() {
        let roleIdeaRatingsString = "";
        for (let i = 0; i < localStorage.length; i++) {
            const role = JSON.parse(localStorage.getItem(localStorage.key(i)));
            if (role["rating"] === undefined) {
                continue;
            }
            roleIdeaRatingsString = roleIdeaRatingsString.concat("<li>" + role["name"] + " wurde mit " + role["rating"] + " bewertet" + "</li>");
        }
        document.getElementById("rate-history").innerHTML = roleIdeaRatingsString;
    }
});

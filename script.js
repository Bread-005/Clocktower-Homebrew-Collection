document.addEventListener("DOMContentLoaded",function () {

    document.getElementById("js-add-role").addEventListener("click",addRole);

    const roleSearch = document.getElementById("role-search");
    const characterTypSelection = document.getElementById("character-typ-selection");
    const sortingDropDownMenu = document.getElementById("sorting");
    sortingDropDownMenu.value = "Neuste zuerst";

    displayRoles("Neuste zuerst");
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
        displayRoles("Neuste zuerst");
    }

    function displayRoles(input) {
        const array = createTempLocalStorage();
        array.sort((a, b) => a.key - b.key);
        if (input === "Neuste zuerst") {
            array.reverse();
        }
        if (input === "Alphabet A-Z") {
            array.sort((a,b) => sortAlphabetically(a["role"],b["role"],true));
        }
        if (input === "Alphabet Z-A") {
            array.sort((a,b) => sortAlphabetically(a["role"],b["role"],false));
        }
        const roleIdeaArray = array.slice((Number.parseInt(localStorage.getItem("page")) - 1) * 10,Number.parseInt(localStorage.getItem("page")) * 10);
        document.getElementById("homebrewroles").innerHTML = "";

        const table = document.createElement("table");
        table.setAttribute("class","border-spacing-10");

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

             const wikiButtonIcon = document.createElement("i");
             wikiButtonIcon.setAttribute("class","fa-solid fa-book");

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

         if (roleIdeaArray.length === 0) {
             document.getElementById("homebrewroles").innerHTML = "Es gibt noch keine Rollen die deiner Suche entsprechen";
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

    sortingDropDownMenu.addEventListener("change",function () {
        displayRoles(sortingDropDownMenu.value);
    });

    characterTypSelection.addEventListener("change",function () {
        displayRoles(sortingDropDownMenu.value);
    });

    roleSearch.addEventListener("input",function () {
        displayRoles(sortingDropDownMenu.value);
    });
    function createTempLocalStorage() {
        const array = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === "page") {
                continue;
            }
            const value = localStorage.getItem(key);
            const input = characterTypSelection.value;
            const role = JSON.parse(value);
            if (role["characterType"] !== input && input !== "All") {
                continue;
            }
            if (roleSearch.value !== "" &&
                !role["name"].toUpperCase().includes(roleSearch.value.toUpperCase()) &&
                !role["characterType"].toUpperCase().includes(roleSearch.value.toUpperCase()) &&
                !role["abilityText"].toUpperCase().includes(roleSearch.value.toUpperCase())) {
                continue;
            }
            array.push({key,role});
        }
        return array;
    }

    function sortAlphabetically(a, b, alphabetically) {
        if (a["name"].toUpperCase() < b["name"].toUpperCase()) {
            if (alphabetically) {
                return -1;
            }
            return 1;
        }
        if (a["name"].toUpperCase() > b["name"].toUpperCase()) {
            if (alphabetically) {
                return 1;
            }
            return -1;
        }
        return 0;
    }

    showPages();

    function showPages() {
        const pages = (localStorage.length - 1) / 10;
        for (let i = 0; i < pages; i++) {
            const button = document.createElement("button");
            button.textContent = (i + 1).toString();
            button.classList.remove("blue");
            if (localStorage.getItem("page") === button.textContent) {
                button.setAttribute("class", "blue");
            }
            button.addEventListener("click",function () {
                localStorage.setItem("page",button.textContent);
                document.querySelectorAll(".blue").forEach(element => element.classList.remove("blue"));
                if (localStorage.getItem("page") === button.textContent) {
                    button.setAttribute("class", "blue");
                }
                displayRoles(sortingDropDownMenu.value);
            });
            document.getElementById("role-idea-page-selection").append(button);
        }
    }
});

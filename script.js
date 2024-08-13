document.addEventListener("DOMContentLoaded",function () {

    const websiteStorageString = "websiteStorage1";

    document.getElementById("js-add-role").addEventListener("click",addRole);

    if (localStorage.getItem(websiteStorageString) === null) {
        const storage = {
            roleIdeas: [],
            page: "1",
            users: []
        }
        localStorage.setItem(websiteStorageString,JSON.stringify(storage));
    }

    const webSiteStorage1 = JSON.parse(localStorage.getItem(websiteStorageString));

    const roleSearch = document.getElementById("role-search");
    const characterTypSelection = document.getElementById("character-typ-selection");
    const sortingDropDownMenu = document.getElementById("sorting");
    sortingDropDownMenu.value = "Neuste zuerst";

    displayRoles(sortingDropDownMenu.value);
    displayRatings();
    setEmptyListContent();
    showPages();

    function addRole(event) {
        event.preventDefault();
        const roleNameInput = document.getElementById("role-name");
        const characterTypeInput = document.getElementById("character-types");
        const abilityTextInput = document.getElementById("ability-text");
        if (roleNameInput.value === "" || characterTypeInput.value === "" || abilityTextInput.value === "") {
            return;
        }

        const role = {
            name: roleNameInput.value,
            characterType: characterTypeInput.value,
            abilityText: abilityTextInput.value,
            key: Date.now().toString()
        }
        webSiteStorage1["roleIdeas"].push(role);
        localStorage.setItem(websiteStorageString, JSON.stringify(webSiteStorage1));
        roleNameInput.value = "";
        abilityTextInput.value = "";
        displayRoles(sortingDropDownMenu.value);
        showPages();
    }

    function displayRoles(input) {
        const array = createTempLocalStorage();
        if (input === "Neuste zuerst") {
            array.reverse();
        }
        if (input === "Alphabet A-Z") {
            array.sort((a,b) => sortAlphabetically(a["name"],b["name"],true));
        }
        if (input === "Alphabet Z-A") {
            array.sort((a,b) => sortAlphabetically(a["name"],b["name"],false));
        }
        const roleIdeaArray = array.slice((Number.parseInt(webSiteStorage1["page"]) - 1) * 10,Number.parseInt(webSiteStorage1["page"]) * 10);
        document.getElementById("homebrewroles").innerHTML = "";

        const table = document.createElement("table");
        table.setAttribute("class","border-spacing-10");

        const tableBody = document.createElement("tbody");

         for (let i = 0; i < roleIdeaArray.length; i++) {

             const role = roleIdeaArray[i];
             const key = role["key"].toString();

             const columnRoleIdea = document.createElement("td");
             columnRoleIdea.setAttribute("class","column-role-idea");
             const columnDeleteAndRate = document.createElement("td");
             columnDeleteAndRate.setAttribute("class","column-delete-and-rate");
             const tableRow = document.createElement("tr");

             const list = document.createElement("li");
             list.setAttribute("id",key);
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
             deleteButton.setAttribute("id",key);
             deleteButton.setAttribute("data-key",key);

             const deleteButtonIcon = document.createElement("i");
             deleteButtonIcon.setAttribute("class","js-delete-button fa-solid fa-trash");
             deleteButtonIcon.setAttribute("data-key",key);

             const input = document.createElement("input");
             input.setAttribute("id",key + "-rate-field");
             input.setAttribute("class","rate-field");
             input.setAttribute("type","number");
             input.setAttribute("name","rating" + key);
             input.setAttribute("min","0");
             input.setAttribute("max","10");

             const rateButton = document.createElement("button");
             rateButton.setAttribute("class","rate-button icon-button");
             rateButton.setAttribute("id",key + "-rate-field");
             rateButton.setAttribute("data-key",key);

             const rateButtonIcon = document.createElement("i");
             rateButtonIcon.setAttribute("class","rate fa-sharp fa-regular fa-star");
             rateButtonIcon.setAttribute("data-key",key);

             const wikiButton = document.createElement("button");

             const wikiButtonIcon = document.createElement("i");
             wikiButtonIcon.setAttribute("class","fa-solid fa-book");

             const anchor = document.createElement("a");
             anchor.setAttribute("href","wiki.html?r=" + key);

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
                 for (let j = 0; j < webSiteStorage1.roleIdeas.length; j++) {
                     if (webSiteStorage1.roleIdeas[j].key === key) {
                         webSiteStorage1.roleIdeas.splice(j,1);
                     }
                 }
                 localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                 tableRow.remove();
                 displayRoles(sortingDropDownMenu.value);
                 displayRatings();
                 setEmptyListContent();
                 showPages();
             });

             rateButton.addEventListener("click",function () {
                 for (let j = 0; j < webSiteStorage1.roleIdeas.length; j++) {
                     if (webSiteStorage1.roleIdeas[j].key === key) {
                         const input = document.getElementById(webSiteStorage1.roleIdeas[j].key + "-rate-field");
                         if (input.value === "" || input.value < 0 || input.value > 10) {
                             input.value = "";
                             return;
                         }
                         webSiteStorage1["roleIdeas"][j]["rating"] = input.value;
                         localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                         displayRatings();
                         input.value = "";
                         break;
                     }
                 }
             });
         }

         if (roleIdeaArray.length === 0) {
             document.getElementById("homebrewroles").innerHTML = "Es gibt noch keine Rollen die deiner Suche entsprechen";
         }
    }

    function setEmptyListContent() {
        let roleIdeaCount = 0;
        let ratingCount = 0;
        for (let i = 0; i < webSiteStorage1["roleIdeas"].length; i++) {
            const role = webSiteStorage1["roleIdeas"][i];
            if (role["name"] !== undefined) {
                roleIdeaCount++;
            }
            if (role["rating"] !== undefined) {
                ratingCount++;
            }
        }
        if (roleIdeaCount === 0) {
            document.getElementById("homebrewroles").innerHTML = "Die Rollenliste ist leer";
        }
        if (ratingCount === 0) {
            document.getElementById("rate-history").innerHTML = "Niemand hat bisher eine Rolle bewertet";
        }
    }

    function displayRatings() {
        let roleIdeaRatingsString = "";
        for (let i = 0; i < webSiteStorage1["roleIdeas"].length; i++) {
            const role = webSiteStorage1["roleIdeas"][i];
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
        for (let i = 0; i < webSiteStorage1["roleIdeas"].length; i++) {
            const role = webSiteStorage1["roleIdeas"][i];
            const input = characterTypSelection.value;
            if (role["characterType"] !== input && input !== "All") {
                continue;
            }
            if (roleSearch.value !== "" &&
                !role["name"].toUpperCase().includes(roleSearch.value.toUpperCase()) &&
                !role["characterType"].toUpperCase().includes(roleSearch.value.toUpperCase()) &&
                !role["abilityText"].toUpperCase().includes(roleSearch.value.toUpperCase())) {
                continue;
            }
            array.push(role);
        }
        return array;
    }

    function sortAlphabetically(a, b, alphabetically) {
        if (a.toUpperCase() < b.toUpperCase()) {
            if (alphabetically) {
                return -1;
            }
            return 1;
        }
        if (a.toUpperCase() > b.toUpperCase()) {
            if (alphabetically) {
                return 1;
            }
            return -1;
        }
        return 0;
    }

    function showPages() {
        const pages = (webSiteStorage1["roleIdeas"].length - 1) / 10;
        document.getElementById("role-idea-page-selection").innerHTML = "";
        for (let i = 0; i < pages; i++) {
            const button = document.createElement("button");
            button.textContent = (i + 1).toString();
            button.classList.remove("blue");
            if (webSiteStorage1["page"] === button.textContent) {
                button.setAttribute("class", "blue");
            }
            button.addEventListener("click",function () {
                webSiteStorage1["page"] = button.textContent;
                localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                document.querySelectorAll(".blue").forEach(element => element.classList.remove("blue"));
                if (webSiteStorage1["page"] === button.textContent) {
                    button.setAttribute("class", "blue");
                }
                displayRoles(sortingDropDownMenu.value);
            });
            document.getElementById("role-idea-page-selection").append(button);
        }
    }
});
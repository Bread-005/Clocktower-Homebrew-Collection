document.addEventListener("DOMContentLoaded",function () {

    const websiteStorageString = "websiteStorage1";

    document.getElementById("js-add-role").addEventListener("click",addRole);

    const webSiteStorage1 = JSON.parse(localStorage.getItem(websiteStorageString));

    const roleSearch = document.getElementById("role-search");
    const characterTypSelection = document.getElementById("character-typ-selection");
    const sortingDropDownMenu = document.getElementById("sorting");
    sortingDropDownMenu.value = "Newest first";

    webSiteStorage1.page = 1;
    localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));

    const currentUser = document.cookie.split(":")[0];

    displayRoles();
    displayRatings();
    setEmptyListContent();

    document.getElementById("username-display-main-page").append(currentUser);

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
            key: Date.now().toString(),
            owner: currentUser,
            image: "",
            howtorun: "",
            comments: [],
            inEditMode: false,
            rating: [],
            favoriteList: [],
            firstNight: 0,
            firstNightReminder: "",
            otherNight: 0,
            otherNightReminder: ""
        }
        webSiteStorage1["roleIdeas"].push(role);
        localStorage.setItem(websiteStorageString, JSON.stringify(webSiteStorage1));
        roleNameInput.value = "";
        abilityTextInput.value = "";
        displayRoles();
    }

    function displayRoles() {
        const input = sortingDropDownMenu.value;
        const array = createTempLocalStorage();
        if (input === "Newest first") {
            array.reverse();
        }
        if (input === "Alphabet A-Z") {
            array.sort((a,b) => sortAlphabetically(a["name"],b["name"],true));
        }
        if (input === "Alphabet Z-A") {
            array.sort((a,b) => sortAlphabetically(a["name"],b["name"],false));
        }
        const roleIdeaArray = array.slice((webSiteStorage1.page - 1) * 10,Number.parseInt(webSiteStorage1.page) * 10);
        document.getElementById("homebrewroles").innerHTML = "";

        const table = document.createElement("table");
        table.setAttribute("class","border-spacing-10");

        const tableBody = document.createElement("tbody");

         for (let i = 0; i < roleIdeaArray.length; i++) {

             const role = roleIdeaArray[i];
             const key = role["key"].toString();

             const columnRoleIdea = document.createElement("td");
             columnRoleIdea.setAttribute("class","column-role-idea");
             const columnButtons = document.createElement("td");
             columnButtons.setAttribute("class","column-delete-and-rate");
             const tableRow = document.createElement("tr");

             const list = document.createElement("li");
             list.setAttribute("id",key);
             list.setAttribute("class","role-idea-list");

             const image = document.createElement("img");
             image.setAttribute("class","clocktower-icon clocktower-icon-role-idea");
             image.setAttribute("src","https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
             if (role["image"]) {
                 image.setAttribute("src",role["image"]);
             }
             list.textContent = role["name"] + " (" + role["characterType"] + "): " + role["abilityText"];

             const input = document.createElement("input");
             input.setAttribute("id",key + "-rate-field");
             input.setAttribute("class","rate-field");
             input.setAttribute("type","number");
             input.setAttribute("name","rating" + key);
             input.setAttribute("min","0");
             input.setAttribute("max","10");

             const rateButton = document.createElement("button");
             rateButton.setAttribute("id",key + "-rate-field");
             rateButton.setAttribute("data-key",key);

             const rateButtonIcon = document.createElement("i");
             rateButtonIcon.setAttribute("class","fa-sharp fa-regular fa-star");
             rateButtonIcon.setAttribute("data-key",key);

             const wikiButton = document.createElement("button");

             const wikiButtonIcon = document.createElement("i");
             wikiButtonIcon.setAttribute("class","fa-solid fa-book");

             const anchor = document.createElement("a");
             anchor.setAttribute("href","wiki.html?r=" + key);

             const favoriteButton = document.createElement("button");
             const favoriteIcon = document.createElement("i");
             favoriteIcon.classList.remove("red");
             favoriteIcon.setAttribute("class","fa-light fa-heart");
             if (role.favoriteList.includes(currentUser)) {
                 favoriteIcon.setAttribute("class","fa-solid fa-heart");
                 favoriteIcon.classList.add("red");
             }

             rateButton.append(rateButtonIcon);
             wikiButton.append(wikiButtonIcon);
             favoriteButton.append(favoriteIcon);
             anchor.append(wikiButton);
             list.prepend(image);
             columnRoleIdea.append(list);
             columnButtons.append(input);
             columnButtons.append(rateButton);
             columnButtons.append(anchor);
             columnButtons.append(favoriteButton);
             tableRow.append(columnRoleIdea);
             tableRow.append(columnButtons);
             tableBody.append(tableRow);
             table.append(tableBody);
             document.getElementById("homebrewroles").append(table);

             if (roleIdeaArray.length === 0) {
                 document.getElementById("homebrewroles").innerHTML = "There is no role, that matches your search";
             }

             rateButton.addEventListener("click",function () {
                 for (let j = 0; j < webSiteStorage1.roleIdeas.length; j++) {
                     if (webSiteStorage1.roleIdeas[j].key === key) {
                         const input = document.getElementById(webSiteStorage1.roleIdeas[j].key + "-rate-field");
                         if (input.value === "" || input.value < 0 || input.value > 10) {
                             input.value = "";
                             return;
                         }
                         const rating = {
                             rating: input.value,
                             owner: currentUser
                         }
                         input.value = "";
                         for (let k = 0; k < role.rating.length; k++) {
                             if (role.rating[k].owner === currentUser) {
                                 webSiteStorage1.roleIdeas[j].rating[k] = rating;
                                 localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                                 displayRatings();
                                 return;
                             }
                         }
                         webSiteStorage1.roleIdeas[j]["rating"].push(rating);
                         localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                         displayRatings();
                         break;
                     }
                 }
             });

             favoriteButton.addEventListener("click",function () {
                 if (role.favoriteList.includes(currentUser)) {
                     for (let j = 0; j < role.favoriteList.length; j++) {
                         if (role.favoriteList[j] === currentUser) {
                             role.favoriteList.splice(j,1);
                             favoriteIcon.setAttribute("class","fa-light fa-heart");
                             favoriteIcon.classList.remove("red");
                             localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                             return;
                         }
                     }
                 }
                 if (!role.favoriteList.includes(currentUser)) {
                     role.favoriteList.push(currentUser);
                     favoriteIcon.setAttribute("class","fa-solid fa-heart");
                     favoriteIcon.classList.add("red");
                 }
                 localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
             });
         }
        showPages(array);
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
            document.getElementById("homebrewroles").innerHTML = "The Rolelist is empty";
        }
        if (ratingCount === 0) {
            document.getElementById("rate-history").innerHTML = "You have not rated any role";
        }
    }

    function displayRatings() {
        let roleIdeaRatingsString = "";
        for (let i = 0; i < webSiteStorage1["roleIdeas"].length; i++) {
            const role = webSiteStorage1["roleIdeas"][i];
            if (role["rating"] === undefined) {
                continue;
            }
            for (let j = 0; j < role["rating"].length; j++) {
                if (role["rating"][j]["rating"] === undefined) {
                    continue;
                }
                if (role.rating[j].owner !== currentUser) {
                    continue;
                }
                roleIdeaRatingsString = roleIdeaRatingsString.concat("<li>" + " You rated " + role["name"] + " with " + role["rating"][j]["rating"] + "</li>");
            }
        }
        document.getElementById("rate-history").innerHTML = roleIdeaRatingsString;
    }

    sortingDropDownMenu.addEventListener("change",displayRoles);
    characterTypSelection.addEventListener("change",displayRoles);
    roleSearch.addEventListener("input",displayRoles);
    document.getElementById("only-my-ideas").addEventListener("change",displayRoles);
    document.getElementById("only-my-favorites").addEventListener("change",displayRoles);
    document.getElementById("author-search").addEventListener("input",displayRoles);

    function createTempLocalStorage() {
        const array = [];
        for (let i = 0; i < webSiteStorage1["roleIdeas"].length; i++) {
            const role = webSiteStorage1["roleIdeas"][i];
            const input = characterTypSelection.value;
            if (role["characterType"] !== input && input !== "All") {
                continue;
            }
            if (document.getElementById("only-my-ideas").checked) {
                if (webSiteStorage1.roleIdeas[i].owner !== currentUser) {
                    continue;
                }
            }
            if (document.getElementById("only-my-favorites").checked) {
                if (!webSiteStorage1.roleIdeas[i].favoriteList.includes(currentUser)) {
                    continue;
                }
            }
            if (roleSearch.value !== "" &&
                !role["name"].toUpperCase().includes(roleSearch.value.toUpperCase()) &&
                !role["characterType"].toUpperCase().includes(roleSearch.value.toUpperCase()) &&
                !role["abilityText"].toUpperCase().includes(roleSearch.value.toUpperCase())) {
                continue;
            }
            if (document.getElementById("author-search").value !== "") {
                if (!role.owner.toUpperCase().includes(document.getElementById("author-search").value.toUpperCase())) {
                    continue;
                }
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

    function showPages(array) {
        const pages = array.length / 10;
        let pageWasChanged = false;
        if (webSiteStorage1.page > 1) {
            if (pages + 1 < webSiteStorage1.page || array.length < 11) {
                webSiteStorage1.page = 1;
                localStorage.setItem(websiteStorageString, JSON.stringify(webSiteStorage1));
                pageWasChanged = true;
            }
        }
        document.getElementById("role-idea-page-selection").innerHTML = "";
        for (let i = 0; i < pages; i++) {
            const button = document.createElement("button");
            button.textContent = (i + 1).toString();
            button.classList.remove("blue");
            if (webSiteStorage1.page === Number.parseInt(button.textContent)) {
                button.setAttribute("class", "blue");
            }
            button.addEventListener("click",function () {
                webSiteStorage1.page = Number.parseInt(button.textContent);
                localStorage.setItem(websiteStorageString,JSON.stringify(webSiteStorage1));
                document.querySelectorAll(".blue").forEach(element => element.classList.remove("blue"));
                if (webSiteStorage1.page === Number.parseInt(button.textContent)) {
                    button.setAttribute("class", "blue");
                }
                displayRoles();
            });
            document.getElementById("role-idea-page-selection").append(button);
        }
        if (pageWasChanged) {
            displayRoles();
        }
    }

    document.getElementById("logout").addEventListener("click",function (event) {
        event.preventDefault();
        document.cookie = "abdgetevqhjhbjarjaor10298ujka8954rfvjutreewqadhklknvxdrz";
        window.location = "login.html";
    })
});
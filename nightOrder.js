import {allRoles, firstNightList, otherNightList} from "./functions.js";

document.addEventListener('DOMContentLoaded', function () {

    const storageString = "websiteStorage1";
    const websiteStorage = JSON.parse(localStorage.getItem(storageString));

    const firstNightOrderDisplayDiv = document.querySelector(".first-night-order-display-div");
    const otherNightOrderDisplayDiv = document.querySelector(".other-night-order-display-div");

    const firstNightOrderList = [];
    const otherNightOrderList = [];

    fillList(firstNightList, firstNightOrderList, 6);
    fillList(otherNightList, otherNightOrderList, 7);

    for (const role of getRoleIdeas()) {
        if (role.firstNight) {
            firstNightOrderList.push({
                name: role.name,
                number: role.firstNight,
                isOfficial: false,
                image: role.image,
                ability: role.ability
            });
        }
        if (role.otherNight) {
            otherNightOrderList.push({
                name: role.name,
                number: role.otherNight,
                isOfficial: false,
                image: role.image,
                ability: role.ability
            });
        }
    }

    firstNightOrderList.sort((a, b) => a.number - b.number);
    otherNightOrderList.sort((a, b) => a.number - b.number);

    const firstDiv = createDivs(firstNightOrderList);
    const otherDiv = createDivs(otherNightOrderList);

    firstNightOrderDisplayDiv.append(firstDiv);
    otherNightOrderDisplayDiv.append(otherDiv);

    function fillList(List, List2, number) {
        for (const wakingRole of List) {
            const role = {
                name: wakingRole,
                number: number,
                isOfficial: true
            }
            number++;
            List2.push(role);
        }
    }

    function createDivs(List) {
        const container = document.createElement("div");
        for (const role of List) {
            const div = document.createElement("div");
            div.setAttribute("class", "night-order-img-text-edit-div");
            const img = document.createElement("img");

            if (role.image === "") {
                img.setAttribute("src", "https://i.postimg.cc/qM09f8cD/placeholder-icon.png");
            } else if (role.name === "Minion info") {
                img.setAttribute("src", "https://clocktower.live/img/minion.43365de6.webp");
            } else if (role.name === "Demon info") {
                img.setAttribute("src", "https://clocktower.live/img/demon.4669d783.webp");
            } else {
                if (role.isOfficial) {
                    img.setAttribute("src", "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + role.name.toLowerCase().replaceAll(" ", "") + ".png");
                }
                if (!role.isOfficial) {
                    img.setAttribute("src", role.image);
                }
            }
            img.setAttribute("width", "50px");
            img.setAttribute("height", "50px");

            const button = document.createElement("button");
            const icon = document.createElement("i");
            icon.setAttribute("class", "fa-solid fa-pen fa-pen-to-square");
            button.append(icon);

            let roleNameAndNumber = document.createElement("div");
            roleNameAndNumber.textContent = role.name + ": " + role.number;
            roleNameAndNumber.style.marginRight = "0.25rem";

            div.append(img);
            div.append(roleNameAndNumber);
            if (allRoles.map(role1 => role1.name).includes(role.name) || role.name === "Minion info" || role.name === "Demon info") {
                div.setAttribute("class", "night-order-img-text-div");
            } else {
                div.append(button);

                const abilityText = document.createElement("div");
                abilityText.setAttribute("class", "hover-text");
                abilityText.textContent = role.ability;
                div.prepend(abilityText);

                img.addEventListener("mouseover", function () {
                    abilityText.style.visibility = "visible";
                });
                img.addEventListener("mouseout", function () {
                    abilityText.style.visibility = "hidden";
                });
            }
            div.style.background = "lightskyblue";
            container.append(div);

            if (!allRoles.map(role1 => role1.name).includes(role.name)) {

                const editNightOrder = document.createElement("div");
                const input = document.createElement("input");
                input.type = "number";
                input.style.height = "1.5rem";
                input.value = role.number;
                input.setAttribute("id", role.name + "night-order-edit-input");
                const label = document.createElement("label");
                label.textContent = role.name + ": ";
                label.setAttribute("for", role.name + "night-order-edit-input");
                editNightOrder.append(label);
                editNightOrder.append(input);
                input.style.width = "35px";

                input.addEventListener("keydown", function (event) {
                    if (event.key.toLowerCase() === "e") {
                        event.preventDefault();
                    }
                });

                button.addEventListener("click", function () {

                    if (input.value === "") {
                        return;
                    }

                    if (icon.className.includes("fa-pen")) {
                        roleNameAndNumber.replaceWith(editNightOrder);
                        icon.setAttribute("class", "fa-solid fa-floppy-disk");
                    } else {
                        editNightOrder.replaceWith(roleNameAndNumber);
                        icon.setAttribute("class", "fa-solid fa-pen fa-pen-to-square");

                        for (const role1 of getRoleIdeas()) {
                            if (role.name === role1.name && role.ability === role1.ability) {
                                if (firstNightOrderDisplayDiv.contains(div)) {
                                    if (role1.firstNight !== Number.parseFloat(input.value)) {
                                        role1.lastEdited = Date.now().toString();
                                    }
                                    role1.firstNight = Number.parseFloat(input.value);
                                    roleNameAndNumber.textContent = role1.name + ": " + role1.firstNight;
                                } else {
                                    if (role1.otherNight !== Number.parseFloat(input.value)) {
                                        role1.lastEdited = Date.now().toString();
                                    }
                                    role1.otherNight = Number.parseFloat(input.value);
                                    roleNameAndNumber.textContent = role1.name + ": " + role1.otherNight;
                                }
                                saveLocalStorage();
                            }
                        }
                    }
                });
            }
        }
        return container;
    }

    function saveLocalStorage() {
        localStorage.setItem(storageString, JSON.stringify(websiteStorage));
    }

    function getRoleIdeas() {
        if (websiteStorage.user.databaseUse === "localStorage") return websiteStorage.localRoleIdeas;
        if (websiteStorage.user.databaseUse === "mongoDB") return websiteStorage.roleIdeas;
    }
});
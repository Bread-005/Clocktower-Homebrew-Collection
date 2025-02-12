import {firstNightList, otherNightList} from "./functions.js";

document.addEventListener('DOMContentLoaded', function () {

    const storageString = "websiteStorage1";
    const websiteStorage = JSON.parse(localStorage.getItem(storageString));

    const firstNightOrderList = [];
    const otherNightOrderList = [];

    fillList(firstNightList, firstNightOrderList, 6);
    fillList(otherNightList, otherNightOrderList, 7);

    for (const role of websiteStorage.roleIdeas) {
        if (role.firstNight) {
            firstNightOrderList.push({name: role.name, number: role.firstNight, isOfficial: false, image: role.image});
        }
        if (role.otherNight) {
            otherNightOrderList.push({name: role.name, number: role.otherNight, isOfficial: false, image: role.image});
        }
    }

    firstNightOrderList.sort((a, b) => a.number - b.number);
    otherNightOrderList.sort((a, b) => a.number - b.number);

    const firstDiv = createDivs(firstNightOrderList);
    const otherDiv = createDivs(otherNightOrderList);

    document.querySelector(".first-night-order-display-div").append(firstDiv);
    document.querySelector(".other-night-order-display-div").append(otherDiv);

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
            div.setAttribute("class", "night-order-img-text-div");
            const img = document.createElement("img");

            if (role.name === "Minion info") {
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
            div.append(img);
            div.append(role.name + ": " + role.number);
            div.style.background = "lightskyblue";
            container.append(div);
        }
        return container;
    }
});
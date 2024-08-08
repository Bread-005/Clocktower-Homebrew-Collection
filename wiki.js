document.addEventListener("DOMContentLoaded",function () {
    const searchParameters = new URLSearchParams(window.location.search);
    const key = searchParameters.get("r");
    const role = JSON.parse(localStorage.getItem(key));

    if (role["comments"] === undefined) {
        role["comments"] = [];
    }
    if (role["image"] === undefined) {
        role["image"] = "";
    }
    if (role["howtorun"] === undefined) {
        role["howtorun"] = "";
    }

    const uploadButton = document.getElementById("upload-button");

    if (role["image"] !== "") {
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    }

    document.getElementById("role-name").textContent = role["name"];
    document.getElementById("character-type").textContent = "Charaktertyp: " + role["characterType"];
    document.getElementById("ability-text").textContent = "Fähigkeit: " + role["name"];

    const roleRating = document.getElementById("role-rating");
    roleRating.textContent = "Bewertung: " + role["rating"];
    if (role["rating"] === undefined) {
        roleRating.textContent = "Niemand hat diese Rolle bisher bewertet";
    }

    let yellowStarCount = Math.round(Number.parseInt(role["rating"]));
    let grayStarCount = 10 - yellowStarCount;
    for (let i = 0; i < yellowStarCount; i++) {
        const yellowStarIcon = document.createElement("i");
        yellowStarIcon.setAttribute("class", "fa-solid fa-star");
        yellowStarIcon.setAttribute("style","color: #FFD43B");
        roleRating.append(yellowStarIcon);
    }
    for (let i = 0; i < grayStarCount; i++) {
        const grayStarIcon = document.createElement("i");
        grayStarIcon.setAttribute("class", "fa-regular fa-star");
        roleRating.append(grayStarIcon);
    }
    const halfStarIcon = document.createElement("i");

    const howToRunInput = document.getElementById("howtorun-input");
    howToRunInput.value = role["howtorun"] ?? '';

    const howToRunChangeButton = document.getElementById("howtorun-button");
    howToRunChangeButton.textContent = "Change Text";

    const editButton = document.getElementById("edit-button-how-to-run");

    document.getElementById("howtorun-text").innerHTML = role["howtorun"];

    const comments = document.createElement("div");
    comments.setAttribute("class", "center margin-top-30");

    const commentForm = document.createElement("form");

    const inputComment = document.createElement("input");
    inputComment.setAttribute("type", "text");
    inputComment.setAttribute("placeholder", "Kommentar schreiben");

    const commentButton = document.createElement("button");
    commentButton.setAttribute("class", "howtorun-button");
    commentButton.textContent = "Kommentar hinzufügen";

    const ul = document.createElement("ul");
    ul.setAttribute("id", "comments-list");

    if (!role["howtorun"]) {
        editButton.style.display = "none";
    }
    if (role["howtorun"]) {
        howToRunInput.style.display = "none";
        howToRunChangeButton.style.display = "none";
    }
    commentForm.append(inputComment);
    commentForm.append(commentButton);
    comments.append(commentForm);
    comments.append(ul);
    document.body.append(comments);

    displayComments();

    const howToRunText = document.getElementById("howtorun-text");

    editButton.addEventListener("click", function (event) {
        event.preventDefault();
        editButton.style.display = "none";
        howToRunInput.style.display = "block";
        howToRunChangeButton.style.display = "block";
    });

    howToRunChangeButton.addEventListener("click", function (event) {
        event.preventDefault();
        const input = document.getElementById("howtorun-input");
        howToRunText.textContent = input.value;
        role["howtorun"] = howToRunText.textContent;
        localStorage.setItem(key, JSON.stringify(role));
        editButton.style.display = "block";
        howToRunInput.style.display = "none";
        howToRunChangeButton.style.display = "none";
    });

    uploadButton.addEventListener("click", function (event) {
        event.preventDefault();
        const uploadImage = document.getElementById("image-input-file");
        const uploadImageURL = document.getElementById("image-input-url");
        let imageString = "";
        if (uploadImageURL.value !== "") {
            imageString = uploadImageURL.value;
            uploadImageURL.value = "";
        }
        if (uploadImage.value !== "") {
            imageString = uploadImage.value.replace("C:\\fakepath\\", "");
            uploadImage.value = "";
        }
        if (imageString === "") {
            return;
        }
        console.log(imageString);
        role["image"] = imageString;
        localStorage.setItem(key, JSON.stringify(role));
        document.getElementById("wiki-role-image").setAttribute("src", role["image"]);
    });

    commentButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (inputComment.value === "") {
            return;
        }
        if (inputComment.value.includes("beleidigung")) {
            inputComment.value = "";
            return;
        }
        const commentKey = Date.now().toString();

        const comment = {
            message: inputComment.value,
            key: commentKey
        }
        role["comments"].push(comment);
        localStorage.setItem(key, JSON.stringify(role));
        inputComment.value = "";
        displayComments();
    });

    function displayComments() {
        ul.innerHTML = "";
        for (let i = 0; i < role["comments"].length; i++) {
            const list = document.createElement("li");
            list.textContent = role["comments"][i]["message"];
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "icon-button");
            deleteButton.setAttribute("data-key", role["comments"][i]["key"]);

            const deleteButtonIcon = document.createElement("i");
            deleteButtonIcon.setAttribute("class", "js-delete-button fa-solid fa-trash");
            deleteButtonIcon.setAttribute("data-key", role["comments"][i]["key"]);

            deleteButton.append(deleteButtonIcon);
            list.append(deleteButton);
            ul.append(list);

            deleteButton.addEventListener("click", function () {
                role["comments"].splice(i, 1);
                localStorage.setItem(key, JSON.stringify(role));
                displayComments();
            });
        }
    }
})
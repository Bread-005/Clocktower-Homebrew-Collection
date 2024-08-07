document.addEventListener("DOMContentLoaded",function () {
    const searchParameters = new URLSearchParams(window.location.search);
    const key = searchParameters.get("r");
    const role = JSON.parse(localStorage.getItem(key));

    console.log(role);

    if (role["comments"] === undefined) {
        role["comments"] = [];
    }

    const roleTextDiv = document.createElement("div");
    roleTextDiv.setAttribute("class","role-text");
    roleTextDiv.textContent = role["name"] + " (" + role["characterType"] + "): " + role["abilityText"];

    const roleRatingDiv = document.createElement("div");
    roleRatingDiv.setAttribute("class","role-rating");
    let roleRatingText = "Bewertung: " + role["rating"] + "/10";
    if (role["rating"] === undefined) {
        roleRatingText = "Niemand hat diese Rolle bisher bewertet";
    }
    roleRatingDiv.textContent = roleRatingText;

    document.body.append(roleTextDiv);
    document.body.append(roleRatingDiv);

    const howToRunDiv = document.createElement("div");
    howToRunDiv.setAttribute("class","howtorun-div");

    const howToRunInput = document.createElement("textarea");
    howToRunInput.setAttribute("class","howtorun-input");
    howToRunInput.setAttribute("id","howtorun-input");
    howToRunInput.setAttribute("cols","60");
    howToRunInput.setAttribute("rows","5");
    howToRunInput.setAttribute("placeholder","How To Run Text");
    howToRunInput.value = role["howtorun"] ?? '';

    const howToRunChangeButton = document.createElement("button");
    howToRunChangeButton.setAttribute("class","howtorun-button");
    howToRunChangeButton.setAttribute("type","submit");
    howToRunChangeButton.textContent = "Change Text";

    const editButton = document.createElement("button");
    editButton.setAttribute("class","edit-button icon-button");

    const editButtonIcon = document.createElement("i");
    editButtonIcon.setAttribute("class","fa-solid fa-pen fa-pen-to-square");

    const howToRunForm = document.createElement("form");
    howToRunForm.setAttribute("class","howtorun-form");

    const howToRunHeadline = document.createElement("h2");
    howToRunHeadline.setAttribute("class","howtorum-headline");
    howToRunHeadline.textContent = "How To Run";

    const howToRunText = document.createElement("p");
    howToRunText.innerText = role["howtorun"];

    const comments = document.createElement("div");
    comments.setAttribute("class","comment");

    const commentForm = document.createElement("form");

    const inputComment = document.createElement("input");
    inputComment.setAttribute("type","text");
    inputComment.setAttribute("placeholder","Kommentar schreiben");

    const commentButton = document.createElement("button");
    commentButton.setAttribute("class","howtorun-button");
    commentButton.textContent = "Kommentar hinzufügen";

    const ul = document.createElement("ul");
    ul.setAttribute("id","comments-list");

    editButton.append(editButtonIcon);
    howToRunForm.append(editButton);
    howToRunForm.append(howToRunInput);
    howToRunForm.append(howToRunChangeButton);
    if (!role["howtorun"]) {
        editButton.style.display = "none";
    }
    if (role["howtorun"]) {
        howToRunInput.style.display = "none";
        howToRunChangeButton.style.display = "none";
    }
    howToRunDiv.append(howToRunHeadline);
    howToRunDiv.append(howToRunText);
    howToRunDiv.append(howToRunForm);
    commentForm.append(inputComment);
    commentForm.append(commentButton);
    comments.append(commentForm);
    comments.append(ul);
    document.body.append(howToRunDiv);
    document.body.append(comments);

    howToRunText.textContent = role["howtorun"]??"";

    displayComments();

    editButton.addEventListener("click",function () {
        howToRunInput.textContent = howToRunText.textContent;
        editButton.style.display = "none";
        howToRunInput.style.display = "block";
        howToRunChangeButton.style.display = "block";
    });

    howToRunChangeButton.addEventListener("click",function (event) {
        event.preventDefault();
        const input = document.getElementById("howtorun-input");
        howToRunText.textContent = input.value;
        role["howtorun"] = howToRunText.textContent;
        localStorage.setItem(key,JSON.stringify(role));
        editButton.style.display = "block";
        howToRunInput.style.display = "none";
        howToRunChangeButton.style.display = "none";
    });

    commentButton.addEventListener("click",function (event) {
        event.preventDefault();
        if (inputComment.value === "") {
            return;
        }
        role["comments"].push(inputComment.value);
        localStorage.setItem(key,JSON.stringify(role));
        inputComment.value = "";
        displayComments();
    });

    function displayComments() {
        let commentString = "";
        for (const comment of role["comments"]) {
            commentString = commentString.concat("<li>" + comment + "</li>");
        }
        ul.innerHTML = commentString;
    }
})
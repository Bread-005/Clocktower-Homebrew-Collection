document.addEventListener("DOMContentLoaded",function () {

    const websiteStorageString = "websiteStorage1";
    const signUpUserNameInput = document.getElementById("sign-up-username-input");
    const signUpPasswordInput = document.getElementById("sign-up-password-input");
    const signUpConfirmPasswordInput = document.getElementById("sign-up-confirm-password-input")
    const signUpButton = document.getElementById("sign-up-button");
    const signUpMessage = document.getElementById("sign-up-message");
    const userNameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const loginMessage = document.getElementById("login-message");

    if (localStorage.getItem(websiteStorageString) === null) {
        const storage = {
            roleIdeas: [],
            page: 1,
            users: [],
            archive: []
        }
        localStorage.setItem(websiteStorageString,JSON.stringify(storage));
    }

    const websiteStorage = JSON.parse(localStorage.getItem(websiteStorageString));

    if (websiteStorage.archive === undefined) {
        websiteStorage.archive = [];
        localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
    }

    if (document.cookie === "") {
        document.cookie = "iajrhugairopiarjoairjk138174590015mf,sloivohgwr18514";
    }

    userNameInput.value = "";
    passwordInput.value = "";

    for (const user of websiteStorage.users) {
        if (user.name === document.cookie.split(":")[0] && user.password === document.cookie.split(":")[1]) {
            window.location = "role_idea.html";
        }
    }

    loginButton.addEventListener("click",function (event) {
        event.preventDefault();
        if (userNameInput.value === "") {
            loginMessage.textContent = "You have to provide a username";
            return;
        }
        let userNameExists = false;
        for (const user of websiteStorage.users) {
            if (user.name === userNameInput.value) {
                userNameExists = true;
            }
        }
        if (!userNameExists) {
            loginMessage.textContent = "This username does not exist. Please create a new account in the Sign Up section";
            return;
        }
        if (passwordInput.value === "") {
            loginMessage.textContent = "You have to provide a password";
            return;
        }
        loginMessage.textContent = "";
        for (let i = 0; i < websiteStorage["users"].length; i++) {
            if (userNameInput.value === websiteStorage.users[i].name) {
                if (passwordInput.value !== websiteStorage.users[i].password) {
                    document.getElementById("message").innerHTML = "You provided the wrong password";
                    passwordInput.value = "";
                    return;
                }
                document.cookie = userNameInput.value + ":" + passwordInput.value;
                window.location = "role_idea.html";
                return;
            }
        }
    });

    signUpButton.addEventListener("click",function (event) {
        event.preventDefault();
        if (signUpUserNameInput.value === "") {
            signUpMessage.textContent = "You have to provide a username";
            return;
        }
        for (const user of websiteStorage.users) {
            if (user.name === signUpUserNameInput.value) {
                signUpMessage.textContent = "This username is already taken";
                return;
            }
        }
        if (signUpPasswordInput.value === "") {
            signUpMessage.textContent = "You have to provide a password";
            return;
        }
        if (signUpConfirmPasswordInput.value === "") {
            signUpMessage.textContent = "You have to confirm your password";
            return;
        }
        if (signUpPasswordInput.value !== signUpConfirmPasswordInput.value) {
            signUpMessage.textContent = "The password does not match the confirmation";
            return;
        }
        const user = {
            name: signUpUserNameInput.value,
            password: signUpPasswordInput.value,
        }
        websiteStorage.users.push(user);
        localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
        signUpUserNameInput.value = "";
        signUpPasswordInput.value = "";
        signUpConfirmPasswordInput.value = "";
        signUpMessage.textContent = "You have created a new account. Login in the login section to login into your account";
    });

    function getDataFile(string) {
        const data = fetch("./data.json").then((response) => response.json()).then((json) => console.log(json));
        fetch("./data.json").then((response) => response.json()).then((json) => {
            json.id = "ok";
            console.log(json);
        });
    }
});
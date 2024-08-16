document.addEventListener("DOMContentLoaded",function () {

    const websiteStorageString = "websiteStorage1";
    const userNameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const websiteStorage = JSON.parse(localStorage.getItem(websiteStorageString));

    if (localStorage.getItem(websiteStorageString) === null) {
        const storage = {
            roleIdeas: [],
            page: 1,
            users: []
        }
        localStorage.setItem(websiteStorageString,JSON.stringify(storage));
    }

    if (document.cookie === "") {
        document.cookie = "iajrhugairopiarjoairjk138174590015mf,sloivohgwr18514";
    }

    userNameInput.value = "";
    passwordInput.value = "";

    for (let i = 0; i < websiteStorage["users"].length; i++) {
        if (websiteStorage.users[i].name === document.cookie.split(":")[0] && websiteStorage.users[i].password === document.cookie.split(":")[1]) {
            window.location = "role_idea.html";
        }
    }

    loginButton.addEventListener("click",function () {
        if (userNameInput.value === "") {
            document.getElementById("message").innerHTML = "You have to provide a username";
            return;
        }
        if (passwordInput.value === "") {
            document.getElementById("message").innerHTML = "You have to provide a password";
            return;
        }
        document.getElementById("message").innerHTML = "";
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
        const user = {
            name: userNameInput.value,
            password: passwordInput.value,
            favoriteRoles: []
        }
        websiteStorage.users.push(user);
        localStorage.setItem(websiteStorageString,JSON.stringify(websiteStorage));
        document.getElementById("message").innerHTML = "You created a new account. Enter your password again to proceed";
        passwordInput.value = "";
    });
});
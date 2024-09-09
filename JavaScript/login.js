import {sendXMLHttpRequest} from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {

    const signUpEmailInput = document.getElementById("sign-up-email-input");
    const signUpUserNameInput = document.getElementById("sign-up-username-input");
    const signUpPasswordInput = document.getElementById("sign-up-password-input");
    const signUpConfirmPasswordInput = document.getElementById("sign-up-confirm-password-input");
    const signUpButton = document.getElementById("sign-up-button");
    const signUpMessage = document.getElementById("sign-up-message");
    const userNameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const loginMessage = document.getElementById("login-message");

    if (document.cookie === "") {
        document.cookie = "iajrhugairopiarjoairjk138174590015mf7sloivohgwr18514";
    }

    userNameInput.value = "";
    passwordInput.value = "";

    if (document.cookie.includes(":")) {
        const cookie = {
            name: document.cookie.split(":")[0],
            password: document.cookie.split(":")[1]
        }

        sendXMLHttpRequest("POST", "/api/user/cookie.php", "", JSON.stringify(cookie), function () {
            window.location = "../role_idea.php";
        });
    }

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (userNameInput.value === "") {
            loginMessage.textContent = "You have to provide a username";
            return;
        }
        if (passwordInput.value === "") {
            loginMessage.textContent = "You have to provide a password";
            return;
        }
        const user = {
            name: userNameInput.value,
            password: passwordInput.value,
        }
        sendXMLHttpRequest("POST", "/api/user/login.php", "", JSON.stringify(user), function () {
            loginMessage.textContent = "";
            document.cookie = user.name + ":" + user.password;
            window.location = "role_idea.php";
        }, function () {
            loginMessage.textContent = "You provided the wrong password";
            passwordInput.value = "";
        });
    });

    signUpButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (signUpEmailInput.value === "") {
            signUpMessage.textContent = "You have to provide an email";
            return;
        }
        if (signUpUserNameInput.value === "") {
            signUpMessage.textContent = "You have to provide a username";
            return;
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
            email: signUpEmailInput.value,
            blocked: 0,
            createdAt: Date()
        }

        sendXMLHttpRequest("POST", "/api/user/create.php", "", JSON.stringify(user), function () {
            signUpMessage.textContent = "You have created a new account. Login in the login section to login into your account";
        }, function () {
            signUpMessage.textContent = "The username or email is already taken";
        });
        signUpEmailInput.value = "";
        signUpUserNameInput.value = "";
        signUpPasswordInput.value = "";
        signUpConfirmPasswordInput.value = "";
    });
});
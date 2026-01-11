document.addEventListener("DOMContentLoaded", async function () {

    try {
        await fetch('https://clocktower-homebrew-collection-13pz.onrender.com/api/users');
    } catch (error) {
        window.location = "index.html";
        return;
    }

    const websiteStorage = JSON.parse(localStorage.getItem("websiteStorage1"));
    const userNameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const confirmPasswordRow = document.getElementById("confirm-password-row");
    const confirmPasswordInput = document.getElementById("confirm-password-input");
    const loginButton = document.getElementById("login-page-login-button");
    const loginMessage = document.getElementById("login-message");
    const userNames = [];
    let users = await fetch('https://clocktower-homebrew-collection-13pz.onrender.com/api/users').then(res => res.json());
    for (const user of users) {
        userNames.push(user.name);
    }

    if (websiteStorage.user.tempMessage) {
        loginMessage.textContent = websiteStorage.user.tempMessage;
    }

    userNameInput.addEventListener("input", () => {
        if (userNames.includes(userNameInput.value)) {
            loginMessage.textContent = "Username exists (might be yours)";
            loginButton.textContent = "Login";
            confirmPasswordRow.style.visibility = "hidden";
        } else {
            loginMessage.textContent = "";
            loginButton.textContent = "Sign Up";
            confirmPasswordRow.style.visibility = "visible";
        }
    });

    loginButton.addEventListener("click", async () => {
        if (!userNameInput.value) return;
        if (!userNames.includes(userNameInput.value)) {

            if (passwordInput.value !== confirmPasswordInput.value) {
                loginMessage.textContent = "Passwords do not match";
                return;
            }

            const user = {
                name: userNameInput.value,
                password: document.getElementById("password-input").value,
                createdAt: Date.now().toString()
            }

            await fetch('https://clocktower-homebrew-collection-13pz.onrender.com/api/users/create', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });
            loginMessage.textContent = "Enter your name and password again to login";
            saveLocalStorage();
            userNames.push(user.name);
            users.push(user);
            userNameInput.value = "";
            passwordInput.value = "";
            confirmPasswordInput.value = "";
        } else if (userNames.includes(userNameInput.value)) {
            const user = users.find(user => user.name === userNameInput.value);
            if (user.password !== passwordInput.value) {
                loginMessage.textContent = "Incorrect password";
                return;
            }
            websiteStorage.user.currentUsername = user.name;
            saveLocalStorage();
            window.location = "index.html";
        }
    })

    document.getElementById("login-page-go-back-button").addEventListener("click", () => {
        window.location = "index.html";
    });

    function saveLocalStorage() {
        localStorage.setItem("websiteStorage1", JSON.stringify(websiteStorage));
    }
});
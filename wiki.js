document.addEventListener("DOMContentLoaded",function () {
    const searchParameters = new URLSearchParams(window.location.search);
    const key = searchParameters.get("r");
    console.log(key);


})
$(document).ready(init);

var websiteURL = "wyattwilliams.dev/link/";

function init() {
    $("#submit-btn").click(handleSubmit);
    $("#copy-btn").click(handleCopy);
}

function handleSubmit() {
    hideResponses();

    let userInput = $("#user-input").val();
    if (validInput(userInput)) {
        getUrlCode(userInput);
    }
    else {
        invalidUrlToggle();
    }
}

function hideResponses() {
    $("#invalid-response").hide();
    $("#output-link").hide();
    $("#copy-response").hide();
    
    // $("#copy-btn").attr("disabled", true);
    $("#copy-btn").hide();
}

function validInput(userInput) {
    if (userInput === "")
        return false;
    if (!regexCompare(userInput)) {
        return false;
    }
    return true;
}

function regexCompare(string) {
    // Regex found on StackOverflow
    regex = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");
    return regex.test(string);
}

function getUrlCode(userInput) {
    var data = { url: userInput };
    $.post("./post", data, updateShortUrl)
}

function updateShortUrl(code) {
    if (code === undefined) {
        websiteURL = '';
        code = 'There was a problem connecting to the database. Please try again later.';
    }
    let outUrl = $("#output-link");
    outUrl.html(websiteURL + code);
    outUrl.attr("href", code)

    $("#copy-field").html(websiteURL + code);
    
    $("#output-link").show();
    // $("#copy-btn").attr("disabled", false);
    $("#copy-btn").show();
}

function handleCopy() {
    $("#copy-field").show();
    $("#copy-field").select();
    document.execCommand("copy");
    $("#copy-field").hide();
    $("#copy-response").show();
}

function invalidUrlToggle() {
    let invalidResponse = $("#invalid-response");
    invalidResponse.show();
}
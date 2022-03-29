var authBtn = document.querySelector("#auth-btn");
var clientKeyBtn = document.querySelector("#client-key-btn");
var postBtn = document.querySelector("#post-btn");
var getGenreBtn = document.querySelector("#get-genre"); 

var clientID = "f22c868cd9cf4b1ba13b92a0ceff4632";
var clientSecret = "d53376ed600341df98c7c3b0c037dc9d";
var clientKey = "";
var sessionToken = "";
var refreshToken = "";

var spotifyAccountURL = "https://accounts.spotify.com/authorize?";
var spotifyTokenURL = "https://accounts.spotify.com/api/token";
var redirectURL = "http://127.0.0.1:5500/index.html";


var redirectToSpotify = function () {
    window.location.href = spotifyAccountURL + "client_id=" + clientID + "&response_type=code&" + "redirect_uri=" + redirectURL;
}

var getClientKey = function () {
    if (window.location.search.length > 0) {
        clientKey = window.location.search.split("=")[1];
        console.log(clientKey);
    }
}

var getPostData = function () {

    var postBody = "grant_type=authorization_code";
    postBody += "&code=" + clientKey;
    postBody += "&redirect_uri=" + redirectURL;

    fetch(spotifyTokenURL, {
        headers: {
            'Authorization': 'Basic ' + btoa(clientID + ":" +clientSecret),
            'Content-Type': "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: postBody
    }).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            sessionToken = data.access_token;
            refreshToken = data.refresh_token;
        })
    }).catch(function(error) {
        console.log(error);
    })
}

var getGenre = function() {
    
}

authBtn.addEventListener("click", redirectToSpotify);
clientKeyBtn.addEventListener("click", getClientKey);
postBtn.addEventListener("click", getPostData);
getGenreBtn.addEventListener("click", getGenre);
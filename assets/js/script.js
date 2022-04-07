// saving the elements for later for us to manipulate 
var authBtn = document.querySelector("#auth-btn");
var getArtistBtn = document.querySelector("#get-artist");
var drinkPicEl = document.querySelector("#drink-pic");
var drinkNameEl = document.querySelector("#drink-name");
var authModalEl = document.querySelector(".modal");

// these are our project keys
var clientID = "f22c868cd9cf4b1ba13b92a0ceff4632";
var clientSecret = "d53376ed600341df98c7c3b0c037dc9d";
var clientKey = "";
var sessionToken = "";
var refreshToken = "";

// URLs 
var spotifyAccountURL = "https://accounts.spotify.com/authorize";
var spotifyTokenURL = "https://accounts.spotify.com/api/token";
var spotifyAPIURL = "https://api.spotify.com/v1";
var redirectURL = "http://127.0.0.1:5500/index.html";

var followedArtistsURL = "/me/following";
var topSpotifyURL = "/me/top/";

var cocktailAPIURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";

var alcohols = {
    a: "gin",
    b: "beer",
    c: "vodka",
    d: "tequila",
    e: "rum",
    f: "rum",
    g: "wine",
    h: "whistey",
    i: "bourbon",
    j: "brandy",
    k: "gin",
    l: "beer",
    m: "vodka",
    n: "tequila",
    o: "moonshine",
    p: "rum",
    q: "wine",
    r: "whistey",
    s: "bourbon",
    t: "brandy",
    u: "gin",
    v: "beer",
    w: "vodka",
    x: "tequila",
    y: "moonshine",
    z: "rum"
};

// opens window to spotify
var redirectToSpotify = function () {
    window.location.href = spotifyAccountURL + "?client_id=" + clientID + "&response_type=code" + "&redirect_uri=" + redirectURL + "&scope=user-top-read%20playlist-read-private%20user-follow-read";
}

var handleOnload = function () {
    if (localStorage.getItem("tokens")) {
        var tokensObject = JSON.parse(localStorage.getItem("tokens"));
        sessionToken = tokensObject.sessionToken;
        refreshToken = tokensObject.refreshToken;
    }
    
    if (window.location.search.length > 0 && !localStorage.getItem("tokens")) {
        clientKey = window.location.search.split("=")[1];

        firstTimeToken();
    }

    if (localStorage.getItem("tokens") || window.location.search.length > 0) {
        authModalEl.style.visibility = "hidden";
    }
}

var firstTimeToken = function () {

    var postBody = "grant_type=authorization_code";
    postBody += "&code=" + clientKey;
    postBody += "&redirect_uri=" + redirectURL;

    getUserToken(postBody);
}

var getUserToken = function (postBody) {

    fetch(spotifyTokenURL, {
        headers: {
            'Authorization': 'Basic ' + btoa(clientID + ":" + clientSecret),
            'Content-Type': "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: postBody
    }).then(function (response) {

        handleUserTokenResponse(response);

    }).catch(function (error) {
        console.log(error);
    })
}

var getRefreshToken = function () {
    var postBody = "grant_type=refresh_token";
    postBody += "&refresh_token=" + refreshToken;
    postBody += "&client_id=" + clientID;

    getUserToken(postBody);
}

var handleUserTokenResponse = function (response) {
    if (response.status == 200) {
        response.json().then(function (data) {
            console.log(data);
            sessionToken = data.access_token;
            refreshToken = data.refresh_token;
            var tokensObject = {
                sessionToken: sessionToken,
                refreshToken: refreshToken
            };
            localStorage.setItem("tokens", JSON.stringify(tokensObject));
        })
    } else if (response.status == 401) {
        getRefreshToken();
    } else {
        console.log(response.responseText)
    }
}

var getArtist = function (totalArtists) {
    fetch(spotifyAPIURL + topSpotifyURL + "artists", {
        headers: {
            'Authorization': 'Bearer ' + sessionToken,
            'Content-Type': "application/json"
        },
        method: "GET"
    }).then(function (response) {
        if (response.status == 200) {
            response.json().then(function (data) {
                var artistName = data.items[0].name;
                var artistNameFirst = artistName.charAt(0);
                getCocktailByIngrediant(alcohols[artistNameFirst.toLowerCase()], totalArtists);            })
        } else if (response.status == 401) {
            getRefreshToken();
        } else {
            console.log(response.responseText);
        }
    }).catch(function (error) {
        console.log(error);
    })
}

var getTotalArtists = function () {
    fetch(spotifyAPIURL + followedArtistsURL + "?type=artist", {
        headers: {
            'Authorization': 'Bearer ' + sessionToken,
            'Content-Type': "application/json"
        },
        method: "GET"
    }).then(function (response) {
        if (response.status == 200) {
            response.json().then(function (data) {
                var totalArtists = data.artists.total;
                getArtist(totalArtists);
            })
        } else if (response.status == 401) {
            getRefreshToken();
        } else {
            console.log(response.responseText);
        }
    }).catch(function (error) {
        console.log(error);
    })
}

var getCocktailByIngrediant = function (ingrediant, totalArtists) {
    console.log(ingrediant);
    console.log(cocktailAPIURL + "?i=" + ingrediant);
    fetch(cocktailAPIURL + "?i=" + ingrediant, { method: "GET" })
        .then(function (response) {
            response.json().then(function (data) {
                var drink = data.drinks[totalArtists % data.drinks.length];
                var drinkName = drink.strDrink;
                var drinkPic = drink.strDrinkThumb;
                drinkNameEl.textContent = drinkName;
                drinkPicEl.src = drinkPic;
                getArtistBtn.style.display = "none";            })
        })
}

var writeDrinkToScreen = function(data) {
    
}

onload = handleOnload();

authBtn.addEventListener("click", redirectToSpotify);
getArtistBtn.addEventListener("click", getTotalArtists);
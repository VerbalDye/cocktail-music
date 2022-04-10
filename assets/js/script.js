// saving the elements for later for us to manipulate 
var authBtn = document.querySelector("#auth-btn");
var getArtistBtn = document.querySelector("#get-artist");
var drinkPicEl = document.querySelector("#drink-pic");
var drinkNameEl = document.querySelector("#drink-name");
var authModalEl = document.querySelector(".modal");

// these are our project keys
var clientID = "f22c868cd9cf4b1ba13b92a0ceff4632";
var clientSecret = "d53376ed600341df98c7c3b0c037dc9d";

// setting up global key variable to be populated later
var clientKey = "";
var sessionToken = "";
var refreshToken = "";

// URLs 
var spotifyAccountURL = "https://accounts.spotify.com/authorize";
var spotifyTokenURL = "https://accounts.spotify.com/api/token";
var spotifyAPIURL = "https://api.spotify.com/v1";
var redirectURL = "http://127.0.0.1:5500/index.html";

// Search URLs
var followedArtistsURL = "/me/following";
var topSpotifyURL = "/me/top/";

// Cocktail API
var cocktailAPIURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";

//Object of alcohols for getting drink type
var alcohols = {
    a: "gin",
    b: "beer",
    c: "vodka",
    d: "tequila",
    e: "rum",
    f: "dry%20vermouth",
    g: "red%20wine",
    h: "whiskey",
    i: "bourbon",
    j: "brandy",
    k: "scotch",
    l: "kahlua",
    m: "triple%20sec",
    n: "amaretto",
    o: "pisco",
    p: "champagne",
    q: "southern%20comfort",
    r: "malibu%20rum",
    s: "sweet%20vermouth",
    t: "peach%20schnapps",
    u: "blended%20whiskey",
    v: "baileys%20irish%20cream",
    w: "blue%20curacao",
    x: "raspberry%20vodka",
    y: "apple%20schnapps",
    z: "cognac"
};

// Opens authentication window to spotify; step 1 of OAuth 2
var redirectToSpotify = function () {
    window.location.href = spotifyAccountURL + "?client_id=" + clientID + "&response_type=code" + "&redirect_uri=" + redirectURL + "&scope=user-top-read%20playlist-read-private%20user-follow-read";
}

// Function to handle the onload event
var handleOnload = function () {

    // checks to see if the tokens object exists in local storage
    if (localStorage.getItem("tokens")) {

        // takes the tokens from local storage and sets them as variables
        var tokensObject = JSON.parse(localStorage.getItem("tokens"));
        sessionToken = tokensObject.sessionToken;
        refreshToken = tokensObject.refreshToken;
    }

    // checks to see if there is a key in address bar and no local tokens variable
    if (window.location.search.length > 0 && !localStorage.getItem("tokens")) {

        // sets the client key from the URL and calls the functions to get session tokens
        clientKey = window.location.search.split("=")[1];
        firstTimeToken();
    }

    // checks if evidence of previous spotify authenication exists
    if (localStorage.getItem("tokens") || window.location.search.length > 0) {

        // if it does this hides the model
        authModalEl.style.visibility = "hidden";
    }
}

// step 2 of OAuth 2
var firstTimeToken = function () {

    // creates the post content
    var postBody = "grant_type=authorization_code";
    postBody += "&code=" + clientKey;
    postBody += "&redirect_uri=" + redirectURL;

    // sends the post body to a post request
    getUserToken(postBody);
}

// optional step 4 of OAuth 2
var getRefreshToken = function () {

    // creates the post content
    var postBody = "grant_type=refresh_token";
    postBody += "&refresh_token=" + refreshToken;
    postBody += "&client_id=" + clientID;

    // send the post body to a post request
    getUserToken(postBody);
}

// POST fetch request
var getUserToken = function (postBody) {
    fetch(spotifyTokenURL, {

        // Authorization and Content type set in headers
        headers: {
            'Authorization': 'Basic ' + btoa(clientID + ":" + clientSecret),
            'Content-Type': "application/x-www-form-urlencoded"
        },
        method: "POST",

        // body value from before
        body: postBody
    }).then(function (response) {

        // sends the response to be handled
        handleUserTokenResponse(response);
    }).catch(function (error) {

        // catches and logs an error to console
        console.log(error);
    })
}

// catches the different statuses and funnel traffic to different functions
var handleUserTokenResponse = function (response) {

    // 200 status means good to go
    if (response.status == 200) {
        response.json().then(function (data) {

            // set the tokens gotten form the reponse
            sessionToken = data.access_token;
            refreshToken = data.refresh_token;
            var tokensObject = {
                sessionToken: sessionToken,
                refreshToken: refreshToken
            };

            // stores the tokens to storage to speed up the process on reload
            localStorage.setItem("tokens", JSON.stringify(tokensObject));
        })

        // 401 means expired token so we send for a new one using our refresh token
    } else if (response.status == 401) {
        getRefreshToken();

        // catches any other statuses and logs to console for debugging purposes
    } else {
        console.log(response.responseText)
    }
}

// called from the "Personalized Drink" button
var getTotalArtists = function () {

    // fetched the users followed artists
    fetch(spotifyAPIURL + followedArtistsURL + "?type=artist", {

        // uses our session token to authenicate
        headers: {
            'Authorization': 'Bearer ' + sessionToken,
            'Content-Type': "application/json"
        },
        method: "GET"
    }).then(function (response) {

        // if a good response then we pull the total number for the data and pass it along to our getArtist function
        if (response.status == 200) {
            response.json().then(function (data) {
                var totalArtists = data.artists.total;
                getArtist(totalArtists);
            })

            // if we get a bad request we get a new token from our refresh token
        } else if (response.status == 401) {
            getRefreshToken();
        } else {

            // logs response for debugging
            console.log(response.responseText);
        }
    }).catch(function (error) {

        // logs error for debugginh
        console.log(error);
    })
}

// totalArtists is passed along to be used in the final step
var getArtist = function (totalArtists) {

    // fetch to get the users to listened to artists on spotify
    fetch(spotifyAPIURL + topSpotifyURL + "artists", {

        // same auth setup
        headers: {
            'Authorization': 'Bearer ' + sessionToken,
            'Content-Type': "application/json"
        },
        method: "GET"
    }).then(function (response) {
        if (response.status == 200) {
            response.json().then(function (data) {

                // get the name of their top artist
                var artistName = data.items[0].name;

                // get the first letter of that bands name
                var artistNameFirst = artistName.charAt(0);

                // uses our achohols object to get an alochol to search for in the final step
                getCocktailByIngrediant(alcohols[artistNameFirst.toLowerCase()], totalArtists);
            })
        } else if (response.status == 401) {
            
            // if our token expires we get a new one.
            getRefreshToken();
        } else {

            // logs response to console for debuggin purposes
            console.log(response.responseText);
        }
    }).catch(function (error) {

        // logs error to console for debuggin purposes
        console.log(error);
    })
}

// calls the cocktail api and searches for a list of cocktails by ingrediant
var getCocktailByIngrediant = function (ingrediant, totalArtists) {

    // fetches from the API
    fetch(cocktailAPIURL + "?i=" + ingrediant, { method: "GET" })
        .then(function (response) {
            if (response.status == 200) {
                response.json().then(function (data) {

                    // set the correct drink by getting the modulus of total artist by the length of the drinks returned
                    var drink = data.drinks[totalArtists % data.drinks.length];

                    // sets the attributes of the drink from the chosen drink
                    var drinkName = drink.strDrink;
                    var drinkPic = drink.strDrinkThumb;
                    var drinkID = drink.idDrink;

                    // sets the attributes from the search to the screen elements
                    drinkNameEl.innerHTML = "<a href='./drink_details.html?" + drinkID + "' >" + drinkName + "</a>";
                    drinkPicEl.src = drinkPic;

                    // removes the get button
                    getArtistBtn.style.display = "none";
                })
            } else {

                // logs bad repsonse to console
                console.log(response.responseText);
            }
        })
}

// runs function on load
onload = handleOnload();

// event listeners for DOM elements
authBtn.addEventListener("click", redirectToSpotify);
getArtistBtn.addEventListener("click", getTotalArtists);
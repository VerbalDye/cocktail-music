var cocktailDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
var drinkID = ""

var getURL = function() {
    drinkID = window.location.search.split("?")[1];
    if (!drinkID) {
        window.location.href = "./index.html";
    } else {
        getCocktailDetails();
    }
}

var getCocktailDetails = function() {

    fetch(cocktailDetailsURL + drinkID, { method: "GET" })
        .then(function (response) {
            if (response.status == 200) {
                response.json().then(function (data) {
                    console.log(data);
                })
            } else {

                // logs bad repsonse to console
                console.log(response.responseText);
            }
        })
}

onload = getURL;
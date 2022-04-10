var cocktailDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
var drinkID = ""
var drinkPicEl = document.querySelector("#drink-pic");
var drinkNameEl = document.querySelector("#drink-name");
var drinkGlassEl = document.querySelector("#drink-glass");
var drinkIngredientEl = document.querySelector("#drink-ingredient")

// Cocktail API
var cocktailAPIURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";

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
                    var drinkGlass = drink.strGlass;
                    var drinkIngredient1 = drink.strIngredient1;
                    var drinkIngredient2 = drink.strIngredient2;
                    var drinkIngredient3 = drink.strIngredient3;
                    var drinkIngredient4 = drink.strIngredient4;
                    var drinkIngredient5 = drink.strIngredient5;
                    var drinkIngredient6 = drink.strIngredient6;
                    var drinkIngredient7 = drink.strIngredient7;
                    var drinkIngredient8 = drink.strIngredient8;
                    var drinkIngredient9 = drink.strIngredient9;
                    var drinkIngredient10 = drink.strIngredient10;
                    var drinkIngredient11 = drink.strIngredient11;
                    var drinkIngredient12 = drink.strIngredient12;
                    var drinkIngredient13 = drink.strIngredient13;
                    var drinkIngredient14 = drink.strIngredient14;
                    var drinkIngredient15 = drink.strIngredient15;
                    var drinkMeasure1 = drink.strMeasure1;
                    var drinkMeasure2 = drink.strMeasure2;
                    var drinkMeasure3 = drink.strMeasure3;
                    var drinkMeasure4 = drink.strMeasure4;
                    var drinkMeasure5 = drink.strMeasure5;
                    var drinkMeasure6 = drink.strMeasure6;
                    var drinkMeasure7 = drink.strMeasure7;
                    var drinkMeasure8 = drink.strMeasure8;
                    var drinkMeasure9 = drink.strMeasure9;
                    var drinkMeasure10 = drink.strMeasure10;
                    var drinkMeasure11 = drink.strMeasure11;
                    var drinkMeasure12 = drink.strMeasure12;
                    var drinkMeasure13 = drink.strMeasure13;
                    var drinkMeasure14 = drink.strMeasure14;
                    var drinkMeasure15 = drink.strMeasure15;
                    var drinkInstructions = drink.strInstructions;

                    // sets the attributes from the search to the screen elements
                    drinkNameEl.src = drinkName;
                    drinkPicEl.src = drinkPic;
                    drinkGlassEl.src = drinkGlass;


                })
            } else {

                // logs bad repsonse to console
                console.log(response.responseText);
            }
        })
}

onload = getURL;
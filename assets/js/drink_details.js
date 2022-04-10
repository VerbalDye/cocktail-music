var cocktailDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
var drinkID = ""
var drinkPicEl = document.querySelector("#drink-pic");
var drinkNameEl = document.querySelector("#drink-name");
var drinkGlassEl = document.querySelector("#drink-glass");
var drinkIngredientEl = document.querySelector("#drink-ingredient")

// Cocktail API
var cocktailAPIURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";

var getURL = function () {
    drinkID = window.location.search.split("?")[1];
    if (!drinkID) {
        window.location.href = "./index.html";
    } else {
        getCocktailDetails();
    }
}

var getCocktailDetails = function () {

    fetch(cocktailDetailsURL + drinkID, { method: "GET" })
        .then(function (response) {
            if (response.status == 200) {
                response.json().then(function (data) {
                    console.log(data);
                    writeRecipeToScreen(data);
                })
            } else {

                // logs bad repsonse to console
                console.log(response.responseText);
            }
        })
}

// calls the cocktail api and searches for a list of cocktails by ingrediant
var writeRecipeToScreen = function (data) {

    var drink = data.drinks[0];

    // sets the attributes of the drink from the chosen drink
    var drinkName = drink.strDrink;
    var drinkPic = drink.strDrinkThumb;
    var drinkID = drink.idDrink;
    var drinkGlass = drink.strGlass;

    for (var i = 1; i < 16; i++) {
        var ingredientIndex = drink["strIngredient" + i];
        var ingredientMeasure = drink["strMeasure" + i];
        if (ingredientIndex) {
            var currentIngredient = document.createElement("li");
            currentIngredient.textContent = ingredientMeasure + " " + ingredientIndex;
            drinkIngredientEl.appendChild(currentIngredient);
        }
    }

    var drinkInstructions = drink.strInstructions;

    // sets the attributes from the search to the screen elements
    drinkNameEl.src = drinkName;
    drinkPicEl.src = drinkPic;
    drinkGlassEl.src = drinkGlass;

}

onload = getURL;
// saving the elements for later for us to manipulate
var cocktailDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
var drinkID = ""
var drinkPicEl = document.querySelector("#drink-pic");
var drinkNameEl = document.querySelector("#drink-name");
var drinkGlassEl = document.querySelector("#drink-glass");
var drinkIngredientEl = document.querySelector("#drink-ingredient");
var drinkInstructionsEl = document.querySelector("#drink-instructions");

// Cocktail API
var cocktailAPIURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";

// loads recipe details page
var getURL = function () {
    drinkID = window.location.search.split("?")[1];
    if (!drinkID) {
        window.location.href = "./index.html";
    } else {
        getCocktailDetails();
    }
}

// fetches recipe info from cocktail API
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

// displays drink name, pic, glass, ingredients, and instructions for the given drink
var writeRecipeToScreen = function (data) {

    var drink = data.drinks[0];

    // display drink name
    drinkNameEl.textContent = drink.strDrink;

    // ingredients + measurements. there can be up to 15 ingredients with corresponding measurements; this combines each ingredient with it's measurement
    for (var i = 1; i < 16; i++) {
        var ingredientIndex = drink["strIngredient" + i];
        var ingredientMeasure = drink["strMeasure" + i];
        if (ingredientIndex) {
            var currentIngredient = document.createElement("li");
            currentIngredient.textContent = ingredientMeasure + " " + ingredientIndex;
            drinkIngredientEl.appendChild(currentIngredient);
        }
    }

    // display drink glass type
    var drinkGlass = document.createElement("li");
    drinkGlass.textContent = drink.strGlass;
    drinkGlassEl.appendChild(drinkGlass);

    // display instructions
    var drinkInstructions = document.createElement("li");
    drinkInstructions.textContent = drink.strInstructions;
    drinkInstructionsEl.appendChild(drinkInstructions);

    // display pic
    drinkPicEl.src = drink.strDrinkThumb;
}

// run function on load
onload = getURL;
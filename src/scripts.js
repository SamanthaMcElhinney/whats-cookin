import './styles.css'
import './images/turing-logo.png'
import MicroModal from 'micromodal'
import RecipeRepository from './classes/RecipeRepository'
import User from './classes/User.js'
import Recipe from './classes/Recipe'
MicroModal.init()

const usersDataFetch = fetch(
    "http://localhost:3001/api/v1/users"
).then((response) => response.json())
const ingredientsDataFetch = fetch(
    "http://localhost:3001/api/v1/ingredients"
).then((response) => response.json())
const recipesDataFetch = fetch(
    "http://localhost:3001/api/v1/recipes"
).then((response) => response.json())

Promise.all([usersDataFetch, ingredientsDataFetch, recipesDataFetch])
.then((data) => {
    let allCookingData = {
        users: data[0].users,
        ingredients: data[1].ingredients,
        recipes: data[2].recipes
    }
    return allCookingData
})
.then(
    (allCookingData) => {
            let recipeRepository = new RecipeRepository(allCookingData.recipes)
            let user = new User(allCookingData.users[10])
            user.recipesToCook = user.changeIdToRecipe(recipeRepository);
            loadPage(recipeRepository, user, allCookingData.ingredients)
        }
    )

function loadPage(recipeRepository, user, ingredientsData) {
    const recipeSection = document.querySelector('#recipe-section')
    const adminSection = document.querySelector(".admin-section")
    const savedRecipes = document.querySelector("#saved-recipes")
    const topButton = document.querySelector("#top-button")
    const allRecipesButton = document.querySelector("#recipe-button")
    const breakfastButton = document.querySelector("#breakfast-filter")
    const snacksAppButton = document.querySelector("#snack-appetizers-filter")
    const mainDishButton = document.querySelector("#main-dish-filter")
    const compDishButton = document.querySelector("#complimentary-dish-filter")
    const searchBar = document.querySelector("#search-bar")
    const adminCenter = document.querySelector("#admin-center")
    const recipeModal = document.querySelector('#modal')
    const recipesHeader = document.querySelector('#recipes-header')
    const recipeContainer = document.querySelector('#recipe-container')
    const searchForm = document.querySelector('#search-form')

    var clickRepo
    let currentRecipe 
    var loggedIn = false
    let currentView = 'landing'
    let filterTerm = ''
    var username
    var password

    renderPage()

    if(localStorage.length < 1){genClickRepo()}

    topButton.addEventListener('click', () => document.documentElement.scrollTop = 0)
    allRecipesButton.addEventListener('click', () => {
        currentView = 'recipes'
        filterTerm = ''
        recipesHeader.innerText = 'All Recipes'
        renderPage()

    })
    savedRecipes.addEventListener('click', () => {
        currentView = 'savedRecipes'
        filterTerm = ''
        renderPage()
    })
    breakfastButton.addEventListener('click', () => {
        currentView = 'recipes'
        filterTerm = ['breakfast', 'morning meal']
        renderPage()

    })
    snacksAppButton.addEventListener('click', () => {
        currentView = "recipes"
        filterTerm = ['dip', 'snack', 'appetizer']
        renderPage()

    })
    mainDishButton.addEventListener('click', () => {
        currentView = "recipes"
        filterTerm = ['main dish', 'dinner', 'lunch']
        renderPage()

    })
    compDishButton.addEventListener('click', () => {
        currentView = "recipes"
        filterTerm = ['antipasti', 'hor d\'oeuvre', 'starter', 'salad', 'side dish', 'appetizer', 'condiment', 'spread']
        renderPage()
    })

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if (searchBar.value) {
            filterTerm = searchBar.value
        }
        if (currentView === 'admin' || currentView ==='landing') {
            currentView = 'recipes'
        }
        renderPage()
        searchBar.value = ''
    })

    adminCenter.addEventListener('click', () => {
        currentView = 'admin'
        filterTerm = ''
        renderPage()
    })

    recipeSection.addEventListener('click', (event) => {
        assignCurrentRecipe(event)
        renderCurrentRecipe()
    })

    window.onscroll = () => {
        if (document.documentElement.scrollTop > 350) {
            topButton.style.display = "block"
        } else {
            topButton.style.display = "none"
        }
    }

    function assignCurrentRecipe(event) {
        let currentRecipeId
        if (event.target.dataset.allRecipes) {
            currentRecipeId = event.target.dataset.allRecipes
        } else {
            currentRecipeId = event.target.parentElement.dataset.allRecipes
        }
        if (!currentRecipeId) {
            return
        }
        currentRecipeId = parseInt(currentRecipeId)
        currentRecipe = recipeRepository.recipes.find(recipe => recipe.id === currentRecipeId)
        currentRecipe = new Recipe(currentRecipe)
        updateRecipeCount()
        updateClickCount()
    }

    function updateRecipeCount() {
        currentRecipe.clicks += 1;
      }
 
    function renderCurrentRecipe() {

        if (!currentRecipe) {
            return
        }
        let isSaved;
        recipeModal.innerHTML = ''
        let ingredients = currentRecipe.determineRecipeIngredients(ingredientsData)

        const ingredientsHTML = ingredients.map(ingredient => {
            return '<li>' + ingredient.ingredient + '</li>'
        }).join('')

        if ( user.recipesToCook && user.recipesToCook.recipes.filter(current => current.id === currentRecipe.id).length !== 0) {
            isSaved = "Saved"
        } else {
            isSaved = "♥️"
        }

        const instructionsHTML = currentRecipe
            .returnInstructions()
            .map((instruction) => {
                return "<li>" + instruction + "</li>";
            })
            .join("");
        recipeModal.innerHTML = `
        <header class="modal__header">
          <h2 class="modal__title" id="modal-1-title">
            ${currentRecipe.name}
          </h2>
        </header>
        <main class="modal__content" id="modal-1-content">
          <div class="modal_container_img_ingredients"> 
          <img class="modal_img" src="${currentRecipe.image}" alt='${currentRecipe.name}'>
          <div class="modal_ingredients_container">
            <h3 class="modal_ingredients">Ingredients</h3>
            <ul>
                ${ingredientsHTML}
             </ul>
          </div>
          </div>
            <h3 class="modal_recipe_instructions">Recipe Instructions</h3>
          <ol type="1">
            ${instructionsHTML}
          </ol>
          <h4 class="modal_cost">Recipe Cost:$${currentRecipe.calculateRecipeCost(
            ingredientsData
          )}</h4>
          <div class="modal_button_container">
          <button type="button" class="modal__btn">${isSaved}</button>
          <button class="modal__close" id="close" aria-label="Close modal" data-micromodal-close>CLOSE</button>
          </div>
        </main>
        `;
        MicroModal.show('modal-1')
        const saveButton = document.querySelector('.modal__btn')
        const closeButton = document.querySelector('#close')
        if (
          user.recipesToCook.recipes.find(
            (current) => current.id === currentRecipe.id
          )
        ) {
          saveButton.style.backgroundColor = "red";
        }
        saveButton.addEventListener('click', () => saveRecipe(saveButton))
        closeButton.addEventListener('click', () => currentRecipe = '')
        recipeModal.scrollTo(0,0) 
    }

    function saveRecipe(button) {
        if (button.innerText === '♥️') {
            user.addToSavedRecipes(currentRecipe)
            button.innerText = 'Saved'
            button.style.backgroundColor = "red"
        fetch('http://localhost:3001/api/v1/usersRecipes', {
            method: 'POST',
            body: JSON.stringify({ userID: user.id, recipeID: currentRecipe.id}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error('Issue with request: ', response.status);
            }
            return response.json()
           })
           .catch(error => alert('Error, unable to find the saved recipes API'))
        } else {
        fetch('http://localhost:3001/api/v1/usersRecipes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ userID: user.id, recipeID: currentRecipe.id})
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error('Issue with request: ', response.status);
            }
            return response.json()
           })
           .catch(error => alert('Error, unable to locate the users recipes API'))
        
            user.removeFromSavedRecipes(currentRecipe)
            button.innerText = '♥️'
            button.style.backgroundColor = "#e6e6e6"
            renderPage()
        }
    }

    function displayAdmin() {
        adminSection.innerHTML = ''
        if(!loggedIn){
        adminSection.innerHTML += 
        `
        <label>Username : </label>   
            <input id="login-style" class="user" type="text" placeholder="Enter Username" name="username" required>  
            <label>Password : </label>   
            <input id="login-style" class="password" type="password" placeholder="Enter Password" name="password" required>  
        <button class="login-button" type="submit">Login</button>
        `

        var login = document.querySelector('.login-button')
        login.addEventListener('click', () => {
            username = document.querySelector('.user').value
            password = document.querySelector('.password').value
            console.log(username)
            if(checkLogin(username, password)) {
                loggedIn = true 
                displayAdmin()
            }
            else{
                loggedIn = false
                adminSection.innerHTML += `<h1 class="login-error">Incorrect Username or Password</h1>`
                setTimeout(() => {
                    displayAdmin()
                  }, "1500")
            }
        }) 
        }

        if(loggedIn) {
        adminSection.innerHTML += 
        `
        <button id="clear-button">Clear Clicks</button>
        <div class="admin">
          <h2 class="admin-title">Hi Admin</h2>
          <h3 class="admin-subtitle"> Welcome to the Admin Center </h3>
        </div>
        <div class ='scroll-admin-section'>
            <ul class='admin-list'></ul>
        </div>
        `
        var adminList = document.querySelector('.admin-list')

        var clicks = localStorage.getItem('clicks')
        var click = JSON.parse(clicks)
        click.sort((a, b)=> {
           return b.clicks - a.clicks
        })
        click.forEach(clickCount=> {
            adminList.innerHTML += `<li>${clickCount.name} has ${clickCount.clicks} click(s)</li>`
        })

        const clearButton = document.querySelector('#clear-button')
        clearButton.addEventListener('click', genClickRepo)
        }
    }

    function displayRecipes(recipes) {
        if (!recipes) {
            recipeContainer.innerHTML = ''
            recipesHeader.innerHTML = `<p>NO RESULTS</p>`
            return
        }
        if (currentView === 'landing') {
            recipeContainer.innerHTML = ''
            recipesHeader.innerText = 'Popular Recipes'
            recipes.forEach(recipe => {
                recipeContainer.innerHTML +=
            `
            <section class='popular-recipe' data-all-recipes='${recipe.id}'>
            <h3 id='${recipe.id}' class='small-recipe-text'>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            </section>
            `
            })
        } else {
            recipeContainer.innerHTML = ''
            recipes.forEach(recipe => {
                recipeContainer.innerHTML +=
            `
            <section class='recipe' data-all-recipes='${recipe.id}'>
            <h3 id='${recipe.id}' class='small-recipe-text'>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            </section>
            `
            })
        }
    }

    function getCurrentDisplayedRecipes(recipes, filterTerm) {
        if (Array.isArray(filterTerm)) {
            return recipes.filterByTag(filterTerm)
        } else if (filterTerm) {
            return (recipes.filterByName(filterTerm) || recipes.filterByTag(filterTerm))
        } else {
            return recipes.recipes
        }
    }

    function renderPage() {
        if (currentView === 'admin') {
            recipeSection.classList.add('hidden')
            adminSection.classList.remove('hidden')
            displayAdmin(user, ingredientsData)
        } else if (currentView === 'recipes') {
            searchBar.placeholder = "search all recipes..."
            if (!filterTerm) {
                recipesHeader.innerText = 'All Recipes'
            } else {
                recipesHeader.innerText = ''
            }
            adminSection.classList.add('hidden')
            recipeSection.classList.remove('hidden')
            displayRecipes(getCurrentDisplayedRecipes(recipeRepository, filterTerm))
        } else if (currentView === 'savedRecipes') {
            searchBar.placeholder = 'search saved recipes...'
            recipesHeader.innerText = 'Saved Recipes'
            adminSection.classList.add('hidden')
            recipeSection.classList.remove('hidden')
            displayRecipes(
              getCurrentDisplayedRecipes(user.recipesToCook, filterTerm)
            );
        } else if (currentView === 'landing') {
            var popularRecipes = genPopularRecipes()
            displayRecipes(popularRecipes)
        }
    }

    function genPopularRecipes() {
        const num1 = Math.floor(Math.random() * recipeRepository.recipes.length)
        const num2 = Math.floor(Math.random() * recipeRepository.recipes.length)
        const num3 = Math.floor(Math.random() * recipeRepository.recipes.length)

        let popularRecipes = [recipeRepository.recipes[num1], recipeRepository.recipes[num2], recipeRepository.recipes[num3]]

        if((new Set(popularRecipes)).size !== popularRecipes.length) {
            genPopularRecipes()
        } else {
            return popularRecipes
        }

    }


    function checkLogin(username, password) {
        if(username === "admin" && password === "password"){ return true }
        else{ return false} 
    }

    function updateClickCount() {
        clickRepo = localStorage.getItem('clicks')
        var par = JSON.parse(clickRepo)
        par.forEach(recipe => {
            if(recipe.name[0] === currentRecipe.name){recipe.clicks += 1}
        })

        localStorage.clear()
        localStorage.setItem('clicks', JSON.stringify(par))
    }

    function genClickRepo() {
        clickRepo = recipeRepository.recipes.map(recipe => {
            return { name: [recipe.name], clicks: 0 }
        })
        localStorage.setItem('clicks', JSON.stringify(clickRepo))
        displayAdmin()
    }
}

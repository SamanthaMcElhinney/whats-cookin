import './styles.css'
import './images/turing-logo.png'
import MicroModal from 'micromodal'
import RecipeRepository from './classes/RecipeRepository'
import User from './classes/User.js'
MicroModal.init()

// -------------------------------DOM ELEMENTS-------------------------------
const recipeSection = document.querySelector('#recipe-section')
const adminSection = document.querySelector(".admin-section")
const savedRecipesButton = document.querySelector("#saved-recipes")
const returnToTopButton = document.querySelector("#top-button")
const allRecipesButton = document.querySelector("#recipe-button")
const breakfastButton = document.querySelector("#breakfast-filter")
const snacksAppButton = document.querySelector("#snack-appetizers-filter")
const mainDishButton = document.querySelector("#main-dish-filter")
const compDishButton = document.querySelector("#complimentary-dish-filter")
const searchBar = document.querySelector("#search-bar")
const adminButton = document.querySelector("#admin-center")
const recipeModal = document.querySelector('#modal')
const recipeSectionHeader = document.querySelector('#recipes-header')
const recipeContainer = document.querySelector('#recipe-container')
const searchForm = document.querySelector('#search-form')

let currentRecipe
let loggedIn = false
let currentView = 'landing'
let filterTerm = ''
let user
let recipeRepository
let ingredientsData

//----------------------------------FETCH REQUESTS-----------------------------------
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
            recipeRepository = new RecipeRepository(allCookingData.recipes)
            user = new User(allCookingData.users[10])
            user.recipesToCook = user.changeIdToRecipe(recipeRepository)
            ingredientsData = allCookingData.ingredients
            renderPage()
            if (localStorage.length < 1) {
                generateClickInfoObjects()
            }
        }
    )

// --------------------------------EVENT LISTENERS----------------------------------------
returnToTopButton.addEventListener('click', () => document.documentElement.scrollTop = 0)
allRecipesButton.addEventListener('click', () => {
    currentView = 'recipes'
    filterTerm = ''
    renderPage()
})

savedRecipesButton.addEventListener('click', () => {
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
    if (currentView === 'admin' || currentView === 'landing') {
        currentView = 'recipes'
    }
    renderPage()
    searchBar.value = ''
})

adminButton.addEventListener('click', () => {
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
        returnToTopButton.style.display = "block"
    } else {
        returnToTopButton.style.display = "none"
    }
}

//-------------------------------------------FUNCTIONS--------------------------------------------
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
    updateClickCount()
}

function saveRecipe(button) {
    if (button.innerText === '♥️') {
        user.addToSavedRecipes(currentRecipe)
        button.innerText = 'Saved'
        button.style.backgroundColor = "red"
        fetch('http://localhost:3001/api/v1/usersRecipes', {
                method: 'POST',
                body: JSON.stringify({
                    userID: user.id,
                    recipeID: currentRecipe.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Issue with request: ', response.status)
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
                body: JSON.stringify({
                    userID: user.id,
                    recipeID: currentRecipe.id
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Issue with request: ', response.status)
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
    if (!loggedIn) {
        adminSection.innerHTML +=
            `<form id='login-form'>
                <label for="login-user">Username: </label>   
                <input id="login-user" type="text" placeholder="Enter Username" name="username" required>  
                <label for="login-password">Password: </label>   
                <input id="login-password" type="password" placeholder="Enter Password" name="password" required>  
                <button type="submit">Login</button>
            </form>`

        const loginForm = document.querySelector('#login-form')
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const username = document.querySelector('#login-user').value
            const password = document.querySelector('#login-password').value
            if (authenticateUser(username, password)) {
                loggedIn = true
                displayAdmin()
            } else {
                loggedIn = false
                adminSection.innerHTML += `<h1 class="login-error">Incorrect Username or Password</h1>`
                setTimeout(() => {
                    displayAdmin()
                }, "1500")
            }
        })
    } else {
        adminSection.innerHTML +=
            `<button id="clear-button">Clear Clicks</button>
            <div class="admin">
                <h2 class="admin-title">Hi Admin</h2>
                <h3 class="admin-subtitle"> Welcome to the Admin Center </h3>
            </div>
            <div class ='scroll-admin-section'>
                <ul class='admin-list'></ul>
            </div>`

        const adminList = document.querySelector('.admin-list')
        const clicks = localStorage.getItem('clicks')
        const click = JSON.parse(clicks)
        click.sort((a, b) => {
            return b.clicks - a.clicks
        })
        click.forEach(clickCount => {
            adminList.innerHTML += `<li>${clickCount.name} has ${clickCount.clicks} click(s)</li>`
        })

        const clearButton = document.querySelector('#clear-button')
        clearButton.addEventListener('click', generateClickInfoObjects)
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
        displayAdmin()
    } else if (currentView === 'recipes') {
        recipeSectionHeader.innerText = 'All Recipes'
        searchBar.placeholder = "search all recipes..."
        if (!filterTerm) {
            recipeSectionHeader.innerText = 'All Recipes'
        } else {
            recipeSectionHeader.innerText = ''
        }
        adminSection.classList.add('hidden')
        recipeSection.classList.remove('hidden')
        displayRecipes(getCurrentDisplayedRecipes(recipeRepository, filterTerm))
    } else if (currentView === 'savedRecipes') {
        searchBar.placeholder = 'search saved recipes...'
        recipeSectionHeader.innerText = 'Saved Recipes'
        adminSection.classList.add('hidden')
        recipeSection.classList.remove('hidden')
        displayRecipes(
            getCurrentDisplayedRecipes(user.recipesToCook, filterTerm)
        )
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

    if ((new Set(popularRecipes)).size !== popularRecipes.length) {
        genPopularRecipes()
    } else {
        return popularRecipes
    }
}

function authenticateUser(username, password) {
    if (username === "admin" && password === "password") {
        return true
    } else {
        return false
    }
}

function updateClickCount() {
    const recipeClicks = localStorage.getItem('clicks')
    const parsedClickInfo = JSON.parse(recipeClicks)
    parsedClickInfo.forEach(recipe => {
        if (recipe.name === currentRecipe.name) {
            recipe.clicks += 1
        }
    })
    localStorage.setItem('clicks', JSON.stringify(parsedClickInfo))
}

function generateClickInfoObjects() {
    const recipeClicks = recipeRepository.recipes.map(recipe => {
        return {
            name: recipe.name,
            clicks: 0
        }
    })
    localStorage.setItem('clicks', JSON.stringify(recipeClicks))
    displayAdmin()
}

function displayRecipes(recipes) {
    if (!recipes) {
        recipeContainer.innerHTML = ''
        recipeSectionHeader.innerHTML = `<p>NO RESULTS</p>`
        return
    }
    if (currentView === 'landing') {
        recipeContainer.innerHTML = ''
        recipeSectionHeader.innerText = 'Popular Recipes'
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

function renderCurrentRecipe() {

    if (!currentRecipe) {
        return
    }
    let isSaved
    recipeModal.innerHTML = ''
    let ingredients = currentRecipe.determineRecipeIngredients(ingredientsData)

    const ingredientsHTML = ingredients.map(ingredient => {
        return '<li>' + ingredient.ingredient + '</li>'
    }).join('')

    if (user.recipesToCook && user.recipesToCook.recipes.filter(current => current.id === currentRecipe.id).length !== 0) {
        isSaved = "Saved"
    } else {
        isSaved = "♥️"
    }

    const instructionsHTML = currentRecipe
        .returnInstructions()
        .map((instruction) => {
            return "<li>" + instruction + "</li>"
        })
        .join("")
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
    `
    MicroModal.show('modal-1')
    const saveButton = document.querySelector('.modal__btn')
    const closeButton = document.querySelector('#close')
    if (
        user.recipesToCook.recipes.find(
            (current) => current.id === currentRecipe.id
        )
    ) {
        saveButton.style.backgroundColor = "red"
    }
    saveButton.addEventListener('click', () => saveRecipe(saveButton))
    closeButton.addEventListener('click', () => currentRecipe = '')
    recipeModal.scrollTo(0, 0)
}
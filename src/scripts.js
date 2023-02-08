import './styles.css';
import apiCalls from './apiCalls';
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import recipeData from './data/recipes.js';
import MicroModal from 'micromodal'
import RecipeRepository from './classes/RecipeRepository';
const recipeRepository = new RecipeRepository(recipeData)

const recipeSection  = document.querySelector(".recipe-section")
const navigationSeciton = document.querySelector(".navigation-sec tion")
const recipes = document.querySelector(".recipe")

const topButton = document.querySelector("#top-button")
const allRecipes = document.querySelector("#recipe-button")
const breakfastFilter = document.querySelector("#breakfast-filter")
const snacksAppFilter = document.querySelector("#snack-appetizers-filter")
const brunchFilter = document.querySelector("#brunch-filter")
const mainDishFilter = document.querySelector("#main-dish-filter")
const compDishFilter = document.querySelector("#complimentary-dish-filter")

topButton.addEventListener('click', function() {document.documentElement.scrollTop = 0})
allRecipes.addEventListener('click', showAllRecipes)
breakfastFilter.addEventListener('click', function() {showFilteredRecipes('breakfast')})
snacksAppFilter.addEventListener('click', function() {showFilteredRecipes('snack')})
brunchFilter.addEventListener('click', function() {showFilteredRecipes('brunch')})
mainDishFilter.addEventListener('click', function() {showFilteredRecipes('main dish')})
compDishFilter.addEventListener('click', function() {showFilteredRecipes('appetizer')})
var currentRecipes = []

window.onload = function() {
    for(var i = 0; i < recipeData.length; i++) {
        currentRecipes.push(recipeData[i])
    }
    popularRecipes()
}

window.onscroll = function() {
    if (document.documentElement.scrollTop > 350) {
        topButton.style.display = "block";
      } else {
        topButton.style.display = "none";
    }
    if (document.documentElement.scrollTop > 280) {
        navigationSeciton.style.position = "sticky"
        navigationSection.style.marginTop = "10px"
    } else {
        navigationSeciton.style.position = "relative"
    }
}

function displayRecipes() {
    recipeSection.innerHTML = ''
    for(var i = 0; i < currentRecipes.length; i++) {
        recipeSection.innerHTML += 
        `
        <img src="${currentRecipes[i].image}" class="recipe"></img>
        `
    }
}

function popularRecipes() {
    for(var i = 0; i < 10; i++) {
        recipeSection.innerHTML +=
        `
        <img src="${recipeData[i].image}" class="recipe"></img>
        `
    }
}

function showAllRecipes() {
    recipeSection.innerHTML = ''
    for(var i = 0; i < recipeData.length; i++) {
        recipeSection.innerHTML += 
        `
        <img src="${recipeData[i].image}" class="recipe"></img>
        `
    }
}

function showFilteredRecipes(tag) {
    currentRecipes = []
    var filteredRecipes = recipeRepository.filterByTag(tag)
    for(var i = 0; i < filteredRecipes.length; i++) {
        currentRecipes.push(filteredRecipes[i])
    }
    displayRecipes()
}


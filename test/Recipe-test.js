import { expect } from 'chai';
import Recipe from '../src/classes/Recipe'
import sampleIngredientsData from "../src/data/sample-ingredient-data"
import sampleRecipeData from "../src/data/sample-recipe-data"

describe("Recipe", () => {
    let recipe
      
    beforeEach(() => {
        recipe = new Recipe(sampleRecipeData[0]);
    })

    it("should be a function", () => {
        expect(Recipe).to.be.a('function')
    })

    it("should be an instance of Recipe", () => {
        expect(recipe).to.be.an.instanceOf(Recipe)
    })

    it("should have an ID property", () => {
        expect(recipe.id).to.deep.equal(sampleRecipeData[0].id);
    })

    it("should have an image property", () => {
        expect(recipe.image).to.deep.equal(sampleRecipeData[0].image)
    })

    it("should have an ingredients property", () => {
        expect(recipe.ingredients).to.deep.equal(sampleRecipeData[0].ingredients)
    })

    it("should have an instructions property", () => {
        expect(recipe.instructions).to.deep.equal(sampleRecipeData[0].instructions)
    })

    it("should have a name property", () => {
        expect(recipe.name).to.deep.equal(sampleRecipeData[0].name);
    })

    it("should have a tags property", () => {
        expect(recipe.tags).to.deep.equal(sampleRecipeData[0].tags);
    })

    it("should return an array of ingredient ids", () => {
        let ingredientIds = recipe.getIngredientIds()
        expect(ingredientIds).to.deep.equal([20081, 18372, 1123, 19335, 19206, 19334, 2047, 1012047, 10019903, 1145, 2050])
    })

    it("should be able to converts id numbers to ingredient", () => {
        let ingredientNames = recipe.determineRecipeIngredients(sampleIngredientsData);
        expect(ingredientNames).to.have.length(11)
    })

    it("should be able to to calculate total ingredient cost", () => {
        expect(recipe.calculateRecipeCost(sampleIngredientsData)).to.equal('177.76')
    })

    it("should have a function recipe to return recipe instructions", () => {
        let recipeInstructions = recipe.returnInstructions();
        expect(recipeInstructions[0]).to.equal('1: In a large mixing bowl, whisk together the dry ingredients (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl of a stand mixer, cream butter for 30 seconds. Gradually add granulated sugar and brown sugar and cream until light and fluffy.')
    })
})



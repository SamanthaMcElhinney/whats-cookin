import RecipeRepository from "./RecipeRepository"

class User {
    constructor(user) {
        this.name = user.name
        this.id = user.id
        this.recipesToCook = user.recipesToCook
    }

    addToSavedRecipes(recipeToAdd) {
        this.recipesToCook.addRecipe(recipeToAdd)
    }
    
    changeIdToRecipe(recipes) {
        if(this.recipesToCook && this.recipesToCook.length) {
            let matchingRecipe = []
            this.recipesToCook.forEach(id => {
                recipes.recipes.forEach(element => {
                    if(element.id === id){
                        matchingRecipe.push(element)
                    }        
                })
            })
            return new RecipeRepository(matchingRecipe)
        } else {
            return new RecipeRepository([])
        }
    } 

    removeFromSavedRecipes(recipeToRemove) {
      this.recipesToCook.removeRecipe(recipeToRemove.id) 
    }
}

export default User;
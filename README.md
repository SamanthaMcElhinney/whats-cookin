# [What's Cookin](https://espressogoddess.github.io/whats-cookin/) 

### Abstract:
This in an interactive web-based application that was developed to make the user's experience searching for recipes, efficient and fun. The user is presented with an array of popular recipes on the main page. They are able to search and filter recipes based on their culinary choice. The user has the option to view more details of the recipe and save their favorite recipes to their own page, which can be selected in the navigation bar clicking `Saved Recipes`. The user is also able to see what ingredients are located in their pantry to complete the recipe clicking `Your Pantry.` The admin has accessibility to view a list of all the recipes and how many views each recipe has gotten to determine the most popular recipes.

### Feature Spotlight
We successfully implemented MicroModal as seen in the GIF below. This provides users with an expanded view of any recipe they wish to see further with a detailed ingredient list, directions, and estimated cost. As a team we researched features to optimize the user experience and we decided MicroModal.js to be the best solution.

### Installation Instructions:
1. Open terminal and navigate where you would like to store the application. 
1. Click `SSH` and copy and paste `git@github.com:Espressogoddess/whats-cookin.git` into your terminal.
1. `cd` into the repository on your local machine and run `npm install` or `npm i` to install project dependencies.
1. Run `npm start` in the terminal to launch the API's server. 
1. Open the link to your local server (listed in your terminal) in your web browser to view the live page.
1. `Control + C` is the command to stop running the local server. 

### Preview of App:

![demo](./src/images/whats%20cookin%20gif.gif)


### Context:

This project was completed in the 10th week of the Turing front-end software engineering program. We were required to synthesize technical information learned thus in the program, in addition to project management skills to create a fully functioning and accessible site. This project required additional research to implement new technologies.

### Contributors:

- [Amber](https://github.com/Espressogoddess)

- [Sam](https://github.com/SamanthaMcElhinney)

- [Michael](https://github.com/mrlobatoman)

- [Trevor](https://github.com/trevorfitz0)

### Learning Goals:

- Use object and array prototype methods to perform data manipulation
- Implement ES6 classes with a complex data model
- Create a user interface that is easy to use and clearly displays information
- Write modular, reusable code that follows SRP (Single Responsibility Principle)
- Implement a robust testing suite using TDD
- Make network requests to retrieve data
- Store data in local storage so Admin can access information regarding user interaction
- Create dry/semantic HTML
- Run third party tests to make sure app is accessible

### Technologies Used:
- Fetch API (GET, POST, DELETE)
- MicroModal.js 3rd party library
- Webpack module bundler
- Git/GitHub
- Trello project board
- JavaScript
- CSS
- HTML
- Mocha JavaScript testing framework
- Chai assertion library
- Test driven development
- Lighthouse
- Wave

### Wins + Challenges:

#### Wins
- We were able to deepen our understanding and successfully implemented use of fetch API to fetch resources asynchronously.
- Refactor our filter by tag function to accept an array while using TDD.
- Using stringify and parse to add and manipulate data in local storage, also being able to reset that data with a function.

#### Challenges:
- Dividing workload with various schedules, learning and working styles. We implemented a project board and diligently used PR requests for code review and feedback from peers. We adjusted our workflow, viable product and design based on deadlines, product output and the team's needs.
- Implementing inner HTML on the appropriate elements when dynamically adding items to the page.
- Utilizing API's without using async/ await.
- Fixing bug that allowed the user to open up the most recently viewed recipe when clicking in the recipe section background.
- Conceptualizing and converting previous code to use local storage to accomplish our assigned track

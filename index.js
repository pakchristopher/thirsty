class UI{
    printAlert(message, classname){
        document.querySelector('.wrap__alert').innerHTML = `
            <h3 class="${classname}">${message}</h3>
        `
        setTimeout(()=>{
            document.querySelector('.danger').remove()
        },2000)
    }
    clearResults(){document.querySelector('.wrap__result').innerHTML = ''}
    clearFields(){
        document.querySelector('.search-type').value = ''
        document.getElementById('search').value = ''
        document.getElementById('search-category').value = ''

    }
    displayDrinksWithIngredients(drinks){
        const wrapResult = document.querySelector('.wrap__result')
        wrapResult.style.display = 'grid'
        drinks.forEach(drink=>{
            const div = document.createElement('div')
            wrapResult.innerHTML += `
                <div class="query-result">
                    <button class="add-to-fav" data-id="${drink.idDrink}">+</button>
                    <h2 class="query-result__name">${drink.strDrink}</h2>
                    <div class="query-result__badge">
                        <span class="query-result__category">${drink.strCategory}</span>
                        &nbsp;|&nbsp;
                        <span class="query-result__type">${drink.strAlcoholic}</span>
                    </div>
                    <img class="query-result__img" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                    <h3 class="instr">Instructions</h3>
                    <p class="query-result__instructions">${drink.strInstructions}</p>
                    <h3 class="ingre">Ingredients</h3>
                    <ul class="query-result__ingredients">
                        ${this.displayIngredients(drink)}
                    </ul>
                </div>
            `;
        })
        this.isFavorite()
        this.clearFields()
    }
    displayIngredients(drink){
        let ingredients = []
        for(let i=1; i<16; i++){
            const ingredientMeasure = {}
            if(drink[`strIngredient${i}`] !== ''){
                ingredientMeasure.ingredient = drink[`strIngredient${i}`]
                ingredientMeasure.measure = drink[`strMeasure${i}`]
                ingredients.push(ingredientMeasure)
            }
        }
        let ingredMeas = ''
        ingredients.forEach(ingred=>{
            ingredMeas += `<li>${ingred.ingredient} &mdash; ${ingred.measure}</li>`;
        })
        return ingredMeas
    }
    displayDrinks(drinks){
        const wrapResult = document.querySelector('.wrap__result')
        wrapResult.style.display = 'grid'
        drinks.forEach(drink=>{
            const div = document.createElement('div')
            wrapResult.innerHTML += `
                <div class="query-result">
                    <button class="add-to-fav" data-id="${drink.idDrink}">+</button>
                    <h2 class="query-result__name">${drink.strDrink}</h2>
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                    <a class="btn get-recipe" href="javascript:void(0)" data-toggle="modal" data-id="${drink.idDrink}" data-target="#modal-recipe">Get Recipe</a>
                </div>
            `;
        })
        this.isFavorite()
        this.clearFields()
    }
    displayRecipe(recipe){
        document.getElementById('modal-recipe').style.display = 'block'
        const modalTitle = document.querySelector('.modal__content-title')
        const modalIngredients = document.querySelector('.modal__content-ingredients')
        const modalDescription = document.querySelector('.modal__content-description')

        modalTitle.textContent = recipe.strDrink
        modalIngredients.innerHTML = this.displayIngredients(recipe)
        modalDescription.textContent = recipe.strInstructions
    }
    displayCategories(){
        const categoryList = cocktail.getCategories()
        .then(cate=>{
            const list = cate.drinks
            const first = document.createElement('option')
            first.value = ''
            first.textContent = '-- Select --'
            document.getElementById('search-category').appendChild(first)
            list.forEach(cat=>{
                const option = document.createElement('option')
                option.textContent = cat.strCategory
                option.value = cat.strCategory.split(' ').join('_');
                document.getElementById('search-category').appendChild(option)
            })
        })
    }
    displayFavorites(favs){
        const favsContent = document.querySelector('.favorites-content')
        favs.forEach(fav=>{
            const div = document.createElement('div')
            div.className = 'favorites-content__drink'
            div.innerHTML = `
                <h2>${fav.name}</h2>
                <img src="${fav.image}">
                <a href="#" class="get-recipe fav-view" data-toggle="modal" data-id="${fav.id}">View</a>
                <a href="#" class="remove-recipe" data-toggle="modal" data-id="${fav.id}">Remove</a>
            `;
            favsContent.appendChild(div)
        })
    }
    removeFavorite(fav){
        fav.remove();
    }
    isFavorite(){
        const drinks = cocktaildb.getFromDB();
        drinks.forEach(drink=>{
            const id = drink.id
            const favDrink = document.querySelector(`[data-id="${id}"]`)
            if(favDrink){
                favDrink.classList.add('favorite')
                favDrink.textContent = `‒`
                favDrink.style.backgroundColor = 'rgb(235, 105, 125)'
            }
        })
    }
}
class Cocktail{
    getDrinksByName(search){
        const res = fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+search)
        .then(res=>res.json())
        return res
    }
    getDrinksByIngredient(search){
        const res = fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+search)
        .then(res=>res.json())
        return res
    }
    getRecipe(id){
        const res = fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+id)
        .then(res=>res.json())
        return res
    }
    getCategories(){
        const res = fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
        .then(res=>res.json())
        return res
    }
    getDrinksByCategory(category){
        const res = fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c='+category)
        .then(res=>res.json())
        return res
    }
}
class CocktailDB{
    getFromDB(){
        let drinks
        if(localStorage.getItem('drinks') === null) drinks = []
        else drinks = JSON.parse(localStorage.getItem('drinks'))
        return drinks
    }
    saveToDB(drink){
        const drinks = this.getFromDB()
        drinks.push(drink)
        localStorage.setItem('drinks', JSON.stringify(drinks))
    }
    removeFromDB(id){
        const drinks = this.getFromDB()
        drinks.forEach((drink,i)=>{
            if(id === drink.id) drinks.splice(i,1)
        })
        localStorage.setItem('drinks', JSON.stringify(drinks))
    }
}

const ui = new UI()
const cocktail = new Cocktail()
const cocktaildb = new CocktailDB()

function eventListeners(){
    const form = document.querySelector('.wrap__form')
    const wrapResult = document.querySelector('.wrap__result')
    const searchCategory = document.getElementById('search-category')

    document.addEventListener('DOMContentLoaded', docReady)

    if(form) form.addEventListener('submit', getDrinks) // if this form is present in current active html page
    if(wrapResult) wrapResult.addEventListener('click', resultDelegation)
    if(searchCategory) searchCategory.addEventListener('change', getDrinks)
}
eventListeners()

function docReady(){
    const searchCategory = document.getElementById('search-category')
    const favorites = document.getElementById('favorites')
    ui.isFavorite()

    if(searchCategory){
        ui.displayCategories()
    }
    if(favorites){
        const drinks = cocktaildb.getFromDB()
        ui.displayFavorites(drinks)

        favorites.addEventListener('click', e=>{
            e.preventDefault()
            if(e.target.classList.contains('get-recipe')){
                cocktail.getRecipe(e.target.dataset.id)
                .then(recipe => {
                    ui.displayRecipe(recipe.drinks[0])
                })
            }
            if (e.target.classList.contains('remove-recipe')){
                ui.removeFavorite(e.target.parentElement)
                cocktaildb.removeFromDB(e.target.dataset.id)
            }
        })
    }
}
function getDrinks(e){
    e.preventDefault()
    const search = document.getElementById('search').value
    const searchCat = document.getElementById('search-category').value
    if(search === '' && searchCat === '') ui.printAlert('Field is empty.', 'danger')
    else{
        let searchRes, type

        const searchType = document.querySelector('.search-type')
        if(searchType.value === 'name'){
            searchRes = cocktail.getDrinksByName(search)
            type = 'name'
        }
        if(searchType.value === 'ingredient'){
            searchRes = cocktail.getDrinksByIngredient(search)
            type = 'not name'
        }
        if(searchCat !== ''){
            searchRes = cocktail.getDrinksByCategory(searchCat)
            type = 'name... not'
        }
        ui.clearResults()
        // cocktail.getDrinksByName(search)
        searchRes.then(drinks=>{
            if(drinks.drinks === null) ui.printAlert('No cocktails available.', 'danger')
            else{
                if(type==='name') ui.displayDrinksWithIngredients(drinks.drinks)
                else ui.displayDrinks(drinks.drinks)
            }
        })
    }

}
function resultDelegation(e){
    e.preventDefault()
    if(e.target.classList.contains('get-recipe')){
        cocktail.getRecipe(e.target.dataset.id)
        .then(recipe=>{
            ui.displayRecipe(recipe.drinks[0])
        })
    }
    if(e.target.classList.contains('add-to-fav')){
        if(e.target.classList.contains('favorite')){
            e.target.classList.remove('favorite')
            e.target.textContent = '+'
            e.target.style.backgroundColor = 'rgb(48, 194, 194)'
            cocktaildb.removeFromDB(e.target.dataset.id)
        } else{
            e.target.classList.add('favorite')
            e.target.textContent = `‒`;
            e.target.style.backgroundColor = 'rgb(235, 105, 125)'
            const drinkBody = e.target.parentElement
            const drink = {
                id: e.target.dataset.id,
                name: drinkBody.querySelector('h2').textContent,
                image: drinkBody.querySelector('img').src
            }
            cocktaildb.saveToDB(drink)

        }
    }
}
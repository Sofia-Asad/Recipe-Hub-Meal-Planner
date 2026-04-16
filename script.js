const API_KEY = '53888b5dfde74431aa91968830308192';

function showPage(pageId) {
    // Dhamaan bogaga qari
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Kan la rabo kaliya tus
    document.getElementById(pageId + '-page').classList.add('active');
}
// 3. Tusaale yar oo lagu raadinayo cuntada (Search Function)
async function searchRecipes(query) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=12`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Beddel Title-ka marka search la sameeyo
        document.getElementById('home-title').innerText = `Search Results for: "${query}"`;
        
        displayRecipes(data.results);
    } catch (error) {
        console.error("Cillad:", error);
    }
}
// 4. Inaad ku muujiso cuntooyinka shaashadda (Display)
function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('recipe-results');
    resultsDiv.innerHTML = ''; // Markii hore nadiifi

    recipes.forEach(recipe => {
        const card = `
            <div class="recipe-card" onclick="getRecipeDetails(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </div>
        `;
        resultsDiv.innerHTML += card;
    });
}
// Function-ka keenaya cuntooyinka Random-ka ah si boggu u buuxsamo
async function getPopularRecipes() {
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=12`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Kaliya cinwaanka yar beddel
        document.getElementById('result-title').innerText = "Popular Recipes";
        
        displayRecipes(data.recipes); 
    } catch (error) {
        console.error("Cillad:", error);
    }
}

// Event Listener u samee batoonka Search-ka
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if(query) {
        searchRecipes(query);
    }
});
// Markii Enter la taabto isagoo qofku qoraalka ku dhex jiro
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = document.getElementById('search-input').value;
        if (query) {
            searchRecipes(query);
        }
    }
});

// Function-ka keenaya faahfaahinta cuntada marka la gujiyo sawirka
async function getRecipeDetails(id) {
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const recipe = await response.json();
        
        // Marka xogta la helo, tus bogga Details-ka
        showPage('details');
        displayRecipeFullDetails(recipe);
    } catch (error) {
        console.error("Cillad ayaa dhacday:", error);
    }
}
// Function-ka ku qoraya xogta bogga labaad (HTML-ka dhexdiisa)
function displayRecipeFullDetails(recipe) {
    const detailsDiv = document.getElementById('recipe-full-details');
    
    detailsDiv.innerHTML = `
        <div class="details-container">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h2>${recipe.title}</h2>
            
            <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes} mins</span>
                <span><i class="fas fa-users"></i> Serves ${recipe.servings}</span>
            </div>

            <h3>Ingredients</h3>
            <ul>
                ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
            </ul>

            <h3>Instructions</h3>
            <div class="instructions">
                ${recipe.instructions || "No instructions available."}
            </div>

            <button class="save-btn" onclick="saveToMealPlan(${recipe.id}, '${recipe.title}', '${recipe.image}')">
                <i class="fas fa-heart"></i> Add to My Meal Plan
            </button>
        </div>
    `;
}

// 1. Inaad cunto ku dhex keydiso Local Storage
function saveToMealPlan(id, title, image) {
    let mealPlan = JSON.parse(localStorage.getItem('myMealPlan')) || [];

    // Hubi haddii cuntadu mar hore ku jirtay
    const exists = mealPlan.find(item => item.id === id);
    if (exists) {
        alert("Cuntadan mar hore ayay ku jirtay Meal Plan-kaaga!");
        return;
    }

    // Ku dar liiska
    mealPlan.push({ id, title, image });
    localStorage.setItem('myMealPlan', JSON.stringify(mealPlan));
    
    alert("Waa lagu daray My Meal Plan!");
    displayFavorites(); // Cusboonaysii bogga saddexaad
}

// 2. Inaad soo bandhigto cuntooyinka ku jira bogga saddexaad
function displayFavorites() {
    const favoriteResults = document.getElementById('favorite-results');
    let mealPlan = JSON.parse(localStorage.getItem('myMealPlan')) || [];

    if (mealPlan.length === 0) {
        favoriteResults.innerHTML = "<p>Ma jiraan cuntooyin kuu dhowrsan hadda.</p>";
        return;
    }

    favoriteResults.innerHTML = ''; // Nadiifi markii hore
    mealPlan.forEach(recipe => {
        favoriteResults.innerHTML += `
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.title}" onclick="getRecipeDetails(${recipe.id})">
                <h3>${recipe.title}</h3>
                <button class="delete-btn" onclick="removeFromMealPlan(${recipe.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
    });
}

// 3. Inaad ka tirtirto cuntada Local Storage
function removeFromMealPlan(id) {
    let mealPlan = JSON.parse(localStorage.getItem('myMealPlan')) || [];
    mealPlan = mealPlan.filter(item => item.id !== id);
    localStorage.setItem('myMealPlan', JSON.stringify(mealPlan));
    
    displayFavorites(); // Cusboonaysii shaashadda
}

// Marka bogga la furo, soo bandhig cuntooyinka keydsan
window.onload = () => {
    displayFavorites();
    getPopularRecipes();

};
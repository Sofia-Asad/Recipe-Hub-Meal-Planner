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
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=10`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.results); // Halkan ka eeg xogta ay soo celiso
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error:", error);
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
// Event Listener u samee batoonka Search-ka
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if(query) {
        searchRecipes(query);
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
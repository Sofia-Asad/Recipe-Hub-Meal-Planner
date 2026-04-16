const API_KEY = '53888b5dfde74431aa91968830308192';

function showPage(pageId) {
    // Dhamaan bogaga qari
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Kan la rabo kaliya tus
    document.getElementById(pageId + '-page').classList.add('active');
}
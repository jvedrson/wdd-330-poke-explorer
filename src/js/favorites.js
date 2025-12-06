import { FavoritesList } from './components/FavoritesList.mjs';

function init() {
    console.log('Favorites page initialized');

    const favoritesList = new FavoritesList('#favorites-grid');
    favoritesList.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

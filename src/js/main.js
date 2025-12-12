import { PokemonList } from './components/PokemonList.mjs';
import { SearchBar } from './searchModule.js';
import { FilterModule } from './filterModule.js';

async function init() {
    console.log('Poke-Explorer initialized!');

    const pokemonList = new PokemonList('.pokemon-grid');
    
    const searchBar = new SearchBar('#search-container', (query) => {
        pokemonList.searchByName(query);
    });
    searchBar.init();

    const filterModule = new FilterModule('#filter-container', (type) => {
        pokemonList.filterByType(type);
    });
    await filterModule.init();

    await pokemonList.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

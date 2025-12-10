import { PokemonList } from './components/PokemonList.mjs';
import { SearchBar } from './searchModule.js';
import { FilterDropdown } from './filterModule.js';

async function init() {
    console.log('Poke-Explorer initialized!');

    const pokemonList = new PokemonList('.pokemon-grid');
    
    const searchBar = new SearchBar('#search-container', (query) => {
        pokemonList.searchByName(query);
    });
    searchBar.init();

    const filterDropdown = new FilterDropdown('#filter-container', (type) => {
        pokemonList.filterByType(type);
    });
    await filterDropdown.init();

    await pokemonList.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

import { PokemonList } from './components/PokemonList.mjs';

function init() {
    console.log('Poke-Explorer initialized!');

    const pokemonList = new PokemonList('.pokemon-grid');
    pokemonList.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

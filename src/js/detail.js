import { PokemonDetail } from './components/PokemonDetail.mjs';

function init() {
    console.log('Pokemon Detail page initialized');

    const detail = new PokemonDetail('#pokemon-detail');
    detail.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

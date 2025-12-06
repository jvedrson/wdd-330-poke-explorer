import { getPokemonList } from '../pokemonData.js';
import { createPokemonCard } from './PokemonCard.mjs';
import { showLoading, showError } from '../utilities.js';

export class PokemonList {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.pokemonData = [];
        this.limit = 20;
        this.offset = 0;
    }

    async init() {
        try {
            showLoading(this.container);
            await this.loadPokemon();
            this.render();
        } catch (error) {
            console.error('Error initializing Pokemon list:', error);
            showError(this.container, 'Failed to load Pokemon. Please try again later.');
        }
    }

    async loadPokemon() {
        try {
            this.pokemonData = await getPokemonList(this.limit, this.offset);
        } catch (error) {
            console.error('Error loading Pokemon:', error);
            throw error;
        }
    }

    render() {
        this.container.innerHTML = '';

        this.pokemonData.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            this.container.appendChild(card);
        });
    }

    filterByType(type) {
        console.log('Filter by type:', type);
    }

    searchByName(query) {
        console.log('Search by name:', query);
    }
}

import { getPokemonList } from '../pokemonData.js';
import { createPokemonCard } from './PokemonCard.mjs';
import { showLoading, showError } from '../utilities.js';

export class PokemonList {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.allPokemon = [];
        this.filteredPokemon = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.searchQuery = '';
        this.selectedType = '';
        this.paginationContainer = document.querySelector('#pagination-container');
    }

    async init() {
        try {
            showLoading(this.container);
            await this.loadAllPokemon();
            this.applyFilters();
        } catch (error) {
            console.error('Error initializing Pokemon list:', error);
            showError(this.container, 'Failed to load Pokemon. Please try again later.');
        }
    }

    async loadAllPokemon() {
        try {
            this.allPokemon = await getPokemonList(200, 0);
        } catch (error) {
            console.error('Error loading Pokemon:', error);
            throw error;
        }
    }

    applyFilters() {
        this.filteredPokemon = this.allPokemon.filter(pokemon => {
            const matchesSearch = this.matchesSearch(pokemon);
            const matchesType = this.matchesType(pokemon);
            return matchesSearch && matchesType;
        });

        this.currentPage = 1;
        this.render();
        this.renderPagination();
    }

    matchesSearch(pokemon) {
        if (!this.searchQuery) return true;
        
        const query = this.searchQuery.toLowerCase();
        const name = pokemon.name.toLowerCase();
        const id = pokemon.id.toString();
        
        return name.includes(query) || id.includes(query);
    }

    matchesType(pokemon) {
        if (!this.selectedType) return true;
        
        return pokemon.types.some(type => type.type.name === this.selectedType);
    }

    getCurrentPageData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredPokemon.slice(start, end);
    }

    render() {
        this.container.innerHTML = '';

        if (this.filteredPokemon.length === 0) {
            this.container.innerHTML = '<p class="no-results">No Pokemon found.</p>';
            return;
        }

        const pageData = this.getCurrentPageData();
        pageData.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            this.container.appendChild(card);
        });
    }

    renderPagination() {
        if (!this.paginationContainer) return;

        const totalPages = Math.ceil(this.filteredPokemon.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        this.paginationContainer.innerHTML = `
            <div class="pagination">
                <button class="pagination-btn" id="prev-page" ${this.currentPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
                <span class="pagination-info">
                    Page ${this.currentPage} of ${totalPages}
                </span>
                <button class="pagination-btn" id="next-page" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.render();
                    this.renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.render();
                    this.renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    filterByType(type) {
        this.selectedType = type;
        this.applyFilters();
    }

    searchByName(query) {
        this.searchQuery = query;
        this.applyFilters();
    }
}

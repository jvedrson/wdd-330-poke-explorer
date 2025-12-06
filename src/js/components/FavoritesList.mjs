import { getFavorites, removeFavorite } from '../utilities.js';

export class FavoritesList {
    constructor(containerId) {
        this.container = document.querySelector(containerId);
        this.emptyState = document.querySelector('#empty-state');
        this.favorites = [];
    }

    init() {
        this.loadFavorites();
        this.render();
    }

    loadFavorites() {
        this.favorites = getFavorites();
    }

    render() {
        if (this.favorites.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.container.innerHTML = '';

        this.favorites.forEach(pokemon => {
            const card = this.createFavoriteCard(pokemon);
            this.container.appendChild(card);
        });
    }

    createFavoriteCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card favorite-card';
        card.dataset.pokemonId = pokemon.id;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-number">#${String(pokemon.id).padStart(3, '0')}</span>
                <button class="remove-favorite-btn" data-id="${pokemon.id}">❌</button>
            </div>
            <div class="card-image-container">
                <img 
                    src="${pokemon.sprite}" 
                    alt="${pokemon.name}"
                    class="card-image"
                >
            </div>
            <h3 class="card-name">${pokemon.name}</h3>
            <div class="card-types">
                ${pokemon.types.map(type =>
            `<span class="type-badge type-${type}">${type}</span>`
        ).join('')}
            </div>
        `;

        card.querySelector('.card-image-container').addEventListener('click', () => {
            window.location.href = `./detail.html?id=${pokemon.id}`;
        });

        card.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRemove(pokemon.id);
        });

        return card;
    }

    handleRemove(id) {
        removeFavorite(id);
        this.loadFavorites();
        this.render();
    }

    showEmptyState() {
        this.container.classList.add('hidden');
        this.emptyState.classList.remove('hidden');
    }

    hideEmptyState() {
        this.container.classList.remove('hidden');
        this.emptyState.classList.add('hidden');
    }
}

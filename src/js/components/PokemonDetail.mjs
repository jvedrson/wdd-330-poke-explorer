import { getPokemonById, getPokemonSpecies, getEvolutionChain } from '../pokemonData.js';
import { formatPokemonId, getPokemonSprite, showLoading, showError, toggleFavorite, isFavorite, saveLastViewed } from '../utilities.js';
import { searchPokemonImages } from '../imageService.js';

export class PokemonDetail {
    constructor(containerId) {
        this.container = document.querySelector(containerId);
        this.pokemon = null;
        this.pokemonId = this.getPokemonIdFromUrl();
        this.evolutionChain = null;
        this.gallery = [];
        this.currentImageIndex = 0;
    }

    getPokemonIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async init() {
        if (!this.pokemonId) {
            showError(this.container, 'No Pokemon ID provided');
            return;
        }

        try {
            showLoading(this.container);
            this.pokemon = await getPokemonById(this.pokemonId);

            await Promise.all([
                this.loadEvolutionChain(),
                this.loadGallery()
            ]);

            this.render();
            saveLastViewed(this.pokemon);
        } catch (error) {
            console.error('Error loading Pokemon details:', error);
            showError(this.container, 'Failed to load Pokemon details');
        }
    }

    async loadEvolutionChain() {
        try {
            const species = await getPokemonSpecies(this.pokemonId);
            const evolutionData = await getEvolutionChain(species.evolution_chain.url);
            this.evolutionChain = this.parseEvolutionChain(evolutionData.chain);
        } catch (error) {
            console.error('Error loading evolution chain:', error);
            this.evolutionChain = null;
        }
    }

    async loadGallery() {
        try {
            this.gallery = await searchPokemonImages(this.pokemon.name, 16);
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.gallery = [];
        }
    }

    parseEvolutionChain(chain) {
        const evolutions = [];
        let current = chain;

        while (current) {
            const id = current.species.url.split('/').filter(Boolean).pop();
            evolutions.push({
                name: current.species.name,
                id: parseInt(id)
            });
            current = current.evolves_to[0];
        }

        return evolutions;
    }

    render() {
        const sprite = getPokemonSprite(this.pokemon);
        const isFav = isFavorite(this.pokemon.id);

        this.container.innerHTML = `
            <div class="detail-card">
                <div class="detail-header">
                    <div class="detail-title-section">
                        <h1 class="detail-name">${this.pokemon.name}</h1>
                        <span class="detail-number">${formatPokemonId(this.pokemon.id)}</span>
                    </div>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" id="favorite-btn">
                        <img src="${isFav ? './public/images/heart-fill.svg' : './public/images/heart.svg'}" alt="Favorite" class="heart-icon">
                    </button>
                </div>
                
                <div class="detail-image-container">
                    <img src="${sprite}" alt="${this.pokemon.name}" class="detail-image">
                </div>
                
                <div class="detail-types">
                    ${this.renderTypes()}
                </div>
                
                <div class="detail-info">
                    <div class="info-item">
                        <span class="info-label">Height</span>
                        <span class="info-value">${this.pokemon.height / 10} m</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Weight</span>
                        <span class="info-value">${this.pokemon.weight / 10} kg</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3 class="section-title">Abilities</h3>
                    <div class="abilities-list">
                        ${this.renderAbilities()}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3 class="section-title">Stats</h3>
                    <div class="stats-list">
                        ${this.renderStats()}
                    </div>
                </div>
                
                ${this.evolutionChain && this.evolutionChain.length > 1 ? `
                    <div class="detail-section">
                        <h3 class="section-title">Evolution Chain</h3>
                        <div class="evolution-chain">
                            ${this.renderEvolutionChain()}
                        </div>
                    </div>
                ` : ''}
                
                ${this.gallery && this.gallery.length > 0 ? `
                    <div class="detail-section">
                        <h3 class="section-title">Gallery</h3>
                        ${this.renderGallery()}
                    </div>
                ` : ''}
            </div>
        `;

        this.setupFavoriteButton();
        if (this.gallery && this.gallery.length > 0) {
            this.setupGallery();
        }
    }

    renderTypes() {
        return this.pokemon.types
            .map(typeInfo => {
                const typeName = typeInfo.type.name;
                return `<span class="type-badge type-${typeName}">${typeName}</span>`;
            })
            .join('');
    }

    renderAbilities() {
        return this.pokemon.abilities
            .map(abilityInfo => {
                const abilityName = abilityInfo.ability.name.replace('-', ' ');
                return `<span class="ability-badge">${abilityName}</span>`;
            })
            .join('');
    }

    renderStats() {
        const maxStatValue = 255;
        return this.pokemon.stats
            .map(statInfo => {
                const statName = this.formatStatName(statInfo.stat.name);
                const statValue = statInfo.base_stat;
                const percentage = (statValue / maxStatValue) * 100;

                return `
                    <div class="stat-item">
                        <div class="stat-info">
                            <span class="stat-name">${statName}</span>
                            <span class="stat-value">${statValue}</span>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    renderEvolutionChain() {
        return this.evolutionChain
            .map((evo, index) => `
                <div class="evolution-item">
                    <div class="evolution-card" onclick="window.location.href='./detail.html?id=${evo.id}'">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png" 
                             alt="${evo.name}" 
                             class="evolution-image">
                        <span class="evolution-name">${evo.name}</span>
                        <span class="evolution-number">${formatPokemonId(evo.id)}</span>
                    </div>
                    ${index < this.evolutionChain.length - 1 ? '<span class="evolution-arrow">→</span>' : ''}
                </div>
            `)
            .join('');
    }

    renderGallery() {
        const currentImage = this.gallery[this.currentImageIndex];
        return `
            <div class="gallery-carousel">
                <div class="gallery-main">
                    <button class="gallery-btn gallery-btn-prev" id="gallery-prev">‹</button>
                    <div class="gallery-main-image-container">
                        <img src="${currentImage.url}" alt="${currentImage.alt}" class="gallery-main-image" id="gallery-main-img">
                        <div class="gallery-credit">
                            Photo by ${currentImage.photographer} from DeviantArt. 
                            <a class="gallery-credit-link" href="${currentImage.url}" target="_blank">Open Image</a>
                        </div>
                    </div>
                    <button class="gallery-btn gallery-btn-next" id="gallery-next">›</button>
                </div>
                <div class="gallery-thumbnails">
                    ${this.gallery.map((image, index) => `
                        <div class="gallery-thumb ${index === this.currentImageIndex ? 'active' : ''}" data-index="${index}">
                            <img src="${image.thumb}" alt="${image.alt}" class="gallery-thumb-img">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupGallery() {
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        const thumbnails = document.querySelectorAll('.gallery-thumb');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevImage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                this.goToImage(index);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.gallery.length) % this.gallery.length;
        this.updateGallery();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.gallery.length;
        this.updateGallery();
    }

    goToImage(index) {
        this.currentImageIndex = index;
        this.updateGallery();
    }

    updateGallery() {
        const currentImage = this.gallery[this.currentImageIndex];
        const mainImg = document.getElementById('gallery-main-img');
        const credit = document.querySelector('.gallery-credit');
        const thumbnails = document.querySelectorAll('.gallery-thumb');

        if (mainImg) {
            mainImg.src = currentImage.url;
            mainImg.alt = currentImage.alt;
        }

        if (credit) {
            credit.innerHTML = `Photo by ${currentImage.photographer} from DeviantArt. <a class="gallery-credit-link" href="${currentImage.url}" target="_blank">Open Image</a>`;
        }

        thumbnails.forEach((thumb, index) => {
            if (index === this.currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    formatStatName(name) {
        const names = {
            'hp': 'HP',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Sp. Atk',
            'special-defense': 'Sp. Def',
            'speed': 'Speed'
        };
        return names[name] || name;
    }

    setupFavoriteButton() {
        const btn = document.getElementById('favorite-btn');
        if (btn) {
            btn.addEventListener('click', () => this.handleFavoriteClick());
        }
    }

    handleFavoriteClick() {
        const result = toggleFavorite(this.pokemon);
        const btn = document.getElementById('favorite-btn');
        const heartIcon = btn.querySelector('.heart-icon');

        if (result.action === 'added') {
            btn.classList.add('active');
            heartIcon.src = './public/images/heart-fill.svg';
        } else {
            btn.classList.remove('active');
            heartIcon.src = './public/images/heart.svg';
        }
    }
}

import { getPokemonTypes } from './pokemonData.js';

export class FilterDropdown {
    constructor(containerId, onFilter) {
        this.container = document.querySelector(containerId);
        this.onFilter = onFilter;
        this.types = [];
        this.selectedType = '';
    }

    async init() {
        await this.loadTypes();
        this.render();
        this.setupEvents();
    }

    async loadTypes() {
        try {
            this.types = await getPokemonTypes();
        } catch (error) {
            console.error('Error loading types:', error);
            this.types = [];
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="filter-container">
                <label class="filter-label">Filter by type:</label>
                <div class="filter-buttons">
                    <button class="filter-button filter-button-all ${this.selectedType === '' ? 'active' : ''}" data-type="">
                        All
                    </button>
                    ${this.types.map(type =>
            `<button class="filter-button filter-button-type-${type.name} ${this.selectedType === type.name ? 'active' : ''}" data-type="${type.name}">
                ${this.capitalize(type.name)}
            </button>`
        ).join('')}
                </div>
            </div>
        `;
    }

    setupEvents() {
        const buttons = this.container.querySelectorAll('.filter-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.getAttribute('data-type');
                this.selectedType = type;
                this.render();
                this.setupEvents();
                this.onFilter(type);
            });
        });
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

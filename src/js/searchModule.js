export class SearchBar {
    constructor(containerId, onSearch) {
        this.container = document.querySelector(containerId);
        this.onSearch = onSearch;
        this.searchInput = null;
    }

    init() {
        this.render();
        this.setupEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="search-container">
                <input 
                    type="text" 
                    id="pokemon-search" 
                    class="search-input" 
                    placeholder="Search pokemon"
                    autocomplete="off"
                >
                <button class="search-clear hidden" id="search-clear">✕</button>
            </div>
        `;

        this.searchInput = document.getElementById('pokemon-search');
        this.clearButton = document.getElementById('search-clear');
    }

    setupEvents() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (query) {
                this.clearButton.classList.remove('hidden');
            } else {
                this.clearButton.classList.add('hidden');
            }

            this.onSearch(query);
        });

        this.clearButton.addEventListener('click', () => {
            this.searchInput.value = '';
            this.clearButton.classList.add('hidden');
            this.onSearch('');
        });
    }

    getValue() {
        return this.searchInput ? this.searchInput.value.trim() : '';
    }
}

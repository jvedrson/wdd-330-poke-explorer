export function formatPokemonId(id) {
    return `#${String(id).padStart(3, '0')}`;
}

export function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getTypeColor(type) {
    const typeColors = {
        normal: 'var(--type-normal)',
        fire: 'var(--type-fire)',
        water: 'var(--type-water)',
        electric: 'var(--type-electric)',
        grass: 'var(--type-grass)',
        ice: 'var(--type-ice)',
        fighting: 'var(--type-fighting)',
        poison: 'var(--type-poison)',
        ground: 'var(--type-ground)',
        flying: 'var(--type-flying)',
        psychic: 'var(--type-psychic)',
        bug: 'var(--type-bug)',
        rock: 'var(--type-rock)',
        ghost: 'var(--type-ghost)',
        dragon: 'var(--type-dragon)',
        dark: 'var(--type-dark)',
        steel: 'var(--type-steel)',
        fairy: 'var(--type-fairy)'
    };

    return typeColors[type.toLowerCase()] || 'var(--type-normal)';
}

export function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading Pokemon...</p>
        </div>
    `;
}

export function hideLoading(container) {
    const loading = container.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

export function showError(container, message = 'An error occurred') {
    container.innerHTML = `
        <div class="error">
            <h3 class="error-title">Oops! Something went wrong</h3>
            <p>${message}</p>
        </div>
    `;
}

export function getPokemonSprite(pokemon) {
    return pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default ||
        'https://via.placeholder.com/150?text=No+Image';
}

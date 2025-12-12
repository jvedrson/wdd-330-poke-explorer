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

const FAVORITES_KEY = 'pokemonFavorites';

export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

export function addFavorite(pokemon) {
    const favorites = getFavorites();

    const exists = favorites.find(fav => fav.id === pokemon.id);
    if (exists) {
        return favorites;
    }

    const favoriteData = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(t => t.type.name)
    };

    favorites.push(favoriteData);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    return favorites;
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));

    return filtered;
}

export function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === id);
}

export function toggleFavorite(pokemon) {
    if (isFavorite(pokemon.id)) {
        return { action: 'removed', favorites: removeFavorite(pokemon.id) };
    } else {
        return { action: 'added', favorites: addFavorite(pokemon) };
    }
}

import { formatPokemonId, getPokemonSprite } from '../utils/helpers.mjs';

export function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.dataset.pokemonId = pokemon.id;

  const sprite = getPokemonSprite(pokemon);

  card.innerHTML = `
        <div class="card-header">
            <span class="card-number">${formatPokemonId(pokemon.id)}</span>
        </div>
        <div class="card-image-container">
            <img 
                src="${sprite}" 
                alt="${pokemon.name}"
                class="card-image"
                loading="lazy"
            >
        </div>
        <h3 class="card-name">${pokemon.name}</h3>
        <div class="card-types">
            ${createTypeBadges(pokemon.types)}
        </div>
    `;

  card.addEventListener('click', () => handleCardClick(pokemon));

  return card;
}

function createTypeBadges(types) {
  return types
    .map(typeInfo => {
      const typeName = typeInfo.type.name;
      return `<span class="type-badge type-${typeName}">${typeName}</span>`;
    })
    .join('');
}

function handleCardClick(pokemon) {
  console.log('Pokemon clicked:', pokemon.name);
  // TODO: detail page coming soon
  alert(`${pokemon.name} details coming soon!`);
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const pokemonPromises = data.results.map(pokemon => getPokemonByUrl(pokemon.url));
        const pokemonDetails = await Promise.all(pokemonPromises);

        return pokemonDetails;
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        throw error;
    }
}

async function getPokemonByUrl(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        throw error;
    }
}

export async function getPokemonById(id) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokemon by ID:', error);
        throw error;
    }
}

export async function getPokemonByName(name) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokemon by name:', error);
        throw error;
    }
}

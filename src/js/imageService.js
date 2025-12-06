const DEVIANTART_CLIENT_ID = import.meta.env.VITE_DEVIANTART_CLIENT_ID;
const DEVIANTART_CLIENT_SECRET = import.meta.env.VITE_DEVIANTART_CLIENT_SECRET;
const DEVIANTART_PROXY_BASE = '/api/deviantart';

let currentAccessToken = {
    token: null,
    expiresAt: null
};

async function getDeviantArtToken() {
    if (currentAccessToken.token && currentAccessToken.expiresAt && Date.now() < currentAccessToken.expiresAt) {
        return currentAccessToken.token;
    }

    try {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_id', DEVIANTART_CLIENT_ID);
        formData.append('client_secret', DEVIANTART_CLIENT_SECRET);

        const response = await fetch(`${DEVIANTART_PROXY_BASE}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized: Please check your DeviantArt API credentials');
            } else if (response.status === 400) {
                console.error('Bad Request: Invalid client credentials or grant type');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const expiresIn = (data.expires_in || 3600) * 1000;
        currentAccessToken = {
            token: data.access_token,
            expiresAt: Date.now() + expiresIn - 60000
        };

        return data.access_token;
    } catch (error) {
        console.error('Error fetching DeviantArt token:', error);
        currentAccessToken = { token: null, expiresAt: null };
        throw error;
    }
}

async function deviantArtRequest(endpoint, params = null) {
    const token = await getDeviantArtToken();
    
    const finalParams = new URLSearchParams(params || '');
    finalParams.append('access_token', token);
    
    const proxyUrl = `${DEVIANTART_PROXY_BASE}/${endpoint}?${finalParams.toString()}`;
    
    const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });
    
    if (!response.ok && response.status === 401) {
        currentAccessToken = { token: null, expiresAt: null };
    }
    
    return response;
}

export async function searchPokemonImages(pokemonName, count = 3) {
    try {
        const params = new URLSearchParams({
            tag: pokemonName.toLowerCase(),
            limit: count,
            mature_content: 'false'
        });

        const response = await deviantArtRequest('browse/tags', params);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            console.warn(`No images found for ${pokemonName}`);
            return [];
        }

        return data.results
            .filter(deviation => deviation.content && deviation.content.src)
            .slice(0, count)
            .map((deviation) => 
                ({
                    id: deviation.deviationid,
                    url: deviation.content.src || deviation.thumbs?.[-1]?.src || '',
                    thumb: deviation.thumbs?.[-1]?.src || deviation.content.src || '', // Should be the last thumb because the first is the smallest
                    alt: deviation.title || `${pokemonName} image`,
                    photographer: deviation.author?.username || 'Unknown',
                    photographerUrl: deviation.author?.usericon || `https://www.deviantart.com/${deviation.author?.username}`
                })
            );
    } catch (error) {
        console.error('Error fetching DeviantArt images:', error);
        return [];
    }
}

export async function getRandomPokemonImage() {
    try {
        const params = new URLSearchParams({
            tag: 'pokemon',
            limit: 1,
            mature_content: 'false'
        });

        const response = await deviantArtRequest('browse/tags', params);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }

        const deviation = data.results[0];
        return {
            id: deviation.deviationid,
            url: deviation.content.src || deviation.thumbs?.[-1]?.src || '',
            thumb: deviation.thumbs?.[-1]?.src || deviation.content.src || '', // Should be the last thumb because the first is the smallest
            alt: deviation.title || 'Pokemon image',
            photographer: deviation.author?.username || 'Unknown',
            photographerUrl: deviation.author?.usericon || `https://www.deviantart.com/${deviation.author?.username}`
        };
    } catch (error) {
        console.error('Error fetching random DeviantArt image:', error);
        return null;
    }
}

export async function getPokemonHeroImage() {
    try {
        const params = new URLSearchParams({
            tag: 'pokemon',
            limit: 1,
            mature_content: 'false'
        });

        const response = await deviantArtRequest('browse/tags', params);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }

        const deviation = data.results[0];
        return {
            id: deviation.deviationid,
            url: deviation.content.src || deviation.thumbs?.[-1]?.src || '',
            regular: deviation.content.src || deviation.thumbs?.[-1]?.src || '', // Should be the last thumb because the first is the smallest
            alt: deviation.title || 'Pokemon hero image',
            photographer: deviation.author?.username || 'Unknown',
            photographerUrl: deviation.author?.usericon || `https://www.deviantart.com/${deviation.author?.username}`
        };
    } catch (error) {
        console.error('Error fetching hero image:', error);
        return null;
    }
}

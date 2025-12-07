/*
    This function is a proxy for the DeviantArt API.
    It is used to bypass the CORS policy of the DeviantArt API.
    
    Documentation: 
    - https://www.deviantart.com/developers/api
    - https://www.deviantart.com/developers/oauth2

    Netlify Functions Documentation:
    - https://docs.netlify.com/functions/overview/
    - https://docs.netlify.com/build/functions/get-started/?data-tab=JavaScript
    - https://docs.netlify.com/build/functions/optional-configuration/?data-tab=JavaScript#directory
*/

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Remove the function path prefix that is added by Netlify
    // Path can be either /.netlify/functions/deviantart/xxx or /api/deviantart/xxx (from redirect)
    let path = event.path;

    if (path.startsWith('/.netlify/functions/deviantart')) {
        path = path.replace('/.netlify/functions/deviantart', '');
    } else if (path.startsWith('/api/deviantart')) {
        path = path.replace('/api/deviantart', '');
    }

    if (!path || path === '') {
        path = '/';
    }

    console.log('Original path:', event.path);
    console.log('Processed path:', path);
    console.log('Method:', event.httpMethod);

    // Use the correct DeviantArt API base URL
    // For OAuth2 token endpoint, use www.deviantart.com
    // For API endpoints (browse, etc), use www.deviantart.com/api/v1/oauth2
    let baseUrl;
    if (path.startsWith('/oauth2/token')) {
        baseUrl = 'https://www.deviantart.com';
    } else {
        baseUrl = 'https://www.deviantart.com/api/v1/oauth2';
    }

    const url = `${baseUrl}${path}`;


    try {
        const options = {
            method: event.httpMethod,
            headers: { 'Accept': 'application/json' },
        };

        // Handle POST requests
        if (event.httpMethod === 'POST' && event.body) {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.body = event.body;
        }

        let fullUrl = url;

        // Handle GET requests with query parameters
        if (event.httpMethod === 'GET' && event.queryStringParameters) {
            const params = new URLSearchParams(event.queryStringParameters);
            fullUrl = `${url}?${params}`;
        }

        console.log('Fetching URL:', fullUrl);
        const response = await fetch(fullUrl, options);

        // Get response as text first
        const text = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text (first 200 chars):', text.substring(0, 200));

        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // If parsing fails, return the text as error
            console.error('JSON parse error:', e.message);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Invalid response from DeviantArt',
                    details: text.substring(0, 500)
                }),
            };
        }

        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

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

    const url = `https://www.deviantart.com${path}`;

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

        // Handle GET requests
        if (event.httpMethod === 'GET' && event.queryStringParameters) {
            const params = new URLSearchParams(event.queryStringParameters);
            const fullUrl = `${url}?${params}`;
            const response = await fetch(fullUrl, options);
            const data = await response.json();

            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify(data),
            };
        }

        const response = await fetch(url, options);
        const data = await response.json();

        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

# Poke-Explorer

**WDD 330 Final Project**  
**Author:** Ederson Villalba  
**Course:** Web Frontend Development II

## Project Description

Poke-Explorer is an interactive web application that allows users to explore detailed information about Pokémon using the PokéAPI. The application features a modern, responsive design with a clean interface optimized for learning and demonstration purposes.


## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **JavaScript (ES6+)** - Vanilla JavaScript modules
- **Vite** - Build tool and dev server
- **PokéAPI** - Pokemon data source
- **DeviantArt** - Explorer images art (Pokemon)

## Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

This project uses the DeviantArt API for Pokemon images. You need to set up API credentials:

1. Create a `.env` file in the root directory
2. Get your DeviantArt API credentials from [DeviantArt Developers](https://www.deviantart.com/developers/)
3. Create a new application to get your Client ID and Client Secret
4. Add the following to your `.env` file:
   ```
   VITE_DEVIANTART_CLIENT_ID=your_client_id_here
   VITE_DEVIANTART_CLIENT_SECRET=your_client_secret_here
   ```
5. Replace `your_client_id_here` and `your_client_secret_here` with your actual DeviantArt credentials

**Note:** The `.env` file is gitignored and should not be committed to version control.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Reference

This project uses the following APIs:

### PokéAPI
- **Base URL:** `https://pokeapi.co/api/v2/`
- **Endpoints used:**
  - `/pokemon?limit=20&offset=0` - Get list of Pokémon
  - `/pokemon/{id}` - Get specific Pokémon details

### DeviantArt API
- **Base URL:** `https://www.deviantart.com/api/v1/oauth2`
- Used for fetching Pokemon-related images from DeviantArt
- **Endpoints used:**
  - `/oauth2/token` - Get access token (OAuth2 client credentials)
  - `/browse/tags` - Search for images by tag
- Requires Client ID and Client Secret (see Environment Setup above)
- The API uses OAuth2 client credentials flow for authentication

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

## Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Reference

This project uses the [PokéAPI](https://pokeapi.co/):
- **Base URL:** `https://pokeapi.co/api/v2/`
- **Endpoints used:**
  - `/pokemon?limit=20&offset=0` - Get list of Pokémon
  - `/pokemon/{id}` - Get specific Pokémon details

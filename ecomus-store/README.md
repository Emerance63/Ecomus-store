# Ecomus Store

A modern React + Vite storefront with authentication, product browsing, cart management, and dark mode support.

## Features

- User registration and login with token-based auth
- Protected routes for cart and profile
- Product listing with search, category filters, sorting, and pagination
- Product detail view with add-to-cart and buy-now flows
- Cart management with quantity updates and checkout feedback
- Dark mode toggle and responsive styling

## State Management

This app uses React Context for auth and cart state. The choice keeps the project lightweight while avoiding unnecessary dependencies for the current scope.

## API Layer

All API calls are centralized in the services and axios layer. The base URL is loaded from the environment variable VITE_API_BASE_URL.

## Setup

1. Install dependencies with npm install
2. Create a .env file with:
   VITE_API_BASE_URL=your_api_base_url
3. Start the dev server with npm run dev

## Notes

- Checkout uses the available order endpoint when present; if the endpoint is not available, the UI still provides a graceful fallback experience.
- Cart data is persisted locally in the browser so the cart remains available across refreshes.

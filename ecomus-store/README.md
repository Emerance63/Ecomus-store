# Ecomus Store

A modern e-commerce storefront built with React and Vite, featuring user authentication, product browsing, shopping cart management, and dark mode support.

## Project Overview

Ecomus Store is a fully functional e-commerce frontend application designed to provide a seamless shopping experience. The application allows users to browse products, manage their shopping cart, and complete purchases through a streamlined checkout process. The project emphasizes responsive design, accessibility, and user experience with features like dark mode and smooth navigation.

### Key Features

- User registration and login with token-based authentication
- Protected routes for authenticated pages (cart, profile)
- Product listing with search, category filters, sorting, and pagination
- Product detail view with add-to-cart and buy-now flows
- Shopping cart management with quantity updates and persistent storage
- Dark mode toggle with system preference detection
- Responsive design optimized for mobile, tablet, and desktop
- Real-time cart count updates in the navigation

## Tech Stack

### Frontend Framework
- **React 18** - UI library for building component-based interfaces
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation

### Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Icon library for consistent iconography

### State Management
- **React Context API** - Lightweight state management for auth and cart state
- **useState/useEffect** - React hooks for local component state

### HTTP Client
- **Axios** - Promise-based HTTP client for API requests with interceptors

### Additional Tools
- **React Router DOM** - Routing library for navigation
- **Local Storage** - Client-side persistence for cart and theme preferences

## Setup and Run Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- A backend API server (or use the provided mock/demo mode)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecomus-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following:
   ```env
   VITE_API_BASE_URL=your_api_base_url_here
   ```
   
   Example:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.


### Notes on Environment Variables
- All environment variables must be prefixed with `VITE_` to be accessible in the browser
- The API base URL is used by the Axios instance configured in `src/api/axios.js`
- Without this variable, API calls will fail and the application may not function correctly

## Key Decisions and Assumptions

### Architecture Decisions

1. **React Context over Redux/Zustand**
   - Decision: Use React Context API for state management
   - Reasoning: The application's state management needs are relatively simple (auth token and cart items). Adding Redux or Zustand would introduce unnecessary complexity and bundle size for the current scope.

2. **Client-Side Routing with React Router**
   - Decision: Implement React Router for navigation
   - Reasoning: Provides a smooth single-page application experience with URL-based routing, enabling browser back/forward navigation and shareable links.

3. **Tailwind CSS for Styling**
   - Decision: Use Tailwind CSS utility classes
   - Reasoning: Accelerates development with pre-built utility classes, ensures design consistency, and reduces the need for custom CSS files. The utility-first approach makes responsive design implementation straightforward.

4. **Axios with Interceptors**
   - Decision: Centralize API calls with Axios and request/response interceptors
   - Reasoning: Provides a single place to handle authentication tokens, error handling, and request/response transformation. Makes it easy to update API configuration across the entire application.

5. **Local Storage for Cart Persistence**
   - Decision: Persist cart data in browser's local storage
   - Reasoning: Allows users to maintain their cart across browser sessions without requiring a backend database. Provides a better user experience for guest users.

6. **Dark Mode with System Preference Detection**
   - Decision: Implement dark mode with localStorage and system preference detection
   - Reasoning: Respects user's system preferences by default while allowing manual override. Persists the user's choice across sessions.

### Assumptions

1. **Backend API Availability**
   - The application assumes a RESTful API backend is available at the configured `VITE_API_BASE_URL`
   - API endpoints follow the structure: `/auth`, `/products`, `/cart`, `/orders`

2. **Authentication Flow**
   - JWT-based authentication with tokens stored in Context
   - Protected routes redirect unauthenticated users to login
   - Token is included in Authorization header for authenticated requests

3. **Product Data Structure**
   - Products have standard e-commerce attributes: id, name, price, image, description, category, etc.
   - Images are served from a CDN or static file server

4. **Browser Support**
   - Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)
   - Local Storage API availability for cart persistence

5. **Responsive Breakpoints**
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px

## Known Limitations

### Current Limitations

1. **No Backend Integration**
   - The application requires a backend API to function fully. Without a backend, authentication, product loading, and cart operations will not work.
   - Currently, the app is designed to work with a specific API structure and will need adjustments for different backend implementations.

2. **Limited Error Handling**
   - While basic error handling exists, the application could benefit from more comprehensive error messages and retry mechanisms for failed API calls.
   - Network errors are not always user-friendly and could be improved with better error boundaries.

3. **No Image Optimization**
   - Product images are loaded as-is without lazy loading, responsive images, or optimization
   - Large images may slow down page load times, especially on mobile devices

4. **Cart Quantity Validation**
   - The cart does not validate against available product inventory
   - Users can add items beyond available stock (would need backend validation)

5. **No Payment Integration**
   - The checkout process is a UI simulation only
   - No actual payment processing or integration with payment gateways (Stripe, PayPal, etc.)

6. **Limited Search Capabilities**
   - Search is performed client-side and may not scale well with large product catalogs
   - No fuzzy search or advanced filtering options

7. **No Product Reviews/Ratings**
   - The current product detail view does not include customer reviews or ratings
   - Would require additional backend endpoints and database schema

8. **No Wishlist/Favorites**
   - Users cannot save products to a wishlist for later
   - This feature would require additional state management and backend support

9. **No Order History**
   - While orders can be placed, there's no dedicated order history page
   - Users cannot view past orders or track order status

10. **Accessibility Improvements Needed**
    - While basic accessibility is considered (aria-labels, semantic HTML), comprehensive WCAG compliance has not been fully tested
    - Keyboard navigation could be improved in some areas



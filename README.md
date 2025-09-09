# Alice's Antiques - Full-Stack E-Commerce Application

This is a solution to the Portfolio Project: E-Commerce App for Codecademy's Full-Stack Engineer path.

A complete full-stack e-commerce web application built with a Node.js/Express REST API backend and a React frontend. It features user authentication, product management, a shopping cart, a wishlist, and an order checkout process.

## Features

-   **User Authentication**: Secure local (email/password) sign-up and login, plus social sign-in with Google.
-   **Product Catalog**: Browse products by category.
-   **Product Details**: View detailed information for each product.
-   **Shopping Cart**: Add, remove, and change the quantity of items in the cart.
-   **Wishlist**: Save items for later.
-   **Checkout**: A multi-step checkout process to place orders.
-   **Order History**: View past orders.

## Tech Stack

-   **Frontend**:
    -   [React](https://reactjs.org/)
    -   [Vite](https://vitejs.dev/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [Axios](https://axios-http.com/) for API requests
-   **Backend**:
    -   [Node.js](https://nodejs.org/)
    -   [Express.js](https://expressjs.com/)
    -   [PostgreSQL](https://www.postgresql.org/) for the database
    -   [Passport.js](http://www.passportjs.org/) for authentication (Local and Google OIDC strategies)
    -   [express-session](https://www.npmjs.com/package/express-session) for session management

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (v16 or newer recommended)
-   [npm](https://www.npmjs.com/get-npm)
-   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/e-commerce-app-rest-api.git
    cd e-commerce-app-rest-api
    ```

2.  **Backend Setup**
    -   Navigate to the backend directory:
        ```sh
        cd backend
        ```
    -   Install dependencies:
        ```sh
        npm install
        ```
    -   Create a `.env` file in the `backend` directory. Copy the contents of `.env.example` and fill in your credentials.
    -   Set up your PostgreSQL database and run the necessary SQL scripts to create the tables.
    -   Start the backend server:
        ```sh
        node server.js
        ```
        The API will be running on `http://localhost:3000`.

3.  **Frontend Setup**
    -   Navigate to the client directory from the root folder:
        ```sh
        cd ../client
        ```
    -   Install dependencies:
        ```sh
        npm install
        ```
    -   Start the frontend development server:
        ```sh
        npm run dev
        ```
        The application will be running on `http://localhost:5173`.

---

## API Endpoints

Here are some of the main API endpoints available:

### Authentication
-   `POST /login`: Log in a user with email and password.
-   `GET /logout`: Log out the current user.
-   `GET /auth/google`: Initiate Google Sign-In.
-   `GET /auth/check-session`: Check if a user session is active.

### Data
-   `GET /products`: Get all products.
-   `GET /cart/:userEmail`: Get a user's cart items.
-   `POST /cart`: Add an item to the cart.
-   `GET /wishlist/:userEmail`: Get a user's wishlist.

...and more. See `backend/server.js` for the full list of routes.
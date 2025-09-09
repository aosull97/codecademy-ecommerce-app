require("dotenv").config();

const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//Gets cart
const fetchCart = async (request, response) => {
  const { userEmail } = request.params;
  try {
    const results = await pool.query(
      "SELECT id, product, price, img, quantity FROM carts WHERE email=$1 ORDER BY product ASC",
      [userEmail]
    );
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(`Error fetching cart for ${userEmail}:`, error);
    response.status(500).send("Server error");
  }
};

//Adds item to cart
const addToCart = async (request, response) => {
  const { product, price, img, quantity, email } = request.body;
  try {
    await pool.query(
      "INSERT INTO carts (product, price, img, quantity, email ) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (product, email) DO UPDATE SET quantity = carts.quantity + 1 RETURNING *",
      [product, price, img, quantity, email]
    );
    response.status(201).send("Item added to cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    response.status(500).send("Server error");
  }
};

//Removes an item from the cart
const removeCartItem = async (request, response) => {
  const { product, userEmail } = request.params;
  try {
    // The product name from the URL is encoded, so we decode it.
    const decodedProduct = decodeURIComponent(product);
    const result = await pool.query(
      `DELETE FROM carts WHERE product = $1 AND email = $2`,
      [decodedProduct, userEmail]
    );
    if (result.rowCount === 0) {
      return response.status(404).send("Cart item not found.");
    }
    response.status(200).send("Cart item deleted");
  } catch (error) {
    console.error("Error removing cart item:", error);
    response.status(500).send("Server error");
  }
};


//Gets Wishlist
const fetchWishlist = async (request, response) => {
  const { userEmail } = request.params;
  try {
    const results = await pool.query(
      "SELECT id, product, price, img FROM wishlist WHERE email=$1 ORDER BY product ASC",
      [userEmail]
    );
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(`Error fetching wishlist for ${userEmail}:`, error);
    response.status(500).send("Server error");
  }
};

//Adds item to wish list
const addToWishList = async (request, response) => {
  const { product, price, img, email } = request.body;
  try {
    await pool.query(
      "INSERT INTO wishlist (product, price, img, email ) VALUES ($1, $2, $3, $4) ON CONFLICT (product, email) DO NOTHING",
      [product, price, img, email]
    );
    response.status(201).send("Item added to wishlist");
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    response.status(500).send("Server error");
  }
};

//Removes an item from wishlist
const removeWishListItem = async (request, response) => {
  const { product, userEmail } = request.params;
  try {
    const decodedProduct = decodeURIComponent(product);
    const result = await pool.query(
      `DELETE FROM wishlist WHERE product = $1 AND email = $2`,
      [decodedProduct, userEmail]
    );
    if (result.rowCount === 0) {
      return response.status(404).send("Wish list item not found.");
    }
    response.status(200).send("Wish list item deleted");
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    response.status(500).send("Internal Server Error");
  }
};

//Fetch details of specific product
const fetchProductById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const results = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (results.rows.length === 0) {
      return response.status(404).send("Product not found");
    }
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    response.status(500).send("Server error");
  }
};

//Creates a new user
const createUser = async (request, response) => {
  const { email, full_name, password } = request.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const pwd_hash = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (email, full_name, pwd_hash) VALUES ($1, $2, $3) RETURNING *",
      [email, full_name, pwd_hash]
    );
    response.status(201).send(`User added`);
  } catch (error) {
    console.error("Error creating user:", error);
    // Avoid sending detailed error messages to the client in production
    response.status(500).send("Error creating user");
  }
};

//Gets all users
const fetchUsers = async (request, response) => {
  try {
    const results = await pool.query(
      "SELECT id, email, full_name, provider FROM users ORDER BY id ASC"
    );
    response.status(200).json(results.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).send("Server error");
  }
};

// This function is for internal use by Passport. It must not fail for users without a cart.
const getUserById = async (id) => {
  const results = await pool.query(
    "SELECT id, email, full_name, provider FROM users WHERE id = $1",
    [id]
  );
  return results.rows;
};

//Gets a user by their Id
const fetchUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    // This query is now safe and only fetches user data, removing the broken JOIN.
    const results = await pool.query(
      "SELECT id, email, full_name, provider FROM users WHERE id = $1",
      [id]
    );
    if (results.rows.length > 0) {
      response.status(200).json(results.rows);
    } else {
      response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    response.status(500).send("Server error");
  }
};

//Fetches all products and their info
const fetchProducts = async (request, response) => {
  try {
    const results = await pool.query("SELECT * FROM products ORDER BY id");
    response.status(200).json(results.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).send("Server error");
  }
};

//Gets users orders
const fetchOrders = async (request, response) => {
  const { userEmail } = request.params;
  try {
    const results = await pool.query(
      'SELECT id, status, created_at, order_price, "order" FROM orders WHERE email=$1 ORDER BY created_at DESC',
      [userEmail]
    );
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(`Error fetching orders for ${userEmail}:`, error);
    response.status(500).send("Server error");
  }
};

//Creates a new order
const createOrder = (request, response) => {
  const { order_price, order, email } = request.body;

  pool.query(
    'INSERT INTO orders (order_price, "order", email) VALUES ($1, $2, $3) RETURNING *',
    [order_price, order, email],
    (error, results) => {
      if (error) {
        console.error("Error creating order:", error);
        return response.status(500).send("Internal Server Error");
      }
      response.status(201).send(`Order created`);
    }
  );
};

const login = async (email) => {
  const results = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return results.rows;
};

const findOrCreateGoogleUser = async ({
  profileId,
  displayName,
  email,
  provider,
}) => {
  try {
    // 1. Check if user exists via Google provider ID
    let userRes = await pool.query(
      "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
      [provider, profileId]
    );
    let user = userRes.rows[0];

    if (user) {
      // User found, return them
      const { pwd_hash, ...userPayload } = user;
      return userPayload;
    }

    // 2. User not found by provider ID. Check by email.
    userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    user = userRes.rows[0];

    if (user) {
      // User with this email exists. Link their account to Google.
      const updatedUserRes = await pool.query(
        "UPDATE users SET provider = $1, provider_id = $2 WHERE email = $3 RETURNING *",
        [provider, profileId, email]
      );
      user = updatedUserRes.rows[0];
      const { pwd_hash, ...userPayload } = user;
      return userPayload;
    }

    // 3. No user found at all. Create a new one.
    const newUserRes = await pool.query(
      "INSERT INTO users (full_name, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [displayName, email, provider, profileId]
    );
    user = newUserRes.rows[0];
    const { pwd_hash, ...userPayload } = user;
    return userPayload;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  fetchCart,
  addToCart,
  removeCartItem,
  fetchWishlist,
  addToWishList,
  removeWishListItem,
  fetchProductById,
  createUser,
  fetchUsers,
  getUserById,
  fetchUserById,
  fetchProducts,
  fetchOrders,
  createOrder,
  login,
  findOrCreateGoogleUser,
};

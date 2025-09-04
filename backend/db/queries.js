require('dotenv').config();

const {Pool} = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

//Gets cart
const fetchCart = async (request, response) => {
  const { userEmail } = request.params;
  try {
    const results = await pool.query('SELECT product, price, img, quantity FROM carts WHERE email=$1 ORDER BY product ASC', [userEmail]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Adds item to cart
const addToCart = async (request, response) => {
  const { product, price, img, quantity } = request.body;
  const email = request.user.email; // Get email from the authenticated user session
  try {
    await pool.query('INSERT INTO carts (product, price, img, quantity, email ) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (product, email) DO UPDATE SET quantity = carts.quantity + 1', [product, price, img, quantity, email]);
    response.status(201).send(`Item added to cart`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Removes an item from the cart
const removeCartItem = async (request, response) => {
  const { id } = request.params;
  try {
    await pool.query(`DELETE FROM carts WHERE id = $1`, [id]);
    response.status(200).send(`Cart item with id ${id} deleted`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Clears cart
const clearCart = async (request, response) => {
  try {
    await pool.query(`TRUNCATE carts`);
    response.status(200).send('Cart cleared');
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Makes changes to an existing user
const modifyCart = async (request, response) => {
  const { id } = request.params;
  const { quantity } = request.body;
  try {
    await pool.query(`UPDATE carts SET quantity = $2 WHERE id = $1`, [id, quantity]);
    response.status(201).send(`Cart modified with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Gets wishlist
const fetchWishlist = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM wishlist ORDER BY product ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Adds item to wishlist
const addToWishList = async (request, response) => {
  const { product, price, img, user } = request.body;
  try {
    await pool.query('INSERT INTO wishlist (product, price, img, "user") VALUES ($1, $2, $3, $4) ON CONFLICT (product) DO NOTHING', [product, price, img, user]);
    response.status(201).send(`Item added to wishlist`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Fetch details of specific product
const fetchProductById = async (request, response) => {
  const { id } = request.params;
  try {
    const results = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Creates a new user
const createUser = async (request, response) => {
  const { email, full_name, pwd_hash } = request.body;
  try {
    await pool.query('INSERT INTO users (email, full_name, pwd_hash) VALUES ($1, $2, $3) RETURNING *', [email, full_name, pwd_hash]);
    response.status(201).send(`User added`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Gets all users
const fetchUsers = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Gets a user by their email
const fetchUserByEmail = async (request, response) => {
  try {
    const results = await pool.query(`SELECT users.id, email, full_name FROM users WHERE email = $1`);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Gets a user by their Id
const fetchUserById = async (request, response) => {
  const { id } = request.params;
  try {
    const results = await pool.query(`SELECT users.id, email, full_name,
    carts.id AS cart_id FROM users INNER JOIN carts ON users.id = carts.user_id WHERE users.id = $1`);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
    }
}


//Makes changes to an existing user
const modifyUser = async (request, response) => {
  const { id, email, first_name, last_name, address1, address2, postcode, city, country } = request.body;
  try {
    const results = await pool.query(
      'UPDATE users SET email=$2, first_name=$3, last_name=$4, address1=$5, address2=$6, postcode=$7, city=$8, country=$9 WHERE id = $1 RETURNING *',
      [id, email, first_name, last_name, address1, address2, postcode, city, country]
    );
    response.status(200).send(`User modified with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Deletes a user
const removeUser = async (request, response) => {
  const { id } = request.body;
  try {
    await pool.query('UPDATE users SET active = false WHERE id = $1', [id]);
    response.status(200).send(`User with id ${id} has been deactivated`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Fetches all products and their info
const fetchProducts = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM products ORDER BY id');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Creates a new product
const createProduct = async (request, response) => {
  const { name, price, description, category, image_url, status } = request.body;
  try {
    await pool.query('INSERT INTO products (name, price, description, category, image_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, price, description, category, image_url, status]);
    response.status(201).send(`Product added`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Modifies an existing product
const modifyProduct = async (request, response) => {
  const { id, name, price, description, category, image_url, status } = request.body;
  try {
    const results = await pool.query(
      `UPDATE products SET name=$2, price=$3, description=$4, category=$5, image_url=$6, status=$7 WHERE id = $1 RETURNING *`,
      [id, name, price, description, category, image_url, status]
    );
    response.status(200).send(`Product modified with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Removes a single product
const removeProduct = async (request, response) => {
  const { id } = request.body;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    response.status(200).send(`Product with id ${id} deleted`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}


//Gets all orders
const fetchOrders = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM orders');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Fetches an order by it's Id
const fetchOrderById = async (request, response) => {
  const { id } = request.body;
  try {
    const results = await pool.query(`SELECT * FROM orders
    INNER JOIN order_products ON orders.id = order_products.order_id
    INNER JOIN products ON order_products.product_id = products.id
    WHERE orders.id = $1`, [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Adds one product to an order
const createProductInOrder = async (request, response) => {
  const { order_id, product_id, quantity, price } = request.body;
  try {
    await pool.query(`INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *`, [order_id, product_id, quantity, price]);
    response.status(200).send(`${quantity} products with id ${product_id} added to order ${order_id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}


//Fetches all products in a cart for a userId
const fetchCartById = async (request, response) => {
  const { id } = request.body;
  try {
    const results = await pool.query(`SELECT products.id, name, price, description, category, image_url, status, quantity FROM carts
    INNER JOIN cart_products ON carts.id = cart_products.cart_id
    INNER JOIN products ON cart_products.product_id = products.id
    WHERE user_id = $1`, [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Creates record in the carts table for a userId with 1-1 relation
const createCartById = async (request, response) => {
  const { user_id } = request.body;
  try {
    await pool.query(`INSERT INTO carts(user_id) VALUES($1) RETURNING id`, [user_id]);
    response.status(201).send(`Cart record created for user with id: ${user_id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Adds a new product of a given quantity to a cart
const createProductInCart = async (request, response) => {
  const { cart_id, product_id, quantity } = request.body;
  try {
    await pool.query(`INSERT INTO cart_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`, [cart_id, product_id, quantity]);
    response.status(200).send(`${quantity} products with id ${product_id} added to cart ${cart_id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

//Removes a cart (needs to be empty)
const removeCart = async (request, response) => {
  const { user_id } = request.body;
  try {
    await pool.query('DELETE FROM carts WHERE user_id = $1', [user_id]);
    response.status(200).send('Cart deleted');
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}

module.exports = {
  fetchUsers,
  fetchUserById,
  fetchUserByEmail,
  createUser,
  modifyUser,
  removeUser,
  fetchWishlist,
  addToWishList,
  fetchProducts,
  fetchProductById,
  createProduct,
  modifyProduct,
  removeProduct,
  fetchOrders,
  fetchOrderById,
  addToCart,
  createProductInOrder,
  fetchCart,
  fetchCartById,
  clearCart,
  createCartById,
  createProductInCart,
  modifyCart,
  removeCartItem,
  removeCart
}
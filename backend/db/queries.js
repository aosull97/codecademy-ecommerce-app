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
const fetchCart = (request, response) => {
  const {userEmail} = request.params
  pool.query('SELECT id, product, price, img, quantity FROM carts WHERE email=$1 ORDER BY product ASC', [userEmail], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Adds item to cart
const addToCart = (request, response) => {
  const { product, price, img, quantity, email } = request.body;
  pool.query('INSERT INTO carts (product, price, img, quantity, email ) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (product, email) DO UPDATE SET quantity = carts.quantity + 1 RETURNING *', [product, price, img, quantity, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Item added to cart`)
  })
}

//Removes an item from the cart
const removeCartItem = (request, response) => {
  const {product, userEmail} = request.params

  pool.query(`DELETE FROM carts WHERE product = $1 AND email = $2`, [product, userEmail], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).send(`Cart item deleted`)
  })
}

//Clears cart
const clearCart = (request, response) => {
  const {userEmail} = request.params
  pool.query(`DELETE FROM carts WHERE email=$1`, [userEmail], (error, results) => {
      if (error) {
          console.error(`Error deleting ${userEmail}'s cart: `, error);
          return response.status(500).send('Internal Server Error');
      }
      response.status(200).send(`User ${userEmail}'s cart deleted`);
  })
}


//Makes changes to an existing user
const modifyCart = (request, response) => {
  const {id} = request.params
  const {quantity} = request.body

  pool.query(
    `UPDATE carts SET quantity = $2 WHERE id = $1`,
    [id, quantity],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Cart modified with ID: ${id}`)
    }
  )
}

//Gets Wishlist
const fetchWishlist = (request, response) => {
  const {userEmail} = request.params
  pool.query('SELECT product, price, img FROM wishlist WHERE email=$1 ORDER BY product ASC', [userEmail], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Adds item to wish list
const addToWishList = (request, response) => {
  const { product, price, img, email } = request.body;
  pool.query('INSERT INTO wishlist (product, price, img, email ) VALUES ($1, $2, $3, $4) ON CONFLICT (product) DO NOTHING', [product, price, img, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Item added to cart`)
  })
}

//Removes an item from the cart
const removeWishListItem = (request, response) => {
  const {product, userEmail} = request.params

  pool.query(`DELETE FROM wishlist WHERE product = $1 AND email = $2`, [product, userEmail], (error, results) => {
      if (error) {
          console.error('Error deleting wishlist item:', error);
          return response.status(500).send('Internal Server Error');
      }
      if (results.rowCount === 0) {
        return response.status(404).send('Wish list item not found.');
      }
      response.status(200).send(`Wish list item deleted`);
  })
}

//Fetch details of specific product
const fetchProductById = (request, response) => {
  const {id} = request.params

  pool.query(`SELECT * FROM products WHERE id = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//Creates a new user
const createUser = (request, response) => {
  const { email, full_name, pwd_hash } = request.body

  pool.query('INSERT INTO users (email, full_name, pwd_hash) VALUES ($1, $2, $3) RETURNING *', [email, full_name, pwd_hash], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added`)
  })
}

//Gets all users
const fetchUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Gets a user by their email
const fetchUserByEmail = (request, response) => {
  pool.query(`SELECT users.id, email, full_name FROM users WHERE email = $1`, (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Gets a user by their Id
const fetchUserById = (request, response) => {
  pool.query(`SELECT users.id, email, full_name,
  carts.id AS cart_id FROM users INNER JOIN carts ON users.id = carts.user_id WHERE users.id = $1`, (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}


//Makes changes to an existing user
const modifyUser = (request, response) => {
  const { id, email, first_name, last_name, address1, address2, postcode, city,  country } = request.body

  pool.query(
    'UPDATE users SET email=$2, first_name=$3, last_name=$4, address1=$5, address2=$6, postcode=$7, city=$8, country=$9 WHERE id = $1 RETURNING *',
    [id, email, first_name, last_name, address1, address2, postcode, city,  country],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${results.id}`)
    }
  )
}

//Deletes a user
const removeUser = (request, response) => {
  const {id} = request.body
  pool.query('UPDATE users SET active = false WHERE id = $1', (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).send(`User with id ${id} has been deactivated`)
  })
}

//Fetches all products and their info
const fetchProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id', (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Creates a new product
const createProduct = (request, response) => {
  const { name, price, description, category, image_url, status } = request.body

  pool.query('INSERT INTO products (name, price, description, category, image_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, price, description, category, image_url, status], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Product added`)
  })
}

//Modifies an existing product
const modifyProduct = (request, response) => {
  const { id, name, price, description, category, image_url, status } = request.body

  pool.query(
    `UPDATE products SET name=$2, price=$3, description=$4, category=$5, image_url=$6, status=$7 WHERE id = $1 RETURNING *`,
    [id, name, price, description, category, image_url, status],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Product modified with ID: ${results.id}`)
    }
  )
}

//Removes a single product
const removeProduct = (request, response) => {
  const {id} = request.body
  pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).send(`Product with id ${id} deleted`)
  })
}


//Gets all orders
const fetchOrders = (request, response) => {
  pool.query('SELECT * FROM orders', (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Creates a new order
const createOrder = (request, response) => {
  const {order_price, order, email} = request.body
  
  pool.query('INSERT INTO orders (order_price, "order", email) VALUES ($1, $2, $3) RETURNING *', [order_price, order, email], (error, results) => {
     if (error) {
          console.error('Error creating order:', error);
          return response.status(500).send('Internal Server Error');
    }
    response.status(201).send(`Order created`)
  })
}

//Fetches an order by it's Id
const fetchOrderById = (request, response) => {
  const {id} = request.body

  pool.query(`SELECT * FROM orders
  INNER JOIN order_products ON orders.id = order_products.order_id
  INNER JOIN products ON order_products.product_id = products.id
  WHERE orders.id = $1`, [id], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Adds one product to an order
const createProductInOrder = (request, response) => {
  const {order_id, product_id, quantity, price} = request.body

  pool.query(`INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *`, [order_id, product_id, quantity, price], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).send(`${quantity} products with id ${product_id} added to order ${order_id}`)
  })
}


//Fetches all products in a cart for a userId
const fetchCartById = (request, response) => {
  const {id} = request.body

  pool.query(`SELECT products.id, name, price, description, category, image_url, status, quantity FROM carts
  INNER JOIN cart_products ON carts.id = cart_products.cart_id
  INNER JOIN products ON cart_products.product_id = products.id
  WHERE user_id = $1`, [id], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

//Creates record in the carts table for a userId with 1-1 relation
const createCartById = (request, response) => {
  const { user_id } = request.body

  pool.query(`INSERT INTO carts(user_id)
  VALUES($1) RETURNING id`, [user_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Cart record created for user with id: ${user_id}`)
  })
}

//Adds a new product of a given quantity to a cart
const createProductInCart = (request, response) => {
  const {cart_id, product_id, quantity} = request.body

  pool.query(`INSERT INTO cart_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`, [cart_id, product_id, quantity], (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).send(`${quantity} products with id ${product_id} added to cart ${order_id}`)
  })
}

//Removes a cart (needs to be empty)
const removeCart = (request, response) => {
  const {user_id} = request.body

  pool.query('DELETE FROM carts WHERE user_id = $1', [user_id], (error, response) => {
      if (error) {
          throw error
      }
      response.status(200).send('Cart deleted')
  })
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
  removeCart,
  removeWishListItem,
  createOrder,
}
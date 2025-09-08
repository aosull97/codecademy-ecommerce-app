require('dotenv').config();

const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3000
const db = require('./db/queries');
const cors = require('cors')

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE)
    }
  })
);

app.use((req, res, next) => {
  console.log(req.session)
  next()
})

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://localhost:3000"
  )

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  )

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  )

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);

  next()
})

app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const passport = require('passport');

require('dotenv').config();
require('./passport')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (request, response) => {
    response.json({ info: 'Antiques E-Commerce API' })
  })

app.post('/cart', db.addToCart)
app.get('/cart/:userEmail', db.fetchCart)
app.delete('/cart/:userEmail', db.clearCart)
app.put('/cart/:id', db.modifyCart)
app.delete('/cart/:userEmail/:product', db.removeCartItem)

app.get('/wishlist/:userEmail', db.fetchWishlist)
app.post('/wishlist', db.addToWishList)
app.delete('/wishlist/:userEmail/:product', db.removeWishListItem)

app.get('/users', db.fetchUsers)
app.get('/users/:id', db.fetchUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.modifyUser)
app.delete('/users/:id', db.removeUser)


app.get('/orders/:userEmail', db.fetchOrders)
app.post('/orders', db.createOrder)
app.get('/orders/:id', db.fetchOrderById)
app.post('/orderProducts', db.createProductInOrder)

app.post('/login', passport.authenticate('local', {failureRedirect: '/'}), ((req, res) => {
  res.status(201).json(req.user)
}))

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: 'Logout successful' });
  });
});

app.get('/products', db.fetchProducts)
app.get('/products/:id', db.fetchProductById)
app.post('/products', db.createProduct)
app.put('/products/:id', db.modifyProduct)
app.delete('/products/:id', db.removeProduct)



app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

require('dotenv').config();

const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3000
const db = require('./db/queries');
const cors = require('cors')

const session = require("express-session");

// It's good practice to set this based on your environment
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    // Set saveUninitialized to false, it's better for login sessions and GDPR
    saveUninitialized: false, 
    cookie: {
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
      // `secure` must be true in production and `sameSite` must be 'none' 
      // for cross-domain cookies. 'lax' is fine for development.
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction
    }
  })
);

// If your app is behind a proxy in production (e.g., on Heroku, Render), 
// you need to trust the proxy to for `secure` cookies to work.
if (isProduction) {
  app.set('trust proxy', 1); // trust first proxy
}

// Remove the manual CORS headers and configure the cors middleware properly
app.use(cors({
  // Your client's origin
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  // Allow cookies to be sent
  credentials: true
}));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log(req.session)
  next()
})
const passport = require('passport');

require('dotenv').config();
require('./passport')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())

// This route starts the Google authentication flow.
// Your frontend should have a link or button that directs the user to this endpoint.
// e.g., <a href="http://localhost:3000/auth/google">Sign in with Google</a>
app.get('/auth/google',
  passport.authenticate('google'));

// This is the callback route that Google will redirect to after the user authenticates.
// The path must match the `callbackURL` in your GoogleStrategy configuration.
app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    // On success, redirect back to your frontend.
    // You should use an environment variable for the client URL.
    successRedirect: process.env.CLIENT_URL || 'http://localhost:5173/', 
    // On failure, redirect to a login page or show an error on the frontend.
    failureRedirect: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : 'http://localhost:5173/login',
    failureMessage: true 
  }));

app.get('/auth/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    // req.user is populated by Passport's deserializeUser
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

app.get('/', (request, response) => {
    response.json({ info: 'Antiques E-Commerce API' })
  })


app.post('/cart', db.addToCart)
app.get('/cart/:userEmail', db.fetchCart)
app.delete('/cart/:userEmail/:product', db.removeCartItem)

app.get('/wishlist/:userEmail', db.fetchWishlist)
app.post('/wishlist', db.addToWishList)
app.delete('/wishlist/:userEmail/:product', db.removeWishListItem)

app.get('/users', db.fetchUsers)
app.get('/users/:id', db.fetchUserById)
app.post('/users', db.createUser)

app.get('/orders/:userEmail', db.fetchOrders)
app.post('/orders', db.createOrder)

app.get('/products', db.fetchProducts)
app.get('/products/:id', db.fetchProductById)

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // will trigger default error handler
    }
    if (!user) {
      // Authentication failed, send 401 Unauthorized with the info message
      return res.status(401).json(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful, send 200 OK with user data
      return res.status(200).json(user);
    });
  })(req, res, next);
});

app.get('/logout', (req, res, next) => {
  // The version of Passport you are using has a synchronous logout function.
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    res.status(200).json({ message: 'Logout successful' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

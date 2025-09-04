const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bycrypt = require('bcryptjs')
const db = require('./db/queries')

passport.use(new LocalStrategy({
    username: 'email',
    password: 'password',
    passReqToCallback: true
},
    async function(req, username, password, callback) {
        let response;
        try {
            response = await db.login(username)
            const customerDetails = response[0]
            if(!customerDetails) {
                return callback(null, false, {message: 'No user by that email'})
            }
            await bycrypt.compare(password, customerDetails.saltyhash, ((error, res) => {
                if (res) {
                    const user = {customer_id: customerDetails.customer_id, email: customerDetails.email, first_name: customerDetails.first_name, last_name: customerDetails.last_name, address1: customerDetails.address1, address2: customerDetails.address2, postcode: customerDetails.postcode, city: customerDetails.city, country: customerDetails.country }
                    return callback(null, user)
                } else {
                    return callback(null, false)
                }
            }))} catch (error) {
                return callback(error)
            }
    }
))

passport.serializeUser((user, callback) => {
    return callback(null, user);
})

passport.deserializeUser((user, callback) => {
    // In a real app, you would find the user in the database based on the user.customer_id
    return callback(null, user);
});

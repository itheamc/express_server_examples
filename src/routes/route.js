const express = require('express');
const { default: axios } = require('axios');
const routers = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');



// This is middleware function
const generateToken = async (res, user, next) => {
    try {
        const _email = user._email;
        const token = jwt.sign({ _email }, process.env.COOKIE_SECRET_KEY);
        console.log(_email);
        const add_token =
        {
            "_tokens": { token}
                
        }

        const isAdded = await User.findOneAndUpdate({_email}, add_token);
        if(isAdded) {

            res.cookie('token', token, {
                httpOnly: true,
            });
            next();
        }

    } catch (error) {
        console.log(error.message);
    }
    next();
}


// Function to check credientels
const checkingCredentials = (req, res, next) => {
    const { _name, _email, _password } = req.body;

    if (_name === '') {
        if (_email === '') {
            if (_password === '') {
                res.json({ message: 'Please enter all the details' })
            } else {
                res.json({ message: 'Please enter your name and email' })
            }
        } else {
            if (_password === '') {
                res.json({ message: 'Please enter your name and password' })
            } else {
                res.json({ message: 'Please enter your name' })
            }
        }
    } else {
        if (_email === '') {
            if (_password === '') {
                res.json({ message: 'Please enter your email and password' })
            } else {
                res.json({ message: 'Please enter your email' })
            }
        } else {
            if (_password === '') {
                res.json({ message: 'Please enter your password' })
            } else {
                next();
            }
        }
    }

}

// Function to verify users___A Middleware Function
const verifyUser = async (req, res, next) => {
    try {
        const { _email, _password } = req.body;

        if (_email != '') {
            if (_password != '') {
                const user = await User.findOne({ _email }, { _id: 1, _email: 1, _password: 1 });
                
                if (user) {
                    if (_password === user._password) {
                        generateToken(res, user, next);
                    } else {
                        res.json({ message: "Credentials do not match!!. Please try again!" })
                    }
                } else {
                    res.json({ message: "User doesn't exist" })
                }
            } else {
                res.json({ message: "Password can't be empty" })
            }
            
        } else {
            if (_password === '') {
                res.json({ message: "Email and password can't be empty" })
            } else {
                res.json({ message: "Email can't be empty" })
            }
            
        }

    } catch (error) {
        res.json({ error: error.message });
    }
}


// Function to authenticate users using jwt token stored in cookies
const authenticateUser = async (req, res, next) => {
    try {
        let token = req.headers.cookie?.trim().replace('token=', "");
        if (token) {

            const user = await User.findOne({_tokens: {token}})
            if (user) {
                const {_email} = jwt.verify(user._tokens.token, process.env.COOKIE_SECRET_KEY);
                if (_email === user._email) {
                    next();
                } else {
                    res.json({ message: 'You are not authenticate to browse this route'})
                }
            } else {
                res.json({ message: 'Your token is expired'})
            }
        } else {
            res.json({ message: "You haven't login yet!, Please Login"})
        }
       
    } catch (error) {
        res.json({ message: 'Something went wrong', error: error.message })
    }
}

// GET Request
routers.get('/', generateToken, async (req, res) => {
    await axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(posts => res.json({ message: 'OK', posts: posts.data }))
        .catch(err => console.log(err))
})


// POST Request for register
routers.post('/register', checkingCredentials, async (req, res) => {
    try {
        const new_user = new User(req.body);
        const saved_data = await new_user.save();
        res.json({ message: 'Registered Successfully', new_user })
    } catch (error) {
        res.json({ message: 'Something went wrong', error: error.message })
    }
})

// POST Request for login
routers.post('/login', verifyUser, async (req, res) => {

    res.json({ message: 'Signed In successfully' })
})



// GET Request for login
routers.get('/login', authenticateUser, async (req, res) => {
    try {
        const users = await User.find();
        res.json({ message: 'OK', users });
    } catch (error) {
        res.json({ error });
    }
})

module.exports = routers;
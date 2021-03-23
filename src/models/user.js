const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _name: {
        type: String,
        required: true,
        trim: true
    },
    _email: {
        type: String,
        required: true,
        trim: true,
        unique: [true, 'Email already exist'],
        match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,4})$/i, 'You have entered invalid email']

    },
    _password: {
        type: String,
        required: true,
        trim: true,
    },
    _tokens: {
        token: String
    }
});


// Creating collections model for the Users as name 'Users'
const User = mongoose.model('Users', UserSchema);

module.exports = User;
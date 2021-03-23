const mongoose = require('mongoose');

const DB = process.env.DBLINK;

mongoose.connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
.then(() => console.log('Database Connected Successfully'))
.catch(err => console.log(`Something went wrong!! due to ${err.message}`));

module.exports = mongoose;



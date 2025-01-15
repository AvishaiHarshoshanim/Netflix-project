const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const token = require('./routes/token');  // import token path
const categories = require('./routes/category');
const users = require('./routes/users');
const movies = require('./routes/movies');


require('custom-env').env(process.env.NODE_ENV, './config');
mongoose.connect(process.env.CONNECTION_STRING);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/tokens', token);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/movies', movies);
app.listen(process.env.USER_TO_WEB_PORT);



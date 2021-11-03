const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const methodOverride = require('method-override');
require('ejs');
require('./db/mongoose');
const usersRouter = require('./routers/usersRouter');
const productsRouter = require('./routers/productsRouter');
const mainRouter = require('./routers/mainRouter');
const adminRouter = require('./routers/adminRouter');

const app = express();

//directory to serve public folder
const publicDirectoryPath = path.join(__dirname, '../public');

//basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectoryPath));
app.use(methodOverride('_method'));

//express-session middleware
const HOUR = 2000 * 60 * 60;

app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: {
      maxAge: HOUR,
      sameSite: true,
    },
  })
);

//routers
app.use(usersRouter);
app.use(productsRouter);
app.use(adminRouter);
app.use(mainRouter);

//view engine
app.set('view engine', 'ejs');

module.exports = app;

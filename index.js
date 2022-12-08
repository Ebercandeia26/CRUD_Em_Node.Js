/**
 * Import Libs
 */
const express = require("express");
const path = require("path");
const session = require("express-session");
const exphbs = require("express-handlebars");

/**
 * Run Migrations
 */
const runMigrations = require("./src/database/sqlite/migrations");
runMigrations();

/**
 * Create App with Express
 */
const app = express();

/**
 * Set public path to files images and css and js and index.html
 */
const publicDirectory = path.join(__dirname, "./public");

/**
 * Configure express
 */
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
/**
 * Configure session
 */
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "auiyaisudyf9a76d9769",
    cookie: {
      httpOnly: true,
      maxAge: Date.now() + 30 * 86400 * 1000
    }
  })
);

/**
 * Configure template engine
 */
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "master",
    partialsDir: __dirname + "/views/partials",
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");

/**
 * Routes of application
 */
app.use("/", require("./src/routes/pages"));
app.use("/users", require("./src/routes/users"));
app.use("/clients", require("./src/routes/clients"));

app.listen(9009, () => {
  console.log("Server running on port 9009");
});

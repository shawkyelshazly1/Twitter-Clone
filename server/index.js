// Require dependencies modules
const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  path = require("path"),
  helmet = require("helmet"),
  cookieParser = require("cookie-parser");

require("dotenv").config();

// initializse express app object
const app = express();

// Adding dependencies to the app
app.use(cors({ origin: true, credentials: true }));
app.use(
  helmet.contentSecurityPolicy({
    directives: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

/**
 * Requiring  Routes
 * Using /api/ for all routes to create REST API
 */

// Requiring Routes
const userAuthRouter = require("./routes/user/auth"),
  userRouter = require("./routes/user/user"),
  tweetRouter = require("./routes/tweet/tweet");

// Adding user routes to express app
app.use("/api/users", userAuthRouter);
app.use("/api/users", userRouter);

// Adding tweet routes to express app
app.use("/api/tweets", tweetRouter);

// Serving the react from express
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// Connecting Mongoose & starting server on port: 5000
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log(`MongoDB Connected Successfully.`);
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server started on port ${
          process.env.PORT || 5000
        } you can visit from here: http://localhost:5000/`
      );
    });
  })
  .catch((err) => {
    console.error(`Something went wrong, Error: ${err}`);
  });

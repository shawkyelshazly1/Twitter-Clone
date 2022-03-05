// Require dependencies modules
const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  path = require("path"),
  helmet = require("helmet"),
  cookieParser = require("cookie-parser"),
  { connectedUsers } = require("./utils/connectedUseres");

require("dotenv").config();

// initializse express app object
const app = express();
const http = require("http").Server(app);

//Adding Socket.io
const io = require("./socketIOServer").listen(http);

//  Adding user to connected list on connection

// Attaching SocketIO instance to the app and can be accessed with req.app.io
app.io = io;

let originURI = "";
process.env.NODE_ENV === "development"
  ? (originURI = "http://localhost:3000")
  : (originURI = true);

// Adding dependencies to the app
app.use(cors({ origin: originURI, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      frameSrc: ["'self'"],
      childSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "https://res.cloudinary.com", "blob:", "data:"],
      baseUri: ["'self'"],
    },
  })
);
/**
 * Requiring  Routes
 * Using /api/ for all routes to create REST API
 */

// Requiring Routes
const userAuthRouter = require("./routes/user/auth"),
  userRouter = require("./routes/user/user"),
  tweetRouter = require("./routes/tweet/tweet"),
  messageRouter = require("./routes/message/message"),
  conversationRouter = require("./routes/message/conversation");

// Adding user routes to express app
app.use("/api/users", userAuthRouter);
app.use("/api/users", userRouter);

// Adding Chat Router
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

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
    http.listen(process.env.PORT || 5000, () => {
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

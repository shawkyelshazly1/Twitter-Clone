const { connectedUsers } = require("./utils/connectedUseres");

module.exports.listen = function (server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });
  io.listen(8000);

  io.on("connection", (socket) => {
    socket.on("connectedAddUser", (userId) => {
      connectedUsers[userId] = socket;
    });
    likeNotification(socket);
  });

  return io;
};

const likeNotification = (socket) => {
  socket.on("tweetLike", (tweetAuthor) => {
    connectedUsers[tweetAuthor].emit("likedTweet", "someone liked your tweet");
  });
};

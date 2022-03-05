const {
  connectedUsers,
  connectedUsernames,
} = require("./utils/connectedUseres");

module.exports.listen = function (server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.listen(8000);

  io.on("connection", (socket) => {
    socket.on("connectedAddUser", (user) => {
      connectedUsers[user._id] = socket;
      connectedUsernames[user.username] = user._id;
    });

    socket.on("error", function (err) {
      console.log(err);
    });

    socket.on("sendNotification", function (notificationData) {
      const { reciever } = notificationData;

      if (
        notificationData.sender._id != reciever ||
        notificationData.sender._id != connectedUsernames[reciever]
      ) {
        if (notificationData.type === "tweetMention") {
          connectedUsers[connectedUsernames[reciever]].emit(
            "recieveNotification",
            notificationData
          );
        } else {
          connectedUsers[reciever].emit(
            "recieveNotification",
            notificationData
          );
        }
      }
    });

    socket.on("sendMessage", function (messageData) {
      const { recipient } = messageData;

      connectedUsers[recipient._id].emit("recieveMessage", messageData);
    });
  });

  return io;
};

const recieveAndSendNotification = (socket) => {
  console.log(socket);
};

// const sendAndRecieveMessages = (socket) => {};

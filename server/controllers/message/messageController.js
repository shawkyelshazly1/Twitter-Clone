const Conversation = require("../../models/conversation"),
  Message = require("../../models/message");

// Get Conversations
exports.getConversations = async (req, res, next) => {
  const userId = req.user._id;
  const conversations = await Conversation.find({
    members: { $elemMatch: { $eq: userId } },
  })
    .populate("members", ["_id", "firstName", "lastName", "username", "photo"])
    .exec(function (err, conversations) {
      // let lastMessages = [];
      // conversations.map((conversation) => {
      //   const message = Message.find({ conversationId: conversation._id }, [
      //     "content",
      //     "createdAt",
      //     "-_id",
      //   ])
      //     .sort({ createdAt: -1 })
      //     .limit(1)
      //     .exec(function (err, messages) {
      //       lastMessages.push({
      //         conversationId: conversation._id,
      //         lastMessage: messages[0],
      //       });
      //       console.log(lastMessages);
      //     });
      // });
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, conversations });
    });
};

// Get single conversation
exports.getSingleConversation = async (req, res, next) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId)
    .populate("members", ["_id", "firstName", "lastName", "username", "photo"])
    .exec(function (err, conversation) {
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, conversation });
    });
};

// Get Conversations Messages
exports.getConversationMessages = async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const conversation = await Conversation.findById(conversationId)
    .then(async (conversation) => {
      if (!conversation) {
        return res.status(400).json({ errors: ["Ca't find conversation."] });
      }

      if (!conversation.members.includes(userId)) {
        return res.status(400).json({
          errors: ["You'\r not authorized to view this conversation."],
        });
      } else {
        const messages = Message.find({
          conversationId: conversation._id,
        })
          .populate([
            {
              path: "sender",
              select: ["_id", "firstName", "lastName", "username", "photo"],
            },
            {
              path: "recipient",
              select: ["_id", "firstName", "lastName", "username", "photo"],
            },
          ])
          .exec(function (err, messages) {
            if (err) return res.status(400).json({ errors: [err] });
            return res.status(200).json({ success: true, messages });
          });
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// Send A Message to Conversation
exports.sendMessage = async (req, res, next) => {
  const { conversationId } = req.params,
    { content, recipientId } = req.body,
    userId = req.user._id;

  if (recipientId == userId) {
    return res
      .status(400)
      .json({ errors: ["You can't send message to yourself"] });
  } else if (content.length < 1) {
    return res.status(400).json({ errors: ["Content can't be empty"] });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    members: { $all: [recipientId, userId] },
  })
    .then(function (conversation) {
      if (conversation) {
        const message = new Message({
          conversationId: conversation._id,
          sender: userId,
          recipient: recipientId,
          content,
        }).save(async function (err, message) {
          if (err) return res.status(400).json({ errors: [err] });
          message = await message.populate([
            {
              path: "sender",
              select: ["_id", "firstName", "lastName", "username", "photo"],
            },
            {
              path: "recipient",
              select: ["_id", "firstName", "lastName", "username", "photo"],
            },
          ]);
          return res.status(200).json({ success: true, message });
        });
      } else {
        return res.status(400).json({ errors: ["Can't find Conversation"] });
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

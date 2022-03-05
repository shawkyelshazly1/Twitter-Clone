const {
  getConversationMessages,
  sendMessage,
} = require("../../controllers/message/messageController");
const { validateCookieToken } = require("../../utils/middlewares");

const router = require("express").Router();

// Get conversations messages by conversation Id in the params
router.get("/:conversationId", validateCookieToken, getConversationMessages);

// Send message to conversation
router.post("/:conversationId", validateCookieToken, sendMessage);

module.exports = router;

const {
  getConversations,
  getSingleConversation,
} = require("../../controllers/message/messageController");
const { validateCookieToken } = require("../../utils/middlewares");
const router = require("express").Router();

//Get user Conversations
router.get("/", validateCookieToken, getConversations);

// Get one conversation
router.get("/:conversationId", validateCookieToken, getSingleConversation);

module.exports = router;

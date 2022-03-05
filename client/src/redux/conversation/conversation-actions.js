import * as conversationActionTypes from "./conversation-ActionTypes";
import axios from "axios";
import store from "../store";
import { clearErrors, showErrors } from "../error/error-actions";

// Get user Conversation
export const loadConversations = () => (dispatch) => {
  dispatch({ type: conversationActionTypes.LOADING_USER_CONVERSATIONS });

  axios
    .get(`/api/conversations`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: conversationActionTypes.LOAD_USER_CONVERSATIONS_SUCCESS,
        payload: res.data.conversations,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: conversationActionTypes.LOAD_USER_CONVERSATIONS_FAIL });
    });
};

// Get Conversation Messages
export const loadConversationMessages = (conversationId) => (dispatch) => {
  dispatch({ type: conversationActionTypes.LOADING_CONVERSATION_MESSAGES });

  axios
    .get(`/api/messages/${conversationId}`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: conversationActionTypes.LOAD_CONVERSATION_MESSAGES_SUCCESS,
        payload: res.data.messages,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({
        type: conversationActionTypes.LOAD_CONVERSATION_MESSAGES_FAIL,
      });
    });
};

// get active conversation
export const loadActiveConversation = (conversationId) => (dispatch) => {
  dispatch({ type: conversationActionTypes.LOADING_ACTIVE_CONVERSATION });
  axios
    .get(`/api/conversations/${conversationId}`, config)
    .then((res) => {
      dispatch(clearErrors());
      dispatch({
        type: conversationActionTypes.LOAD_ACTIVE_CONVERSATION_SUCCESS,
        payload: res.data.conversation,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.erros));
      dispatch({ type: conversationActionTypes.LOAD_ACTIVE_CONVERSATION_FAIL });
    });
};

// Send Message To Conversation
export const sendMessage =
  (content, recipientId, conversationId, socket, recipient, sender) =>
  (dispatch) => {
    const body = JSON.stringify({
      content,
      recipientId,
    });
    dispatch({ type: conversationActionTypes.SENDING_MESSAGE });
    axios
      .post(`/api/messages/${conversationId}`, body, config)
      .then((res) => {
        store.dispatch(clearErrors());

        socket.emit("sendMessage", {
          type: "sendMessage",
          recipient,
          content: res.data.message,
          sender,
        });
        dispatch({
          type: conversationActionTypes.SEND_MESSAGE_SUCCESS,
          payload: res.data.message,
        });
      })
      .catch((err) => {
        store.dispatch(showErrors(err.response.data.errors));
        dispatch({ type: conversationActionTypes.SEND_MESSAGE_FAIL });
      });
  };

export const recieveMessage = (message) => (dispatch) => {
  dispatch({ type: conversationActionTypes.ADD_NEW_MESSAGE, payload: message });
};

// Axios Config
const config = {
  headers: {
    "Content-type": "application/json",
  },
  baseURL: process.env.REACT_APP_DEV_BASEURL || "",
  withCredentials: true,
  credentials: "include",
};

import * as conversationActionTypes from "./conversation-ActionTypes";

const initialState = {
  loadingMessages: true,
  loadingConversations: true,
  conversations: [],
  messages: [],
  sendingMessage: false,
  loadingActiveConversation: true,
  activeConversation: null,
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case conversationActionTypes.LOADING_USER_CONVERSATIONS:
      return { ...state, loadingConversations: true };

    case conversationActionTypes.LOADING_CONVERSATION_MESSAGES:
      return { ...state, loadingMessages: true };

    case conversationActionTypes.LOAD_USER_CONVERSATIONS_FAIL:
      return { ...state, loadingConversations: false, conversations: [] };

    case conversationActionTypes.LOAD_CONVERSATION_MESSAGES_FAIL:
      return { ...state, loadingMessages: false, messages: [] };

    case conversationActionTypes.LOAD_USER_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        loadingConversations: false,
        conversations: action.payload,
      };

    case conversationActionTypes.SENDING_MESSAGE:
      return { ...state, sendingMessage: true };

    case conversationActionTypes.SEND_MESSAGE_FAIL:
      return { ...state, sendingMessage: false };

    case conversationActionTypes.SEND_MESSAGE_SUCCESS:
      let updatedMessages = state.messages;
      updatedMessages.push(action.payload);
      return { ...state, sendingMessage: false, messages: updatedMessages };

    case conversationActionTypes.LOAD_CONVERSATION_MESSAGES_SUCCESS:
      return { ...state, loadingMessages: false, messages: action.payload };

    case conversationActionTypes.LOADING_ACTIVE_CONVERSATION:
      return { ...state, loadingActiveConversation: true };

    case conversationActionTypes.LOAD_ACTIVE_CONVERSATION_SUCCESS:
      return {
        ...state,
        loadingActiveConversation: false,
        activeConversation: action.payload,
      };

    case conversationActionTypes.LOAD_ACTIVE_CONVERSATION_FAIL:
      return {
        ...state,
        loadingActiveConversation: false,
        activeConversation: null,
      };

    case conversationActionTypes.ADD_NEW_MESSAGE:
      let uMessages = state.messages;
      uMessages.push(action.payload);
      return { ...state, messages: uMessages };

    default:
      return { ...state };
  }
};

export default conversationReducer;

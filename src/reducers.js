export default function(state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            users: action.users
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    users: null
                };
            })
        };
    }
    if (action.type == "ACCEPT_REQUEST") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    accepted: true
                };
            })
        };
    }

    if (action.type == "CHAT_MESSAGES") {
        return {
            ...state,
            chatMessages: action.messages
        };
    }
    
    if (action.type == "NEW_MESSAGE") {
        return {
            ...state,
            chatMessages: [...state.chatMessages, action.message]
        };
    }

    return state;
}

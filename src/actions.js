import axios from "./axios";

export async function receiveUsers() {
    const { data } = await axios.get("/friendswannabes");
    return {
        type: "RECEIVE_USERS",
        users: data
    };
}

export async function unfriend(id) {
    console.log("unfriend action working")
    const { data } = await axios.post(`/unfriend/${id}.json`, {
        button: "unfriend"
    });
    // console.log("data unfriend", data);
    return {
        type: "UNFRIEND",
        id
    };
}

export async function acceptRequest(id) {
    console.log("accept action working")
    const { data } = await axios.post(`/acceptfriend/${id}.json`, {
        button: "accept friend request"
    });
    // console.log("data accept", data);
    return {
        type: "ACCEPT_REQUEST",
        id
    };
}

export function chatMessages(messages) {
    return {
        type: "CHAT_MESSAGES",
        messages
    };
}

export function chatMessage(message) {
    return {
        type: "NEW_MESSAGE",
        message
    };
}

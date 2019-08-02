import axios from "axios";

export async function receiveUsers() {
    const { data } = await axios.get("/friendswannabes");
    return {
        type: "RECEIVE_USERS",
        users: data
    };
}

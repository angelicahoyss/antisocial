import React from "react";
import axios from "./axios";

export default function FriendButton() {
    const [button, setButton] = useState();

    useEffect(
        () => {
            if (!searchUsers) {
                (async () => {
                    const usersList = await axios.get("/users");
                    setUsers(usersList.data);
                })();
            } else {
                (async () => {
                    const searchList = await axios.post("/users.json",{val:searchUsers});
                    setUsers(searchList.data);
                })();
            }
        },
        [searchUsers]);

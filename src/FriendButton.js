import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [button, setButton] = useState();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    `/friendship/${props.OtherProfileId}.json`
                );
                console.log("DATA in FriendButton: ", data);
                setButton(data.btnText);
            } catch (err) {
                console.log("err in useEffect GET /friendship: ", err);
            }
        })();
    }, []);

    async function submit() {
        try {
            if (button == "add friend") {
                const { data } = await axios.post(
                    `/friendrequest/${props.OtherProfileId}.json`,
                    { button }
                );
                // socket.emit("new friend request", { sender: sender_id, receiver: receiver_id });
                setButton(data.btnText);
            } else if (button == "accept friend request") {
                const { data } = await axios.post(
                    `/acceptfriend/${props.OtherProfileId}.json`,
                    { button }
                );
                setButton(data.btnText);
            } else if (button == "unfriend") {
                const { data } = await axios.post(
                    `/unfriend/${props.OtherProfileId}.json`,
                    { button }
                );
                setButton(data.btnText);
            } else if (button == "cancel friend request") {
                const { data } = await axios.post(
                    `/cancelrequest/${props.OtherProfileId}.json`,
                    { button }
                );
                setButton(data.btnText);
            }
        } catch (err) {
            console.log("err in FriendButton POST /friendship", err);
        }
    }

    return (
        <div>
            <button onClick={submit}>{button}</button>
        </div>
    );
}

import React, { useEffect, useRef } from 'react';
import { socket } from './socket';
import { useSelector } from 'react-redux';

export function Chat() {

    const chatMessages = useSelector(
        state => state && state.chatMessages
    )
    console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();

    useEffect(()=> {
        console.log("chat hooks mounted!");
        console.log("elemRef", elemRef);
        console.log("scroll top: ", elemRef.current.scrollTop); //zero
        console.log("scroll height: ", elemRef.current.scrollHeight); //360
        console.log("clientHeight: ", elemRef.current.clientHeight); //300
        elemRef.current.scrollTop = elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);
    // console.log("here are my last 10 messages: ", chatMessages);
    const keyCheck = (e) => {
        console.log("e.target.value:", e.target.value);
        console.log("e.key", e.key);
        if(e.key === "Enter") {
            e.preventDefault();
            console.log("enter was pressed");
            socket.emit("send message", e.target.value)
            e.target.value = "";
        }
    }

    return (
        <div className="chat">
            <h1>chat room</h1>

            <div className="chat-container" ref={elemRef}>
            {chatMessages &&
                chatMessages.map(user => (
                        <div key={user.id}>
                            <img src={user.image} alt={user.first} />
                            <p>{user.message}</p>
                        </div>
            ))}
            </div>
            <textarea
                placeholder="add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
//     return (
//         <div className="chat">
//             <h1>chat room</h1>
//             <div className="chat-container" ref={elemRef}>
//                 <p>chat messages will go here. i am a chat.</p>
//                 <p>chat messages will go here. i am a chat.</p>
//                 <p>chat messages will go here. i am a chat.</p>
//                 <p>chat messages will go here. i am a chat.</p>
//                 <p>chat messages will go here. i am a chat.</p>
//             </div>
//             <textarea
//                 placeholder = "add your message here"
//                 onKeyDown = { keyCheck }
//             >
//             </textarea>
//         </div>
//     )
}

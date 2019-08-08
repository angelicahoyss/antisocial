import * as io from 'socket.io-client';
import { chatMessages, chatMessage, acceptRequest } from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on(
            'chatMessages',
            msgs => store.dispatch(
                chatMessages(msgs)
            )
        );

        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessage(msg)
            )
        );

        // socket.on(
        //     'acceptRequest',
        //     not => store.dispatch(
        //         receiveUsers(not)
        //     )
        // );
    }
};

// const socket = io.connect();
// socket.on(
//     'greeting',
//     payload => {
//         // console.log(payload);
//         //     socket.emit('niceToBeHere', {
//         //         chicken: 'funky'
//         // });
//     }
// );
//
// socket.on(
//     'newPlayer',
//     () =>
//         console.log('NEW PLAYER'));

// import React, { useEffect, useRef } from 'react';
// import { socket } from './socket';
// import { useSelector } from 'react-redux';
//
// export default function Notification () {
//
// const users = useSelector(
//     state => state && state.users
// );
//
// console.log("users: ", users)
//
// const requests = users.filter(user => {
//     return !user.accepted
// })
//
//     useEffect(() => {
//           console.log("mounted!");
//           // socket.emit('allwallpost', wallId);
//       }, []);
//
//     return (
//       <div>
//           <h1>{requests.length}</h1>
//       </div>
//     );
// }

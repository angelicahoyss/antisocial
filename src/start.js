import React from "react";
import ReactDOM from "react-dom";
import AnimalsContainer from "./AnimalsContainer";
import App from "./App";
import Welcome from "./Welcome";
// let elem;

// if (location.pathname == "/welcome") {
//     //they are loggedout
//     elem = <Welcome />;
// } else {
//     elem = <img src="/images/900x650 Logo.png" />;
// }
// they are logged in

ReactDOM.render(<Welcome />, document.querySelector("main"));

// export default function HelloWorld() {
//     return (
//         <div>
//             <h1>My first component!</h1>
//         </div>
//     );
// }

//register, ajax request(axios post), reload the page redirect to /, serve this page again,
//url will be/home not welcome. index html loads bundle runs and we'll see the logo
//res.json in axios

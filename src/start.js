import React from "react";
import ReactDOM from "react-dom";
// import AnimalsContainer from "./AnimalsContainer";
import App from "./App";
import Welcome from "./Welcome";
let elem;

if (location.pathname == "/welcome") {
    //they are loggedout
    elem = <Welcome />;
} else {
    elem = <App />;
}
//they are logged in

ReactDOM.render(elem, document.querySelector("main"));

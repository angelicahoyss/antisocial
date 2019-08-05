import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Welcome from "./Welcome";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
// import "./css/style.class";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

// if (location.pathname == "/welcome") {
//     //they are loggedout
//     elem = <Welcome />;
// } else {
//     elem = <App />;
// }
// //they are logged in

ReactDOM.render(elem, document.querySelector("main"));

//function component
import React from "react";
import Registration from "./Registration";
import Login from "./Login";
import { HashRouter, Route } from "react-router-dom"; //also has component Switch { HashRouter, Route, Switch } and then add <switch></switch> in JSX

export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <h1>welcome!</h1>
                <img src="/images/900x650 Logo.png" height={150} />
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </div>
        </HashRouter>
    );
}
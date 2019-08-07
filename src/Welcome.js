import React from "react";
import Registration from "./Registration";
import Login from "./Login";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div className="welcome">
                <img src="/images/antisocial_lowall_logo.png" height={30} />
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </div>
        </HashRouter>
    );
}

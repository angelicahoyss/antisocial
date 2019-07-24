//should be class component bc it needs state for:
//screen needs to update to show error message

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }); //this can also be this[e.target.name]:e.target.value;
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div className="login">
                <div>
                    {this.state.error && <div className="error">oops!</div>}
                </div>
                <h1>Login</h1>
                <input
                    name="email"
                    onChange={e => this.handleChange(e)}
                    placeholder="email"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={e => this.submit()}>login</button>
            </div>
        );
    }
}

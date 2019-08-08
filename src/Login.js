import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.submit = this.submit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
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
                <h1>login</h1>
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
                <div>
                    {this.state.error && <div className="error">invalid username or password</div>}
                </div>
            </div>
        );
    }
}

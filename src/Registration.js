//should be class component bc it needs state for:
//screen needs to update to show error message

import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value; //this can also go in state with this.setState({[e.target.name]:e.target.value})
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                //same as resp and resp.data.success
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
        //location.replace('https://www.spiced.academy')
        //gather body input all the same as in petition
        //except you res.json
    }
    render() {
        return (
            <div>
                <div>
                    {this.state.error && <div className="error">oops!</div>}
                    <input
                        name="first"
                        onChange={e => this.handleChange(e)}
                        placeholder="first name"
                    />
                    <input
                        name="last"
                        onChange={e => this.handleChange(e)}
                        placeholder="last name"
                    />
                    <input
                        name="email"
                        onChange={e => this.handleChange(e)}
                        placeholder="email"
                    />
                    <input name="password" placeholder="password" />
                    <button onClick={e => this.submit()}>register</button>
                </div>
                <div>
                    <p>
                        Already a member? <a href="/login">Log in</a>
                    </p>
                </div>
            </div>
        );
    }
}

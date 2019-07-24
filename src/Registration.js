//should be class component bc it needs state for:
//screen needs to update to show error message

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
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
    }
    render() {
        return (
            <div className="registration">
                <div>
                    {this.state.error && <div className="error">oops!</div>}
                </div>
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
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={e => this.submit()}>register</button>
                <p>
                    already a member?<Link to="/login">Login</Link>
                </p>
            </div>
        );
    }
}

// function makePasta() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("pasta's done!");
//             resolve();
//         }, 3000);
//     });
// }
//
// function makeSauce() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("sauce's done!");
//             resolve();
//         }, 1000);
//     });
// }
//
// function grateCheese() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("cheese's done!");
//             resolve();
//         }, 1500);
//     });
// }
//
// makePasta().then(() => {
//     makeSauce().then(() => {
//         grateCheese().then(() => {
//             console.log("all done!");
//         });
//     });
// });
//
// async function makeDinner() {
//     try {
//         const pastaPromise = makePasta();
//         const saucePromise = makeSauce();
//         const cheesePromise = grateCheese();
//         return {
//             pasta: await pastaPromise,
//             sauce: await saucePromise,
//             cheese: await cheesePromise
//         };
//     } catch (e) {
//         console.log(e);
//     }
// }
//
// makeDinner();

//Concurrency

import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        const { data } = await axios.get(`/user/${id}.json`);
        console.log("OtherProfile DATA:", data);

        if (data.sameUser) {
            this.props.history.push("/"); //url you want to redirect to. match and history
        }
        this.setState(data);
    }

    render() {
        return (
            <div>
                <img src={this.state.image} />
                {this.state.first} {this.state.last} {this.state.bio}
            </div>
        );
    }
}

//it needs to be class, ajax to get info from user in question- who's ID is in the route
//req.params.id - in express is equivalent to match in react: match obj has prop name params:
//in BioEditor componentDidMount matches params id

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
            this.props.history.push("/");
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
 // <FriendButton OtherProfileId={this.props.match.params.id} />


//PART 7//
//button changes to cancel when clicked on viewers Profile
//on owner profile its accept
//once accepted on both it's end friendship
//button has 4 states
//database relationship with users: new table named friendships or friend request
// CREATE TABLE friendships(
//     id SERIAL,
//     sender_id INT REFERENCES users(id),
//     recever_id INT REFERENCES users(id),
//     accepted BOOLEAN DEFAULT false
// );
//queries, when the component mounts make ajax request send id of the profile owner. server gets viewer id from session. we can use only one id, maybe recever_id
// SELECT * FROM friendships
// WHERE (sender_id = $1 AND recever_id = $2)
// OR (sender_id = $2 AND recever_id = $1)
//INSERT on send friend request
//when someone accepts that is an UPDATE = set col to getRecentUsers
//cancel friend request DELETE
//total of 4 queries
//total of at least 2 routes: get does select when component mounts. one post that fgures out which query to do
//or==== 3 different routes: one for making a request does insert, another route for update, accepting friend request. same route for cancel and unfriend
//one click handler in the client?
//database: index, or trigger sql ?
//tests first and code to confirm that it works

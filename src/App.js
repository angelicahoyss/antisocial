import React from "react";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import axios from "axios";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            bioIsVisible: false
        };
    }
    async componentDidMount() {
        const { data } = await axios.get("/user"); //add two cols to users table - col for bio and col for imageurl. id, first, last, image, bio
        // console.log("data in APP:", data.user.rows[0]);
        // this.setState(data.user.rows[0]);
        this.setState(data);
    }
    catch(err) {
        console.log("err in axios mount", err);
    }
    render() {
        return (
            <div>
                <header>
                    <img src="/images/logo.png" alt="logo" width={150} />
                    <ProfilePic
                        image={this.state.image}
                        first={this.state.first}
                        last={this.state.last}
                        onClick={() =>
                            this.setState({ uploaderIsVisible: true })
                        }
                    />
                </header>

                <Profile
                    bio={this.state.bio}
                    changeBio={bio => {
                        this.setState({
                            bio: bio
                        });
                    }}
                    image={this.state.image}
                    first={this.state.first}
                    last={this.state.last}
                    onClick={() =>
                        this.setState({
                            uploaderIsVisible: true,
                            bioIsVisible: true
                        })
                    }
                />

                {this.state.uploaderIsVisible && (
                    <Uploader
                        done={image =>
                            this.setState({
                                image: image,
                                uploaderIsVisible: false
                            })
                        }
                        close={() =>
                            this.setState({
                                uploaderIsVisible: false
                            })
                        }
                    />
                )}
            </div>
        );
    }
}
// if (!this.state.id) {
//     return null;
// }
//uploader needs to change app state, app state needs to change to make modal dissappear or automatially close when uploaded

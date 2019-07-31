import React from "react";
import Uploader from "./Uploader";
import ProfilePic from "./Profilepic";
import Profile from "./Profile";
import axios from "./axios";
import { Route, BrowserRouter, Link } from "react-router-dom";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";

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

                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        bio={this.state.bio}
                                        changeBio={bio =>
                                            this.setState({
                                                bio: bio
                                            })
                                        }
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
                                );
                            }}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route exact path="/users" component={FindPeople} />
                        <Link to="/">home</Link>
                        <Link to="/users">find people</Link>
                    </div>
                </BrowserRouter>

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
//PART 6
//put users array into state!! when users change we'd need update the display

//function FindPeople() {
//const[users,setUsers] = useState();
//const [val, setVal] = useState();
//}

//useEffect runs everytime the value changes. get new users everytime value changes

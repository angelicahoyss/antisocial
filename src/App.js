import React from "react";
import Uploader from "./Uploader";
import ProfilePic from "./Profilepic";
import Profile from "./Profile";
import axios from "./axios";
import { Route, BrowserRouter, Link } from "react-router-dom";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Moment from "./moment";
import { Chat } from './chat';
import Notification from './notification';
import { receiveUsers  } from "./actions";
import { useSelector , useDispatch} from 'react-redux';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            bioIsVisible: false
        };
    }
    async componentDidMount() {
        const { data } = await axios.get("/user");
        const friends = await axios.get("/friendswannabes");
        console.log(friends.data)
        // console.log("data in APP:", data.user.rows[0]);
        // this.setState(data.user.rows[0]);
        this.setState({
           ...data,
           friends : friends.data
       });
    }
    catch(err) {
        console.log("err in axios mount", err);
    }
    render() {
        return (
            <div>
                <BrowserRouter>
                    <header className="header">
                        <a href="/"><img src="/images/antisocial_lowall_logo.png" alt="logo" height={30} /></a>
                        <nav className="navigation">
                            <Link to="/users">find people</Link>
                            <Link to="/friends"> friends<Notification/> </Link>
                            <Link to="/chat">chat</Link>
                            <a href="/logout">logout</a>

                            <ProfilePic
                                image={this.state.image}
                                first={this.state.first}
                                last={this.state.last}
                                onClick={() =>
                                    this.setState({ uploaderIsVisible: true })
                                }
                            />
                        </nav>
                    </header>
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
                        <Route exact path="/friends" component={Friends} />
                        <Route exact path="/chat" component={Chat} />
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

import React from "react";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
// import AnimalsContainer from "./AnimalsContainer";
// import HelloWorld from "./start";
import axios from "axios";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
            // image: image.data || "default.gif"
            // cutenessScore: null
        };
        //         this.handleChange = this.handleChange.bind(this);
        //         this.handleClick = this.handleClick.bind(this);
    }
    // componentDidMount is the react version of "mounted"
    async componentDidMount() {
        const { data } = await axios.get("user"); //add two cols to users table - col for bio and col for imageurl. id, first, last, image, bio
        //         axios.get("/get-animal").then(resp => {
        //             // console.log("resp: ", resp);
        console.log("data:", data.user.rows[0]);
        this.setState(
            data.user.rows[0]
            //                 name: resp.data.name,
            //                 cutenessScore: resp.data.cutenessScore
        );
        //             // console.log("this.state: ", this.state);
        //         });
    }
    //
    //     handleChange(e) {
    //         // console.log("e.target.name: ", e.target.name);
    //         // console.log("e.target.value: ", e.target.value);
    //         // console.log("handleChange running!");
    //         this.setState({
    //             [e.target.name]: e.target.value
    //         });
    //     }
    //
    //     handleClick(e) {
    //         e.preventDefault();
    //         console.log("this.state: ", this.state);
    //         //from here you could make a POST request with axios just like we did with Vue
    //     }
    //
    render() {
        // if (!this.state.id) {
        //     return null;
        // }
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
                {this.state.uploaderIsVisible && (
                    <Uploader done={image => this.setImage({ image })} />
                    //uploader needs to change app state, app state needs to change to make modal dissappear or automatially close when uploaded
                )}
            </div>
        );
    }
}
//                 <AnimalsContainer
//                     name={this.state.name}
//                     cutenessScore={this.state.cutenessScore}
//                 />
//                 <HelloWorld />
//                 <form>
//                     <input
//                         type="text"
//                         name="name"
//                         onChange={this.handleChange}
//                     />
//                     <input
//                         type="text"
//                         name="cutenessScore"
//                         onChange={this.handleChange}
//                     />
//                     <button onClick={this.handleClick}>submit</button>
//                 </form>
//             </div>

//passes variable (prop) in this case name (can be called
//anything) to AnimalsContainer with a value.

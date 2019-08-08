import React from "react";
import ProfilePic from "./Profilepic";
import BioEditor from "./Bioeditor";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic
                size="jumbo"
                image={props.image}
                first={props.first}
                last={props.last}
                onClick={props.onClick}
            />
            <div className="profile-name">{`${props.first} ${props.last}`}</div>
            <BioEditor bio={props.bio} done={props.changeBio} />
        </div>
    );
}

import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic
                image={props.image}
                first={props.first}
                last={props.last}
                onClick={props.onClick}
            />
            <div>{`${props.first} ${props.last}`}</div>
            <BioEditor bio={props.bio} done={props.changeBio} />
        </div>
    );
}

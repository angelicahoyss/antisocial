import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    upload(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.file);
    }
    render() {
        return (
            <div>
                <h1>do you want to change profile picture?</h1>
                <input
                    type="file"
                    className="inputfile"
                    name="file"
                    accept="image/*"
                    onChange={e => this.upload(e)}
                />
                <label id="filelabel" ref="filelabel" htmlFor="file">
                    select file
                </label>
            </div>
        );
    }
}

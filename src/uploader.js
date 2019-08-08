import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    close() {
        this.props.close();
    }
    upload(e) {
        e.preventDefault();
        this.file = e.target.files[0];
        let formData = new FormData();
        formData.append("file", this.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("DATA in uploader:", data);
                this.props.done(data);
            })
            .catch(err => {
                console.log("err in axios /upload", err);
            });
    }
    render() {
        return (
            <div className="uploader">
                <button className="close-btn" onClick={e => this.close(e)}>
                    X
                </button>
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

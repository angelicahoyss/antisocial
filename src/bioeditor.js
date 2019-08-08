import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            showCancel: false
        };
    }

    changeBio(e) {
        this.setState({
            draftBio: e.target.value
        });
    }

    submit() {
        axios
            .post("./bio", {
                bio: this.state.draftBio
            })
            .then(({ data }) => {
                this.setState({
                    editing: false,
                    showCancel: false
                });
                this.props.done(data);
            });
    }

    render() {
        const isEditing = this.state.editing;

        return (
            <div className="bio-editor">
                {isEditing && (
                    <div>
                        <textarea
                            placeholder="start typing..."
                            name="draftBio"
                            onChange={e => {
                                this.changeBio(e);
                            }}
                        />
                        <button onClick={() => this.submit()}>save</button>
                    </div>
                )}

                {this.props.bio && (
                    <div>
                        <p>{this.props.bio}</p>
                        <button
                            onClick={() =>
                                this.setState({
                                    editing: true,
                                    showCancel: true
                                })
                            }
                        >
                            edit your bio
                        </button>
                    </div>
                )}

                {!this.props.bio && (
                    <div>
                        <p>{this.props.bio}</p>
                        <button
                            onClick={() =>
                                this.setState({
                                    editing: true,
                                    showCancel: true
                                })
                            }
                        >
                            add bio
                        </button>
                    </div>
                )}

                {this.state.showCancel ? (
                    <button
                        onClick={e =>
                            this.setState({ editing: false, showCancel: false })
                        }
                    >
                        cancel
                    </button>
                ) : null}
            </div>
        );
    }
}

import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            showCancel: false,
            editBio: "edit your bio",
            addBio: "add your bio"
        };
    }

    componentDidMount() {
        this.setState((state, props) => ({ draftBio : props.bio }));
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
                    showCancel: false,
                    editBio: "edit your bio",
                    addBio: "add your bio"
                });
                this.props.done(data);
            });
    }

    render() {
        const isEditing = this.state.editing;
        const { editBio } = this.state;
        const { addBio } = this.state;

        return (
            <div className="bio-editor">
                {isEditing && (
                    <div>
                        <textarea
                            defaultValue ={this.props.bio}
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
                                    showCancel: true,
                                    editBio: ""
                                })
                            }
                        >
                            {editBio}
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
                                    showCancel: true,
                                    addBio: ""
                                })
                            }
                        >
                            {addBio}
                        </button>
                    </div>
                )}

                {this.state.showCancel ? (
                    <button
                        onClick={e =>
                            this.setState({
                                editing: false,
                                showCancel: false,
                                editBio: "edit your bio",
                                addBio: "add your bio"
                            })
                        }
                    >
                        cancel
                    </button>
                ) : null}
            </div>
        );
    }
}

import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
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
                    editing: false
                });
                this.props.done(data);
            });
    }

    render() {
        return (
            <div>
                {this.state.editing && (
                    <div>
                        <textarea
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
                                    editing: true
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
                                    editing: true
                                })
                            }
                        >
                            add bio
                        </button>
                    </div>
                )}

                <button onClick={e => this.setState({ editing: false })}>
                    cancel
                </button>
            </div>
        );
    }
}

//bioeditor needs some indicator what's in the state
//two props and two state properties
//ajax request, when successful set state editing false and call props done

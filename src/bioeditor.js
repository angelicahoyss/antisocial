import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addbio: true
        };
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
                        <textarea name="draftBio" />
                        <button>save</button>
                    </div>
                )}

                {this.props.bio}

                <button onClick={e => this.setState({ editing: true })}>
                    add
                </button>
            </div>
        );
    }
}

//bioeditor needs some indicator what's in the state
//two props and two state properties
//ajax request, when successful set state editing false and call props done

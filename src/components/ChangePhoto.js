'use strict';

import React from 'react';
import UserController from '../../app/controllers/userController.client';

const userController = new UserController();

export default class ChangePhoto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shownFileInput: false,
            file: null,
            error: null
        };

        this.toggleFileInput = this.toggleFileInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleFileInput() {
        const shownFileInput = !this.state.shownFileInput;
        this.setState({shownFileInput});
    }

    handleChange(e) {
        const file = e.target.files[0];
        this.setState({file});
    }

    handleSubmit(e) {
        e.preventDefault();
        const body = new FormData();
        body.append('avatar', this.state.file);

        userController.changePhoto(body)
            .then(data => {
                if (data.status != 'Success') {
                    return this.setState({error: data.message});
                }
                this.props.updatePhoto();
                this.setState({shownFileInput: false, error: null});
            })
            .catch(err => console.error('Network error'));
    }

    render() {

        if (!this.state.shownFileInput) {
            return (
                <button type="button" onClick={this.toggleFileInput}>
                    Изменить фото
                </button>
            );
        }
        const error = this.state.error ? <p>{this.state.error}</p> : null;

        return (
            <div>
                <form id="addAvatar">
                    <input type="file" accept="image/*" name="avatar"
                        onChange={this.handleChange} />
                    <button type="submit" onClick={this.handleSubmit}>Загрузить</button>
                </form>
                {error}
            </div>
        );
    }
}
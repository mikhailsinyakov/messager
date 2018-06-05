'use strict';

import React from 'react';
import RequestController from '../../app/controllers/requestController.client';

const requestController = new RequestController();

export default class ChangePhoto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shownFileInput: false,
            file: null
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
        const action = '/api/users/current/files/avatar';
        const formData = new FormData();
        formData.append('avatar', this.state.file);

        requestController.sendFile(action, formData)
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

    render() {

        if (!this.state.shownFileInput) {
            return (
                <button type="button" onClick={this.toggleFileInput}>
                    Изменить фото
                </button>
            );
        }

        return (
            <form id="addAvatar" action="/api/users/current/files/avatar" method="POST" 
                    encType="multipart/form-data">
                <input type="file" accept="image/*" name="avatar"
                    onChange={this.handleChange} />
                <button type="submit" onClick={this.handleSubmit}>Загрузить</button>
            </form>
        );
    }
}
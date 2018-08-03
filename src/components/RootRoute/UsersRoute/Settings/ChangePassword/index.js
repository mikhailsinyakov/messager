'use strict';

import React from 'react';
import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            error: null,
            success: null
        }

        this.abortControllers = [];
        this.handleInput = this.handleInput.bind(this);
        this.showSuccessMsg = this.showSuccessMsg.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(target) {
        const name = target.name;
        const value = target.value;
        this.setState({[name]: value});
    }

    showSuccessMsg() {
        const success = 'Пароль успешно изменен!';
        this.setState({success});
        setTimeout(() => this.setState({success: null}), 5000);
    }

    handleSubmit(e) {
        const currentPassword = this.state.currentPassword;
        const newPassword = this.state.newPassword;
        if (currentPassword.length < 6 || newPassword.length < 6) {
            const error = 'Длина пароля должна быть минимум 6 символов';
            this.setState({error});
            return;
        }
        const body = { currentPassword, newPassword };
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.changeUserInfo(body, signal)
            .then(data => {
                if (data.status == 'Success') {
                    this.setState({currentPassword: '', newPassword: ''});
                    this.showSuccessMsg();
                }
                else {
                    const error = data.message;
                    this.setState({currentPassword: '', newPassword: '', error});
                }
            }).catch(err => console.error('Network error'));
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const usernameStyle = {
            display: 'none'
        };

        const errorMsg = this.state.error ? <p className="error">{this.state.error}</p> : null;
        const successMsg = this.state.success ? <p>{this.state.success}</p> : null;

        return (
            <form className="change-password">
                <input type="text" name="username" value={this.props.username}
                    readOnly  autoComplete="username" style={usernameStyle}/><br/>
                <input type="password" name="currentPassword" 
                    placeholder="Текущий пароль" autoComplete="current-password"
                    value={this.state.currentPassword} 
                    onChange={e => this.handleInput(e.target)} /><br/>
                <input type="password" name="newPassword" 
                    placeholder="Новый пароль" autoComplete="new-password"
                    value={this.state.newPassword} 
                    onChange={e => this.handleInput(e.target)} /><br/>
                <button type="button" onClick={this.handleSubmit}>
                    Изменить
                </button>
                {errorMsg}
                {successMsg}
            </form>
        );
    }
}
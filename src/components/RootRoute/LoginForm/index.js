'use strict';

import React from 'react';
import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            errors: []
        };
        this.abortControllers = [];

        this.handleInput = this.handleInput.bind(this);
        this.findErrors = this.findErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendCredentials = this.sendCredentials.bind(this);
    }

    handleInput(target) {
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    
    findErrors() {
        const noUsernameMsg = 'Имя должно содержать минимум 1 символ';
        const diffPasswordsMsg = 'Указанные пароли не совпадают';
        const smallPasswordsMsg = 'Длина пароля должна быть не менее 6 символов';
        const errors = [];

        const haveUsernameLength = this.state.username.length;
        const arePasswordsEqual = this.state.password == this.state.confirmPassword;
        const havePasswordsLessThan6Char = (this.state.password.length < 6 || 
                                                this.state.confirmPassword.length < 6);

        if (!haveUsernameLength) errors.push(noUsernameMsg);
        if (!arePasswordsEqual) errors.push(diffPasswordsMsg);
        if (havePasswordsLessThan6Char) errors.push(smallPasswordsMsg);

        if (!errors.length) return null;

        return errors;
    }

    handleSubmit(e) {
        const action = this.props.pathUrl;
        const username = document.querySelector('input[name="username"]').value;
        const password = this.state.password;
        const body = { username, password };

        if (!username.length || !password.length) return;

        if (this.props.pathUrl == '/signup') {
            const errors = this.findErrors();
            if (errors) this.setState({errors});
            else this.sendCredentials(action, body);
        }
        else this.sendCredentials(action, body);
    }

    sendCredentials(action, body) {
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.authenticate(action, body)
            .then(data => {
                if (data.status == 'Success') {
                    this.props.getUsername();
                    return;
                }
                const errors = [data.message];
                this.setState({errors});
            }).catch(err => console.error('Network error'));
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const confirmPasswordInput = (
            <span>
                <input type="password" name="confirmPassword" 
                        onChange={e => this.handleInput(e.target)}
                        value={this.state.confirmPasswordInput}
                        placeholder="Повторите пароль" required 
                        autoComplete="new-password"/>
                <br/>
            </span>
        );
        const autocompletePsw = this.props.pathUrl == '/signup' ? 'new-password'
                                                                : 'current-password';
        const btnName = this.props.pathUrl == '/signup' ? 'Зарегистрироваться'
                                                        : 'Войти';

        let message = null;

        if (this.state.errors.length) {
            const errors = this.state.errors.map((error, i) => <p key={i}>{error}</p>);
            message = <div>{errors}</div>;
        }

        return (
            <React.Fragment>
                <form id="loggingForm">
                    <input type="text" name="username" 
                            onChange={e => this.handleInput(e.target)}
                            value={this.state.usernameInput}
                            placeholder="Введите имя, ник"
                            autoComplete="username"/>
                    <br/>
                    <input type="password" name="password" 
                            onChange={e => this.handleInput(e.target)}
                            value={this.state.passwordInput}
                            placeholder="Введите пароль"
                            autoComplete={autocompletePsw} />
                    <br/>
                    {this.props.pathUrl == '/signup' && confirmPasswordInput}
                    <button type="button" onClick={this.handleSubmit}>
                        {btnName}
                    </button>
                </form>
                {message}
            </React.Fragment>
        );
    }
    
}
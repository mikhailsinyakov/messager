'use strict';

import React from 'react';
import RequestController from '../../app/controllers/requestController.client';

const requestController = new RequestController();

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            errors: []
        };

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

        const haveUsernameLength = this.state.usernameInput.length;
        const arePasswordsEqual = this.state.passwordInput == this.state.confirmPasswordInput;
        const havePasswordsLessThan6Char = (this.state.passwordInput.length < 6 || 
                                                this.state.confirmPasswordInput.length < 6);

        if (!haveUsernameLength) errors.push(noUsernameMsg);
        if (!arePasswordsEqual) errors.push(diffPasswordsMsg);
        if (havePasswordsLessThan6Char) errors.push(smallPasswordsMsg);

        if (!errors.length) return null;

        return errors;
    }

    handleSubmit(e) {
        const action = `/${this.props.formType}`;
        const username = document.querySelector('input[name="username"]').value;
        const password = this.state.password;

        if (this.props.formType == 'signup') {
            const errors = this.findErrors();
            if (errors) this.setState({errors});
            else this.sendCredentials(action, username, password);
        }
        else this.sendCredentials(action, username, password);
    }

    sendCredentials(action, username, password) {
        requestController.sendCredentials(action, username, password)
            .then(data => {
                if (data.status == 'Success') {
                    this.props.getUsername();
                    return;
                }
                const errors = [data.message];
                this.setState({errors});
            }).catch(err => console.error('Network error'));
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
        const autocompletePsw = this.props.formType == 'signup' ? 'new-password'
                                                                : 'current-password';
        const btnName = this.props.formType == 'signup' ? 'Зарегистрироваться'
                                                    : 'Войти';

        let message = null;

        if (this.state.errors.length) {
            const errors = this.state.errors.map((error, i) => <p key={i}>{error}</p>);
            message = <div>{errors}</div>;
        }

        return (
            <div>
                <form id="loggingForm">
                    <input type="text" name="username" 
                            onChange={e => this.handleInput(e.target)}
                            value={this.state.usernameInput}
                            placeholder="Введите имя, ник" required 
                            autoComplete="username"/>
                    <br/>
                    <input type="password" name="password" 
                            onChange={e => this.handleInput(e.target)}
                            value={this.state.passwordInput}
                            placeholder="Введите пароль" required
                            autoComplete={autocompletePsw} />
                    <br/>
                    {this.props.formType == 'signup' && confirmPasswordInput}
                    <button type="button" onClick={e => this.handleSubmit(e)}>
                        {btnName}
                    </button>
                </form>
                {message}
            </div>
        );
    }
    
}
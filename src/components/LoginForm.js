import React from 'react';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
            errors: []
        };
        this.handleUsernameInput = this.handleUsernameInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleConfirmPasswordInput = this.handleConfirmPasswordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendCredentials = this.sendCredentials.bind(this);
    }

    handleUsernameInput(value) {
        this.setState({usernameInput: value});
    }

    handlePasswordInput(value) {
        this.setState({passwordInput: value});
    }

    handleConfirmPasswordInput(value) {
        this.setState({confirmPasswordInput: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const action = `/${this.props.formType}`;
        if (this.props.formType == 'signup') {
            const noUsernameMsg = 'Имя должно содержать минимум 1 символ';
            const diffPasswordsMsg = 'Указанные пароли не совпадают';
            const smallPasswordsMsg = 'Длина пароля должна быть не менее 6 символов';
            let errors = [];

            const haveUsernameLength = this.state.usernameInput.length;
            const arePasswordsEqual = this.state.passwordInput == this.state.confirmPasswordInput;
            const havePasswordsLessThan6Char = (this.state.passwordInput.length < 6 || 
                                                this.state.confirmPasswordInput.length < 6);

            if (!haveUsernameLength) errors.push(noUsernameMsg);
            if (!arePasswordsEqual) errors.push(diffPasswordsMsg);
            if (havePasswordsLessThan6Char) errors.push(smallPasswordsMsg);
            if (arePasswordsEqual && !havePasswordsLessThan6Char && haveUsernameLength) {
                this.sendCredentials(action);
            }

            this.setState({errors});
        }
        else {
            this.sendCredentials(action);
        }
    }

    sendCredentials(action) {
        const username = document.querySelector('input[name="username"]').value;
        const password = this.state.passwordInput;
        const credentials = `username=${username}&password=${password}`;
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        const options = {
            method: 'POST',
            body: credentials,
            headers: myHeaders,
            credentials: 'include'
        };
        fetch(action, options)
            .then(response => {
                return new Promise((resolve, reject) => {
                    if (response.ok) {
                        this.props.getUsername();
                        return;
                    }
                    resolve(response.text());
                });
            })
            .then(response => {
                const errors = [response];
                this.setState({errors});
            })
            .catch(err => console.error(err));
    }

    render() {
        const confirmPasswordInput = (
            <span>
                <input type="password" name="confirmPassword" 
                        onChange={e => this.handleConfirmPasswordInput(e.target.value)}
                        value={this.state.confirmPasswordInput}
                        placeholder="Повторите пароль" required />
                <br/>
            </span>
        );
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
                            onChange={e => this.handleUsernameInput(e.target.value)}
                            value={this.state.usernameInput}
                            placeholder="Введите имя, ник" required />
                    <br/>
                    <input type="password" name="password" 
                            onChange={e => this.handlePasswordInput(e.target.value)}
                            value={this.state.passwordInput}
                            placeholder="Введите пароль" required />
                    <br/>
                    {this.props.formType == 'signup' && confirmPasswordInput}
                    <button type="submit" onClick={e => this.handleSubmit(e)}>
                        {btnName}
                    </button>
                </form>
                {message}
            </div>
        );
    }
    
}
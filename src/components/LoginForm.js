import React from 'react';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordInput: '',
            confirmPasswordInput: ''
        };
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleConfirmPasswordInput = this.handleConfirmPasswordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePasswordInput(value) {
        this.setState({passwordInput: value});
    }

    handleConfirmPasswordInput(value) {
        this.setState({confirmPasswordInput: value});
    }

    handleSubmit(e) {
        if (this.props.form == 'signup') {
            if (this.state.passwordInput != this.state.confirmPasswordInput ||
                this.state.passwordInput.length < 6) {
                e.preventDefault();
            }
        }
    }

    render() {
        const action = `/${this.props.form}`;
        const confirmPasswordInput = (
            <span>
                <input type="password" name="confirmPassword" 
                        onChange={e => this.handleConfirmPasswordInput(e.target.value)}
                        value={this.state.confirmPasswordInput}
                        placeholder="Повторите пароль" required />
                <br/>
            </span>
        );
        const btnName = this.props.form == 'signup' ? 'Зарегистрироваться'
                                                    : 'Войти';

        return (
            <form action={action} method="POST">
                <input type="text" name="username" 
                        placeholder="Введите имя, ник" required />
                <br/>
                <input type="password" name="password" 
                        onChange={e => this.handlePasswordInput(e.target.value)}
                        value={this.state.passwordInput}
                        placeholder="Введите пароль" required />
                <br/>
                {this.props.form == 'signup' && confirmPasswordInput}
                <button type="submit" onClick={e => this.handleSubmit(e)}>
                    {btnName}
                </button>
            </form>
        );
    }
    
}
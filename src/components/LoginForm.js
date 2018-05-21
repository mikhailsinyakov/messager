import React from 'react';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordInput: '',
            confirmPasswordInput: '',
            errors: []
        };
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleConfirmPasswordInput = this.handleConfirmPasswordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addErrorToErrorsArray = this.addErrorToErrorsArray.bind(this);
        this.deleteErrorFromErrorsArray = this.deleteErrorFromErrorsArray.bind(this);
    }

    handlePasswordInput(value) {
        this.setState({passwordInput: value});
    }

    handleConfirmPasswordInput(value) {
        this.setState({confirmPasswordInput: value});
    }

    handleSubmit(e) {
        if (this.props.form == 'signup') {
            const diffPasswords = 'Указанные пароли не совпадают';
            const smallPasswords = 'Длина пароля должна быть не менее 6 символов';
            let errors = this.state.errors;

            if (this.state.passwordInput != this.state.confirmPasswordInput) {
                errors = this.addErrorToErrorsArray(diffPasswords, errors);
                e.preventDefault();
            }
            else {
                errors = this.deleteErrorFromErrorsArray(diffPasswords, errors);
            }

            if (this.state.passwordInput.length < 6 || 
                this.state.confirmPasswordInput.length < 6) {
                errors = this.addErrorToErrorsArray(smallPasswords, errors);
                e.preventDefault();
            }
            else {
                errors = this.deleteErrorFromErrorsArray(smallPasswords, errors);
            }
            this.setState({errors});
        }
    }

    addErrorToErrorsArray(error, errors) {
        const isErrorExist = !!errors.filter(existedError => error == existedError).length;
        if (!isErrorExist) {
            errors.push(error);
        }
        return errors;
    }

    deleteErrorFromErrorsArray(error) {
        let errors = this.state.errors;
        errors = errors.filter(existedError => error != existedError);
        return errors;
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

        let message = null;

        if (this.state.errors.length) {
            const errors = this.state.errors.map((error, i) => <p key={i}>{error}</p>);
            message = <div>{errors}</div>;
        }

        return (
            <div>
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
                {message}
            </div>
        );
    }
    
}
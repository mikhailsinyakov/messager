import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header';
import LoginForm from './components/LoginForm';

const app = document.querySelector('#app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loginForm: null
        };

        this.showLoginForm = this.showLoginForm.bind(this);
        this.showSignupForm = this.showSignupForm.bind(this);

    }

    showLoginForm() {
        this.setState({loginForm: 'login'});
    }

    showSignupForm() {
        this.setState({loginForm: 'signup'});
    }

    render() {

        const loginForm = this.state.loginForm ? <LoginForm form={this.state.loginForm} />
                                                : null;

        return (
            <div>
                <Header user={this.state.user} showLoginForm={this.showLoginForm}
                        showSignupForm={this.showSignupForm}/>
                {loginForm}
            </div>
        );
    }
    
}

ReactDOM.render(<App/>, app);
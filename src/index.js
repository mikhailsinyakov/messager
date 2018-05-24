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
            loginForm: null,
            gotUsername: false
        };

        this.sendGetRequest = this.sendGetRequest.bind(this);
        this.addUserToStateOrShowForm = this.addUserToStateOrShowForm.bind(this);
        this.showLoginForm = this.showLoginForm.bind(this);
        this.showSignupForm = this.showSignupForm.bind(this);

    }

    sendGetRequest(url) {
        return new Promise((resolve, reject) => {
            const options = {
                credentials: 'include'
            };
            fetch(url, options)
                .then(response => response.text())
                .then(username => resolve(username))
                .catch(err => reject(err));
        });
        
    }

    addUserToStateOrShowForm(username) {
        if (username) {
            this.setState({user: username, gotUsername: true});
        }
        else {
            this.showLoginForm();
            this.setState({gotUsername: true});
        }
    }

    showLoginForm() {
        this.setState({loginForm: 'login'});
    }

    showSignupForm() {
        this.setState({loginForm: 'signup'});
    }

    componentDidMount() {
        this.sendGetRequest('/api/getUsername')
            .then(this.addUserToStateOrShowForm)
            .catch(err => console.error(err));
    }

    render() {

        const loginForm = this.state.loginForm ? <LoginForm form={this.state.loginForm} />
                                                : null;

        return (
            <div>
                <Header user={this.state.user} gotUsername={this.state.gotUsername}
                        showLoginForm={this.showLoginForm}
                        showSignupForm={this.showSignupForm} 
                        sendGetRequest={this.sendGetRequest}/>
                {loginForm}
            </div>
        );
    }
    
}

ReactDOM.render(<App/>, app);
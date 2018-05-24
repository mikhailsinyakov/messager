import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import Header from './components/Header';
import Main from './components/Main';

const app = document.querySelector('#app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            updated: false
        };

        this.sendGetRequest = this.sendGetRequest.bind(this);
        this.addUserToState = this.addUserToState.bind(this);
        this.getUsername = this.getUsername.bind(this);
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

    addUserToState(username) {
        const user = username ? username : null;
        this.setState({user});
    }

    getUsername() {
        this.sendGetRequest('/api/getUsername')
            .then(this.addUserToState)
            .catch(err => console.error(err));
    }

    componentDidMount() {
        this.getUsername();
    }

    componentWillUpdate() {
        if (!this.state.updated) {
            this.setState({updated: true});
        }
    }

    render() {

        return (
            <div>
                <Header user={this.state.user} updated={this.state.updated}
                        sendGetRequest={this.sendGetRequest}/>
                <Main user={this.state.user} getUsername={this.getUsername}
                        updated={this.state.updated}/>
            </div>
        );
    }
    
}

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), app);
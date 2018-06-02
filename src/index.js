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
            username: null,
            updated: false
        };

        this.sendGetRequest = this.sendGetRequest.bind(this);
        this.addUserToState = this.addUserToState.bind(this);
        this.getUsername = this.getUsername.bind(this);
    }

    sendGetRequest(url) {
        return new Promise((resolve, reject) => {
            const options = {
                credentials: 'same-origin'
            };
            fetch(url, options)
                .then(response => response.text())
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
        
    }

    addUserToState(username) {
        username = username ? username : null;
        this.setState({username});
    }

    getUsername() {
        this.sendGetRequest('/api/users/current?onlyUsername=true')
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
                <Header username={this.state.username} updated={this.state.updated}
                        sendGetRequest={this.sendGetRequest}/>
                <Main username={this.state.username} getUsername={this.getUsername}
                        updated={this.state.updated} sendGetRequest={this.sendGetRequest}/>
            </div>
        );
    }
    
}

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), app);
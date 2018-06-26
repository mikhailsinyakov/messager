'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            users: []
        };

        this.abortControllers = [];
        this.handleInput = this.handleInput.bind(this);
        this.handleSearchResults = this.handleSearchResults.bind(this);
        this.handleImgError = this.handleImgError.bind(this);
    }

    handleInput(e) {
        const value = e.target.value;
        this.setState({query: value});
    }

    handleSearchResults() {
        const query = this.state.query;
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.getSearchResults(query, signal)
            .then(data => this.setState({users: data.users}))
            .catch(err => console.error('Network error'));
    }

    handleImgError(e) {
        e.target.src = '/public/photos/placeholder.png';
    }

    componentDidMount() {
        this.handleSearchResults();
    }
    
    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.query != prevState.query) this.handleSearchResults();
    }

    render() {

        const users = this.state.users.map((val, i) => (
            <div key={i}> 
                <Link to={`/users/${val.username}/info`}>
                    <img src={`/public/photos/${val.username}-avatar.jpg`}
                        height={100}
                        onError={this.handleImgError} />
                </Link>
                <Link to={`/users/${val.username}/info`}>
                    {val.firstName &&  val.lastName 
                        ? <span> {val.firstName} {val.lastName}</span> 
                        : <span>{val.username}</span>}
                </Link>
                
            </div>
        ));

        return (
            <div id="search">
                <input type="text" name="query" placeholder="Введите запрос"
                    onChange={this.handleInput} value={this.state.query} />
                <div id="users">
                    {users}
                </div>
            </div>
        );
    }
}
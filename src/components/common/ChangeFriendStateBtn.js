'use strict';

import React from 'react';
import FriendshipController from '@app/controllers/friendshipController.client';
import websocket from '@app/websocket/client';

const friendshipController = new FriendshipController();

export default class changeFriendStateBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.abortControllers = [];
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick() {
        const { username: username1, friendUsername: username2, newFriendState } = this.props;
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);

        friendshipController.changeFriendshipState(username1, username2, newFriendState, signal)
            .then(data => {
                if (data.status == 'Success') {
                    websocket.send('usernamesWithChangedStatus', { username1, username2 });
                }
            }).catch(err => console.error('Network error'));
    }
    
    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        return (
            <button type="button" onClick={this.handleClick}>
                {this.props.description}
            </button>
        );
    }
}
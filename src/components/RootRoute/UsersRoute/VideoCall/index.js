'use strict';

import React from 'react';
import { Redirect } from 'react-router-dom';
import websocket from '@app/websocket/client';

export default class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        const { username: currUsername, match } = this.props;
        const { username, friendUsername } = match.params;
        this.currUsername = currUsername;
        this.username = username;
        this.friendUsername = friendUsername;
        this.state = {
            
        };
        this.askForPermission = this.askForPermission.bind(this);
    }


    askForPermission() {
        const constraints = { video: true, audio: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {})
            .catch(err => console.error(err));
    }

    componentDidMount() {
        this.askForPermission();
    }


    render() {
        
        return (
                <h1>Ok</h1>
            );


    }
    
}
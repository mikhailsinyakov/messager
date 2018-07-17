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
        this.myCamStream = null;
        this.myCamRef = React.createRef();
        this.state = {
            
        };
        this.getMedia = this.getMedia.bind(this);
        this.broadcastStreamOn = this.broadcastStreamOn.bind(this);
        this.stopBroadcastStreamFrom = this.stopBroadcastStreamFrom.bind(this);
    }

    getMedia(video, audio) {
        return navigator.mediaDevices.getUserMedia({ video, audio });
    }

    broadcastStreamOn(ref) {
        ref.current.srcObject = this.myCamStream;
    }

    stopBroadcastStreamFrom(ref) {
        ref.current.srcObject = null;
        this.myCamStream.getTracks()[0].stop();
    }

    componentDidMount() {
        this.getMedia(true, false)
            .then(stream => {
                this.myCamStream = stream;
                this.assignStreamToVideoElement(this.myCamRef);
            })
            .catch(err => console.error(err));
    }

    componentWillUnmount() {
        this.stopBroadcastStreamFrom(this.myCamRef);
    }

    render() {
        
        return (
                <video ref={this.myCamRef} width="400" height="250" autoPlay></video>
            );


    }
    
}
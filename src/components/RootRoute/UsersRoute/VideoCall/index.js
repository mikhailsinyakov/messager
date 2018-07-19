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
        this.myVideoRef = React.createRef();
        this.state = {
            
        };
        this.getMedia = this.getMedia.bind(this);
        this.playStream = this.playStream.bind(this);
        this.stopPlayingStream = this.stopPlayingStream.bind(this);
    }

    getMedia(video, audio) {
        return navigator.mediaDevices.getUserMedia({ video, audio });
    }

    playStream(ref, stream) {
        ref.current.srcObject = stream;
    }

    stopPlayingStream(ref) {
        const stream = ref.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        ref.current.srcObject = null;
    }

    componentDidMount() {
        this.getMedia(true, true)
            .then(myCamStream => {
                const videoTrack = myCamStream.getVideoTracks()[0].clone();
                const myCamVideoStream = new MediaStream([videoTrack]);

                this.playStream(this.myVideoRef, myCamVideoStream);
            })
            .catch(err => console.error(err));
    }

    componentWillUnmount() {
        this.stopPlayingStream(this.myVideoRef);
    }

    render() {
        
        return (
                <video ref={this.myVideoRef} width="400" height="250" autoPlay></video>
            );


    }
    
}
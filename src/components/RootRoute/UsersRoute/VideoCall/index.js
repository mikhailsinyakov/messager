'use strict';

import React from 'react';
import { Redirect } from 'react-router-dom';
import websocket from '@app/websocket/client';
import adapter from 'webrtc-adapter';

export default class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        const { username: currUsername, match } = this.props;
        const { username, friendUsername, isCaller } = match.params;
        this.currUsername = currUsername;
        this.username = username;
        this.friendUsername = friendUsername;
        this.isCaller = isCaller;
        this.localVideoRef = React.createRef();
        this.remoteVideoRef = React.createRef();
        this.state = {
            
        };
        this.wsListenIds = [];
        this.createPeerConnection = this.createPeerConnection.bind(this);
        this.getLocalMedia = this.getLocalMedia.bind(this);
        this.playStream = this.playStream.bind(this);
        this.stopPlayingStream = this.stopPlayingStream.bind(this);
    }

    createPeerConnection() {
        const { username: username1, friendUsername: username2 } = this;

        const stunServers = [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302"
        ];
        const iceServers = [{urls: stunServers}];
        const configuration = { iceServers };

        const pc = new RTCPeerConnection(configuration);
        const gotSDP = sdp => {
            pc.setLocalDescription(sdp)
                .then(() => websocket.send('RTCSignalling', { username1, username2, sdp }))
                .catch(err => console.err(error));
        };
        const gotMessage = obj => {
            if (obj.sdp) {
                pc.setRemoteDescription(new RTCSessionDescription(obj.sdp))
                    .then(() => {
                        if (obj.sdp.type == 'offer') {
                            pc.createAnswer()
                                .then(gotSDP)
                                .catch(err => console.error(err));
                        }
                    })
            }
            else if (obj.ice) {
                pc.addIceCandidate(new RTCIceCandidate(obj.ice))
                    .catch(err => console.error(err));
            }
        }

        this.getLocalMedia(true, true)
            .then(localStream => {
                this.playStream(this.localVideoRef, localStream);
                localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
                if (this.isCaller == 'true') {
                    pc.createOffer()
                        .then(gotSDP)
                        .catch(err => console.err(error));
                }
                pc.onicecandidate = e => {
                    if (e.candidate) {
                        websocket.send('RTCSignalling', 
                            { username1, username2, ice: e.candidate });
                    }
                };
                pc.ontrack = e => {
                    console.log(e.streams[0])
                    this.playStream(this.remoteVideoRef, e.streams[0])
                };
                pc.oniceconnectionstatechange = e => console.log(pc.iceConnectionState)
            })
            .catch(err => console.error(err));

        const id = websocket.subscribe('RTCSignalling', gotMessage);
        this.wsListenIds = [ ...this.wsListenIds, id ];
    }

    getLocalMedia(video, audio) {
        if (this.isCaller == 'true') {
            audio = false;
        }
        else video = false;
        return navigator.mediaDevices.getUserMedia({ video, audio });
    }

    playStream(ref, stream) {
        ref.current.srcObject = stream;
    }

    stopPlayingStream(ref) {
        const stream = ref.current.srcObject;
        if (!stream) return;//
        stream.getTracks().forEach(track => track.stop());
        ref.current.srcObject = null;
    }

    componentDidMount() {
        this.createPeerConnection();
    }

    componentWillUnmount() {
        this.stopPlayingStream(this.localVideoRef);
        this.stopPlayingStream(this.remoteVideoRef);
        this.wsListenIds.forEach(id => websocket.unsubscribe(id) );
    }

    render() {
        
        return (
                <React.Fragment>
                    <video ref={this.localVideoRef} width="400" height="250" autoPlay muted></video>
                    <video ref={this.remoteVideoRef} width="800" height="500" autoPlay></video>
                </React.Fragment>
            );


    }
    
}
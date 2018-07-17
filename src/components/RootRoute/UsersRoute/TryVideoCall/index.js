'use strict';

import React from 'react';
import { Redirect } from 'react-router-dom';
import websocket from '@app/websocket/client';

export default class TryVideoCall extends React.Component {
    constructor(props) {
        super(props);
        const { username: currUsername, match } = this.props;
        const { username, friendUsername, isCaller } = match.params;
        this.currUsername = currUsername;
        this.username = username;
        this.friendUsername = friendUsername;
        this.isCaller = isCaller;
        this.state = {
            mediaDevicesStatus: 'no answer',
            callStatus: isCaller == 'false' ? 'answer' : 'waiting',
            wsListenIds: []
        };
        this.sendRespond = this.sendRespond.bind(this);
        this.listenWebsocket = this.listenWebsocket.bind(this);
        this.receivedMessage = this.receivedMessage.bind(this);
        this.changeMediaDevicesStatus = this.changeMediaDevicesStatus.bind(this);
        this.askForPermission = this.askForPermission.bind(this);
    }

    sendRespond(respond) {
        const { isCaller, username, friendUsername } = this;
        const caller = isCaller == 'true' ? username : friendUsername;
        const receiver = isCaller == 'false' ? username : friendUsername;
        let type;
        if (isCaller == 'true') {
            if (respond) type = 'start';
            else type = 'stop';
        }
        else {
            if (respond) type = 'answer';
            else type = 'deny';
        }
        const obj = { caller, receiver, type };
        websocket.send('videoCall', obj);
    }

    listenWebsocket() {
        const id = websocket.subscribe('videoCall', this.receivedMessage);
        const wsListenIds = [...this.state.wsListenIds, id];
        this.setState({ wsListenIds });
    }

    receivedMessage(obj) {
        const { type } = obj;
        if (type == 'answer') this.setState({callStatus: 'answer'});
        else this.setState({ callStatus: 'denied' });
    }

    changeMediaDevicesStatus(status) {
        this.setState({mediaDevicesStatus: status});
    }

    askForPermission() {
        const constraints = { video: true, audio: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(() => {
                this.changeMediaDevicesStatus('allowed');
                this.sendRespond(true);
                if (this.isCaller == 'true') this.listenWebsocket();
            }).catch(err => {
                if (err.name == 'PermissionDeniedError') {
                    this.changeMediaDevicesStatus('not allowed');
                }
                else if (err.name == 'NotFoundError') {
                    this.changeMediaDevicesStatus('not found');
                }
                this.sendRespond(false);
                setTimeout(() => this.changeMediaDevicesStatus('forbidden'), 3000);
            });
    }

    componentDidMount() {
        this.askForPermission();
    }

    componentWillUnmount() {
        this.state.wsListenIds.forEach(id => websocket.unsubscribe(id));
        this.sendRespond(false);
    }


    render() {
        if (this.currUsername != this.username) {
            return <Redirect to={`/users/${this.currUsername}/info`}/>
        }
        const { mediaDevicesStatus, callStatus } = this.state;

        if (mediaDevicesStatus != 'allowed') {
            if (mediaDevicesStatus != 'forbidden') {
                let message;
                if (mediaDevicesStatus == 'no answer') {
                    message = 'Пожалуйста, разрешите использование камеры и микрофона';
                }
                else if (mediaDevicesStatus == 'not found') {
                    message = 'У Вас нет устройств, необходимых для видеосвязи';
                }
                else {
                    message = 'Вы запретили использование камеры и микрофона';
                }
                return <h1>{message}</h1>
            }
            else {
                return <Redirect to={`/users/${this.username}/info`}/>;
            }
        }

        if (callStatus == 'answer') {
            return (
                <Redirect 
                    to={`/users/${this.username}/videocall/${this.friendUsername}`}
                />
            );
        }
        else  {
            let message;
            if (callStatus == 'waiting') message = `Ожидайте ответа от ${this.friendUsername}`;
            else message = `${this.friendUsername} отклонил Ваш вызов`;

            return <h1>{message}</h1>;
        }

    };
    
}
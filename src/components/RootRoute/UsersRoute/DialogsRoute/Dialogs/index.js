'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import websocket from '@app/websocket/client';
import dateToPrettierFormat from '@src/helpers/dateToPrettierFormat';

import DialogController from '@app/controllers/dialogController.client';

const dialogController = new DialogController();

export default class Dialogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogs: []
        };
        this.getAndUpdateDialogs = this.getAndUpdateDialogs.bind(this);
        this.listenOnWSEvents = this.listenOnWSEvents.bind(this);
        this.updateDialogs = this.updateDialogs.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.abortControllers = [];
        this.wsListenId = [];
    }

    getAndUpdateDialogs() {
        const controller = new AbortController();
        const signal = controller.signal;
        this.abortControllers.push(controller);

        const { username } = this.props;
        dialogController.getAllDialogsInfo(username, signal)
            .then(response => {
                if (response.status == 'Success') {
                    this.updateDialogs(response.dialogs);
                }
            })
            .catch(err => console.error('Network error'));
    }

    updateDialogs(dialogs) {
        this.setState({ dialogs });
    }

    listenOnWSEvents() {
        const id1 = websocket.subscribe('newMessage', this.getAndUpdateDialogs);
        const id2 = websocket.subscribe('newMessageStatus', this.getAndUpdateDialogs);
        this.wsListenId.push(id1, id2);
    }

    handleClick(url) {
        window.location.href = url;
    }

    componentDidMount() {
        this.getAndUpdateDialogs();
        this.listenOnWSEvents();
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
        this.wsListenId.forEach(websocket.unsubscribe);
    }

    render() {
        const { match: { url } } = this.props;
        const dialogs = this.state.dialogs.map((dialog, i) => {
            const { penPalUsername, lastMessage } = dialog;
            const { text, read, date, sender } = lastMessage;
            let divClass = 'dialog-item';
            if (sender != penPalUsername ) divClass += ' right-align';
            let lastMessageClass = 'last-message';
            if (!read) lastMessageClass += ' not-read';
            return (
                <div className={divClass} key={i} 
                    onClick={() => this.handleClick(`${url}/${penPalUsername}`)}>
                        <h3 className="username">{penPalUsername}</h3>
                        <div className={lastMessageClass}>
                            <p className="text">{text}</p>
                            <p className="date">{dateToPrettierFormat(new Date(date))}</p>
                        </div>
                </div>
            )
        });

        return (
            <div className="dialogs">
                <h2>Диалоги</h2>
                {dialogs}
            </div>
        );
        
    }
}
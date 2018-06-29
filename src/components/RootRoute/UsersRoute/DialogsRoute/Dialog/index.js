'use strict';

import React from 'react';
import { Link } from 'react-router-dom';

import DialogController from '@app/controllers/dialogController.client';
import dateToPrettierFormat from '@src/helpers/dateToPrettierFormat';

const dialogController = new DialogController();

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.updateMessages = this.updateMessages.bind(this);
        this.abortControllers = [];
    }

    updateMessages(messages) {
        this.setState({ messages });
    }

    componentDidMount() {
        const controller = new AbortController();
        const signal = controller.signal;
        this.abortControllers.push(controller);

        const { username, match: { params: { penPalUsername } } } = this.props;
        dialogController.getDialogInfo(username, penPalUsername, signal)
            .then(response => {
                if (response.status == 'Success') {
                    this.updateMessages(response.messages);
                }
            })
            .catch(err => console.error('Network error'));
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const messages = this.state.messages.map(message => {
            const { username } = this.props;
            const { sender, text, read } = message;
            let { date } = message;
            date = dateToPrettierFormat(new Date(date));
            let className =  '';
            if (sender == username) className += 'right-align';
            if (!read) className += ' not-read';

            return (
                <p className={className} key={date}>
                    {date}
                    {text}
                </p>
            )
        });

        return (
            <div>
                {messages}
            </div>
        );
    }
}
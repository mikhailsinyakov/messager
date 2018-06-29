'use strict';

import React from 'react';
import { Link } from 'react-router-dom';

import DialogController from '@app/controllers/dialogController.client';

const dialogController = new DialogController();

export default class Dialogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogs: []
        };
        this.updateDialogs = this.updateDialogs.bind(this);
        this.abortControllers = [];
    }

    updateDialogs(dialogs) {
        this.setState({ dialogs });
    }

    componentDidMount() {
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

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const { match: { url } } = this.props;
        const dialogs = this.state.dialogs.map((dialog, i) => {
            const { penPalUsername, lastMessage } = dialog;
            return (
                <div key={i}>
                    <Link to={`${url}/${penPalUsername}`}>
                        <p>{penPalUsername}</p>
                        <p>{lastMessage.text}</p>
                    </Link>
                </div>
            )
        });

        return (
            <div id="dialogs">
                {dialogs}
            </div>
        );
        
    }
}
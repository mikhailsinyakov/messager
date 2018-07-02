'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import websocket from '@app/websocket/client';

import DialogController from '@app/controllers/dialogController.client';
import dateToPrettierFormat from '@src/helpers/dateToPrettierFormat';

const dialogController = new DialogController();

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            newMessage: '',
            error: null
        };
        this.updateMessages = this.updateMessages.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.addErrorTooltip = this.addErrorTooltip.bind(this);
        this.abortControllers = [];
    }

    updateMessages(messages) {
        this.setState({ messages });
    }

    handleInput(e) {
        this.setState({newMessage: e.target.value});
    }

    handleSubmit() {
        const { username, match: { params: { penPalUsername } } } = this.props;
        const { newMessage: text } = this.state;
        websocket.sendMessage(username, penPalUsername, text);
        this.setState({newMessage: ''});
    }

    addMessage(message) {
        const { messages } = this.state;
        messages.push(message);
        this.setState({messages});
    }

    addErrorTooltip(error) {
        this.setState({error});
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

        websocket.gotNewMessage(obj => this.addMessage(obj.message));
        websocket.gotError(obj => {
            if (obj.errName == 'Specified user doesn\'t exist') {
                this.addErrorTooltip(obj.message);
            }
        });
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const messages = this.state.messages.map((message, i) => {
            const { username } = this.props;
            const { sender, text, read } = message;
            let { date } = message;
            date = dateToPrettierFormat(new Date(date));
            
            const messageClass = classnames({
                'right-align': sender == username,
                'not-read': !read
            });

            return (
                <p className={messageClass} key={i}>
                    {date}
                    {text}
                </p>
            )
        });

        const error = this.state.error 
            ? <p>Пользователь, которому вы написали сообщение не существует</p> 
            : null;

        return (
            <div>
                {messages}
                <input type="text" value={this.state.newMessage} onChange={this.handleInput}/>
                <button type="button" onClick={this.handleSubmit}>Отправить</button>
                {error}
            </div>
        );
    }
}
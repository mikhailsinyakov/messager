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
        this.getAndUpdateMessages = this.getAndUpdateMessages.bind(this);
        this.listenOnWSEvents = this.listenOnWSEvents.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.updateMessageStatus = this.updateMessageStatus.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.addErrorTooltip = this.addErrorTooltip.bind(this);
        this.checkIfAnotherUnreadMessages = this.checkIfAnotherUnreadMessages.bind(this);
        this.sendUnreadMessagesIndexesIfAny = this.sendUnreadMessagesIndexesIfAny.bind(this);
        this.abortControllers = [];
    }

    getAndUpdateMessages() {
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

    listenOnWSEvents() {
        websocket.gotNewMessage(obj => this.addMessage(obj.message));
        websocket.gotNewMessageStatus(obj => this.updateMessageStatus(obj));
        websocket.gotError(obj => {
            if (obj.errName == 'Specified user doesn\'t exist') {
                this.addErrorTooltip(obj.message);
            }
        });
    }
 
    updateMessages(messages) {
        this.setState({ messages });
    }

    updateMessageStatus(obj) {
        const { username1, username2, index } = obj;
        const { username, match: { params: { penPalUsername } } } = this.props;
        if ((username == username1 && penPalUsername == username2) ||
            (username == username2 && penPalUsername == username1)) {
                const { messages } = this.state;
                messages[index].read = true;
                this.setState({messages});
            }
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
        let { messages } = this.state;
        messages = [...messages, message];
        this.setState({messages});
    }

    addErrorTooltip(error) {
        this.setState({error});
    }

    checkIfAnotherUnreadMessages() {
        const { messages } = this.state;
        const { username } = this.props;
        const indexes = [];
        messages.forEach((message, i) => {
            if (message.sender != username && !message.read) {
                indexes.push(i);
            }
        });
        return indexes;
    }

    sendUnreadMessagesIndexesIfAny() {
        const { username, match: { params: { penPalUsername } } } = this.props;
        const anotherUnreadMessages = this.checkIfAnotherUnreadMessages();
        anotherUnreadMessages.forEach(index => {
            websocket.sendChangedMessagesIndexes(username, penPalUsername, index);
        });
    }

    componentDidMount() {
        this.getAndUpdateMessages();
        this.listenOnWSEvents();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length != this.state.messages.length) {
            this.sendUnreadMessagesIndexesIfAny();
        }
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
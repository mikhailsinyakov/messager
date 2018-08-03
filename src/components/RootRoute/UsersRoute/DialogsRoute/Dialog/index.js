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
            penPalIsTyping: false,
            timerId: null,
            error: null
        };
        this.getAndUpdateMessages = this.getAndUpdateMessages.bind(this);
        this.listenOnWSEvents = this.listenOnWSEvents.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.updateMessageStatus = this.updateMessageStatus.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.toggleTypingMessage = this.toggleTypingMessage.bind(this);
        this.addErrorTooltip = this.addErrorTooltip.bind(this);
        this.checkIfAnotherUnreadMessages = this.checkIfAnotherUnreadMessages.bind(this);
        this.sendUnreadMessagesIndexesIfAny = this.sendUnreadMessagesIndexesIfAny.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.abortControllers = [];
        this.wsListenId = [];
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
        const id1 = websocket.subscribe('newMessage', obj => this.addMessage(obj.message));
        const id2 = websocket.subscribe('newMessageStatus', this.updateMessageStatus);
        const id3 = websocket.subscribe('userIsTyping', this.toggleTypingMessage)
        const id4 = websocket.subscribe('error', obj => {
            if (obj.errName == 'Specified user doesn\'t exist') {
                this.addErrorTooltip(obj.message);
            }
        });
        this.wsListenId.push(id1, id2, id3, id4);
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

    toggleTypingMessage(obj) {
        const { username, 
            match: { params: { penPalUsername } } } = this.props;
        const { username1, username2 } = obj;
        if (username1 != penPalUsername) return;
        
        if (this.state.timerId) clearTimeout(this.state.timerId);
        const timerId = setTimeout(() => {
            this.setState({penPalIsTyping: false, timerId: null})
        }, 1000);
        this.setState({penPalIsTyping: true, timerId});
        
    }

    handleInput(e) {
        const { username: username1, 
            match: { params: { penPalUsername: username2 } } } = this.props;
        websocket.send('userIsTyping', { username1, username2 });
        this.setState({newMessage: e.target.value});
    }

    handleKeyPress(e) {
        if (e.key == 'Enter') this.handleNewMessage();
    }

    handleSubmit() {
        this.handleNewMessage();
    }

    handleNewMessage() {
        const { username: username1, 
            match: { params: { penPalUsername: username2 } } } = this.props;
        const { newMessage: text } = this.state;
        websocket.send('message', { username1, username2, text });
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
        const { username: username1, 
            match: { params: { penPalUsername: username2 } } } = this.props;
        const anotherUnreadMessages = this.checkIfAnotherUnreadMessages();
        anotherUnreadMessages.forEach(index => {
            websocket.send('indexOfChangedMessage', { username1, username2, index });
        });
    }

    scrollToBottom() {
        const page = document.documentElement;
        page.scrollTop = page.scrollHeight;
    }

    componentDidMount() {
        this.getAndUpdateMessages();
        this.listenOnWSEvents();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length != this.state.messages.length) {
            this.sendUnreadMessagesIndexesIfAny();
        }
        if (prevState.messages.length != this.state.messages.length || 
            (!prevState.penPalIsTyping && this.state.penPalIsTyping)) {
                this.scrollToBottom();
            }
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
        this.wsListenId.forEach(websocket.unsubscribe);
    }

    render() {
        const { username, match: { params: { penPalUsername } } } = this.props;
        const messages = this.state.messages.map((message, i) => {
            const { sender, text, read } = message;
            let { date } = message;
            date = dateToPrettierFormat(new Date(date));
            
            const messageClass = classnames({
                'message': true,
                'not-read': !read
            });
            const messageWrapperClass = classnames({
                'message-wrapper': true,
                'right-align': sender == username
            });

            return (
                <div className={messageWrapperClass} key={i}>
                    <div className={messageClass}>
                        <p className="text">{text}</p>
                        <p className="date">{date}</p>
                    </div>
                </div>
            );
        });

        const error = this.state.error 
            ? <p className="error">Пользователь, которому вы написали сообщение не существует</p> 
            : null;

        return (
            <div className="dialog">
                {messages}
                {this.state.penPalIsTyping && <p>{penPalUsername} печатает сообщение</p>}
                <input type="text" autoFocus
                    value={this.state.newMessage} onChange={this.handleInput}
                    onKeyPress={this.handleKeyPress}/>
                <button type="button" onClick={this.handleSubmit}>Отправить</button>
                {error}
            </div>
        );
    }
}
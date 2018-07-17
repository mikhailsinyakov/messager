'use strict';

const WebSocket = require('ws');
const DialogController = require('../controllers/dialogController.server');

const dialogController = new DialogController();

module.exports = function handleWebSocketConnection(server) {
    
    const ws = new WebSocket.Server({server});
    const activeUsers = {};

    const getOnlineUsers = () => {
        const users = [];
        for (const username in activeUsers) {
            users.push(username);
        }
        return users;
    };
    const sendMessageToAllUsers = outgoingBody => {
        for (const username in activeUsers) {
            const outgoingMessage = JSON.stringify(outgoingBody);
            activeUsers[username].forEach(connection => {
                connection.send(outgoingMessage);
            });
        }
    };
    const sendOnlineUsers = () => {
        const onlineUsers = getOnlineUsers();
        const outgoingBody = {
            event: 'list of online users has changed',
            onlineUsers
        };
        sendMessageToAllUsers(outgoingBody);
    };

    ws.on('connection', connection => {
        let currUser = {};

        connection.on('message', incomingMessage => {
            const incomingBody = JSON.parse(incomingMessage);
            const { event } = incomingBody;

            if (event == 'connection is open') {
                const { username } = incomingBody;
                currUser.username = username;
                if (!activeUsers[currUser.username]) {
                    const id = 0;
                    activeUsers[currUser.username] = [connection];
                    currUser.id = id;
                }
                else {
                    const id = activeUsers[currUser.username].length;
                    activeUsers[currUser.username].push(connection);
                    currUser.id = id;
                }
                sendOnlineUsers();

            }
            else if (event == 'friendship status changed') {
                const { username1, username2 } = incomingBody;

                for (const username in activeUsers) {
                    if (username == username1 || username == username2) {
                        const outgoingBody = {event: 'friendship status changed'};
                        const outgoingMessage = JSON.stringify(outgoingBody);
                        activeUsers[username].forEach(connection => {
                            connection.send(outgoingMessage);
                        });
                    }
                }
            }
            else if (event == 'new message') {
                const { username1, username2, text } = incomingBody;
                dialogController.addMessage(username1, username2, text)
                    .then(message => {
                        for (const username in activeUsers) {
                            if (username == username1 || username == username2) {
                                const outgoingBody = {event: 'new message', message};
                                const outgoingMessage = JSON.stringify(outgoingBody);
                                activeUsers[username].forEach(connection => {
                                    connection.send(outgoingMessage);
                                });
                            }
                        }
                    })
                    .catch(err => {
                        if (err == 'Specified user doesn\'t exist') {
                            const outgoingBody = {event: 'error', errName: err};
                            const outgoingMessage = JSON.stringify(outgoingBody);
                            activeUsers[username1].forEach(connection => {
                                connection.send(outgoingMessage);
                            });
                        }
                    })
            }
            else if (event == 'message status has changed') {
                const { username1, username2, index } = incomingBody;
                dialogController.changeStatusOfMessage(username1, username2, index)
                    .then(() => {
                        const outgoingBody = { ...incomingBody };
                        const outgoingMessage = JSON.stringify(outgoingBody);
                        for (const username in activeUsers) {
                            if (username == username1 || username == username2) {
                                activeUsers[username].forEach(connection => {
                                    connection.send(outgoingMessage);
                                });
                            }
                        }
                    }).catch(err => console.error(err));
            }
            else if (event == 'user is typing') {
                const { username1, username2 } = incomingBody;
                const outgoingBody = { ...incomingBody };
                const outgoingMessage = JSON.stringify(outgoingBody);
                for (const username in activeUsers) {
                    if (username == username2) {
                        activeUsers[username].forEach(connection => {
                            connection.send(outgoingMessage);
                        });
                    }
                }
            }
            else if (event == 'video call') {
                const { caller, receiver, type } = incomingBody;
                const outgoingBody = { ...incomingBody };
                const outgoingMessage = JSON.stringify(outgoingBody);
                let toWho;
                if (type == 'start' || type == 'stop') toWho = receiver;
                else toWho = caller;
                for (const username in activeUsers) {
                    if (username == toWho) {
                        activeUsers[username].forEach(connection => {
                            connection.send(outgoingMessage);
                        });
                    }
                }
                
            }

        });

        connection.on('close', () => {
            if (currUser.username) {
                if (activeUsers[currUser.username].length == 1) {
                    delete activeUsers[currUser.username];
                }
                else {
                    activeUsers[currUser.username].splice(currUser.id, 1);
                }
            }
            sendOnlineUsers();
        });
    });

}
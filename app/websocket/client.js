'use strict';

export default (function websocket() {

    let ws;

    function createConnection() {
        if (!ws) {
            const host = process.env.APP_HOST;
            const port = process.env.PORT;
            const uri = `ws://${host}:${port}`;
            ws = new WebSocket(uri);
        }
    }

    function ready (fn) {
        let fails = 0;
        if (ws.readyState == 0) {
            ws.addEventListener('open', fn);
        }
        else if (ws.readyState == 1) fn();
        else {
            fails++;
            if (fails < 5) {
                createConnection();
                ready(fn);
            }
            else {
                console.error('Failed to recreate WebSocket connection');
            }
        }
    }

    function sendJSON (obj) {
        ws.send(JSON.stringify(obj));
    }

    function sendUsername (username) {
        ready(() => sendJSON({event: 'connection is open', username}));
    }

    function sendUsernamesWithChangedStatus (username1, username2) {
        ready(() => sendJSON({event: 'friendship status changed', username1, username2}));
    }

    function sendMessage(username1, username2, text) {
        ready(() => sendJSON({event: 'new message', username1, username2, text}));
    }

    function onMessage (event, fn) {
        if (!ws) createConnection();
        ws.addEventListener('message', message => {
            const { data } = message;
            const obj = JSON.parse(data);
            if (obj.event == event) fn();
        });
    }
    
    function friendshipStatusChanged (fn) {
        onMessage('friendship status changed', fn)
    }

    function close() {
        ws.close();
    }

    return {
        createConnection,
        sendUsername,
        sendUsernamesWithChangedStatus,
        friendshipStatusChanged,
        close,
        sendMessage
    }

})();
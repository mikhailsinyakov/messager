'use strict';

export default (function websocket() {

    let ws;
    let subscribers = {};

    const createConnection = () => {
        const host = process.env.APP_HOST;
        const port = process.env.PORT;
        const scheme = process.env.SECURE == 'true' ? 'wss' : 'ws';
        console.log({host})
        console.log({port})
        console.log({scheme})
        console.log(process.env.APP_HOST)
        console.log(process.env.PORT)
        console.log(process.env.SECURE)
        const uri = `${scheme}://${host}:${port}`;
        ws = new WebSocket(uri);
    };

    const ready = fn => {
        if (!ws) createConnection();
        let fails = 0;
        if (ws.readyState == 0) {
            ws.addEventListener('open', fn);
        }
        else if (ws.readyState == 1) {
            fn();
        }
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
    };

    const listenMessages = () => {
        ready(() => {
            ws.addEventListener('message', message => {
                const { data } = message;
                const obj = JSON.parse(data);
                const { event } = obj;
                for (const id in subscribers) {
                    if (event == subscribers[id].event) {
                        subscribers[id].fn(obj);
                    }
                }
            });
        });
    }

    const sendJSON = obj => ready(() => ws.send(JSON.stringify(obj)));

    const subscribe =  (event, fn) => {
        const id = +new Date() + Math.random();
        subscribers[id] = { event, fn };
        return id;
    };
    
    const unsubscribe =  id => {
        delete subscribers[id];
    };

    const closeConnection = () => {
        ws.close();
        subscribers = {};
    };

    return {
        create: () => {
            createConnection();
            listenMessages()
        },
        send: (name, obj) => {
            let event;
            if (name == 'username') event = 'connection is open';
            else if (name == 'usernamesWithChangedStatus') event = 'friendship status changed';
            else if (name == 'message') event = 'new message';
            else if (name == 'indexOfChangedMessage') event = 'message status has changed';
            else if (name == 'userIsTyping') event = 'user is typing';
            sendJSON({ event, ...obj });
        },
        subscribe: (name, fn) => {
            let event;
            if (name == 'friendshipStatus') event = 'friendship status changed';
            else if (name == 'newMessage') event = 'new message';
            else if (name == 'newMessageStatus') event = 'message status has changed';
            else if (name == 'userIsTyping') event = 'user is typing';
            else if (name == 'onlineUsersChanged') event = 'list of online users has changed'
            else if (name == 'error') event = 'error';
            return subscribe(event, fn);
        },
        unsubscribe,
        close: closeConnection
    };

})();
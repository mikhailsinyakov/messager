'use strict';

export default function websocket() {

    let ws;

    function createConnection() {
        const host = process.env.APP_HOST;
        const port = process.env.PORT;
        const uri = `ws://${host}:${port}`;
        ws = new WebSocket(uri);
        console.log(ws)
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

    return {
        createConnection,
        sendUsername
    }

    /*

    ws.addEventListener('message', event => {
        console.log(event.data);
    });*/

}
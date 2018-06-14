'use strict';

const credentials = 'same-origin';

export default function () {

    this.defineOptions = (method, body, contentType, mode) => {
        const options = { method, credentials };

        if (contentType == 'application/json') {
            const headers = new Headers();
            headers.append('Content-Type', contentType);
            options.headers = headers;
            options.body = JSON.stringify(body);
        }
        else {
            options.body = body;
        }

        if (mode) options.mode = mode;

        return options;
    };

    this.sendRequest = (url, options = {credentials}) => {
        return fetch(url, options)
                    .then(response => response.json());
    };

    this.sendFile = (url, body) => {
        const method = 'PUT';
        const mode = 'same-origin';

        const options = {method, body, credentials, mode};

        return this.sendRequest(url, options);
    };


}
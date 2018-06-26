'use strict';

export default function () {
    const credentials = 'same-origin';
    
    this.defineOptions = (method, body, contentType, mode) => {
        const options = { method, credentials };

        if (contentType) {
            const headers = new Headers();
            headers.append('Content-Type', contentType);
            options.headers = headers;
        }
        
        if (contentType == 'application/json') {
            options.body = JSON.stringify(body);
        }
        else {
            options.body = body;
        }

        if (mode) options.mode = mode;

        return options;
    };

    this.sendRequest = (url, options = { credentials }, signal) => {
        options.signal = signal;
        return fetch(url, options)
                    .then(response => response.json());
    };

}
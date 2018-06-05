'use strict';

const credentials = 'same-origin';

export default function () {

    this.sendRequest = (url, options = {credentials}) => {
        return fetch(url, options)
                    .then(response => response.json());
    };

    this.sendCredentials = (url, username, password) => {
        const method = 'POST';
        const body = JSON.stringify({username, password});
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const options = {method, body, headers, credentials};

        return this.sendRequest(url, options);
    };

    this.sendUserInfo = (url, userInfo) => {
        const method = 'PATCH';
        const body = JSON.stringify(userInfo);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const options = {method, body, headers, credentials};

        return this.sendRequest(url, options);
    };

    this.sendFile = (url, body) => {
        const method = 'PUT';
        const mode = 'same-origin';

        const options = {method, body, credentials, mode};

        return this.sendRequest(url, options);
    };

    this.testRequest = () => {
        const url = '/testFetch';
        return this.sendRequest(url);
    };


}
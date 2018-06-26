'use strict';

import RequestController from './requestController.client';
const requestController = new RequestController();

export default function () {

    this.getAllDialogsInfo = (username, signal) => {
        const url = `/api/users/${username}/dialogs`;
        return requestController.sendRequest(url, undefined, signal);
    };

    this.getDialogInfo = (username, penPalUsername, signal) => {
        const url = `/api/users/${username}/dialogs/${penPalUsername}`;
        return requestController.sendRequest(url, undefined, signal);
    };
}
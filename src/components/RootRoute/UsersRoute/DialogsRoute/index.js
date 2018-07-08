'use strict';

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dialogs from './Dialogs';
import Dialog from './Dialog';

export default function DialogsRoute(props) {
    const { username, match} = props;
    if (match.params.username != username) {
        return <Redirect to={`/users/${username}/dialogs`} />;
    }
    return (
        <Switch>
            <Route 
                exact path={match.url}
                render={({match}) => <Dialogs 
                    match={match} username={username} 
                />}
            />
            <Route 
                exact path={match.url + '/:penPalUsername'}
                render={({match}) => <Dialog 
                    match={match} username={username} 
                />}
            />
            <Route 
                render={() => <Redirect to={match.url} />}
            />
        </Switch>
    );
}